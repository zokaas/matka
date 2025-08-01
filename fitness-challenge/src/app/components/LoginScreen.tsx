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
  const { t, colors } = useTheme();

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
  <div
    className="min-h-screen flex items-center justify-center px-4 py-8"
    style={{ backgroundColor: colors.background, color: colors.text }}
  >
    <div className="relative max-w-xl w-full space-y-10 text-center">

      {/* TITLE */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl md:text-6xl mb-3">{t.loginEmoji}</div>
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          {t.loginTitle}
        </h1>
        <p className="text-sm md:text-base" style={{ color: colors.mutedText }}>
          {t.loginSubtitle}
        </p>
      </motion.div>

      {/* FORM */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-6 text-left"
      >
        <div>
          <label
            className="block text-sm font-medium mb-2 flex items-center"
            style={{ color: colors.text }}
          >
            <Users className="w-4 h-4 mr-2" />
            {t.selectUserLabel}
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
            className="w-full p-3 md:p-4 rounded-xl shadow-sm focus:ring-2 focus:border-transparent"
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
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
          className="w-full py-3 md:py-4 px-6 rounded-xl transition font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          style={{
            backgroundColor: colors.primary,
            color: colors.background,
          }}
        >
          <LogIn className="w-5 h-5" />
          <span>{t.loginButton}</span>
        </motion.button>
      </motion.form>

      {/* TEAM INFO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-4 border shadow-sm text-sm backdrop-blur-md"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text,
        }}
      >
        <h3 className="font-semibold flex items-center justify-center mb-2">
          <Bike className="w-4 h-4 mr-1" />
          {t.teamTitle}
        </h3>
        <div className="space-y-1 text-center" style={{ color: colors.mutedText }}>
          <p>🚴‍♂️ {t.activeUsers}: {users.length}</p>
          <p>🏆 {t.totalPointsLabel}: {users.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString('fi-FI')} {t.points}</p>
          <p>🎯 {t.goalLabel}</p>
          <p>📍 {t.routeLabel}</p>
        </div>
      </motion.div>

      <div className="text-xs mt-4 text-center" style={{ color: colors.mutedText }}>
        {t.loginNote}
      </div>
    </div>
  </div>
);
}

export default LoginScreen;