import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bike, Users, LogIn } from 'lucide-react';
import { useTheme } from '@/app/hooks/useTheme';

interface User {
  totalKm: number;
  username: string;
  totalPoints: number;
}

const LoginScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://matka-zogy.onrender.com/users');
        if (response.ok) {
          const userData = await response.json();
          const convertedUsers = userData.map((user: User) => ({
            ...user,
            totalPoints: Math.round(user.totalKm * 0.1),
          }));
          setUsers(convertedUsers);
        }
      } catch (error) {
        console.error('Käyttäjien haku epäonnistui:', error);
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
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="relative max-w-xl w-full space-y-10 text-center">
        {/* Vuoritausta */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
          <svg viewBox="0 0 1200 300" className="w-full h-auto">
            <polygon points="0,300 0,200 150,120 300,180 450,100 600,140 750,80 900,120 1050,90 1200,130 1200,300" fill="currentColor" className="text-slate-400" />
            <polygon points="0,300 100,250 250,200 400,230 550,180 700,210 850,170 1000,200 1150,160 1200,180 1200,300" fill="currentColor" className="text-slate-300" />
            <polygon points="0,300 200,280 350,240 500,260 650,220 800,240 950,200 1100,220 1200,210 1200,300" fill="currentColor" className="text-slate-200" />
          </svg>
        </div>

        {/* Otsikko */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl md:text-6xl mb-3">{t.loginEmoji}</div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-2">
            {t.loginTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-600">{t.loginSubtitle}</p>
        </motion.div>

        {/* Kirjautumislomake */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6 text-left"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
              <Users className="w-4 h-4 mr-2" />
              {t.selectUserLabel}
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-3 md:p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800 shadow-sm"
              required
            >
              <option value="">{t.selectUserPlaceholder}</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  🚴‍♂️ {user.username} ({user.totalPoints.toLocaleString('fi-FI')} {t.points})
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!selectedUser}
            className="w-full bg-gradient-to-r from-yellow-500 to-slate-500 text-white py-3 md:py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-slate-600 transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            <span>{t.loginButton}</span>
          </motion.button>
        </motion.form>

        {/* Tilannetiedot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-sm text-sm"
        >
          <h3 className="text-slate-800 font-semibold flex items-center justify-center mb-2">
            <Bike className="w-4 h-4 mr-1" />
            {t.teamTitle}
          </h3>
          <div className="space-y-1 text-slate-700 text-center">
            <p>🚴‍♂️ {t.activeUsers}: {users.length}</p>
            <p>🏆 {t.totalPointsLabel}: {users.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString('fi-FI')} {t.points}</p>
            <p>🎯 {t.goalLabel}</p>
            <p>📍 {t.routeLabel}</p>
          </div>
        </motion.div>

        <div className="text-xs text-gray-500 mt-4 text-center">
          {t.loginNote}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;