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
        const ratio = (180 - prevLng) / (180 - prevLng + (180 + currLng));
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
    const achieved = routeCoordinates.slice(
      0,
      Math.ceil((progress / 100) * routeCoordinates.length)
    );
    return { progressPercentage: progress, achievedDestinations: achieved };
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

      setCurrentCity(current?.city || "Unknown");
      setNextCity(next?.city || "Journey Complete 🎉");

      // Calculate distance to next destination
      if (current && next) {
        const distance = getDistance(
          current.coordinates.latitude,
          current.coordinates.longitude,
          next.coordinates.latitude,
          next.coordinates.longitude
        );
        setDistanceToNext(Math.round(distance));

        // Check if we're crossing the Pacific Ocean
        const isNearDateLine =
          (current.coordinates.longitude > 140 ||
            current.coordinates.longitude < -140) &&
          (next.coordinates.longitude > 140 ||
            next.coordinates.longitude < -140);

        if (isNearDateLine) {
          setIsPacificView(true);
        } else {
          setIsPacificView(false);
        }
      } else {
        setDistanceToNext(null);
      }
    }
  }, [achievedDestinations]);

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
        // Show only completed cities, current city, and next city
        // Plus first and last of entire journey for context
        if (index === 0 || index === routeCoordinates.length - 1) return true;
        if (index <= currentIndex || index === currentIndex + 1) return true;

        // Hide all other future destinations
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

        // Calculate visit date for visited cities
        const visitDate =
          cityIndex < currentIndex
            ? calculateVisitDate(cityIndex, currentIndex, totalKm)
            : undefined;

        // Calculate distance to next destination for current city
        let distanceToNext;
        if (status === "current" && cityIndex < routeCoordinates.length - 1) {
          const nextCity = routeCoordinates[cityIndex + 1];
          distanceToNext = getDistance(
            city.coordinates.latitude,
            city.coordinates.longitude,
            nextCity.coordinates.latitude,
            nextCity.coordinates.longitude
          );
        }

        return {
          type: "Feature",
          properties: {
            name: city.city,
            status,
            visitDate,
            distanceToNext: distanceToNext
              ? Math.round(distanceToNext)
              : undefined,
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

  // Calculate view parameters based on current progress
  const viewParams = useMemo(() => {
    const currentIndex = achievedDestinations.length - 1;

    if (currentIndex < 0 || currentIndex >= routeCoordinates.length) {
      // Default view if no valid current location
      return {
        center: [0, 20],
        zoom: 1.5,
        bearing: 0,
        pitch: 30,
      };
    }

    const current = routeCoordinates[currentIndex];
    const next = routeCoordinates[currentIndex + 1];

    if (current && next) {
      let centerLng, centerLat;

      // Special handling for date line crossing
      if (
        Math.abs(current.coordinates.longitude - next.coordinates.longitude) >
        180
      ) {
        // When crossing the date line, we need a special center calculation
        if (isPacificView) {
          // Pacific-centered view (center around longitude 180/-180)
          if (
            current.coordinates.longitude > 0 &&
            next.coordinates.longitude < 0
          ) {
            // Crossing from east to west (180 to -180)
            centerLng =
              (current.coordinates.longitude +
                next.coordinates.longitude +
                360) /
              2;
            if (centerLng > 180) centerLng -= 360;
          } else {
            // Crossing from west to east (-180 to 180)
            centerLng =
              (current.coordinates.longitude +
                next.coordinates.longitude -
                360) /
              2;
            if (centerLng < -180) centerLng += 360;
          }
        } else {
          // Atlantic-centered view (center around longitude 0)
          if (
            current.coordinates.longitude > 0 &&
            next.coordinates.longitude < 0
          ) {
            // Adjust for crossing
            const adjustedNextLng = next.coordinates.longitude + 360;
            centerLng = (current.coordinates.longitude + adjustedNextLng) / 2;
            if (centerLng > 180) centerLng -= 360;
          } else {
            // Adjust for crossing
            const adjustedCurrentLng = current.coordinates.longitude + 360;
            centerLng = (adjustedCurrentLng + next.coordinates.longitude) / 2;
            if (centerLng > 180) centerLng -= 360;
          }
        }

        centerLat =
          (current.coordinates.latitude + next.coordinates.latitude) / 2;
      } else {
        // Normal case - no date line crossing
        centerLng =
          (current.coordinates.longitude + next.coordinates.longitude) / 2;
        centerLat =
          (current.coordinates.latitude + next.coordinates.latitude) / 2;
      }

      // Calculate the bearing between current and next
      const bearing = getBearing(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      // Calculate appropriate zoom level based on distance
      const distance = getDistance(
        current.coordinates.latitude,
        current.coordinates.longitude,
        next.coordinates.latitude,
        next.coordinates.longitude
      );

      // Date line crossing typically means long distance, so adjust zoom accordingly
      const zoom =
        Math.abs(current.coordinates.longitude - next.coordinates.longitude) >
        180
          ? 1.5 // Wider view for date line crossing
          : calculateZoomLevel(distance);

      return {
        center: [centerLng, centerLat],
        zoom: zoom,
        bearing: bearing,
        pitch: 40,
      };
    } else if (current) {
      // If at the end of journey, just center on the last city
      return {
        center: [current.coordinates.longitude, current.coordinates.latitude],
        zoom: 5,
        bearing: 0,
        pitch: 30,
      };
    }

    // Fallback view
    return {
      center: [0, 20],
      zoom: 1.5,
      bearing: 0,
      pitch: 30,
    };
  }, [achievedDestinations.length, isPacificView]);

  // Update walker marker position
  const updateWalkerMarker = useCallback(() => {
    if (!map.current || achievedDestinations.length === 0) return;

    const currentIndex = achievedDestinations.length - 1;
    const currentCity = routeCoordinates[currentIndex];

    if (!currentCity) return;

    // Create or update the walker marker
    if (!walkerMarker.current) {
      // Create a custom element for the marker
      const el = document.createElement("div");
      el.className = "walker-marker";
      el.style.backgroundImage = `url(${createWalkerIcon()})`;
      el.style.width = "42px";
      el.style.height = "42px";
      el.style.backgroundSize = "100%";

      // Create the marker
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
      // Update the marker position
      walkerMarker.current.setLngLat([
        currentCity.coordinates.longitude,
        currentCity.coordinates.latitude,
      ]);
    }

    // If we have a next city, calculate the bearing and rotate the marker
    if (currentIndex < routeCoordinates.length - 1) {
      const nextCity = routeCoordinates[currentIndex + 1];
      const bearing = getBearing(
        currentCity.coordinates.latitude,
        currentCity.coordinates.longitude,
        nextCity.coordinates.latitude,
        nextCity.coordinates.longitude
      );

      // Rotate the marker to face the direction of travel
      if (walkerMarker.current.getElement()) {
        walkerMarker.current.getElement().style.transform = `translate(-50%, -50%) rotate(${bearing}deg)`;
      }
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

  useEffect(() => {
    const totalRouteDistance = calculateTotalRouteDistance();
    console.log(
      `Total route distance: ${totalRouteDistance.toLocaleString()} km`
    );

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

    // Fly to new view position
    mapInstance.flyTo({
      center: viewParams.center as [number, number],
      zoom: viewParams.zoom,
      bearing: viewParams.bearing,
      pitch: viewParams.pitch,
      duration: 2000,
      essential: true,
    });
  }, [routeGeoJSON, cityFeatures, viewParams, mapReady, updateWalkerMarker]);

  // Initialize map
  useEffect(() => {
mapboxgl.accessToken =
  "pk.eyJ1Ijoiem9rYWFzIiwiYSI6ImNtNnA2bmRubzA0ZDQya3NhZmk3bWQzMG8ifQ.Ej3pG0ieo8JRm-a46W9WGA";
    if (map.current || !mapContainer.current) return;

    // Use a lighter map style with less prominent date line
    // Always use the light theme
    const mapStyle = "mapbox://styles/mapbox/light-v11"; // Light, clean style

    // Create the map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: viewParams.center as [number, number],
      zoom: Math.min(viewParams.zoom, 3),
      bearing: 0,
      pitch: 0,
      projection: { name: "mercator" }, // Better date line handling
      attributionControl: false,
      dragRotate: false,
    });

    // Add attribution in a better position
    map.current.addControl(new mapboxgl.AttributionControl(), "bottom-left");

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add scale
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
      "bottom-right"
    );

    const mapInstance = map.current;

    // When map is loaded, add the data layers
    mapInstance.on("load", () => {
      // Add sources
      mapInstance.addSource("completed-route", {
        type: "geojson",
        data: routeGeoJSON.completed,
      });

      mapInstance.addSource("upcoming-route", {
        type: "geojson",
        data: routeGeoJSON.upcoming,
      });

      // Add city markers source
      mapInstance.addSource("cities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: cityFeatures,
        },
      });

      // Add glow effect for the completed route
      mapInstance.addLayer({
        id: "completed-route-glow",
        type: "line",
        source: "completed-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff8a80",
          "line-width": 6,
          "line-opacity": 0.6,
          "line-blur": 3,
        },
      });

      // Add the main completed route
      mapInstance.addLayer({
        id: "completed-route-line",
        type: "line",
        source: "completed-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff4d4d",
          "line-width": 3,
        },
      });

      // Add the upcoming route
      mapInstance.addLayer({
        id: "upcoming-route-line",
        type: "line",
        source: "upcoming-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#c0c0c0",
          "line-width": 2,
          "line-dasharray": [2, 1],
        },
      });

      // Add city markers glow effect
      mapInstance.addLayer({
        id: "city-marker-glow",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": [
            "case",
            ["==", ["get", "status"], "current"],
            16,
            ["==", ["get", "status"], "next"],
            12,
            ["==", ["get", "status"], "visited"],
            6,
            6, // default for future cities
          ],
          "circle-color": [
            "case",
            ["==", ["get", "status"], "current"],
            "#e91e63",
            ["==", ["get", "status"], "next"],
            "#2196f3",
            ["==", ["get", "status"], "visited"],
            "#5e35b1",
            "#757575", // default for future cities
          ],
          "circle-opacity": 0.2,
          "circle-blur": 1,
        },
      });

      // Add city markers
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
            3, // default for future cities
          ],
          "circle-color": [
            "case",
            ["==", ["get", "status"], "current"],
            "#e91e63",
            ["==", ["get", "status"], "next"],
            "#2196f3",
            ["==", ["get", "status"], "visited"],
            "#5e35b1",
            "#757575", // default for future cities
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Add city labels layer
      mapInstance.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": [
            "case",
            ["==", ["get", "status"], "current"],
            14,
            ["==", ["get", "status"], "next"],
            14,
            12,
          ],
          "text-offset": [0, -1.5],
          "text-anchor": "bottom",
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "text-optional": true,
          "symbol-sort-key": [
            "case",
            ["==", ["get", "status"], "current"],
            1,
            ["==", ["get", "status"], "next"],
            2,
            ["==", ["get", "status"], "visited"],
            3,
            4, // Future cities have lowest priority
          ],
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "status"], "current"],
            "#e91e63",
            ["==", ["get", "status"], "next"],
            "#2196f3",
            ["==", ["get", "status"], "visited"],
            "#5e35b1",
            "#757575",
          ],
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      // Add popup interaction for cities
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
        className: "city-popup",
      });

      // Add mouse events for showing city popups
      mapInstance.on("mouseenter", "city-markers", (e) => {
        mapInstance.getCanvas().style.cursor = "pointer";

        if (
          e.features &&
          e.features[0] &&
          e.features[0].geometry.type === "Point"
        ) {
          const coords = e.features[0].geometry.coordinates.slice() as [
            number,
            number
          ];
          const properties = e.features[0].properties;

          if (properties) {
            const status = properties.status;
            let statusText = "";

            if (status === "current") {
            //   // Show distance to next for current location
            //   statusText = properties.distanceToNext
            //     // ? `Current Location • ${properties.distanceToNext} km to next`
            //     // : "Current Location";
            } else if (status === "next") {
              statusText = "Next Destination";
            } else if (status === "visited") {
            //   // Show visit date for visited cities
            //   statusText = properties.visitDate
            //     ? `Visited on ${properties.visitDate}`
            //     : "Visited";
            } else {
              statusText = "Future Destination";
            }

            const popupContent = `
              <div class="popup-city-name">${properties.name}</div>
              <div class="popup-city-status">${statusText}</div>
            `;

            popup.setLngLat(coords).setHTML(popupContent).addTo(mapInstance);
          }
        }
      });

      // Remove popup when mouse leaves the marker
      mapInstance.on("mouseleave", "city-markers", () => {
        mapInstance.getCanvas().style.cursor = "";
        popup.remove();
      });

      // Add the walking character marker
      updateWalkerMarker();

      // Mark the map as ready
      setMapReady(true);
    });

    // Add resize handler
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
  }, []);

  // Update map when data changes
  useEffect(() => {
    updateMapData();
  }, [updateMapData]);

  return (
    <div style={styles.pageContainer}>
      <div ref={mapContainer} style={styles.mapContainer} />
      <InfoPanel
        totalKm={totalKm}
        progressPercentage={progressPercentage}
        currentCity={currentCity || "Unknown"}
        nextCity={nextCity || "Unknown"}
        distanceToNext={distanceToNext}
      />
    </div>
  );
}