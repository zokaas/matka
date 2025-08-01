import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, Trophy, Users, MapPin, Award, Activity, Clock, Star, ArrowUp } from 'lucide-react';

// Define proper types for weather and difficulty
type WeatherType = 'Sunny' | 'Cloudy' | 'Rainy' | 'Windy' | 'Storm' | 'Variable' | 'Headwind' | 'Tailwind';
type StageType = 'Flat' | 'Hilly' | 'Mountain' | 'Time Trial' | 'Sprint';

interface Stage {
  name: string;
  pointsRequired: number;
  emoji: string;
  description: string;
  stageType: StageType;
  weather: WeatherType;
  color: string;
  location: string;
}

const TourDeFranceDashboard = () => {
  const [totalPoints, setTotalPoints] = useState(892); // Current team points
  const [currentStage, setCurrentStage] = useState(0);
  const [loading, setLoading] = useState(true);

  const TOTAL_TOUR_POINTS = 3360; // Total challenge points
  const progressPercentage = (totalPoints / TOTAL_TOUR_POINTS) * 100;

  const stages: Stage[] = [
    { 
      name: 'Florence → Rimini', 
      pointsRequired: 0, 
      emoji: '🏁', 
      description: 'Grand Départ from Renaissance Florence',
      stageType: 'Flat',
      weather: 'Sunny',
      color: 'from-green-400 to-green-600',
      location: 'Ligne de Départ'
    },
    { 
      name: 'Cesenatico → Bologna', 
      pointsRequired: 160, 
      emoji: '🚴‍♂️', 
      description: 'Rolling hills through Emilia-Romagna',
      stageType: 'Hilly',
      weather: 'Cloudy',
      color: 'from-emerald-400 to-emerald-600',
      location: 'Étape Sprint'
    },
    { 
      name: 'Plaisance → Turin', 
      pointsRequired: 320, 
      emoji: '⛰️', 
      description: 'First mountain challenge to Turin',
      stageType: 'Mountain',
      weather: 'Variable',
      color: 'from-blue-400 to-blue-600',
      location: 'Col du Galibier'
    },
    { 
      name: 'Pinerolo → Valloire', 
      pointsRequired: 480, 
      emoji: '🏔️', 
      description: 'Alpine stage through French Alps',
      stageType: 'Mountain',
      weather: 'Windy',
      color: 'from-purple-400 to-purple-600',
      location: 'Haute Montagne'
    },
    { 
      name: 'Saint-Vulbas → Superdévoluy', 
      pointsRequired: 640, 
      emoji: '❄️', 
      description: 'Summit finish in the Alps',
      stageType: 'Mountain',
      weather: 'Storm',
      color: 'from-gray-300 to-gray-500',
      location: 'Sommet'
    },
    { 
      name: 'Manosque → Mâcon', 
      pointsRequired: 800, 
      emoji: '🌻', 
      description: 'Through Provence countryside',
      stageType: 'Flat',
      weather: 'Sunny',
      color: 'from-yellow-400 to-yellow-600',
      location: 'Plaine'
    },
    { 
      name: 'Mâcon → Dijon', 
      pointsRequired: 960, 
      emoji: '🍷', 
      description: 'Burgundy wine country sprint',
      stageType: 'Sprint',
      weather: 'Variable',
      color: 'from-red-400 to-red-600',
      location: 'Vignobles'
    },
    { 
      name: 'Semur-en-Auxois → Colombey', 
      pointsRequired: 1120, 
      emoji: '⏱️', 
      description: 'Individual Time Trial',
      stageType: 'Time Trial',
      weather: 'Headwind',
      color: 'from-cyan-400 to-cyan-600',
      location: 'Contre-la-Montre'
    },
    { 
      name: 'Troyes → Troyes', 
      pointsRequired: 1280, 
      emoji: '🏃‍♂️', 
      description: 'Circuit race around Troyes',
      stageType: 'Sprint',
      weather: 'Tailwind',
      color: 'from-orange-400 to-orange-600',
      location: 'Circuit Urbain'
    },
    { 
      name: 'Orléans → Saint-Amand', 
      pointsRequired: 1440, 
      emoji: '🌾', 
      description: 'Through Loire Valley châteaux',
      stageType: 'Flat',
      weather: 'Sunny',
      color: 'from-green-500 to-green-700',
      location: 'Vallée de Loire'
    },
    { 
      name: 'Évaux-les-Bains → Le Lioran', 
      pointsRequired: 1600, 
      emoji: '🌋', 
      description: 'Volcanic mountains of Auvergne',
      stageType: 'Mountain',
      weather: 'Cloudy',
      color: 'from-slate-400 to-slate-600',
      location: 'Volcans'
    },
    { 
      name: 'Aurillac → Villeneuve', 
      pointsRequired: 1760, 
      emoji: '🌿', 
      description: 'Rolling green countryside',
      stageType: 'Hilly',
      weather: 'Variable',
      color: 'from-lime-400 to-lime-600',
      location: 'Campagne'
    },
    { 
      name: 'Agen → Pau', 
      pointsRequired: 1920, 
      emoji: '🏰', 
      description: 'Gateway to the Pyrenees',
      stageType: 'Flat',
      weather: 'Sunny',
      color: 'from-amber-400 to-amber-600',
      location: 'Porte des Pyrénées'
    },
    { 
      name: 'Pau → Saint-Lary-Soulan', 
      pointsRequired: 2080, 
      emoji: '🗻', 
      description: 'First Pyrenean mountain stage',
      stageType: 'Mountain',
      weather: 'Storm',
      color: 'from-indigo-400 to-indigo-600',
      location: 'Pyrénées'
    },
    { 
      name: 'Loudenvielle → Plateau de Beille', 
      pointsRequired: 2240, 
      emoji: '⛷️', 
      description: 'Queen stage of the Pyrenees',
      stageType: 'Mountain',
      weather: 'Windy',
      color: 'from-violet-400 to-violet-600',
      location: 'Haute Pyrénées'
    },
    { 
      name: 'Gruissan → Nîmes', 
      pointsRequired: 2400, 
      emoji: '🏛️', 
      description: 'Roman amphitheatre finish',
      stageType: 'Flat',
      weather: 'Sunny',
      color: 'from-rose-400 to-rose-600',
      location: 'Provence Romaine'
    },
    { 
      name: 'Saint-Paul-Trois → Superdévoluy', 
      pointsRequired: 2560, 
      emoji: '🦅', 
      description: 'Alpine eagle\'s nest finish',
      stageType: 'Mountain',
      weather: 'Variable',
      color: 'from-sky-400 to-sky-600',
      location: 'Nid d\'Aigle'
    },
    { 
      name: 'Gap → Barcelonnette', 
      pointsRequired: 2720, 
      emoji: '🌲', 
      description: 'Through Alpine forests',
      stageType: 'Mountain',
      weather: 'Cloudy',
      color: 'from-emerald-500 to-emerald-700',
      location: 'Forêts Alpines'
    },
    { 
      name: 'Embrun → Isola 2000', 
      pointsRequired: 2880, 
      emoji: '🎿', 
      description: 'Ski resort summit finish',
      stageType: 'Mountain',
      weather: 'Storm',
      color: 'from-blue-500 to-blue-700',
      location: 'Station de Ski'
    },
    { 
      name: 'Nice → Col de la Couillole', 
      pointsRequired: 3040, 
      emoji: '🌊', 
      description: 'From Mediterranean to mountains',
      stageType: 'Mountain',
      weather: 'Sunny',
      color: 'from-teal-400 to-teal-600',
      location: 'Côte d\'Azur'
    },
    { 
      name: 'Monaco → Nice', 
      pointsRequired: 3200, 
      emoji: '🏆', 
      description: 'Final stage - Champs-Élysées!',
      stageType: 'Sprint',
      weather: 'Sunny',
      color: 'from-yellow-400 to-yellow-600',
      location: 'Arrivée Finale'
    }
  ];

  // Find current stage based on total points
  useEffect(() => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (totalPoints >= stages[i].pointsRequired) {
        setCurrentStage(i);
        break;
      }
    }
    setLoading(false);
  }, [totalPoints, stages.length]);

  const nextStage = stages[currentStage + 1];
  const currentProgress = stages[currentStage];
  const progressToNext = nextStage ? 
    ((totalPoints - currentProgress.pointsRequired) / (nextStage.pointsRequired - currentProgress.pointsRequired)) * 100 : 100;

  const weatherIcons: Record<WeatherType, string> = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Rainy': '🌧️',
    'Windy': '💨',
    'Storm': '⛈️',
    'Variable': '🌤️',
    'Headwind': '🌪️',
    'Tailwind': '🍃'
  };

  const stageColors: Record<StageType, string> = {
    'Flat': 'text-green-600',
    'Hilly': 'text-yellow-600',
    'Mountain': 'text-red-600',
    'Time Trial': 'text-blue-600',
    'Sprint': 'text-purple-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🚴‍♂️</div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🏆 TOUR DE FRANCE CHALLENGE 🏆
          </h1>
          <p className="text-xl text-gray-600">Peloton pääsee Pariisiin yhdessä!</p>
        </motion.div>

        {/* Current Stage Status */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-r ${currentProgress.color} rounded-3xl p-8 shadow-2xl border-2 border-white/20`}
        >
          <div className="text-center">
            <div className="text-8xl mb-4">{currentProgress.emoji}</div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              📍 Étape {currentStage + 1}: {currentProgress.location}
            </h2>
            <h3 className="text-2xl font-semibold mb-2 text-white/90">
              {currentProgress.name}
            </h3>
            <p className="text-lg mb-4 text-white/80">
              {currentProgress.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString('fi-FI')} pts</div>
                <div className="text-sm text-white/80">Tour-pisteet</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Activity className="w-6 h-6 mx-auto mb-2 text-white" />
                <div className="text-xl font-bold text-white">{weatherIcons[currentProgress.weather]} {currentProgress.weather}</div>
                <div className="text-sm text-white/80">Sääolosuhteet</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Bike className="w-6 h-6 mx-auto mb-2 text-white" />
                <div className={`text-xl font-bold text-white`}>
                  {currentProgress.stageType}
                </div>
                <div className="text-sm text-white/80">Etappi tyyppi</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress to Next Stage */}
        {nextStage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                Seuraava etappi: {nextStage.name} {nextStage.emoji}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm ${stageColors[nextStage.stageType]} bg-white/60`}>
                {nextStage.stageType}
              </span>
            </div>
            
            <div className="relative mb-4">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <span className="text-xs font-bold text-white">{Math.round(progressToNext)}%</span>
                </motion.div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Étape {currentStage + 1}</span>
                <span>Étape {currentStage + 2}</span>
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">
                {(nextStage.pointsRequired - totalPoints).toLocaleString('fi-FI')} pistettä
              </span>
              <span className="text-gray-500 ml-2">seuraavaan etappiin</span>
            </div>
          </motion.div>
        )}

        {/* Stage Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Bike className="w-6 h-6 mr-2 text-yellow-500" />
            Tour de France Reitti
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {stages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                  index <= currentStage 
                    ? 'bg-green-100 border-2 border-green-400/50' 
                    : index === currentStage + 1
                    ? 'bg-yellow-100 border-2 border-yellow-400/50'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="text-4xl">{stage.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className={`font-medium text-lg ${
                      index <= currentStage ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      Étape {index + 1}: {stage.name}
                    </h4>
                    {index <= currentStage && (
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    )}
                    <span className="text-2xl">{weatherIcons[stage.weather]}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stage.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`px-2 py-1 rounded ${stageColors[stage.stageType]} bg-white/70`}>
                      {stage.stageType}
                    </span>
                    <span className="text-gray-500">{stage.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-xl ${
                    index <= currentStage ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {stage.pointsRequired.toLocaleString('fi-FI')} pts
                  </div>
                  {index <= currentStage ? (
                    <div className="text-green-500 text-sm flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  ) : index === currentStage + 1 ? (
                    <div className="text-yellow-500 text-sm flex items-center">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      Current
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      À venir
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-lg text-white">
            <Users className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Peloton</h4>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-yellow-100">coureurs actifs</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg text-white">
            <Trophy className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Progression</h4>
            <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
            <p className="text-sm text-blue-100">vers Paris</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 shadow-lg text-white">
            <Activity className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Objectif quotidien</h4>
            <p className="text-3xl font-bold">{Math.round((TOTAL_TOUR_POINTS - totalPoints) / 140)}</p>
            <p className="text-sm text-green-100">pts/jour vers larrivée</p>
          </div>
        </motion.div>

        {/* Jerseys & Classifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🏆 Maillots & Classifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-yellow-100 border-2 border-yellow-400">
              <div className="text-2xl mb-1">🟡</div>
              <div className="text-sm font-medium">Maillot Jaune</div>
              <div className="text-xs text-gray-600">Classement Général</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-100 border-2 border-green-400">
              <div className="text-2xl mb-1">🟢</div>
              <div className="text-sm font-medium">Maillot Vert</div>
              <div className="text-xs text-gray-600">Points Sprint</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-100 border-2 border-red-400">
              <div className="text-2xl mb-1">🔴</div>
              <div className="text-sm font-medium">Maillot à Pois</div>
              <div className="text-xs text-gray-600">Roi de la Montagne</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-100 border-2 border-gray-400">
              <div className="text-2xl mb-1">⚪</div>
              <div className="text-sm font-medium">Maillot Blanc</div>
              <div className="text-xs text-gray-600">Meilleur Jeune</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TourDeFranceDashboard;