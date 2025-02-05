"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface User {
  username: string;
  totalKm: number;
  activities: { activity: string; date: string }[];
}

const TOTAL_GOAL = 100000; // Total goal in kilometers
const MOTIVATIONAL_MESSAGES = [
  "🌟 Emme tiedä mitään ennen kuin on liian myöhäistä",
  "🔥 Saksa on paska maa",
  "🌍 Ystävyyden voimalla ympäri maailman",
  "🚀 ",
  "💪 Maailma ei lopu Joroisiin",
  "🌟 Huominen on aina tulevaisuutta.",
  "🔥 Sovitaanko, että sinä olet vahtimestari ja minä Maailmanmestari!",
  "🌍 Jokainen tsäänssi on mahdollisuus",
  "🚀 En tiedä miksi hypin, mutta hypin kyllä",
  "💪 Jos pallo on pyöreä, niin elämäkin on pyöreä",
];

export default function QuickAccess() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("http://localhost:5001/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        const sortedUsers = data.sort(
          (a: User, b: User) => b.totalKm - a.totalKm
        ); // Sort by totalKm descending
        setUsers(sortedUsers);
        setTotalKm(sortedUsers.reduce((sum: number, user: User) => sum + user.totalKm, 0));

        // Select a random motivational message
        setMotivationalMessage(
          MOTIVATIONAL_MESSAGES[
            Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
          ]
        );
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  const progress = (totalKm / TOTAL_GOAL) * 100; // Calculate progress percentage

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Progress Bar */}
      <section className="bg-white p-4 rounded-lg shadow text-center">
        {/* Header Section */}
        <motion.header
          className="p-4 rounded-lg text-center shadow"
          animate={{ opacity: [0, 1], y: [-20, 0] }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl font-bold text-purple-600">PETOLLISET🔥</h1>
          <motion.div
            className="mt-4 text-lg font-bold text-purple-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {motivationalMessage}
          </motion.div>

          <div className="relative mt-4">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <motion.div
                className="h-6 bg-gradient-to-r from-purple-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            <p className="mt-2 text-gray-600">
              {totalKm.toFixed(2)} / {TOTAL_GOAL.toLocaleString()} km (
              {progress.toFixed(2)}%)
            </p>
          </div>
        </motion.header>
      </section>

      {/* Loading & Error Handling */}
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Ladataan käyttäjiä...
        </div>
      )}
      {error && <div className="text-center text-red-500">Virhe: {error}</div>}

      {/* Leaderboard */}
      {!loading && !error && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <span>🏆</span> Leaderboard
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {users.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/user/${user.username}`}
                  className={`block bg-white p-4 rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 ${
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
                    <div className="relative">
                      <Image
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
                        alt={`${user.username}'s avatar`}
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                        unoptimized
                      />
                      {getMedal(index) && (
                        <div className="absolute -bottom-2 -right-2 text-3xl">
                          {getMedal(index)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-medium">
                      {user.username}
                    </h3>
                    <p
                      className={`font-medium ${
                        user.totalKm > 0 ? "text-purple-600" : "text-gray-400"
                      }`}
                    >
                      {user.totalKm.toFixed(1)} km
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
