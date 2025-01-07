import React, { useEffect, useState } from "react";
import { MapPin, TrendingUp, Users, Activity, Award, Clock } from "lucide-react";
import ProgressBar from "./ProgressBar";
import ActivityForm from "./ActivityForm";
import MapView from "./MapView";
import Leaderboard from "./Leaderboard";
import UserList from "./UserList";

const BACKEND_URL = "http://localhost:3000";

// Reusable StatsCard
const StatsCard = ({ title, value, icon: Icon, change, tooltip }) => (
  <div
    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
    title={tooltip}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {change !== undefined && (
          <p
            className={`text-sm flex items-center gap-1 ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}% viime viikosta
          </p>
        )}
      </div>
      <div className="p-3 bg-green-50 rounded-full text-green-600">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-6 rounded-lg shadow space-y-4">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-green-600" />
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

const HomePage = ({ onSubmit, users = [] }) => {
  const [progressData, setProgressData] = useState({
    totalPoints: 0,
    totalDistance: 0,
    remainingDistance: 0,
    route: [],
    userContributions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    weeklyChange: 0,
    activeUsers: 0,
    topContributor: "",
    averagePerUser: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [friendshipMessage, setFriendshipMessage] = useState("");

  useEffect(() => {
    const FRIENDSHIP_MESSAGES = [
      "Jokainen askel vie meidät lähemmäs tavoitetta!",
      "Ystävyyden voima on pysäyttämätön!",
      "Yhdessä olemme vahvempia – jatketaan samaan malliin!",
      "Jokainen liike rakentaa yhteistä matkaamme!",
    ];

    const interval = setInterval(() => {
      const randomMessage =
        FRIENDSHIP_MESSAGES[Math.floor(Math.random() * FRIENDSHIP_MESSAGES.length)];
      setFriendshipMessage(randomMessage);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/progress`);
        if (!response.ok) throw new Error("Ei saatu ladattua etenemistä");
        const data = await response.json();

        setProgressData(data);
        setLastUpdated(new Date().toLocaleString());

        const activeUsers = data.userContributions.filter((u) => u.points > 0).length;
        const avgPerUser = activeUsers > 0 ? Math.round(data.totalPoints / activeUsers) : 0;
        const topUser =
          data.userContributions.sort((a, b) => b.points - a.points)[0]?.name || "Ei vielä kukaan";

        setStats({
          weeklyChange: 5,
          activeUsers,
          topContributor: topUser,
          averagePerUser: avgPerUser,
        });
      } catch (error) {
        console.error("Virhe edistymisdatan lataamisessa:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  const nextDestination = progressData.route.find((_, index, arr) =>
    arr.slice(0, index + 1).reduce((sum, r) => sum + r.distance, 0) > progressData.totalPoints
  );

  const remainingDistance = Math.max(0, progressData.totalDistance - progressData.totalPoints);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Virhe ladattaessa tietoja:</p>
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center text-lg font-semibold text-green-700 p-4 bg-green-50 rounded-lg shadow">
        {friendshipMessage}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Kokonaismatka"
          value={`${Math.round(progressData.totalPoints)} km`}
          icon={TrendingUp}
          change={stats.weeklyChange}
          tooltip="Joukkueen kulkema matka yhteensä."
        />
        <StatsCard
          title="Aktiiviset jäsenet"
          value={stats.activeUsers}
          icon={Users}
          tooltip="Tällä viikolla osallistuneiden käyttäjien määrä."
        />
        <StatsCard
          title="Keskimääräinen panos"
          value={`${stats.averagePerUser} km`}
          icon={Activity}
          tooltip="Keskimääräinen matka aktiivista käyttäjää kohden."
        />
        <StatsCard
          title="Eniten panostanut"
          value={stats.topContributor}
          icon={Award}
          tooltip="Jäsen, joka on tehnyt eniten matkaa tällä viikolla."
        />
      </div>
      <Section title="Tutki karttaa" icon={MapPin}>
        <MapView route={progressData.route} totalPoints={progressData.totalPoints} />
      </Section>
    </div>
  );
};

export default HomePage;
