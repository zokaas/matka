import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Thermometer, Users, Award, Clock, Star, Activity, Compass } from 'lucide-react';

// Define proper types for weather and difficulty
type WeatherType = 'Sunny' | 'Cloudy' | 'Snowy' | 'Windy' | 'Storm' | 'Variable' | 'Blizzard' | 'Death Zone';
type DifficultyType = 'Helppo' | 'Kohtalainen' | 'Haastava' | 'Erittäin haastava' | 'Äärimmäisen haastava';

interface Peak {
  name: string;
  altitude: number;
  emoji: string;
  description: string;
  difficulty: DifficultyType;
  weather: WeatherType;
  color: string;
  basecamp: string;
}

const MountainClimbingDashboard = () => {
  const [totalAltitude, setTotalAltitude] = useState(4567); // meters climbed
  const [currentPeak, setCurrentPeak] = useState(0);
  const [loading, setLoading] = useState(true);

  const EVEREST_HEIGHT = 8849; // Total challenge: climb Everest's height
  const progressPercentage = (totalAltitude / EVEREST_HEIGHT) * 100;

  const peaks: Peak[] = [
    { 
      name: 'Harjureitti (Tampere)', 
      altitude: 0, 
      emoji: '🏃‍♂️', 
      description: 'Matka alkaa tasaisesta maastosta',
      difficulty: 'Helppo',
      weather: 'Sunny',
      color: 'from-green-400 to-green-600',
      basecamp: 'Aloitusleiri'
    },
    { 
      name: 'Koli', 
      altitude: 347, 
      emoji: '🌲', 
      description: 'Kansallismaisemien huippu',
      difficulty: 'Helppo',
      weather: 'Cloudy',
      color: 'from-emerald-400 to-emerald-600',
      basecamp: 'Metsäleiri'
    },
    { 
      name: 'Halti', 
      altitude: 1324, 
      emoji: '❄️', 
      description: 'Suomen korkein kohta',
      difficulty: 'Kohtalainen',
      weather: 'Snowy',
      color: 'from-blue-400 to-blue-600',
      basecamp: 'Tunturileiri'
    },
    { 
      name: 'Kebnekaise', 
      altitude: 2097, 
      emoji: '🏔️', 
      description: 'Ruotsin kattaa',
      difficulty: 'Kohtalainen',
      weather: 'Windy',
      color: 'from-purple-400 to-purple-600',
      basecamp: 'Alppileiri'
    },
    { 
      name: 'Mont Blanc', 
      altitude: 4807, 
      emoji: '⛷️', 
      description: 'Alppien valkoinen jättiläinen',
      difficulty: 'Haastava',
      weather: 'Storm',
      color: 'from-gray-300 to-gray-500',
      basecamp: 'Lumileiri'
    },
    { 
      name: 'Kilimanjaro', 
      altitude: 5895, 
      emoji: '🦁', 
      description: 'Afrikan katto',
      difficulty: 'Haastava',
      weather: 'Variable',
      color: 'from-orange-400 to-orange-600',
      basecamp: 'Savanileiri'
    },
    { 
      name: 'Denali', 
      altitude: 6190, 
      emoji: '🐻', 
      description: 'Pohjois-Amerikan huippu',
      difficulty: 'Erittäin haastava',
      weather: 'Blizzard',
      color: 'from-cyan-400 to-cyan-600',
      basecamp: 'Jääleiri'
    },
    { 
      name: 'Everest', 
      altitude: 8849, 
      emoji: '🏆', 
      description: 'Maailman korkein huippu - MAALI!',
      difficulty: 'Äärimmäisen haastava',
      weather: 'Death Zone',
      color: 'from-yellow-400 to-yellow-600',
      basecamp: 'Huippuleiri'
    }
  ];

  // Find current peak based on total altitude
  useEffect(() => {
    for (let i = peaks.length - 1; i >= 0; i--) {
      if (totalAltitude >= peaks[i].altitude) {
        setCurrentPeak(i);
        break;
      }
    }
    setLoading(false);
  }, [totalAltitude, peaks.length]); // Add peaks.length to dependencies

  const nextPeak = peaks[currentPeak + 1];
  const currentProgress = peaks[currentPeak];
  const progressToNext = nextPeak ? 
    ((totalAltitude - currentProgress.altitude) / (nextPeak.altitude - currentProgress.altitude)) * 100 : 100;

  const weatherIcons: Record<WeatherType, string> = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Snowy': '🌨️',
    'Windy': '💨',
    'Storm': '⛈️',
    'Variable': '🌤️',
    'Blizzard': '🌪️',
    'Death Zone': '💀'
  };

  const difficultyColors: Record<DifficultyType, string> = {
    'Helppo': 'text-green-600',
    'Kohtalainen': 'text-yellow-600',
    'Haastava': 'text-orange-600',
    'Erittäin haastava': 'text-red-600',
    'Äärimmäisen haastava': 'text-purple-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4">
            🏔️ HUIPPUJEN VALLOITUS 🏔️
          </h1>
          <p className="text-xl text-gray-300">Kiipeä Everesin huipulle yhdessä tiimin kanssa!</p>
        </motion.div>

        {/* Current Peak Status */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-r ${currentProgress.color} rounded-3xl p-8 shadow-2xl border-2 border-white/20`}
        >
          <div className="text-center">
            <div className="text-8xl mb-4">{currentProgress.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">
              📍 {currentProgress.basecamp}
            </h2>
            <h3 className="text-2xl font-semibold mb-2">
              {currentProgress.name}
            </h3>
            <p className="text-lg mb-4 opacity-90">
              {currentProgress.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Mountain className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalAltitude.toLocaleString('fi-FI')} m</div>
                <div className="text-sm opacity-80">Kokonaisnousu</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Thermometer className="w-6 h-6 mx-auto mb-2" />
                <div className="text-xl font-bold">{weatherIcons[currentProgress.weather]} {currentProgress.weather}</div>
                <div className="text-sm opacity-80">Sääolosuhteet</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Activity className="w-6 h-6 mx-auto mb-2" />
                <div className={`text-xl font-bold ${difficultyColors[currentProgress.difficulty]}`}>
                  {currentProgress.difficulty}
                </div>
                <div className="text-sm opacity-80">Vaikeustaso</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress to Next Peak */}
        {nextPeak && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Compass className="w-6 h-6 mr-2 text-cyan-400" />
                Seuraava huippu: {nextPeak.name} {nextPeak.emoji}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[nextPeak.difficulty]} bg-white/10`}>
                {nextPeak.difficulty}
              </span>
            </div>
            
            <div className="relative mb-4">
              <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-end pr-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <span className="text-xs font-bold text-white">{Math.round(progressToNext)}%</span>
                </motion.div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{currentProgress.name}</span>
                <span>{nextPeak.name}</span>
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-bold text-cyan-400">
                {(nextPeak.altitude - totalAltitude).toLocaleString('fi-FI')} m
              </span>
              <span className="text-gray-400 ml-2">jäljellä seuraavaan huippuun</span>
            </div>
          </motion.div>
        )}

        {/* Mountain Range Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Mountain className="w-6 h-6 mr-2 text-blue-400" />
            Kiipeilyreittiemme
          </h3>
          
          <div className="space-y-4">
            {peaks.map((peak, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                  index <= currentPeak 
                    ? 'bg-green-900/30 border-2 border-green-400/50' 
                    : index === currentPeak + 1
                    ? 'bg-yellow-900/30 border-2 border-yellow-400/50'
                    : 'bg-slate-700/30 border border-slate-600/50'
                }`}
              >
                <div className="text-4xl">{peak.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className={`font-medium text-lg ${
                      index <= currentPeak ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {peak.name}
                    </h4>
                    {index <= currentPeak && (
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    )}
                    <span className="text-2xl">{weatherIcons[peak.weather]}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{peak.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`px-2 py-1 rounded ${difficultyColors[peak.difficulty]} bg-white/10`}>
                      {peak.difficulty}
                    </span>
                    <span className="text-gray-500">{peak.basecamp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-xl ${
                    index <= currentPeak ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {peak.altitude.toLocaleString('fi-FI')} m
                  </div>
                  {index <= currentPeak ? (
                    <div className="text-green-400 text-sm flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Valloitettu
                    </div>
                  ) : index === currentPeak + 1 ? (
                    <div className="text-yellow-400 text-sm flex items-center">
                      <Compass className="w-4 h-4 mr-1" />
                      Seuraava
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Odottaa
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Stats & Equipment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
            <Users className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Kiipeilytiimi</h4>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm opacity-80">rohkeaa kiipeilijää</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-lg">
            <Mountain className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Everest-edistyminen</h4>
            <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
            <p className="text-sm opacity-80">huipulle pääsystä</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-lg">
            <Award className="w-8 h-8 mb-3" />
            <h4 className="text-lg font-semibold mb-2">Päivän haaste</h4>
            <p className="text-3xl font-bold">{Math.round((EVEREST_HEIGHT - totalAltitude) / 30)}</p>
            <p className="text-sm opacity-80">m/päivä tavoitteeseen</p>
          </div>
        </motion.div>

        {/* Equipment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            🎒 Kiipeilyvarusteet & Saavutukset
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`text-center p-3 rounded-lg ${totalAltitude >= 347 ? 'bg-green-900/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-1">🥾</div>
              <div className="text-sm">Vaelluskengät</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${totalAltitude >= 1324 ? 'bg-green-900/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-1">🧗‍♂️</div>
              <div className="text-sm">Kiipeilyvarusteet</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${totalAltitude >= 4807 ? 'bg-green-900/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-1">❄️</div>
              <div className="text-sm">Talvivarusteet</div>
            </div>
            <div className={`text-center p-3 rounded-lg ${totalAltitude >= 8849 ? 'bg-green-900/30' : 'bg-gray-700/30'}`}>
              <div className="text-2xl mb-1">🥽</div>
              <div className="text-sm">Korkeuden maski</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MountainClimbingDashboard;