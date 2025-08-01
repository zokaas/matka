// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Bike, Trophy, MapPin, Award, Activity, Clock, Star, ArrowUp
// } from "lucide-react";

// import { themes } from "@/app/themes/themeManager";
// import { Stage } from "../themes/themeTypes";

// const ThemedStageDashboard = () => {
//   const [currentStage, setCurrentStage] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [selectedTheme, setSelectedTheme] = useState(
//     localStorage.getItem("selectedTheme") || "tour"
//   );

//   const currentTheme = themes[selectedTheme as keyof typeof themes] || themes.tour;
//   const {
//     stages,
//     totalPoints,
//     translations: t,
//     weatherIcons,
//     stageColors,
//   } = currentTheme;

//   useEffect(() => {
//     for (let i = stages.length - 1; i >= 0; i--) {
//       if (totalPoints >= stages[i].pointsRequired) {
//         setCurrentStage(i);
//         break;
//       }
//     }
//     setLoading(false);
//   }, [totalPoints, stages]);

//   const currentProgress = stages[currentStage];
//   const nextStage = stages[currentStage + 1];
//   const progressToNext = nextStage
//     ? ((totalPoints - currentProgress.pointsRequired) /
//         (nextStage.pointsRequired - currentProgress.pointsRequired)) * 100
//     : 100;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-slate-50">
//         <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-slate-50 text-gray-800">
//       <div className="max-w-6xl mx-auto space-y-8 p-6">
//         {/* Title & Emoji */}
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
//           <div className="text-8xl mb-4">{currentProgress.emoji}</div>
//           <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-4">
//             🏆 {t.dashboardTitle} 🏆
//           </h1>
//           <p className="text-xl text-gray-600">{t.subtitle}</p>
//         </motion.div>

//         {/* Current Stage Card */}
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className={`bg-gradient-to-r ${currentProgress.color} rounded-3xl p-8 shadow-2xl border-2 border-white/20`}
//         >
//           <div className="text-center">
//             <div className="text-8xl mb-4">{currentProgress.emoji}</div>
//             <h2 className="text-3xl font-bold mb-2 text-white">
//               📍 {t.stageLabel} {currentStage + 1}: {currentProgress.location}
//             </h2>
//             <h3 className="text-2xl font-semibold mb-2 text-white/90">{currentProgress.name}</h3>
//             <p className="text-lg mb-4 text-white/80">{currentProgress.description}</p>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <StatCard icon={<Trophy />} value={`${totalPoints.toLocaleString("fi-FI")} pts`} label={t.points} />
//               <StatCard icon={<Activity />} value={`${weatherIcons[currentProgress.weather]} ${currentProgress.weather}`} label={t.weather} />
//               <StatCard icon={<Bike />} value={currentProgress.stageType} label={t.type} />
//             </div>
//           </div>
//         </motion.div>

//         {/* Next Stage Preview */}
//         {nextStage && (
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-semibold flex items-center">
//                 <MapPin className="w-6 h-6 mr-2 text-slate-500" />
//                 {t.nextStage}: {nextStage.name} {nextStage.emoji}
//               </h3>
//               <span className={`px-3 py-1 rounded-full text-sm ${stageColors[nextStage.stageType]} bg-white/60`}>
//                 {nextStage.stageType}
//               </span>
//             </div>

//             <div className="relative mb-4">
//               <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-yellow-400 to-slate-500 rounded-full flex items-center justify-end pr-2"
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressToNext}%` }}
//                   transition={{ duration: 1.5, ease: "easeOut" }}
//                 >
//                   <span className="text-xs font-bold text-white">{Math.round(progressToNext)}%</span>
//                 </motion.div>
//               </div>
//               <div className="flex justify-between text-sm text-gray-500 mt-2">
//                 <span>{t.stageLabel} {currentStage + 1}</span>
//                 <span>{t.stageLabel} {currentStage + 2}</span>
//               </div>
//             </div>

//             <div className="text-center">
//               <span className="text-2xl font-bold text-slate-600">
//                 {(nextStage.pointsRequired - totalPoints).toLocaleString("fi-FI")} {t.pointsToNext}
//               </span>
//             </div>
//           </motion.div>
//         )}

//         {/* All Stages */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
//         >
//           <h3 className="text-xl font-semibold mb-6 flex items-center">
//             <Bike className="w-6 h-6 mr-2 text-yellow-500" />
//             {t.stagesTitle}
//           </h3>

//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {stages.map((stage: Stage, index: number) => {
//               const isCompleted = index <= currentStage;
//               const isNext = index === currentStage + 1;

//               return (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.05 * index }}
//                   className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
//                     isCompleted
//                       ? "bg-green-100 border-2 border-green-400/50"
//                       : isNext
//                       ? "bg-yellow-100 border-2 border-yellow-400/50"
//                       : "bg-gray-50 border border-gray-200"
//                   }`}
//                 >
//                   <div className="text-4xl">{stage.emoji}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-1">
//                       <h4 className={`font-medium text-lg ${isCompleted ? "text-slate-600" : "text-gray-600"}`}>
//                         {t.stageLabel} {index + 1}: {stage.name}
//                       </h4>
//                       {isCompleted && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
//                       <span className="text-2xl">{weatherIcons[stage.weather]}</span>
//                     </div>
//                     <p className="text-sm text-gray-500 mb-1">{stage.description}</p>
//                     <div className="flex items-center space-x-4 text-xs">
//                       <span className={`px-2 py-1 rounded ${stageColors[stage.stageType]} bg-white/70`}>
//                         {stage.stageType}
//                       </span>
//                       <span className="text-gray-500">{stage.location}</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`font-bold text-xl ${isCompleted ? "text-slate-600" : "text-gray-400"}`}>
//                       {stage.pointsRequired.toLocaleString("fi-FI")} {t.points}
//                     </div>
//                     <div className={`text-sm flex items-center ${isCompleted ? "text-slate-500" : isNext ? "text-yellow-500" : "text-gray-400"}`}>
//                       {isCompleted && <Award className="w-4 h-4 mr-1" />}
//                       {isNext && <ArrowUp className="w-4 h-4 mr-1" />}
//                       {!isCompleted && !isNext && <Clock className="w-4 h-4 mr-1" />}
//                       {isCompleted ? t.completed : isNext ? t.current : t.upcoming}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
//   <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
//     <div className="mb-2 text-white">{icon}</div>
//     <div className="text-2xl font-bold text-white">{value}</div>
//     <div className="text-sm text-white/80">{label}</div>
//   </div>
// );

// export default ThemedStageDashboard;
