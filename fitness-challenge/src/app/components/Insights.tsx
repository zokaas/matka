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
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-05-31");
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
            <h1 className="text-3xl font-bold text-purple-800">
              Team Activity Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Track team performance and identify patterns in activity data
            </p>
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>
        </div>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Goal Progress
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800">Current Progress</h3>
            <p className="text-2xl font-bold text-purple-600">
              {targetPaces.totalProgress.toFixed(1)} km
            </p>
            <p className="text-sm text-purple-600">of 100,000 km goal</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-medium text-orange-800">
              Required Weekly Pace
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              {targetPaces.weeklyPerUser.toFixed(1)} km
            </p>
            <p className="text-sm text-orange-600">per person per week</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">Days Remaining</h3>
            <p className="text-2xl font-bold text-green-600">
              {targetPaces.daysRemaining}
            </p>
            <p className="text-sm text-green-600">until May 31, 2025</p>
          </div>
        </div>

        <InsightAlert
          title="Pace Analysis"
          description={`To reach the goal, each team member needs to cover ${targetPaces.weeklyPerUser.toFixed(
            1
          )} km weekly. At current pace, projected completion is ${
            targetPaces.projectedEndDate
              ? format(targetPaces.projectedEndDate, "MMM dd, yyyy")
              : "not available"
          }.`}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[
            {
              icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
              label: "Total Distance",
              value: `${achievementStats.totalDistance.toFixed(1)} km`,
              description: "Combined distance covered by all team members",
            },
            {
              icon: <Award className="w-8 h-8 text-green-500" />,
              label: "Longest Streak",
              value: `${achievementStats.longestStreak} days`,
              description: "Consecutive days with recorded activities",
            },
            {
              icon: <Activity className="w-8 h-8 text-orange-500" />,
              label: "Average Duration",
              value: `${(achievementStats.averageDuration / 60).toFixed(
                1
              )} hrs`,
              description: "Average time spent per activity",
            },
            {
              icon: <Users className="w-8 h-8 text-purple-500" />,
              label: "Most Active Day",
              value: mostActiveDay?.[0] || "N/A",
              description: "Day with highest recorded activity",
            },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center gap-4">
                {stat.icon}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Top Sports Done
        </h2>
        <p className="text-gray-600 mb-4">
          Most frequently recorded activities among all users
        </p>
        <ul className="space-y-2">
 {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {topSports.map(([sport, count], index) => (
            <li key={sport} className="flex items-center">
              <span className="mr-2 font-bold text-lg">
              </span>
              <span className="text-gray-800 font-medium">{sport}</span>
              <span className="ml-auto text-gray-500">{count} times</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Progress Timeline
        </h2>
        <p className="text-gray-600 mb-4">
          Progress towards 100,000 km goal (deadline: May 31, 2025)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getTargetLine()}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100000]} />
            <Tooltip
              formatter={(value: number) =>
                value ? `${value.toFixed(1)} km` : "N/A"
              }
              labelFormatter={(label) =>
                format(new Date(label), "MMM dd, yyyy")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="distance"
              name="Current Progress"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Required Pace"
              stroke="#ef4444"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Individual Performance
        </h2>
        <p className="text-gray-600 mb-4">
          Compare individual contributions and achievements
        </p>
        <InsightAlert
          title="Performance Metrics"
          description="Table shows total distance, number of activities, and average duration for each team member. Top performers are marked with medals."
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left">User</th>
                <th className="py-3 text-right">Total Distance</th>
                <th className="py-3 text-right">Activities</th>
                <th className="py-3 text-right">Avg Duration</th>
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
                    {user.distance.toFixed(1)} km
                  </td>
                  <td className="py-3 text-right">{user.activities}</td>
                  <td className="py-3 text-right">
                    {user.avgDuration.toFixed(1)} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
