import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, TrendingDown } from 'lucide-react';

const challengeParams = {
  totalDistance: 3338.8,
  startDate: "2025-08-04",
  endDate: "2025-12-19",
  get totalDays() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
};

interface User {
  username: string;
  totalKm: number;
  activities: Array<{
    id: number;
    activity: string;
    duration: number;
    date: string;
    kilometers: number;
    bonus?: string | null;
  }>;
}

interface PartyBannerProps {
  users: User[];
}

const PartyBanner: React.FC<PartyBannerProps> = ({ users }) => {
  const [expanded, setExpanded] = useState(false);

  const partyStats = useMemo(() => {
    const today = new Date();
    const start = new Date(challengeParams.startDate);
    const totalDays = challengeParams.totalDays;
    const daysPassed = Math.max(1, Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const personalTarget = challengeParams.totalDistance / users.length;

    const categorized = users.map(user => {
      const expected = (personalTarget * daysPassed) / totalDays;
      const diff = user.totalKm - expected;
      
      let category: 'invited' | 'cutoff' | 'behind';
      if (diff >= -5) category = 'invited';      // On track or ahead
      else if (diff >= -20) category = 'cutoff'; // Close but not quite
      else category = 'behind';                  // Needs work

      return {
        username: user.username,
        totalKm: user.totalKm,
        expected,
        diff,
        category,
        percentage: (user.totalKm / personalTarget) * 100
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return {
      invited: categorized.filter(u => u.category === 'invited'),
      cutoff: categorized.filter(u => u.category === 'cutoff'),
      behind: categorized.filter(u => u.category === 'behind'),
      total: users.length
    };
  }, [users]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-3 sm:p-5 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left: Party Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">
                Ranskalaiset<br className="sm:hidden" /> Pikkujoulut
              </h3>
              <p className="text-white/90 text-[10px] sm:text-xs font-medium mt-0.5 hidden sm:block">
                19.12.2025 🥐🍾
              </p>
            </div>
          </div>

          {/* Right: Stats + Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
              {expanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-sm">
              {/* Invited Section */}
              {partyStats.invited.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-bold text-gray-900 text-sm">
                      Kutsuttujen listalla ({partyStats.invited.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {partyStats.invited.map(user => (
                      <div
                        key={user.username}
                        className="bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">
                            {user.username}
                          </span>
                          <span className="text-xs text-green-700 font-medium">
                            {user.totalKm.toFixed(1)} km ({user.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cut-off Zone */}
              {partyStats.cutoff.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-bold text-gray-900 text-sm">
                      Hikiset paikat – liian lähellä rajaa ({partyStats.cutoff.length})
                    </h4>
                  </div>
                  <div className="text-xs text-orange-700 mb-3 italic">
                    Patonki ja samppanja näköpiirissä, mutta poljettava lisää! 🚴‍♂️💨
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {partyStats.cutoff.map(user => (
                      <div
                        key={user.username}
                        className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">
                            {user.username}
                          </span>
                          <span className="text-xs text-orange-700 font-medium">
                            {Math.abs(user.diff).toFixed(1)} km jäljessä
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Behind Section */}
              {partyStats.behind.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <h4 className="font-bold text-gray-900 text-sm">
                      Sohvaperunat – pöytävaraus vaarassa! ({partyStats.behind.length})
                    </h4>
                  </div>
                  <div className="text-xs text-red-700 mb-3 italic">
                    Samppanja vaihtuu vedeksi jos et herää! 💧
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {partyStats.behind.map(user => (
                      <div
                        key={user.username}
                        className="bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm">
                            {user.username}
                          </span>
                          <span className="text-xs text-red-700 font-medium">
                            {Math.abs(user.diff).toFixed(1)} km jäljessä
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PartyBanner;