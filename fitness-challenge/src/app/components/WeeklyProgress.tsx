import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { User } from "@/app/types/types";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";
import { useWeeklyInsights } from "@/app/hooks/useWeeklyInsights";

interface WeeklyProgressProps {
  users: User[];
}

const WeeklyProgress = ({ users }: WeeklyProgressProps) => {
  const targetPaces = useTargetPaces(users);
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

const getProgressColor = (percentage: number) => {
  if (percentage >= 50) return "#22c55e"; // Green
  if (percentage >= 25) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
        <span>📊</span> Tämän viikon ranking
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Tavoite: {targetPaces && Math.round(targetPaces.weeklyPerUser)} km
        viikossa
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {weeklyInsights.map((insight, index) => {
          // Find the matching user to get their profile picture
          const user = users.find((u) => u.username === insight.username);

          return (
            <Link
              key={insight.username}
              href={`/user/${insight.username}`}
              className="block hover:shadow-lg transition-shadow duration-200"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                    {user && (
                      <Image
                        src={
                          user.profilePicture
                            ? `https://matka-xi.vercel.app/${user.username}.png`
                            : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                        }
                        alt={`${insight.username}'s avatar`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-800">
                      {insight.username}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">Sijoitus {index + 1}</span>
                      {index + 1 <= 3 && (
                        <span className="ml-2 text-yellow-500">
                          {index + 1 === 1
                            ? "🥇"
                            : index + 1 === 2
                            ? "🥈"
                            : "🥉"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-20 h-20">
                    <CircularProgressbar
                      value={insight.weeklyPercentage}
                      text={`${insight.weeklyPercentage}%`}
                      styles={buildStyles({
                        pathColor: getProgressColor(insight.weeklyPercentage),
                        textColor: "#374151",
                        trailColor: "#e5e7eb",
                        textSize: "22px",
                        pathTransition: "stroke-dashoffset 0.5s ease 0s",
                      })}
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(insight.weeklyProgress).toLocaleString(
                        "fi-FI"
                      )}{" "}
                      km
                    </div>
                    <div className="text-sm text-gray-500">
                      km tällä viikolla
                    </div>

                    {insight.dailyTarget > 0 && (
                      <div className="mt-2 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1">
                        {insight.dailyTarget} km/pvä tarvitaan
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
