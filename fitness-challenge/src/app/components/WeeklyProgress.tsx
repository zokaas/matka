import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { User } from "@/app/types/types";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";
import { useWeeklyInsights } from "@/app/hooks/useWeeklyInsights";

interface WeeklyProgressProps {
  users: User[];
}

const getMedal = (rank: number) => {
  if (rank === 1) return "🥇"; // Gold
  if (rank === 2) return "🥈"; // Silver
  if (rank === 3) return "🥉"; // Bronze
  return null;
};

const WeeklyProgress = ({ users }: WeeklyProgressProps) => {
  const targetPaces = useTargetPaces(users);
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
        📊 Tämän viikon ranking
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Tavoite: {targetPaces && Math.round(targetPaces.weeklyPerUser)} km
        viikossa
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {weeklyInsights.map((insight, index) => {
          const user = users.find((u) => u.username === insight.username);

          return (
            <Link
              key={insight.username}
              href={`/user/${insight.username}`}
              className={`block p-5 rounded-xl shadow-md transition-transform duration-200 hover:scale-105
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 🏅 Profile Section */}
                <div className="flex items-center mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-gray-300 mr-4">
                    <Image
                      src={
                        user?.profilePicture
                          ? `https://matka-xi.vercel.app/${user.username}.png`
                          : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`
                      }
                      alt={`${insight.username} profiilikuva`}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 text-lg bg-white rounded-full shadow-sm">
                        {getMedal(index + 1)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {insight.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Sijoitus {index + 1}
                    </p>
                  </div>
                </div>

                {/* 📊 Progress Bar & Stats */}
                <div className="flex items-center justify-between">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <CircularProgressbar
                      value={insight.weeklyPercentage}
                      styles={buildStyles({
                        pathColor:
                          insight.weeklyPercentage >= 100
                            ? "#22c55e"
                            : insight.weeklyPercentage >= 50
                            ? "#f97316"
                            : "#ef4444",
                        textColor: "transparent",
                        trailColor: "#e5e7eb",
                        strokeLinecap: "round",
                      })}
                    />
                    <div className="absolute text-gray-800 font-bold text-sm">
                      {insight.weeklyPercentage}%
                    </div>
                  </div>

                  {/* 🏃‍♂️ Distance Info */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(insight.weeklyProgress).toLocaleString(
                        "fi-FI"
                      )}{" "}
                      km
                    </p>
                    <p className="text-sm text-gray-500">km tällä viikolla</p>
                    {insight.dailyTarget > 0 && (
                      <div className="mt-2 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1 no-warp">
                        Tarvitaan vielä {insight.dailyTarget} km/päivä
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyProgress;
