import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "@/app/types/types";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";

interface LeaderboardProps {
  users: User[];
}

interface UserProgress {
  user: User;
  personalTarget: number;
  progressPercentage: number;
  expectedProgress: number;
  difference: number;
  status: 'ahead' | 'behind' | 'ontrack';
  performanceRatio: number;
}

const getMedal = (index: number) => {
  if (index === 0) return "🥇"; // Gold
  if (index === 1) return "🥈"; // Silver
  if (index === 2) return "🥉"; // Bronze
  return null;
};

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
};

const Leaderboard = ({ users }: LeaderboardProps) => {
  const { t } = useTheme();

  // Calculate personal progress for each user
  const usersWithProgress: UserProgress[] = users.map(user => {
    const today = new Date();
    const challengeStart = new Date(challengeParams.startDate);
    
    const totalChallengeDays = challengeParams.totalDays;
    const daysPassed = Math.max(0, Math.ceil((today.getTime() - challengeStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    const personalTarget = challengeParams.totalDistance / users.length;
    const expectedProgress = (personalTarget * daysPassed) / totalChallengeDays;
    const progressPercentage = (user.totalKm / personalTarget) * 100;
    const difference = user.totalKm - expectedProgress;
    
    let status: 'ahead' | 'behind' | 'ontrack' = 'ontrack';
    if (difference > 5) status = 'ahead';
    else if (difference < -5) status = 'behind';
    
    const performanceRatio = expectedProgress > 0 ? (user.totalKm / expectedProgress) * 100 : 100;

    return {
      user,
      personalTarget,
      progressPercentage,
      expectedProgress,
      difference: Math.abs(difference),
      status,
      performanceRatio
    };
  });

  // Sort users by performance ratio (how well they're doing relative to expected progress)
  const sortedUsers = usersWithProgress.sort((a, b) => b.performanceRatio - a.performanceRatio);

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
        <span>🏆 </span> {t.leaderboard.title}
      </h2>
      
      <div className="space-y-4">
        {sortedUsers.map((userProgress, index) => {
          const { user, personalTarget, progressPercentage, expectedProgress, difference, status, performanceRatio } = userProgress;
          const totalDuration = user.activities.reduce((sum, activity) => sum + activity.duration, 0);

          return (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/user/${user.username}`}
                className={`block bg-white p-4 rounded-xl shadow-md transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border-2 ${
                  index === 0
                    ? "border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50"
                    : index === 1
                    ? "border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50"
                    : index === 2
                    ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  {/* Left side - Profile and basic info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {/* Profile Picture */}
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                        <Image
                          src={
                            user.profilePicture
                              ? `https://matka-xi.vercel.app/${user.username}.png`
                              : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                          }
                          alt={`${user.username}'s avatar`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </div>
                      {/* Medal */}
                      {getMedal(index) && (
                        <div 
                          className="absolute -bottom-2 -right-2 text-2xl rounded-full p-1 bg-white shadow-sm"
                          title={
                            index === 0 
                              ? t.leaderboard.goldMedal 
                              : index === 1 
                              ? t.leaderboard.silverMedal 
                              : t.leaderboard.bronzeMedal
                          }
                        >
                          {getMedal(index)}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-gray-800">
                        {user.username}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div>Km: {user.totalKm.toLocaleString("fi-FI", { 
                          minimumFractionDigits: 1, 
                          maximumFractionDigits: 1 
                        })}</div>
                        <div>Aika: {formatDuration(totalDuration)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Performance info */}
                  <div className="text-right">
                    <div className={`text-2xl font-bold mb-1 ${
                      status === 'ahead' ? 'text-green-600' :
                      status === 'behind' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {performanceRatio.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      henk. tavoitteesta
                    </div>
                  </div>
                </div>

                {/* Progress section */}
                <div className={`p-3 rounded-lg border ${
                  status === 'ahead' ? 'bg-green-50 border-green-200' :
                  status === 'behind' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Henkilökohtainen edistyminen:</span>
                    <span className="font-medium">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-2.5 mb-2 relative overflow-hidden">
                    {/* Expected progress line */}
                    <div 
                      className="absolute top-0 h-2.5 w-0.5 rounded-full bg-gray-600 z-10"
                      style={{ left: `${Math.min(100, (expectedProgress / personalTarget) * 100)}%` }}
                      title={`Missä pitäisi olla: ${expectedProgress.toFixed(1)} km`}
                    />
                    {/* Actual progress */}
                    <motion.div
                      className={`h-2.5  ${
                        status === 'ahead' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        status === 'behind' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progressPercentage)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  
                  {/* Status and numbers */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-600">
                      Tavoite: {personalTarget.toFixed(0)} km
                    </div>
                    <div className={`font-medium ${
                      status === 'ahead' ? 'text-green-700' :
                      status === 'behind' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      {status === 'ahead' && '🚀 '}
                      {status === 'behind' && '⚠️ '}
                      {status === 'ontrack' && '🎯 '}
                      {status === 'ahead' ? `${difference.toFixed(1)} km etuajassa` :
                       status === 'behind' ? `${difference.toFixed(1)} km jäljessä` :
                       'Aikataulussa'}
                    </div>
                  </div>
                  
                  {/* Additional context */}
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Pitäisi olla: {expectedProgress.toFixed(1)} km • 
                    Todellinen: {user.totalKm.toFixed(1)} km
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Leaderboard;