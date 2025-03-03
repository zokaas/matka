import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeCoordinates } from "../data/routeCoordinates";
import { getBearing, getDistance } from "../utils/geoUtils";
import { LineFeature, PointFeature } from "../types/types";
import styles from "../styles/styles";
import { calculateVisitDate, calculateZoomLevel } from "../utils/progressUtils";
import InfoPanel from "./InfoPanel";
import { createWalkerIcon } from "./WalkerIcon";

const processLineStringCoordinates = (
  coordinates: [number, number][]
): [number, number][] => {
  if (!coordinates.length) return [];

  const result: [number, number][] = [coordinates[0]];

  for (let i = 1; i < coordinates.length; i++) {
    const [prevLng, prevLat] = coordinates[i - 1];
    const [currLng, currLat] = coordinates[i];

    // Check for date line crossing
    if (Math.abs(currLng - prevLng) > 180) {
      if (prevLng < 0 && currLng > 0) {
        // Crossing from -180 to +180 (west to east)
        const ratio = (-180 - prevLng) / (currLng + 360 - prevLng);
        const latAtCrossing = prevLat + ratio * (currLat - prevLat);

        result.push([-180, latAtCrossing]);
        result.push([180, latAtCrossing]); // Jump to the other side
      } else {
        // Crossing from +180 to -180 (east to west)
        const ratio = (180 - prevLng) / (360 + currLng - prevLng);
        const latAtCrossing = prevLat + ratio * (currLat - prevLat);

        result.push([180, latAtCrossing]);
        result.push([-180, latAtCrossing]); // Jump to the other side
      }
    }

    result.push([currLng, currLat]);
  }

  return result;
};

