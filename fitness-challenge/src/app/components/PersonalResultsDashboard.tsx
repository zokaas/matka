import React from "react";
import { Award } from "lucide-react";

interface PerformanceCardProps {
  username: string;
  totalDistance: number;
  weeklyDistance: number;
  percentageAchieved: number;
  rank: number;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  username,
  totalDistance,
  weeklyDistance,
  percentageAchieved,
  rank,
}) => {
  const getPerformanceStyle = () => {
    if (percentageAchieved >= 100) {
      return {
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-400",
        trend: "📈",
      };
    }
    return {
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-400",
      trend: "📉",
    };
  };

  const getMedal = () => {
    const medals = ["🥇", "🥈", "🥉"];
    return rank < 3 ? medals[rank] : null;
  };

  const performanceStyle = getPerformanceStyle();

  return (
    <div
      className={`rounded-xl border p-4 ${performanceStyle.bgColor} ${performanceStyle.borderColor}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getMedal()}</span>
          <h3 className="text-md font-semibold text-gray-800">{username}</h3>
        </div>
        <span className="text-lg">{performanceStyle.trend}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center border-b pb-2 mb-2">
        <div>
          <p className="text-xs text-gray-600">Kokonaismatka</p>
          <p className="text-md font-semibold text-gray-900">
            {totalDistance.toLocaleString()} km
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Viikon matka</p>
          <p className="text-md font-semibold text-gray-900">
            {weeklyDistance.toLocaleString()} km
          </p>
        </div>
      </div>

      <div className="text-center border-t pt-2">
        <p className="text-sm text-gray-600 font-medium">
          Viikkotavoitteen saavutus
        </p>
        <p className={`text-xl font-bold ${performanceStyle.textColor}`}>
          {Math.round(percentageAchieved)}%
        </p>
      </div>

      <div
        className={`mt-2 text-center text-xs font-medium ${performanceStyle.textColor}`}
      >
        {performanceStyle.trend === "📈"
          ? "Tavoite saavutettu"
          : "Tavoitteesta jäljessä"}
      </div>
    </div>
  );
};

interface UserActivity {
  date: string;
  kilometers: number;
}

interface User {
  username: string;
  totalKm: number;
  activities: UserActivity[];
}

interface TargetPaces {
  weeklyPerUser: number;
}

interface PersonalResultsDashboardProps {
  users: User[];
  targetPaces: TargetPaces;
}

const PersonalResultsDashboard: React.FC<PersonalResultsDashboardProps> = ({
  users,
  targetPaces,
}) => {
  const calculateWeeklyPerformance = (user: User) => {
    const weekActivities = user.activities.filter(
      (activity) =>
        (new Date().getTime() - new Date(activity.date).getTime()) /
          (1000 * 60 * 60 * 24) <=
        7
    );

    const weekKilometers = weekActivities.reduce(
      (sum, activity) => sum + activity.kilometers,
      0
    );

    const weeklyPerUser = targetPaces.weeklyPerUser;
    const percentageAchieved = (weekKilometers / weeklyPerUser) * 100;

    return {
      username: user.username,
      totalDistance: Math.round(user.totalKm),
      weeklyDistance: Math.round(weekKilometers),
      percentageAchieved,
    };
  };

  const performanceData = users
    .map(calculateWeeklyPerformance)
    .sort((a, b) => b.percentageAchieved - a.percentageAchieved);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Henkilökohtaiset tulokset
            </h2>
          </div>
          <Award className="w-6 h-6 text-yellow-500" />
        </div>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceData.map((user, index) => (
          <PerformanceCard key={user.username} {...user} rank={index} />
        ))}
      </div>
    </div>
  );
};

export default PersonalResultsDashboard;
