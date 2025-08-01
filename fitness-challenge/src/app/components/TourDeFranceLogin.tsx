import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bike, Users, LogIn } from 'lucide-react';

interface User {
  totalKm: number;
  username: string;
  totalPoints: number; // Changed from totalKm to totalPoints
}

const TourDeFranceLogin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://matka-zogy.onrender.com/users');
        if (response.ok) {
          const userData = await response.json();
          // Convert km to points for display (assuming current km * 0.1 = rough points conversion)
          const convertedUsers = userData.map((user: User) => ({
            ...user,
            totalPoints: Math.round(user.totalKm * 0.1) // Rough conversion for display
          }));
          setUsers(convertedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      localStorage.setItem('currentUser', selectedUser);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-slate-50 flex items-center justify-center p-4">
      {/* Cycling-themed background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 300" className="w-full h-auto opacity-10">
            {/* Mountains silhouette for Alps/Pyrenees */}
            <polygon points="0,300 0,200 150,120 300,180 450,100 600,140 750,80 900,120 1050,90 1200,130 1200,300" fill="currentColor" className="text-slate-400"/>
            <polygon points="0,300 100,250 250,200 400,230 550,180 700,210 850,170 1000,200 1150,160 1200,180 1200,300" fill="currentColor" className="text-slate-300"/>
            <polygon points="0,300 200,280 350,240 500,260 650,220 800,240 950,200 1100,220 1200,210 1200,300" fill="currentColor" className="text-slate-200"/>
          </svg>
        </div>
        {/* Floating cycling elements */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🚴‍♂️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-2">
            TOUR DE FRANCE CHALLENGE
          </h1>
          <p className="text-gray-600">Liity pelotoniin kohti Pariisia</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Valitse coureur-profiilisi
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 backdrop-blur-sm shadow-sm"
              required
            >
              <option value="">Valitse coureur...</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  🚴‍♂️ {user.username} ({user.totalPoints.toLocaleString('fi-FI')} pts)
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!selectedUser}
            className="w-full bg-gradient-to-r from-yellow-500 to-slate-500 text-white py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-slate-600 transition duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            <span>Rejoindre le Peloton</span>
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center justify-center">
              <Bike className="w-4 h-4 mr-1" />
              État du Peloton
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p>🚴‍♂️ Coureurs actifs: {users.length}</p>
              <p>🏆 Points collectifs: {users.reduce((sum, user) => sum + user.totalPoints, 0).toLocaleString('fi-FI')} pts</p>
              <p>🎯 Objectif: 3,360 points → Paris!</p>
              <p>📍 Route: Florence → Champs-Élysées</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🇫🇷 Seuls les coureurs enregistrés peuvent rejoindre le Tour</p>
        </div>
      </div>
    </div>
  );
};

export default TourDeFranceLogin;