export default function Map({ totalKm }: { totalKm: number }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const walkerMarker = useRef<mapboxgl.Marker | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [nextCity, setNextCity] = useState<string | null>(null);
  const [distanceToNext, setDistanceToNext] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [isPacificView, setIsPacificView] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Calculate progress and achieved destinations
  const { progressPercentage, achievedDestinations } = useMemo(() => {
    const progress = (totalKm / 100000) * 100;

    // Calculate actual achieved cities based on distance
    let distanceCovered = 0;
    const achievedCities = [];

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const current = routeCoordinates[i];
      const next = routeCoordinates[i + 1];

      achievedCities.push(current);

      const segmentDistance = getDistance(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      distanceCovered += segmentDistance;

      if (distanceCovered > totalKm) {
        break;
      }
    }

    return {
      progressPercentage: progress,
      achievedDestinations: achievedCities,
    };
  }, [totalKm]);

  useEffect(() => {
    if (totalKm > 1000) {
      setShowMap(true);
    }
  }, [totalKm]);

  // Find current and next city, and calculate distance to next
  useEffect(() => {
    if (achievedDestinations.length > 0) {
      const current = achievedDestinations[achievedDestinations.length - 1];
      const next = routeCoordinates[achievedDestinations.length];

      setCurrentCity(current?.city || "?");
      setNextCity(next?.city || "Journey Complete 🎉");

      if (current && next) {
        // Get the index of current city
        const currentIndex = routeCoordinates.findIndex(
          (city) => city.city === current.city
        );

        // Calculate distance up to current segment
        let distanceToCurrent = 0;
        for (let i = 0; i < currentIndex; i++) {
          const segStart = routeCoordinates[i];
          const segEnd = routeCoordinates[i + 1];
          distanceToCurrent += getDistance(
            segStart.coordinates.latitude,
            segStart.coordinates.longitude,
            segEnd.coordinates.latitude,
            segEnd.coordinates.longitude
          );
        }

        // Calculate total distance of current segment
        const currentSegmentDistance = getDistance(
          current.coordinates.latitude,
          current.coordinates.longitude,
          next.coordinates.latitude,
          next.coordinates.longitude
        );

        // Calculate progress within current segment
        const progressInCurrentSegment = Math.max(
          0,
          totalKm - distanceToCurrent
        );

        // Calculate remaining distance
        const remainingDistance = Math.max(
          0,
          currentSegmentDistance - progressInCurrentSegment
        );

        setDistanceToNext(Math.round(remainingDistance));

        const isNearDateLine =
          (current.coordinates.longitude > 140 ||
            current.coordinates.longitude < -140) &&
          (next.coordinates.longitude > 140 ||
            next.coordinates.longitude < -140);
        setIsPacificView(isNearDateLine);
      } else {
        setDistanceToNext(null);
      }
    }
  }, [achievedDestinations, totalKm]);

  // Convert route coordinates to GeoJSON with date line handling
  const routeGeoJSON = useMemo(() => {
    // Current progress index
    const currentIndex = achievedDestinations.length - 1;

    // Show only up to next destination for upcoming route
    // This limits the future path to just the next segment
    const nextIndex = currentIndex + 2; // Current + 1 more (next destination)
    const limitedUpcomingSegment = routeCoordinates
      .slice(currentIndex, nextIndex)
      .map(
        (point) =>
          [point.coordinates.longitude, point.coordinates.latitude] as [
            number,
            number
          ]
      );

    // Create completed route LineString
    const completedCoordinates = routeCoordinates
      .slice(0, currentIndex + 1)
      .map(
        (point) =>
          [point.coordinates.longitude, point.coordinates.latitude] as [
            number,
            number
          ]
      );

    // Process the coordinates to handle date line crossings
    const processedCompletedCoords =
      processLineStringCoordinates(completedCoordinates);
    const processedUpcomingCoords = processLineStringCoordinates(
      limitedUpcomingSegment
    );

    const completed: LineFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: processedCompletedCoords,
      },
    };

    const upcoming: LineFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: processedUpcomingCoords,
      },
    };

    return { completed, upcoming };
  }, [achievedDestinations.length]);

  // Create city marker features with visit dates and distances
  const cityFeatures = useMemo(() => {
    const currentIndex = achievedDestinations.length - 1;

    return routeCoordinates
      .filter((_, index) => {
        if (index === 0 || index === routeCoordinates.length - 1) return true;
        if (index <= currentIndex || index === currentIndex + 1) return true;
        return false;
      })
      .map((city): PointFeature => {
        const cityIndex = routeCoordinates.findIndex(
          (c) => c.city === city.city
        );

        let status = "future";
        if (cityIndex === currentIndex) status = "current";
        else if (cityIndex === currentIndex + 1) status = "next";
        else if (cityIndex < currentIndex) status = "visited";

        const visitDate =
          cityIndex < currentIndex
            ? calculateVisitDate(cityIndex, currentIndex, totalKm)
            : undefined;

        // Remove the distance calculation from here as it's handled in the useEffect

        return {
          type: "Feature",
          properties: {
            name: city.city,
            status,
            visitDate,
          },
          geometry: {
            type: "Point",
            coordinates: [
              city.coordinates.longitude,
              city.coordinates.latitude,
            ],
          },
        };
      });
  }, [achievedDestinations.length, totalKm]);

  const viewParams = useMemo(() => {
    const currentIndex = achievedDestinations.length - 1;
    if (currentIndex < 0 || currentIndex >= routeCoordinates.length) {
      return { center: [0, 20], zoom: 2, bearing: 0, pitch: 30 };
    }

    const current = routeCoordinates[currentIndex];
    const next = routeCoordinates[currentIndex + 1];

    if (current && next) {
      const centerLng =
        (current.coordinates.longitude + next.coordinates.longitude) / 2;
      const centerLat =
        (current.coordinates.latitude + next.coordinates.latitude) / 2;

      const distance = getDistance(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      // Dynamic zoom based on distance (closer = more zoomed in)
      let zoom = 4; // Default zoom level
      if (distance < 500) zoom = 5.5;
      if (distance < 300) zoom = 6.5;
      if (distance < 150) zoom = 7;
      if (distance < 50) zoom = 9;

      const bearing = getBearing(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      return { center: [centerLng, centerLat], zoom, bearing, pitch: 40 };
    }

    return {
      center: [current.coordinates.longitude, current.coordinates.latitude],
      zoom: 5,
      bearing: 0,
      pitch: 30,
    };
  }, [achievedDestinations.length]);

  // Update walker marker position
  const updateWalkerMarker = useCallback(() => {
    if (!map.current || achievedDestinations.length === 0) return;

    const currentIndex = achievedDestinations.length - 1;
    const currentCity = routeCoordinates[currentIndex];
    if (!currentCity) return;

    if (!walkerMarker.current) {
      const el = document.createElement("div");
      el.className = "walker-marker";
      const img = document.createElement("img");
      img.src = createWalkerIcon();
      img.style.width = "80px";
      img.style.height = "80px";
      el.appendChild(img);

      el.style.width = "80px"; // Bigger marker
      el.style.height = "80px";
      el.style.backgroundSize = "100%";
      el.style.transition = "transform 1s ease-in-out";

      walkerMarker.current = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([
          currentCity.coordinates.longitude,
          currentCity.coordinates.latitude,
        ])
        .addTo(map.current);
    } else {
      walkerMarker.current.getElement().style.transition =
        "transform 2s ease-in-out";
      walkerMarker.current.setLngLat([
        currentCity.coordinates.longitude,
        currentCity.coordinates.latitude,
      ]);
    }

    // Rotate walker based on direction
    if (currentIndex < routeCoordinates.length - 1) {
      const nextCity = routeCoordinates[currentIndex + 1];
      const bearing = getBearing(
        currentCity.coordinates.latitude,
        currentCity.coordinates.longitude,
        nextCity.coordinates.latitude,
        nextCity.coordinates.longitude
      );
      walkerMarker.current.getElement().style.transform = `rotate(${bearing}deg)`;
    }
  }, [achievedDestinations.length]);

  // Function to calculate the total distance of the entire route
  const calculateTotalRouteDistance = () => {
    let totalDistance = 0;

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const current = routeCoordinates[i];
      const next = routeCoordinates[i + 1];

      const distance = getDistance(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      totalDistance += distance;
    }

    return Math.round(totalDistance);
  };

  //voi po
  useEffect(() => {
    const totalRouteDistance = calculateTotalRouteDistance();
    console.log(`TÄÄ ON SE: ${totalRouteDistance.toLocaleString()} km`);

    // Optionally, validate if it's close to 100,000 km
    const isRouteValid = Math.abs(totalRouteDistance - 100000) / 100000 < 0.05; // Within 5% of 100,000
    console.log(
      `Route distance validation: ${isRouteValid ? "Valid" : "Not valid"}`
    );
  }, []);

  // Update map data when progress changes
  const updateMapData = useCallback(() => {
    if (!map.current || !mapReady) return;

    // Get map instance
    const mapInstance = map.current;

    // Check if we need to change projection based on current view
    const isDateLineCrossing = Math.abs(viewParams.center[0] as number) > 170;
    if (isDateLineCrossing !== isPacificView) {
      setIsPacificView(isDateLineCrossing);
    }

    // Update route sources
    if (mapInstance.getSource("completed-route")) {
      (
        mapInstance.getSource("completed-route") as mapboxgl.GeoJSONSource
      ).setData(routeGeoJSON.completed);
    }

    if (mapInstance.getSource("upcoming-route")) {
      (
        mapInstance.getSource("upcoming-route") as mapboxgl.GeoJSONSource
      ).setData(routeGeoJSON.upcoming);
    }

    // Update city markers source
    if (mapInstance.getSource("cities")) {
      (mapInstance.getSource("cities") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: cityFeatures,
      });
    }

    // Update the walker marker
    updateWalkerMarker();

    // Determine the camera position and animation for the route
    const flyToOptions = {
      center: viewParams.center as [number, number],
      zoom: viewParams.zoom,
      bearing: viewParams.bearing,
      pitch: viewParams.pitch,
      duration: 2000,
      essential: true,
    };

    // Fly to new view position
    mapInstance.flyTo(flyToOptions);
  }, [
    routeGeoJSON,
    cityFeatures,
    viewParams,
    mapReady,
    updateWalkerMarker,
    isPacificView,
  ]);

  // Initialize map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiem9rYWFzIiwiYSI6ImNtNnA2bmRubzA0ZDQya3NhZmk3bWQzMG8ifQ.Ej3pG0ieo8JRm-a46W9WGA";
    if (map.current || !mapContainer.current) return;

    const mapStyle = "mapbox://styles/mapbox/light-v11";

    // Use globe projection when in the Pacific view to handle the date line better
    const projection = isPacificView
      ? { name: "globe" as const }
      : { name: "mercator" as const };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: viewParams.center as [number, number],
      zoom: Math.min(viewParams.zoom, 3),
      bearing: 0,
      pitch: 0,
      projection,
      attributionControl: false,
      dragRotate: false,
    });

    map.current.addControl(new mapboxgl.AttributionControl(), "bottom-left");
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      "top-right"
    );
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }),
      "bottom-right"
    );

    const mapInstance = map.current;

    mapInstance.on("load", () => {
      mapInstance.addSource("completed-route", {
        type: "geojson",
        data: routeGeoJSON.completed,
      });
      mapInstance.addSource("upcoming-route", {
        type: "geojson",
        data: routeGeoJSON.upcoming,
      });
      mapInstance.addSource("cities", {
        type: "geojson",
        data: { type: "FeatureCollection", features: cityFeatures },
      });

      mapInstance.addLayer({
        id: "completed-route-glow",
        type: "line",
        source: "completed-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#f7c850", // Vibrant Lemon Yellow
          "line-width": 6,
          "line-opacity": 0.7,
          "line-blur": 3,
        },
      });

      mapInstance.addLayer({
        id: "completed-route-line",
        type: "line",
        source: "completed-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#1c2d69", // Deep Blue
          "line-width": 3,
        },
      });

      mapInstance.addLayer({
        id: "upcoming-route-line",
        type: "line",
        source: "upcoming-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#8a8a8a", // Soft Shadow Gray
          "line-width": 2,
          "line-dasharray": [2, 1],
        },
      });

      mapInstance.addLayer({
        id: "city-markers",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": [
            "case",
            ["==", ["get", "status"], "current"],
            8,
            ["==", ["get", "status"], "next"],
            6,
            ["==", ["get", "status"], "visited"],
            4,
            3,
          ],
          "circle-color": [
            "case",
            ["==", ["get", "status"], "current"],
            "#4ea26e", // Mint Green
            ["==", ["get", "status"], "next"],
            "#f7c850", // Vibrant Lemon Yellow
            ["==", ["get", "status"], "visited"],
            "#1c2d69", // Deep Blue
            "#8a8a8a", // Soft Shadow Gray
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      mapInstance.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, -1.5],
          "text-anchor": "bottom",
        },
        paint: {
          "text-color": "#1c2d69", // Deep Blue
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      updateWalkerMarker();
      setMapReady(true);
    });

    const resizeHandler = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [
    routeGeoJSON,
    cityFeatures,
    isPacificView,
    updateWalkerMarker,
    viewParams.center,
    viewParams.zoom,
  ]);

  // Update map when data changes
  useEffect(() => {
    updateMapData();
  }, [updateMapData]);

  // Update projection when Pacific view status changes
  useEffect(() => {
    if (map.current && mapReady) {
      // Change projection when in Pacific view
      map.current.setProjection(isPacificView ? "globe" : "mercator");
    }
  }, [isPacificView, mapReady]);

  return (
    <div style={styles.pageContainer}>
      <div ref={mapContainer} style={styles.mapContainer} />
      <InfoPanel
        totalKm={totalKm}
        progressPercentage={progressPercentage}
        currentCity={currentCity || "?"}
        nextCity={nextCity || "?"}
        distanceToNext={distanceToNext}
      />
    </div>
  );
}
