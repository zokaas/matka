import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Award,
  Activity,
  Loader2,
  AlertCircle,
  InfoIcon,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import PersonalResultsDashboard from "./PersonalResultsDashboard";

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

const InsightAlert = ({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
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
  const [achievementStats, setAchievementStats] = useState<AchievementStats>({
    totalDistance: 0,
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

const calculateTargetPaces = (userData: User[]): TargetPaces => {
  const today = new Date();
  const startDate = new Date("2025-01-06"); // Projektin aloituspäivä
  const endDate = new Date("2025-05-31"); // Projektin loppupäivä

  // Päivät jäljellä loppuun
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Kokonaismatka tähän mennessä
  const currentTotal = userData.reduce((sum, user) => sum + user.totalKm, 0);
  const remainingDistance = 100000 - currentTotal;

  // Tiimin koko
  const activeMemberCount = Math.max(1, userData.length);

  // Paljonko per henkilö pitää tehdä
  const requiredPerUser = remainingDistance / activeMemberCount;
  const weeksRemaining = Math.ceil(daysRemaining / 7);

  // Lasketaan projektoitu loppupäivä nykyisellä tahdilla
  const daysFromStart = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentDailyRate = currentTotal / Math.max(1, daysFromStart); // km/päivä tähän mennessä

  const daysNeededAtCurrentPace = remainingDistance / currentDailyRate;
  const projectedEndDate = new Date(
    today.getTime() + daysNeededAtCurrentPace * 24 * 60 * 60 * 1000
  );

  return {
    totalProgress: currentTotal,
    remainingDistance,
    daysRemaining,
    dailyPerUser: requiredPerUser / daysRemaining,
    weeklyPerUser: requiredPerUser / weeksRemaining,
    projectedEndDate: currentTotal === 0 ? null : projectedEndDate,
  };
};

const getTargetLine = () => {
  const startDate = new Date("2025-01-06");
  const endDate = new Date("2025-05-31");
  const today = new Date();

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyTarget = 100000 / totalDays; // Paljonko pitäisi kertyä per päivä

  const activityData: Record<string, number> = {};
  let cumulativeDistance = 0;

  // Kerätään toteutuneet kilometrit
  users.forEach((user) => {
    user.activities.forEach((activity) => {
      const date = format(new Date(activity.date), "yyyy-MM-dd");
      activityData[date] = (activityData[date] || 0) + activity.kilometers;
    });
  });

  // Kerätään päivät tähän asti
  const progressDates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= today && currentDate <= endDate) {
    progressDates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Kerätään kaikki päivät loppuun asti
  const allDates: string[] = [...progressDates];
  while (currentDate <= endDate) {
    allDates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Rakennetaan data
  return filterDataByTimeframe(
    allDates.map((date) => {
      const daysSinceStart = Math.ceil(
        (new Date(date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
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


// Päivän suosituin laji
const getWeekTopSports = () => {
  // Hae kuluvan viikon maanantai
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1); // 1 = maanantai
  monday.setHours(0, 0, 0, 0);

  // Hae viikon aktiviteetit (ma-su)
  const weekActivities = users.flatMap(user => 
    user.activities.filter(a => {
      const activityDate = new Date(a.date);
      return activityDate >= monday && activityDate <= today;
    })
  );

  // Muu logiikka pysyy samana...
  const sportCounts = weekActivities.reduce((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(sportCounts).length === 0) return null;

  const maxCount = Math.max(...Object.values(sportCounts));
  const topSports = Object.entries(sportCounts)
    .filter(([, count]) => count === maxCount)
    .map(([sport, count]) => ({
      name: sport,
      count: count
    }));

  return {
    count: maxCount,
    sports: topSports
  };
};

const getLongestActivities = () => {
  const recentActivities = users.flatMap(user => 
    user.activities
      .filter(a => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .map(a => ({ ...a, username: user.username }))
  );

  const maxKilometers = Math.max(...recentActivities.map(a => a.kilometers), 0);

  return recentActivities.filter(a => a.kilometers === maxKilometers);
};


// Ahkerin liikkuja viikolta
const getWeeklyTopPerformers = () => {
  // Calculate weekly kilometers for each user
  const weeklyStats = users.map((user) => {
    const weeklyKm = user.activities
      .filter((a) => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .reduce((sum, a) => sum + a.kilometers, 0);

    return { username: user.username, kilometers: weeklyKm };
  });

  // If no stats, return null
  if (weeklyStats.length === 0) return null;

  // Find the highest distance
  const maxKm = Math.max(...weeklyStats.map((stat) => stat.kilometers));

  // Get all users with this distance
  const topPerformers = weeklyStats
    .filter((stat) => stat.kilometers === maxKm)
    .sort((a, b) => a.username.localeCompare(b.username)); // Sort by name for consistent order

  return {
    kilometers: maxKm,
    users: topPerformers,
  };
};

const getLastFourWeeks = () => {
  // Haetaan kuluvan viikon maanantai
  const today = new Date();
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - today.getDay() + 1); // 1 = maanantai
  currentMonday.setHours(0, 0, 0, 0);

  // Luodaan lista neljästä viimeksi maanantaista
  const weekStarts = [0, -1, -2, -3].map(weekOffset => {
    const monday = new Date(currentMonday);
    monday.setDate(monday.getDate() + (weekOffset * 7));
    return monday;
  });

  // Haetaan aktiviteetit ja merkitään niille viikot
  const recentActivities = users.flatMap(user =>
    user.activities
      .map(activity => {
        const activityDate = new Date(activity.date);
        // Etsi mihin viikkoon aktiviteetti kuuluu
        const weekIndex = weekStarts.findIndex(monday => 
          activityDate >= monday && 
          activityDate < new Date(monday.getTime() + (7 * 24 * 60 * 60 * 1000))
        );
        return {
          ...activity,
          week: weekIndex
        };
      })
      .filter(activity => activity.week !== -1) // Poista aktiviteetit jotka eivät osu 4 viikon aikaikkunaan
  );

  // Laske viikkojen tiedot
  const weeks = weekStarts.map((startDate, weekIndex) => {
    const weekActivities = recentActivities.filter(a => a.week === weekIndex);
    const endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    const sportStats = weekActivities.reduce((acc, activity) => {
      if (!acc[activity.activity]) {
        acc[activity.activity] = { km: 0, count: 0 };
      }
      acc[activity.activity].km += activity.kilometers;
      acc[activity.activity].count += 1;
      return acc;
    }, {} as Record<string, { km: number; count: number }>);

    return {
      week: weekIndex,
      startDate,
      endDate,
      kilometers: Math.round(weekActivities.reduce((sum, a) => sum + a.kilometers, 0)),
      activeDays: new Set(weekActivities.map(a => a.date)).size,
      sports: Object.entries(sportStats)
        .map(([sport, stats]) => ({
          name: sport,
          kilometers: Math.round(stats.km),
          count: stats.count
        }))
        .sort((a, b) => b.kilometers - a.kilometers)
    };
  });

  const allSports = new Set(weeks.flatMap(w => w.sports.map(s => s.name)));
  
  return {
    weeks, // Viikot ovat jo uusimmasta vanhimpaan
    allSports: Array.from(allSports),
    comparisons: weeks.slice(1).map((week, i) => ({
      weekChange: weeks[i].kilometers === 0 ? 0 : 
        Math.round(((week.kilometers - weeks[i].kilometers) / weeks[i].kilometers) * 100),
      activeDaysChange: week.activeDays - weeks[i].activeDays
    }))
  };
};

  const calculateAchievements = (userData: User[]) => {
    const activities = userData.flatMap((user) => user.activities);
    const totalDist = userData.reduce((sum, user) => sum + user.totalKm, 0);


    setAchievementStats({
      totalDistance: totalDist,
      totalActivities: activities.length,
    });
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
             <p className="text-2xl font-bold text-green-600">
               {targetPaces.daysRemaining} päivää{" "}
             </p>
           </div>

           {/* Vaihtoehto 1: VIIKON suosituin laji */}
           <div className="bg-gray-50 p-6 rounded-xl">
             <div className="flex items-center gap-4">
               <Award className="w-8 h-8 text-green-500" />
               <div>
                 <h3 className="text-sm font-medium text-gray-500">
                   Viikon suosituimmat
                 </h3>
                 {getWeekTopSports() ? (
                   <>
                     <div className="text-2xl font-bold text-gray-800">
                       {getWeekTopSports()
                         ?.sports.map((sport) => sport.name)
                         .join(" / ")}
                     </div>
                     <p className="text-xs text-gray-500 mt-1">
                       {getWeekTopSports()?.count} suoritusta tällä viikolla
                     </p>
                   </>
                 ) : (
                   <p className="text-gray-600">Ei vielä suorituksia</p>
                 )}
               </div>
             </div>
           </div>

{/* Vaihtoehto 2: Viikon pisimmät yksittäiset suoritukset */}
<div className="bg-gray-50 p-6 rounded-xl">
  <div className="flex items-center gap-4">
    <Award className="w-8 h-8 text-yellow-500" />
    <div>
      <h3 className="text-sm font-medium text-gray-500">Viikon pisimmät</h3>
      {getLongestActivities().length > 0 ? (
        <>
          <p className="text-2xl font-bold text-gray-800">
            {Math.round(getLongestActivities()[0].kilometers)} km
          </p>
          <ul className="text-xs text-gray-500 mt-1">
            {getLongestActivities().map((activity, index) => (
              <li key={index}>
                {activity.username} - {activity.activity}
              </li>
            ))}
          </ul>
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
                   Viikon ahkerimmat
                 </h3>
                 {(() => {
                   const topPerformers = getWeeklyTopPerformers();

                   if (!topPerformers || topPerformers.kilometers === 0) {
                     return (
                       <p className="text-gray-600">Ei vielä suorituksia</p>
                     );
                   }

                   return (
                     <>
                       <p className="text-2xl font-bold text-gray-800">
                         {topPerformers.users
                           .map((user) => user.username)
                           .join(" / ")}
                       </p>
                       <p className="text-xs text-gray-500 mt-1">
                         {Math.round(topPerformers.kilometers)} km tällä
                         viikolla
                       </p>
                     </>
                   );
                 })()}
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="space-y-4">


         {/* Päätaulukko */}
         <div className="bg-white p-6 rounded-xl shadow-sm">
           <h3 className="text-xl font-semibold text-gray-800 mb-6">
             Viikkoaktiivisuus
           </h3>
         {/* Info-laatikko */}
         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
           <div className="flex items-start gap-3">
             <div className="text-blue-500 mt-1">
               <InfoIcon className="w-5 h-5" />
             </div>
             <div>
               <div className="space-y-2 text-sm text-blue-800">
                 <p>Viikot laskettu maanantaista sunnuntaihin</p>
               </div>
             </div>
           </div>
         </div>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr>
                   <th className="text-left p-3 border-b">Laji</th>
                   {getLastFourWeeks().weeks.map((week, i) => (
                     <th
                       key={i}
                       className="p-3 text-right border-b min-w-[140px]"
                     >
                       <div className="font-semibold">
                         {i === 0
                           ? "Tämä viikko"
                           : i === 1
                           ? "Viime viikko"
                           : format(week.startDate, "d.M.") +
                             "–" +
                             format(week.endDate, "d.M.")}
                       </div>
                     </th>
                   ))}
                 </tr>
               </thead>

               <tbody>
                 {/* Yhteenveto */}
                 <tr className="font-medium bg-gray-50">
                   <td className="p-3 border-b">Yhteensä</td>
                   {getLastFourWeeks().weeks.map((week, i) => (
                     <td key={i} className="p-3 text-right border-b">
                       <div className="text-lg font-bold">
                         {week.kilometers.toLocaleString("fi-FI")} km
                       </div>
                     </td>
                   ))}
                 </tr>

                 {/* Lajikohtaiset rivit */}
                 {getLastFourWeeks().allSports.map((sport) => (
                   <tr key={sport} className="hover:bg-gray-50">
                     <td className="p-3 border-b">{sport}</td>
                     {getLastFourWeeks().weeks.map((week, i) => {
                       const sportData = week.sports.find(
                         (s) => s.name === sport
                       );
                       return (
                         <td key={i} className="p-3 text-right border-b">
                           {sportData ? (
                             <div>
                               <div className="font-medium">
                                 {sportData.kilometers.toLocaleString("fi-FI")}{" "}
                                 km
                               </div>
                               <div className="text-sm text-gray-500">
                                 {sportData.count}{" "}
                                 {sportData.count === 1 ? "kerta" : "kertaa"}
                               </div>
                             </div>
                           ) : (
                             <span className="text-gray-300">—</span>
                           )}
                         </td>
                       );
                     })}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>

       {/* Edistymiskaavio */}
       <div className="bg-white p-6 rounded-xl shadow-sm">
         <div className="flex items-center justify-between mb-4">
<InsightAlert
  title="Eteneminen"
  description={
    <>
      Tavoitevauhti: <strong>{Math.round(targetPaces.weeklyPerUser)} km/vko</strong> per hlö.
      <br />
      Nykyisellä tahdilla saavutamme tavoitteen{" "}
      <strong>
        {targetPaces.projectedEndDate
          ? format(targetPaces.projectedEndDate, "d.M.yyyy")
          : "ei tiedossa"}
      </strong>
      .
    </>
  }
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

           <PersonalResultsDashboard users={users} targetPaces={targetPaces} />
       </div>
     </div>
   </div>
 );
}