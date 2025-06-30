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

  useEffect(() => {
    if (users && users.length > 0) {
      // Laske kokonaiskilometrit
      const total = users.reduce((sum, user) => sum + user.totalKm, 0);
      setTotalKm(total);

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
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🏁</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Haaste päättynyt!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Maailmanympäri-haaste on päättynyt. Kiitos kaikille osallistujille uskomattomasta matkasta!
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-purple-100">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {Math.round(totalKm).toLocaleString('fi-FI')} km
            </h3>
            <p className="text-gray-600">Yhteensä kuljettu matka</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-purple-100">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{users.length}</h3>
            <p className="text-gray-600">Upeaa urheilijaa</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-purple-100">
            <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {totalActivities.toLocaleString('fi-FI')}
            </h3>
            <p className="text-gray-600">Suoritusta yhteensä</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-purple-100">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {topPerformer ? Math.round(topPerformer.totalKm).toLocaleString('fi-FI') : 0} km
            </h3>
            <p className="text-gray-600">Paras suoritus</p>
            {topPerformer && (
              <p className="text-sm text-purple-600 font-medium mt-1">
                {topPerformer.username}
              </p>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mitä seuraavaksi?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Tämä oli vasta alkua! Olemme suunnittelemassa vielä suurempaa ja parempaa haastetta.
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-4">Palaamme syyskuussa!</h3>
            <p className="text-lg mb-6 opacity-90">
              Uusi haaste alkaa syyskuussa 2025. Tule mukaan seuraavalle uskomattomalle matkalle!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-semibold mb-2">🌟 Uusia ominaisuuksia</h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Reaaliaikainen karttaseuranta</li>
                  <li>• Tiimi-haasteet</li>
                  <li>• Palkinnot ja saavutukset</li>
                </ul>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-semibold mb-2">🚀 Uusi reitti</h4>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Avaruusmatka kuuhun</li>
                  <li>• Vielä enemmän kaupunkeja</li>
                  <li>• Interaktiivisia kohteita</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Thank You Section with Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Kiitos kaikille!</h2>
            <p className="text-lg mb-6 opacity-90">
              Tämä matka ei olisi ollut mahdollinen ilman teidän uskomattomaa sitoutumista ja intoa. 
              Jokainen kilometri, jokainen suoritus ja jokainen kannustava kommentti teki tästä haasteesta 
              jotain todella erityistä.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                #Petolliset
              </span>
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                #MaailmanYmpäri
              </span>
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
                #YhdessäVahvempia
              </span>
            </div>
          </div>

          {/* Final Leaderboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🏆 Lopulliset sijoitukset
            </h3>
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

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">
            Seuraa meitä sosiaalisessa mediassa saadaksesi päivityksiä tulevista haasteista
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengeClosedPage;
