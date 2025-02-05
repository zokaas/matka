// import { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import { routeCoordinates } from "../data/routeCordinates";
// import { fetchCityName } from "../utils/geocodeHelper";


// export default function Map({ totalKm }: { totalKm: number }) {
//   const mapContainer = useRef(null); // Container for the map
//   const mapRef = useRef<mapboxgl.Map | null>(null); // Store map instance
//   const markersRef = useRef<mapboxgl.Marker[]>([]); // Store markers
//   const [progressPercentage, setProgressPercentage] = useState(0); // Track progress
//   const [achievedDestinations, setAchievedDestinations] = useState<string[]>(
//     []
//   );
//   const [nextDestinationDistance, setNextDestinationDistance] = useState(0); // Distance to the next destination

//   useEffect(() => {
//     if (mapRef.current) return; // Prevent re-initializing the map

//     mapboxgl.accessToken =
//       "pk.eyJ1Ijoiem9rYWFzIiwiYSI6ImNtNnA2bmRubzA0ZDQya3NhZmk3bWQzMG8ifQ.Ej3pG0ieo8JRm-a46W9WGA"; // Replace with your actual token

//     // Initialize Mapbox map
//     mapRef.current = new mapboxgl.Map({
//       container: mapContainer.current!, // The container for the map
//       style: "mapbox://styles/mapbox/streets-v11", // Mapbox style
//       center: [24.9384, 60.1699], // Start at Helsinki
//       zoom: 5, // Initial zoom level
//     });

//     // Fit the map to the entire route initially
//     const bounds = new mapboxgl.LngLatBounds();
//     routeCoordinates.forEach((coord) => bounds.extend([coord.lng, coord.lat]));
//     mapRef.current.fitBounds(bounds, { padding: 50 });
//   }, []); // Run once when the component mounts

//   useEffect(() => {
//     if (!mapRef.current) return; // Ensure map is initialized

//     // Calculate the progress percentage
//     const progress = (totalKm / 100000) * 100; // Assuming the total journey is 2000 km
//     setProgressPercentage(progress);

//     // Remove all existing markers and route lines
//     markersRef.current.forEach((marker) => marker.remove());
//     markersRef.current = [];

//     // Determine visible destinations based on progress
//     const visibleDestinations = routeCoordinates.filter(
//       (coord) => coord.cumulativeDistance <= totalKm
//     );

//     const nextDestination = routeCoordinates.find(
//       (coord) => coord.cumulativeDistance > totalKm
//     );

//     const newAchievedDestinations = visibleDestinations.map(
//       (coord) => coord.city
//     );
//     setAchievedDestinations(newAchievedDestinations); // Update the list of achieved destinations

//     // Add markers for visible destinations
//     const addMarkers = async () => {
//       for (const coord of visibleDestinations) {
//         const cityName = await fetchCityName(coord.lng, coord.lat); // Fetch city name asynchronously
//         const marker = new mapboxgl.Marker({ color: "green" })
//           .setLngLat([coord.lng, coord.lat])
//           .setPopup(new mapboxgl.Popup().setHTML(`<h3>${cityName}</h3>`)) // Popup with city name
//           .addTo(mapRef.current!);
//         markersRef.current.push(marker);
//       }
//     };

//     addMarkers(); // Execute the async function to add markers

//     // Highlight the next destination with a different marker color
//     if (nextDestination) {
//       const marker = new mapboxgl.Marker({ color: "purple" })
//         .setLngLat([nextDestination.lng, nextDestination.lat])
//         .setPopup(
//           new mapboxgl.Popup().setHTML(`<h3>Next: ${nextDestination.city}</h3>`)
//         ) // Popup with city name
//         .addTo(mapRef.current!);
//       markersRef.current.push(marker);

//       setNextDestinationDistance(nextDestination.cumulativeDistance - totalKm); // Calculate distance to next destination
//     }

//     // Update the map bounds to fit visible destinations
//     const bounds = new mapboxgl.LngLatBounds();
//     visibleDestinations.forEach((coord) =>
//       bounds.extend([coord.lng, coord.lat])
//     );
//     if (nextDestination)
//       bounds.extend([nextDestination.lng, nextDestination.lat]);
//     mapRef.current.fitBounds(bounds, { padding: 50 });

//     // Optional: Update the route line dynamically
//     const waypoints = [...visibleDestinations, nextDestination]
//       .filter(Boolean)
//       .map((coord) => `${coord?.lng},${coord?.lat}`)
//       .join(";");

//     if (waypoints) {
//       const fetchRoute = async () => {
//         const response = await fetch(
//           `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`
//         );
//         const data = await response.json();
//         if (data.routes && data.routes.length > 0) {
//           const route = data.routes[0].geometry;
//           if (mapRef.current!.getSource("route")) {
//             mapRef.current!.getSource("route").setData({
//               type: "Feature",
//               properties: {},
//               geometry: route,
//             });
//           } else {
//             mapRef.current!.addSource("route", {
//               type: "geojson",
//               data: {
//                 type: "Feature",
//                 properties: {},
//                 geometry: route,
//               },
//             });

//             mapRef.current!.addLayer({
//               id: "route-line",
//               type: "line",
//               source: "route",
//               layout: {
//                 "line-join": "round",
//                 "line-cap": "round",
//               },
//               paint: {
//                 "line-color": "#FF5733", // Color for unachieved routes
//                 "line-width": 5, // Route width
//               },
//             });

//             // For achieved destinations, change the line color
//             const achievedWaypoints = routeCoordinates
//               .filter((coord) => coord.cumulativeDistance <= totalKm)
//               .map((coord) => `${coord.lng},${coord.lat}`)
//               .join(";");

//             const achievedRouteResponse = await fetch(
//               `https://api.mapbox.com/directions/v5/mapbox/driving/${achievedWaypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`
//             );
//             const achievedRouteData = await achievedRouteResponse.json();
//             if (
//               achievedRouteData.routes &&
//               achievedRouteData.routes.length > 0
//             ) {
//               const achievedRoute = achievedRouteData.routes[0].geometry;
//               if (mapRef.current!.getSource("achieved-route")) {
//                 mapRef?.current!.getSource("achieved-route").setData({
//                   type: "Feature",
//                   properties: {},
//                   geometry: achievedRoute,
//                 });
//               } else {
//                 mapRef.current!.addSource("achieved-route", {
//                   type: "geojson",
//                   data: {
//                     type: "Feature",
//                     properties: {},
//                     geometry: achievedRoute,
//                   },
//                 });

//                 mapRef.current!.addLayer({
//                   id: "achieved-route-line",
//                   type: "line",
//                   source: "achieved-route",
//                   layout: {
//                     "line-join": "round",
//                     "line-cap": "round",
//                   },
//                   paint: {
//                     "line-color": "#4caf50", // Color for achieved routes (green)
//                     "line-width": 5, // Route width
//                   },
//                 });
//               }
//             }
//           }
//         }
//       };
//       fetchRoute();
//     }
//   }, [totalKm]);

//   return (
//     <div
//       style={{
//         padding: "20px",
//         borderRadius: "10px",
//         backgroundColor: "#f4f4f4",
//       }}
//     >
//       <div
//         ref={mapContainer}
//         style={{
//           width: "100%",
//           height: "500px",
//           position: "relative",
//           borderRadius: "10px",
//           border: "2px solid #ddd",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         }}
//       ></div>

//       <div style={{ marginTop: "20px", textAlign: "center" }}>
//         <h4 style={{ fontWeight: "bold", color: "#2c3e50" }}>
//           Your Progress: {progressPercentage.toFixed(2)}%
//         </h4>
//         <div
//           style={{
//             height: "10px",
//             background: "#e0e0e0",
//             borderRadius: "5px",
//             width: "100%",
//             marginTop: "5px",
//           }}
//         >
//           <div
//             style={{
//               width: `${progressPercentage}%`,
//               height: "100%",
//               background: "#27ae60",
//               borderRadius: "5px",
//             }}
//           ></div>
//         </div>
//         <p style={{ marginTop: "10px", color: "#34495e" }}>
//           Distance to Next Destination: {nextDestinationDistance} km
//         </p>
//       </div>

//       <div
//         style={{
//           marginTop: "30px",
//           padding: "15px",
//           borderRadius: "8px",
//           backgroundColor: "#ecf0f1",
//         }}
//       >
//         <h4 style={{ color: "#34495e", fontWeight: "bold" }}>
//           Achieved Destinations:
//         </h4>
//         <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
//           {achievedDestinations.map((city, index) => (
//             <li
//               key={index}
//               style={{
//                 color: "#27ae60",
//                 fontSize: "16px",
//                 marginBottom: "5px",
//               }}
//             >
//               {city}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
