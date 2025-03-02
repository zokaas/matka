import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "@/app/types/types";

interface LeaderboardProps {
  users: User[];
}

const getMedal = (index: number) => {
  if (index === 0) return "🥇"; // Gold
  if (index === 1) return "🥈"; // Silver
  if (index === 2) return "🥉"; // Bronze
  return null;
};

const Leaderboard = ({ users }: LeaderboardProps) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
        <span>🏆</span> Sijoitukset
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {users
          .sort((a, b) => b.totalKm - a.totalKm) // Sort by total kilometers
          .map((user, index) => (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/user/${user.username}`}
                className={`block bg-white p-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  index === 0
                    ? "border-yellow-500 border-2"
                    : index === 1
                    ? "border-gray-400 border-2"
                    : index === 2
                    ? "border-orange-400 border-2"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    {/* Profile Picture */}
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                      <Image
                        src={
                          user.profilePicture
                            ? `https://matka-xi.vercel.app/${user.username}.png`
                            : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                        }
                        alt={`${user.username}'s avatar`}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    {/* Medals for Top 3 */}
                    {getMedal(index) && (
                      <div className="absolute -bottom-3 -right-3 text-3xl rounded-full p-1 shadow-md">
                        {getMedal(index)}
                      </div>
                    )}
                  </div>
                  {/* Username */}
                  <h3 className="mt-2 text-lg font-medium text-gray-800">
                    {user.username}
                  </h3>
                  {/* Distance */}
                  <p className="font-bold text-xl text-purple-600 mt-1">
                    {Math.round(user.totalKm).toLocaleString("fi-FI")} km
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default Leaderboard;
