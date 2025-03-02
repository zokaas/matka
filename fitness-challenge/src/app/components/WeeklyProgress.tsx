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

const WeeklyProgress = ({ users }: WeeklyProgressProps) => {
  const targetPaces = useTargetPaces(users);
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

  return (
    <section className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center mb-2 sm:mb-4">
        📊 Tämän viikon ranking
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Tavoite: {targetPaces && Math.round(targetPaces.weeklyPerUser)} km
        viikossa
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {weeklyInsights.map((insight, index) => {
          const user = users.find((u) => u.username === insight.username);

          return (
            <Link
              key={insight.username}
              href={`/user/${insight.username}`}
              className="block p-3 sm:p-5 rounded-xl shadow-md transition-transform duration-200 hover:scale-105"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* 🏅 Profile Section - more compact on mobile */}
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md border-2 border-gray-300 mr-3 sm:mr-4">
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
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                      {insight.username}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sijoitus {index + 1}
                    </p>
                  </div>
                </div>

                {/* 📊 Progress Bar & Stats - made responsive */}
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
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
                    <div className="absolute text-gray-800 font-bold text-xs sm:text-sm">
                      {insight.weeklyPercentage}%
                    </div>
                  </div>

                  {/* 🏃‍♂️ Distance Info - responsive text sizes */}
                  <div className="text-right">
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">
                      {Math.round(insight.weeklyProgress).toLocaleString(
                        "fi-FI"
                      )}{" "}
                      km
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      km tällä viikolla
                    </p>
                    {insight.dailyTarget > 0 && (
                      <div className="mt-1 sm:mt-2 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-0.5 sm:py-1 text-center sm:text-left">
                        {insight.dailyTarget} km/päivä
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
