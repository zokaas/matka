// import React, { useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // 🔹 Stage-tyyppi
// type Stage = {
//   name: string;
//   emoji: string;
//   coords: [number, number];
//   stageType: string;
//   pointsRequired: number;
//   description?: string;
// };

// // 🔹 Props-tyyppi
// type TourMapViewProps = {
//   stages: Stage[];
//   currentStage: number;
//   totalKm: number;
//   kmToNextStage: number;
//   eta: string | null;
// };

// // 🔹 Räätälöity ikoni
// const createCustomIcon = (emoji: string, isCompleted: boolean, isCurrent: boolean) => {
//   const color = isCurrent ? "#facc15" : isCompleted ? "#22c55e" : "#6b7280";
//   const size = isCurrent ? 28 : 20;

//   return L.divIcon({
//     html: `
//       <div style="
//         background: ${color}; 
//         border-radius: 50%; 
//         width: ${size}px; 
//         height: ${size}px; 
//         display: flex; 
//         align-items: center; 
//         justify-content: center; 
//         border: 2px solid white;
//         box-shadow: 0 2px 4px rgba(0,0,0,0.3);
//         font-size: ${size === 28 ? "12px" : "9px"};
//         font-weight: bold;
//         ${isCurrent ? "animation: pulse 2s infinite;" : ""}
//       ">
//         ${emoji}
//       </div>
//       <style>
//         @keyframes pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.2); }
//         }
//       </style>
//     `,
//     className: "custom-marker",
//     iconSize: [size, size],
//     iconAnchor: [size / 2, size / 2],
//   });
// };

// // 🔹 Kartan keskittäjä
// const MapController: React.FC<{ stages: Stage[]; currentStage: number }> = ({
//   stages,
// }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (stages.length > 0) {
//       const bounds = L.latLngBounds(stages.map((stage) => stage.coords));
//       map.fitBounds(bounds, {
//         padding: [30, 30],
//         maxZoom: 4,
//       });
//     }
//   }, [map, stages]);

//   return null;
// };

// // 🔹 Karttakomponentti
// const TourMapView: React.FC<TourMapViewProps> = ({
//   stages,
//   currentStage,
//   kmToNextStage,
//   eta,
// }) => {
//   // Pre-calculate segments to avoid any potential issues
//   const completedSegments = React.useMemo(() => {
//     const segments = [];
//     for (let i = 0; i < stages.length - 1; i++) {
//       if (i < currentStage) {
//         segments.push([stages[i].coords, stages[i + 1].coords]);
//       }
//     }
//     return segments;
//   }, [stages, currentStage]);

//   const upcomingSegments = React.useMemo(() => {
//     const segments = [];
//     for (let i = 0; i < stages.length - 1; i++) {
//       if (i >= currentStage) {
//         segments.push([stages[i].coords, stages[i + 1].coords]);
//       }
//     }
//     return segments;
//   }, [stages, currentStage]);

//   const nextStage = React.useMemo(() => {
//     return currentStage + 1 < stages.length ? stages[currentStage + 1] : null;
//   }, [stages, currentStage]);

//   // Pre-calculate markers to ensure no hooks are called conditionally
//   const markers = React.useMemo(() => {
//     return stages.map((stage, index) => {
//       const isCompleted = index < currentStage;
//       const isCurrent = index === currentStage;
      
//       return {
//         key: stage.name,
//         position: stage.coords,
//         icon: createCustomIcon(stage.emoji, isCompleted, isCurrent),
//         stage: stage,
//         index: index,
//         isCompleted,
//         isCurrent
//       };
//     });
//   }, [stages, currentStage]);

//   return (
//     <div className="space-y-2">
//       <div className="relative">
//         <MapContainer
//           center={[46.8566, 2.3522]}
//           zoom={3}
//           scrollWheelZoom={false}
//           dragging={true}
//           touchZoom={true}
//           doubleClickZoom={false}
//           style={{ height: "320px", width: "100%" }}
//           className="rounded-xl overflow-hidden z-0"
//         >
//           <TileLayer
//             attribution="&copy; OSM"
//             url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
//           />

//           <MapController stages={stages} currentStage={currentStage} />

//           {completedSegments.map((segment, index) => (
//             <Polyline
//               key={`completed-${index}`}
//               positions={segment}
//               color="#facc15"
//               weight={4}
//               opacity={0.9}
//             />
//           ))}

