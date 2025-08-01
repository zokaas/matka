import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, MapPin, Award, Activity } from 'lucide-react';
import { useFetchUsers } from '../hooks/useFetchUsers';
import { User } from '../types/types';

const ChallengeClosedPage = () => {
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

{/* 👇 UUSI ILMOITUS TÄHÄN */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.5 }}
  className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 shadow-md backdrop-blur-sm text-center"
>
  <h2 className="text-xl font-semibold text-gray-800 mb-3">🚴‍♀️ Uusi haaste alkaa 4.8.!</h2>
  <p className="text-l text-gray-700">
    Yksityiskohdat julkaistaan pian – valmistaudu inspiroitumaan ja mukaan seikkailuun. 💪
  </p>
</motion.div>
   

        {/* Statistics Cards */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <Trophy className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {Math.round(totalKm).toLocaleString('fi-FI')} km
            </h3>
            <p className="text-gray-600">Yhteensä kuljettu matka</p>
            <p className="text-sm text-orange-600 mt-1">{completionPercentage}% tavoitteesta</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{users.length}</h3>
            <p className="text-gray-600">Rohkeaa yrittäjää</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {totalActivities.toLocaleString('fi-FI')}
            </h3>
            <p className="text-gray-600">Suoritusta yhteensä</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {Math.round(remainingKm).toLocaleString('fi-FI')} km
            </h3>
            <p className="text-gray-600">Jäi puuttumaan</p>
          </div>
        </motion.div> */}

        {/* Thank You Section with Leaderboard */}
{/*
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="text-center mb-12"
  >
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white mb-8">
      <h2 className="text-3xl font-bold mb-4">Kiitos kaikille!</h2>
      <p className="text-gray-600 mb-6 text-center">
        🌍 Afrikka jäi valitettavasti vailla ystävyyttä taas kerran - ehkä ensi kerralla!
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Lopulliset sijoitukset</h3>
      <div className="grid gap-4 max-w-2xl mx-auto">
        {users
          .sort((a, b) => b.totalKm - a.totalKm)
          .map((user, index) => (
            <div
              key={user.username}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300"
                  : index === 2
                  ? "bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <span className="font-semibold text-gray-800">
                  {user.username}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-purple-600">
                  {Math.round(user.totalKm).toLocaleString('fi-FI')} km
                </span>
                <div className="text-sm text-gray-500">
                  {user.activities.length} suoritusta
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  </motion.div>
*/}

      </div>
    </div>
  );
};

export default ChallengeClosedPage;
