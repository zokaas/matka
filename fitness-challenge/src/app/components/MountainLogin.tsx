import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Users, LogIn } from 'lucide-react';

interface User {
  username: string;
  totalKm: number;
}

const MountainLogin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://matka-zogy.onrender.com/users');
        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
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
      // Handle login logic here
      localStorage.setItem('currentUser', selectedUser);
      // Redirect or update app state
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-400 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Mountain silhouettes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 300" className="w-full h-auto opacity-20">
            <polygon points="0,300 0,200 200,100 400,150 600,80 800,120 1000,60 1200,100 1200,300" fill="currentColor" className="text-slate-700"/>
            <polygon points="0,300 100,250 300,180 500,200 700,150 900,180 1100,140 1200,160 1200,300" fill="currentColor" className="text-slate-600"/>
            <polygon points="0,300 150,280 350,220 550,240 750,200 950,220 1150,180 1200,190 1200,300" fill="currentColor" className="text-slate-500"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 bg-slate-800/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🏔️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            HUIPPUJEN VALLOITUS
          </h1>
          <p className="text-gray-300">Liity kiipeilytiimiimme</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Valitse kiipeilijäprofiilisi
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white backdrop-blur-sm"
              required
            >
              <option value="">Valitse kiipeilijä...</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  🧗‍♂️ {user.username} ({Math.round(user.totalKm).toLocaleString('fi-FI')} m)
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!selectedUser}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            <span>Aloita kiipeily</span>
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center justify-center">
              <Mountain className="w-4 h-4 mr-1" />
              Expeditio Status
            </h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>🏔️ Aktiivisia kiipeilijöitä: {users.length}</p>
              <p>⛰️ Yhteinen korkeus: {users.reduce((sum, user) => sum + user.totalKm, 0).toLocaleString('fi-FI')} m</p>
              <p>🎯 Tavoite: Everest (8,849 m)</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🧗‍♂️ Vain rekisteröityneet kiipeilijät voivat liittyä expeditiooon</p>
        </div>
      </div>
    </div>
  );
};

export default MountainLogin;