//           {upcomingSegments.map((segment, index) => (
//             <Polyline
//               key={`upcoming-${index}`}
//               positions={segment}
//               color="#6b7280"
//               weight={4}
//               opacity={0.8}
//               dashArray="8, 8"
//             />
//           ))}

//           {markers.map((marker) => (
//             <Marker
//               key={marker.key}
//               position={marker.position}
//               icon={marker.icon}
//             >
//               <Popup
//                 closeButton={false}
//                 className="stage-popup"
//                 maxWidth={250}
//                 offset={[0, -10]}
//               >
//                 <div className="p-2 min-w-0">
//                   <div className="flex items-start gap-2 mb-2">
//                     <div className="text-2xl flex-shrink-0">{marker.stage.emoji}</div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-bold text-sm leading-tight text-gray-800 mb-1">
//                         Etappi {marker.index + 1}
//                       </h3>
//                       <p className="text-xs font-medium text-gray-700 break-words">
//                         {marker.stage.name}
//                       </p>
//                     </div>
//                     <div className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
//                       marker.isCompleted ? 'bg-green-100 text-green-700' :
//                       marker.isCurrent ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-gray-100 text-gray-600'
//                     }`}>
//                       {marker.isCompleted ? '✓ Valmis' : 
//                        marker.isCurrent ? '📍 Nykyinen' : 
//                        '⏳ Tulossa'}
//                     </div>
//                   </div>
                  
//                   {marker.stage.description && (
//                     <p className="text-xs text-gray-600 mb-2 break-words">
//                       {marker.stage.description}
//                     </p>
//                   )}
                  
//                   <div className="flex items-center justify-between text-xs">
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       marker.stage.stageType === 'vuoristo' ? 'bg-red-50 text-red-600' :
//                       marker.stage.stageType === 'mäkinen' ? 'bg-orange-50 text-orange-600' :
//                       marker.stage.stageType === 'aika-ajo' ? 'bg-purple-50 text-purple-600' :
//                       'bg-green-50 text-green-600'
//                     }`}>
//                       {marker.stage.stageType}
//                     </span>
//                     <span className="text-gray-500 font-medium">
//                       {marker.stage.pointsRequired.toLocaleString('fi-FI')} km
//                     </span>
//                   </div>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>

//         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg z-10 border border-yellow-200">
//           <div className="flex items-center gap-3 text-[9px]">
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
//               <span className="text-gray-700">Tehty</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
//               <span className="text-gray-700">Jäljellä</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {nextStage && (
//         <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md border border-blue-200">
//           <div className="text-xs font-semibold text-gray-700 mb-1">Seuraava etappi:</div>
//           <div className="flex items-center gap-2">
//             <div className="text-sm bg-blue-100 p-1 rounded-full flex-shrink-0">
//               {nextStage.emoji}
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="font-bold text-xs text-gray-800 leading-tight">
//                 {nextStage.name}
//               </div>
//               <div className="text-[10px] text-gray-600 mt-0.5">
//                 {nextStage.description || ""}
//               </div>
//               <div className="text-blue-600 text-[10px] font-medium mt-1">
//                 <span className="font-bold">
//                   {kmToNextStage.toLocaleString("fi-FI", {
//                     maximumFractionDigits: 1,
//                   })}
//                 </span>{" "}
//                 km jäljellä
//                 {eta && <span className="ml-2 text-gray-500">(ETA: {eta})</span>}
//               </div>
//             </div>
//             <div className="text-xs text-gray-700 flex-shrink-0">
//               {nextStage.pointsRequired.toLocaleString("fi-FI")} km
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx global>{`
//         .custom-marker {
//           background: transparent !important;
//           border: none !important;
//         }
//         .leaflet-container {
//           font-size: 11px;
//         }
//         .leaflet-control-attribution {
//           font-size: 8px !important;
//           background: rgba(255, 255, 255, 0.7) !important;
//           padding: 2px 4px !important;
//         }
//         .leaflet-control-zoom {
//           border: none !important;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
//         }
//         .leaflet-control-zoom a {
//           width: 26px !important;
//           height: 26px !important;
//           line-height: 26px !important;
//           font-size: 14px !important;
//         }
//         .stage-popup .leaflet-popup-content-wrapper {
//           padding: 0 !important;
//           border-radius: 8px !important;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
//         }
//         .stage-popup .leaflet-popup-content {
//           margin: 0 !important;
//           line-height: 1.4 !important;
//         }
//         .stage-popup .leaflet-popup-tip {
//           background: white !important;
//           border: none !important;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TourMapView;