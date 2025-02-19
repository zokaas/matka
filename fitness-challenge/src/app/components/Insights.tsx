import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  Award,
  Activity,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

type Activity = {
  date: string;
  duration: number;
  kilometers: number;
  activity: string;
};

type User = {
  username: string;
  totalKm: number;
  activities: Activity[];
};

type AchievementStats = {
  totalDistance: number;
  totalDuration: number;
  averageDuration: number;
  longestStreak: number;
  totalActivities: number;
};

type TargetPaces = {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  dailyPerUser: number;
  weeklyPerUser: number;
  projectedEndDate: Date | null;
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const InsightAlert = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
    <h4 className="font-medium text-purple-800">{title}</h4>
    <p className="text-sm text-purple-600 mt-1">{description}</p>
 </div>
);

export default function Insights() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [mostActiveDay, setMostActiveDay] = useState<[string, number] | null>(
    null
  );
  const [achievementStats, setAchievementStats] = useState<AchievementStats>({
    totalDistance: 0,
    totalDuration: 0,
    averageDuration: 0,
    longestStreak: 0,
    totalActivities: 0,
  });
  const [targetPaces, setTargetPaces] = useState<TargetPaces>({
    totalProgress: 0,
    remainingDistance: 0,
    daysRemaining: 0,
    dailyPerUser: 0,
    weeklyPerUser: 0,
    projectedEndDate: null,
  });

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const backendUrl = "https://matka-zogy.onrender.com";
      const response = await fetch(`${backendUrl}/users`); // Fixed template literal
      if (!response.ok) throw new Error("Failed to fetch users");

      const data: User[] = await response.json();
      setUsers(data);

      const weekday = getMostActiveWeekday(data);
      setMostActiveDay(weekday);
      calculateAchievements(data);
      setTargetPaces(calculateTargetPaces(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const getWeeklyTrend = () => {
  const lastTwoWeeks = users.flatMap(user => 
    user.activities
      .filter(a => differenceInDays(new Date(), new Date(a.date)) <= 14)
      .map(a => ({ ...a, week: Math.floor(differenceInDays(new Date(), new Date(a.date)) / 7) }))
  );

  const thisWeek = lastTwoWeeks.filter(a => a.week === 0).reduce((sum, a) => sum + a.kilometers, 0);
  const lastWeek = lastTwoWeeks.filter(a => a.week === 1).reduce((sum, a) => sum + a.kilometers, 0);

  if (lastWeek === 0) return 0;
  return ((thisWeek - lastWeek) / lastWeek) * 100;
};

// Päivän suosituin laji
const getTodayTopSport = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayActivities = users.flatMap(user => 
    user.activities.filter(a => format(new Date(a.date), 'yyyy-MM-dd') === today)
  );

  const sportCounts = todayActivities.reduce((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSport = Object.entries(sportCounts)
    .sort(([, a], [, b]) => b - a)[0];

  return topSport ? { name: topSport[0], count: topSport[1] } : null;
};

// Pisin yksittäinen suoritus
const getLongestActivity = () => {
  const recentActivities = users.flatMap(user => 
    user.activities
      .filter(a => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .map(a => ({...a, username: user.username}))
  );

  return recentActivities.reduce((longest, current) => 
    current.kilometers > (longest?.kilometers || 0) ? current : longest
  , null as (Activity & { username: string } | null));
};

// Ahkerin liikkuja viikolta
const getWeeklyTopPerformer = () => {
  const weeklyStats = users.map(user => {
    const weeklyKm = user.activities
      .filter(a => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .reduce((sum, a) => sum + a.kilometers, 0);
    
    return { username: user.username, kilometers: weeklyKm };
  });

  return weeklyStats.sort((a, b) => b.kilometers - a.kilometers)[0];
};

const getAverageWeeklyDistance = () => {
  const firstActivity = users.flatMap(u => u.activities)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  if (!firstActivity) return 0;

  const weeksSinceStart = Math.max(1, Math.ceil(differenceInDays(new Date(), new Date(firstActivity.date)) / 7));
  return targetPaces.totalProgress / weeksSinceStart;
};

const getActiveUsers = () => {
  return users.filter(user => 
    user.activities.some(a => differenceInDays(new Date(), new Date(a.date)) <= 7)
  ).length;
};


  const calculateTargetPaces = (userData: User[]): TargetPaces => {
    const today = new Date();
    const endDate = new Date("2025-05-31");
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentTotal = userData.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = 100000 - currentTotal;

    const activeMemberCount = Math.max(1, userData.length);
    const requiredPerUser = remainingDistance / activeMemberCount;
    const weeksRemaining = Math.ceil(daysRemaining / 7);

    return {
      totalProgress: currentTotal,
      remainingDistance,
      daysRemaining,
      dailyPerUser: requiredPerUser / daysRemaining,
      weeklyPerUser: requiredPerUser / weeksRemaining,
      projectedEndDate:
        currentTotal === 0
          ? null
          : new Date(
              today.getTime() +
                (remainingDistance / (currentTotal / daysRemaining)) *
                  24 *
                  60 *
                  60 *
                  1000
            ),
    };
  };

  const filterDataByTimeframe = <T extends { date: string }>(
    data: T[]
  ): T[] => {
    const now = new Date();
    switch (selectedTimeframe) {
      case "week":
        return data.filter((d) => differenceInDays(now, new Date(d.date)) <= 7);
      case "month":
        return data.filter(
          (d) => differenceInDays(now, new Date(d.date)) <= 30
        );
      default:
        return data;
    }
  };

  const calculateAchievements = (userData: User[]) => {
    const activities = userData.flatMap((user) => user.activities);
    const totalDist = userData.reduce((sum, user) => sum + user.totalKm, 0);
    const totalDuration = activities.reduce(
      (sum, act) => sum + act.duration,
      0
    );

    const sortedDates = activities
      .map((a) => a.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let currentStreak = 1;
    let maxStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(
        parseISO(sortedDates[i]),
        parseISO(sortedDates[i - 1])
      );
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    setAchievementStats({
      totalDistance: totalDist,
      totalDuration,
      averageDuration: activities.length
        ? totalDuration / activities.length
        : 0,
      longestStreak: maxStreak,
      totalActivities: activities.length,
    });
  };

  const getMostActiveWeekday = (userData: User[]): [string, number] => {
    const weekdayCounts = userData
      .flatMap((user) =>
        user.activities.map((activity) => ({
          day: DAYS_OF_WEEK[new Date(activity.date).getDay()],
          kilometers: activity.kilometers,
        }))
      )
      .reduce((acc, { day, kilometers }) => {
        acc[day] = (acc[day] || 0) + kilometers;
        return acc;
      }, {} as Record<string, number>);

    return (
      Object.entries(weekdayCounts).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0]
    );
  };

  const getTargetLine = () => {
    const startDate = new Date();
    startDate.setMonth(0); // January
    startDate.setDate(1); // 1st day

    const endDate = new Date();
    endDate.setMonth(4); // May
    endDate.setDate(31); // 31st day
    const today = new Date();
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dailyTarget = 100000 / totalDays;

    const activityData: Record<string, number> = {};
    let cumulativeDistance = 0;

    users.forEach((user) => {
      user.activities.forEach((activity) => {
        const date = format(new Date(activity.date), "yyyy-MM-dd");
        activityData[date] = (activityData[date] || 0) + activity.kilometers;
      });
    });

    const progressDates: string[] = [];
    const currentDate = new Date(startDate);

    // Get dates until today for actual progress
    while (currentDate <= today && currentDate <= endDate) {
      progressDates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get all dates until end date for target line
    const allDates: string[] = [...progressDates];
    while (currentDate <= endDate) {
      allDates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filterDataByTimeframe(
      allDates.map((date) => {
        const daysSinceStart = Math.ceil(
          (new Date(date).getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (activityData[date] && progressDates.includes(date)) {
          cumulativeDistance += activityData[date];
        }

        return {
          date,
          distance: progressDates.includes(date) ? cumulativeDistance : null,
          target: Math.min(100000, dailyTarget * daysSinceStart),
        };
      })
    );
  };

  const getUserProgress = () => {
    return users
      .map((user) => ({
        name: user.username,
        distance: user.totalKm,
        activities: user.activities.length,
        avgDuration: user.activities.length
          ? user.activities.reduce((acc, curr) => acc + curr.duration, 0) /
            user.activities.length /
            60
          : 0,
      }))
      .sort((a, b) => b.distance - a.distance);
  };

    const getTopSports = () => {
      const sportCounts: { [key: string]: number } = {};

      users.forEach((user) =>
        user.activities.forEach((activity) => {
          sportCounts[activity.activity] =
            (sportCounts[activity.activity] || 0) + 1;
        })
      );

      return Object.entries(sportCounts)
        .sort(([, countA], [, countB]) => countB - countA) // Sort by activity frequency
        .slice(0, 5); // Return top 5 sports
    };

    const topSports = getTopSports();


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

 return (
   <div className="max-w-7xl mx-auto p-6 space-y-8">
     <header className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm">
       <div className="flex justify-between items-center">
         <div>
           <h1 className="text-3xl font-bold text-purple-800">Tiimin matka</h1>
           <p className="mt-2 text-gray-600">
             Seurataan yhdessä etenemistä kohti tavoitetta 🌟
           </p>
         </div>
       </div>
     </header>

     {/* Päämittarit */}
     <div className="grid grid-cols-1 gap-6">
       <div className="bg-white p-6 rounded-xl shadow-sm">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
           <div className="bg-purple-50 p-4 rounded-lg">
             <h3 className="font-medium text-purple-800">Tähän mennessä</h3>
             <p className="text-2xl font-bold text-purple-600">
               {Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")}{" "}
               km
             </p>
             <p className="text-sm text-purple-600">/ 100 000 km</p>
           </div>

           <div className="bg-orange-50 p-4 rounded-lg">
             <h3 className="font-medium text-orange-800">Viikon tavoite</h3>
             <div className="flex items-baseline gap-2">
               <p className="text-2xl font-bold text-orange-600">
                 {targetPaces.weeklyPerUser.toFixed(0)} km
               </p>
               <p className="text-sm text-orange-600">/ hlö</p>
             </div>
             <p className="text-sm text-orange-600">
               {Math.round(
                 targetPaces.weeklyPerUser * users.length
               ).toLocaleString("fi-FI")}{" "}
               km yhteensä
             </p>
           </div>

          <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Aikaa jäljellä</h3>
              <p className="text-2xl font-bold text-green-600">{targetPaces.daysRemaining} päivää jäljellä</p>
            </div>


           {/* Vaihtoehto 1: Päivän suosituin laji */}
           <div className="bg-gray-50 p-6 rounded-xl">
             <div className="flex items-center gap-4">
               <Award className="w-8 h-8 text-green-500" />
               <div>
                 <h3 className="text-sm font-medium text-gray-500">
                   Tämän päivän hitti
                 </h3>
                 {getTodayTopSport() ? (
                   <>
                     <p className="text-2xl font-bold text-gray-800">
                       {getTodayTopSport()?.name}
                     </p>
                     <p className="text-xs text-gray-500 mt-1">
                       {getTodayTopSport()?.count} suoritusta tänään
                     </p>
                   </>
                 ) : (
                   <p className="text-gray-600">Ei vielä suorituksia</p>
                 )}
               </div>
             </div>
           </div>

           {/* Vaihtoehto 2: Viikon pisin yksittäinen suoritus */}
           <div className="bg-gray-50 p-6 rounded-xl">
             <div className="flex items-center gap-4">
               <Award className="w-8 h-8 text-yellow-500" />
               <div>
                 <h3 className="text-sm font-medium text-gray-500">
                   Viikon pisin
                 </h3>
                 {getLongestActivity() ? (
                   <>
                     <p className="text-2xl font-bold text-gray-800">
                       {Math.round(getLongestActivity()?.kilometers || 0)} km
                     </p>
                     <p className="text-xs text-gray-500 mt-1">
                       {getLongestActivity()?.username} -{" "}
                       {getLongestActivity()?.activity}
                     </p>
                   </>
                 ) : (
                   <p className="text-gray-600">Ei suorituksia</p>
                 )}
               </div>
             </div>
           </div>

           {/* Vaihtoehto 3: Viikon ahkerin */}
           <div className="bg-gray-50 p-6 rounded-xl">
             <div className="flex items-center gap-4">
               <Award className="w-8 h-8 text-orange-500" />
               <div>
                 <h3 className="text-sm font-medium text-gray-500">
                   Viikon ahkerin
                 </h3>
                 {getWeeklyTopPerformer()?.kilometers > 0 ? (
                   <>
                     <p className="text-2xl font-bold text-gray-800">
                       {getWeeklyTopPerformer()?.username}
                     </p>
                     <p className="text-xs text-gray-500 mt-1">
                       {Math.round(getWeeklyTopPerformer()?.kilometers || 0)} km
                       tällä viikolla
                     </p>
                   </>
                 ) : (
                   <p className="text-gray-600">Ei vielä suorituksia</p>
                 )}
               </div>
             </div>
           </div>
         </div>


       </div>

       {/* Edistymiskaavio */}
       <div className="bg-white p-6 rounded-xl shadow-sm">
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-semibold text-gray-800">Edistyminen</h2>
           <InsightAlert
             title="Eteneminen"
             description={`Tavoitteeseen tarvitaan ${Math.round(
               targetPaces.weeklyPerUser
             )} km viikossa per henkilö. Nykyisellä tahdilla saavutamme tavoitteen ${
               targetPaces.projectedEndDate
                 ? format(targetPaces.projectedEndDate, "d.M.yyyy")
                 : "ei tiedossa"
             }.`}
           />
         </div>
         <ResponsiveContainer width="100%" height={300}>
           <LineChart data={getTargetLine()}>
             <XAxis
               dataKey="date"
               tickFormatter={(date) => format(new Date(date), "d.M.")}
             />
             <YAxis domain={[0, 100000]} />
             <Tooltip
               formatter={(value: number) =>
                 value ? `${Math.round(value).toLocaleString("fi-FI")} km` : "-"
               }
               labelFormatter={(label) => format(new Date(label), "d.M.yyyy")}
             />
             <Legend />
             <Line
               type="monotone"
               dataKey="distance"
               name="Nykyinen"
               stroke="#6366f1"
               strokeWidth={2}
               dot={false}
             />
             <Line
               type="monotone"
               dataKey="target"
               name="Tavoite"
               stroke="#ef4444"
               strokeDasharray="5 5"
               dot={false}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>

       {/* Lajikohtaiset tiedot */}
       <div className="bg-white p-6 rounded-xl shadow-sm">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">
           Lajit ja henkilöt
         </h2>
         <div className="grid lg:grid-cols-2 gap-6">
           <div>
             <h3 className="text-lg font-medium mb-4">Suosituimmat lajit</h3>
             <ul className="space-y-2">
               {topSports.map(([sport, count], index) => (
                 <li
                   key={sport}
                   className="flex items-center p-2 bg-gray-50 rounded"
                 >
                   <span className="w-8 text-center font-bold text-purple-600">
                     {index + 1}.
                   </span>
                   <span className="text-gray-800 font-medium">{sport}</span>
                   <span className="ml-auto text-gray-500">{count} kertaa</span>
                 </li>
               ))}
             </ul>
           </div>

           <div>
             <h3 className="text-lg font-medium mb-4">
               Henkilökohtaiset tulokset
             </h3>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-gray-200">
                     <th className="py-3 text-left">Nimi</th>
                     <th className="py-3 text-right">Matka</th>
                     <th className="py-3 text-right">Aktiviteetit</th>
                   </tr>
                 </thead>
                 <tbody>
                   {getUserProgress().map((user, index) => (
                     <tr
                       key={user.name}
                       className="border-b border-gray-100 hover:bg-gray-50"
                     >
                       <td className="py-3">
                         <div className="flex items-center gap-2">
                           {index < 3 && ["🥇", "🥈", "🥉"][index]}
                           {user.name}
                         </div>
                       </td>
                       <td className="py-3 text-right font-medium">
                         {Math.round(user.distance).toLocaleString("fi-FI")} km
                       </td>
                       <td className="py-3 text-right">{user.activities}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}