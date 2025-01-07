import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, Marker, Polyline } from "@react-google-maps/api";

const DEFAULT_ZOOM = 6;
const TRAVELED_COLOR = "#4CAF50"; // Green
const UPCOMING_COLOR = "#FF5722"; // Orange

const MapView = ({ totalPoints, route }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [traveledSegments, setTraveledSegments] = useState([]);
  const [upcomingSegments, setUpcomingSegments] = useState([]);
  const [directionsCache, setDirectionsCache] = useState({});

  const fetchRoadSegment = useCallback(async (start, end, index) => {
    if (directionsCache[index]) return directionsCache[index];

    const directionsService = new window.google.maps.DirectionsService();
    try {
      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: { lat: start[0], lng: start[1] },
            destination: { lat: end[0], lng: end[1] },
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") resolve(response);
            else reject(`Directions API failed: ${status}`);
          }
        );
      });

      setDirectionsCache((prev) => ({ ...prev, [index]: result }));
      return result;
    } catch (error) {
      console.error("Error fetching road segment:", error);
      return null;
    }
  }, [directionsCache]);

  useEffect(() => {
    if (route.length === 0) return;

    const traveled = [];
    const upcoming = [];
    let cumulativeDistance = 0;

    const loadSegments = async () => {
      for (let i = 0; i < route.length - 1; i++) {
        const start = route[i].coordinates;
        const end = route[i + 1].coordinates;
        const segmentDistance = route[i].distance;

        if (route[i + 1].type === "road") {
          const roadSegment = await fetchRoadSegment(start, end, i);
          if (totalPoints > cumulativeDistance + segmentDistance) {
            traveled.push({ type: "road", directions: roadSegment });
          } else if (totalPoints > cumulativeDistance) {
            traveled.push({ type: "road", directions: roadSegment });
            upcoming.push({ type: "road", directions: roadSegment });
          } else {
            upcoming.push({ type: "road", directions: roadSegment });
          }
        } else if (route[i + 1].type === "sea") {
          const polyline = route[i + 1].polyline;
          if (totalPoints > cumulativeDistance + segmentDistance) {
            traveled.push({ type: "sea", polyline });
          } else if (totalPoints > cumulativeDistance) {
            const traveledPortion = polyline.slice(0, polyline.length / 2);
            const upcomingPortion = polyline.slice(polyline.length / 2);
            traveled.push({ type: "sea", polyline: traveledPortion });
            upcoming.push({ type: "sea", polyline: upcomingPortion });
          } else {
            upcoming.push({ type: "sea", polyline });
          }
        }

        cumulativeDistance += segmentDistance;
      }

      setTraveledSegments(traveled);
      setUpcomingSegments(upcoming);
    };

    loadSegments();
  }, [route, totalPoints, fetchRoadSegment]);

  useEffect(() => {
    if (route.length > 0) {
      const position = calculateMarkerPosition(totalPoints, route);
      setCurrentPosition(position);
    }
  }, [totalPoints, route]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "500px" }}
      zoom={DEFAULT_ZOOM}
      center={currentPosition || { lat: 0, lng: 0 }}
    >
      {/* Kuljettu matka */}
      {traveledSegments.map((segment, index) =>
        segment.type === "road" ? (
          <DirectionsRenderer
            key={`traveled-road-${index}`}
            directions={segment.directions}
            options={{
              suppressMarkers: true,
              polylineOptions: { strokeColor: TRAVELED_COLOR, strokeWeight: 4 },
            }}
          />
        ) : (
          <Polyline
            key={`traveled-sea-${index}`}
            path={segment.polyline}
            options={{
              strokeColor: TRAVELED_COLOR,
              strokeWeight: 4,
            }}
          />
        )
      )}

      {/* Tulevat segmentit */}
      {upcomingSegments.map((segment, index) =>
        segment.type === "road" ? (
          <DirectionsRenderer
            key={`upcoming-road-${index}`}
            directions={segment.directions}
            options={{
              suppressMarkers: true,
              polylineOptions: { strokeColor: UPCOMING_COLOR, strokeWeight: 4 },
            }}
          />
        ) : (
          <Polyline
            key={`upcoming-sea-${index}`}
            path={segment.polyline}
            options={{
              strokeColor: UPCOMING_COLOR,
              strokeWeight: 4,
            }}
          />
        )
      )}

      {/* Marker */}
      {currentPosition && (
        <Marker
          position={currentPosition}
          icon={{
            url: "/friendship-icon.png",
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16),
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapView;
