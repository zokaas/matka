import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { User } from '../types/types';
import { useTheme } from '@/app/hooks/useTheme';

const ChallengeClosedPage = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  const [totalKm, setTotalKm] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [topPerformer, setTopPerformer] = useState<User | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [remainingKm, setRemainingKm] = useState(0);

  const GOAL_KM = 100000; // Alkuperäinen tavoite

  useEffect(() => {
    if (users && users.length > 0) {
      // Laske kokonaiskilometrit
      const total = users.reduce((sum, user) => sum + user.totalKm, 0);
      setTotalKm(total);

      // Laske toteutusprosentti
      const percentage = Math.round((total / GOAL_KM) * 100);
      setCompletionPercentage(percentage);

      // Laske jäljellä oleva matka
      const remaining = Math.max(0, GOAL_KM - total);
      setRemainingKm(remaining);

      // Laske yhteensä aktiviteetit
      const activities = users.reduce((sum, user) => sum + user.activities.length, 0);
      setTotalActivities(activities);

      // Löydä paras suorittaja
      const best = users.reduce((best, user) => 
        user.totalKm > best.totalKm ? user : best, users[0]
      );
      setTopPerformer(best);
    }
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Virhe tietojen lataamisessa: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🚴‍♂️</div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-4">
            🏆 TOUR DE FRANCE CHALLENGE 🏆
          </h1>
          <p className="text-xl text-gray-600">Peloton polkee yhdessä Pariisiin! 🚴‍♂️🚴‍♀️</p>
        </motion.div>

        {/* 👇 UUSI ILMOITUS TÄHÄN */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-slate-100 shadow-md backdrop-blur-sm text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{t.challengeClosed.newChallengeStarts}</h2>
          <p className="text-l text-gray-700">
            {t.challengeClosed.detailsWillBeReleased} – {t.challengeClosed.prepareToBe} {t.challengeClosed.inspired}!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengeClosedPage;