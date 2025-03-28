"use client";

import { useState, useMemo, useEffect } from "react";
import _ from "lodash";

// Define the Activity interface based on your existing model
interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string;
}

// Define the props interface for the component
interface PersonalInsightProps {
  activities: Activity[];
  username: string;
}

// Define the structure for our insights data
interface InsightsData {
  totalActivities: number;
  totalDuration: number;
  totalKilometers: number;
  averageDuration: number;
  mostFrequentActivity: string;
  trendData: Array<{
    date: string;
    kilometers: number;
    duration: number;
  }>;
  activityBreakdown: Array<{
    activity: string;
    count: number;
    percentage: number;
  }>;
  weekdayBreakdown: Array<{
    name: string;
    activities: number;
  }>;
  streakData: {
    currentStreak: number;
    longestStreak: number;
  };
  avgWeeklyKm: number;
}

// Translation object for Finnish
const translations = {
  personalInsights: "Omat tilastot",
  overview: "Yleiskatsaus",
  activity: "Suoritukset",
  totalActivities: "Suoritukset",
  totalHours: "Tunnit",
  totalKm: "Kilometrit",
  weeklyKm: "Viikko ka",
  currentStreak: "Nykyinen putki",
  longestStreak: "Pisin putki",
  days: "päivää",
  mostFrequentActivity: "Suosituin laji",
  recentActivityTrend: "Viimeaikaiset lajit",
  kilometers: "Kilometrit",
  duration: "Kesto (min)",
  activityByDayOfWeek: "Aktiviteetit viikonpäivittäin",
  activities: "Aktiviteetit",
  activityBreakdown: "Aktiviteettijakauma",
  times: "kertaa",
  personalStatistics: "Henkilökohtaiset tilastot",
  avgDuration: "Keskim. kesto",
  avgDistance: "Keskim. matka",
  mins: "min",
  km: "km",
  addActivitiesToSee: "Lisää aktiviteetteja nähdäksesi tilastot.",
  loading: "Ladataan tilastoja...",
};

const PersonalInsights: React.FC<PersonalInsightProps> = ({
  activities,
  username,
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity"
  >("overview");
  
  // State for all activities (in case we need to fetch them separately)
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch all activities for accurate statistics
  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setLoading(true);
        const backendUrl = "https://matka-zogy.onrender.com";
        const response = await fetch(
          `${backendUrl}/users/${username}/activities/all`
        );
        
        if (response.ok) {
          const data = await response.json();
          setAllActivities(data);
        } else {
          // If API request fails, use the provided activities
          setAllActivities(activities);
        }
      } catch (error) {
        console.error("Error fetching all activities:", error);
        // Fallback to the activities passed via props
        setAllActivities(activities);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllActivities();
  }, [username, activities]);

// Process activity data for insights using ALL activities
const insights = useMemo<InsightsData>(() => {
  const activitiesToUse = allActivities.length > 0 ? allActivities : activities;
  
  if (!activitiesToUse || activitiesToUse.length === 0) {
    return {
      totalActivities: 0,
      totalDuration: 0,
      totalKilometers: 0,
      averageDuration: 0,
      mostFrequentActivity: "",
      trendData: [],
      activityBreakdown: [],
      weekdayBreakdown: [],
      streakData: { currentStreak: 0, longestStreak: 0 },
      avgWeeklyKm: 0,
    };
  }

  // Sort activities by date
  const sortedActivities = _.sortBy(activitiesToUse, (a) => new Date(a.date));

  // Total stats
  const totalActivities = activitiesToUse.length;
  const totalDuration = _.sumBy(activitiesToUse, "duration");
  const totalKilometers = _.sumBy(activitiesToUse, "kilometers");
  const averageDuration = totalDuration / totalActivities;

  // Most frequent activity
  const activityCounts = _.countBy(activitiesToUse, "activity");
  const mostFrequentActivity = Object.entries(activityCounts).reduce(
    (max, [activity, count]) => (count > max[1] ? [activity, count] : max),
    ["", 0]
  )[0];

  // Trend data (last 30 activities)
  const last30Activities = sortedActivities.slice(-30);
  const trendData = last30Activities.map((activity) => ({
    date: new Date(activity.date).toLocaleDateString("fi-FI"),
    kilometers: activity.kilometers,
    duration: activity.duration,
  }));

  // Activity breakdown
  const activityBreakdown = Object.entries(activityCounts)
    .map(([activity, count]) => ({
      activity,
      count,
      percentage: Math.round((count / totalActivities) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 activities

  // Weekday breakdown
  const weekdayData = _.groupBy(activitiesToUse, (a) => new Date(a.date).getDay());
  const weekdays = [
    "Sunnuntai",
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
  ];

  const weekdayBreakdown = weekdays.map((day, index) => ({
    name: day,
    activities: weekdayData[index] ? weekdayData[index].length : 0,
  }));

  // Calculate average weekly kilometers
  const firstDate = new Date(sortedActivities[0].date);
  const lastDate = new Date(sortedActivities[sortedActivities.length - 1].date);
  
  // Calculate the number of weeks between first and last activity
  const weeksDiff = Math.max(
    1,
    Math.ceil((lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
  );
  
  // Calculate average weekly kilometers
  const avgWeeklyKm = totalKilometers / weeksDiff;

  // ============ REPLACED STREAK CALCULATION CODE STARTS HERE ============
  
  // First, group activities by date to handle multiple activities on the same day
  const activityDates = sortedActivities
    .map(activity => new Date(activity.date).toISOString().split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
    .sort(); // Ensure dates are sorted ascending (oldest first)

  // Now calculate streaks properly
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Loop through the unique dates
  for (let i = 0; i < activityDates.length; i++) {
    const currentDate = new Date(activityDates[i]);
    
    if (i === 0) {
      // First activity starts a streak
      tempStreak = 1;
    } else {
      const prevDate = new Date(activityDates[i-1]);
      const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day, continue streak
        tempStreak++;
      } else {
        // Gap detected, reset streak
        tempStreak = 1;
      }
    }
    
    // Update longest streak if current one is longer
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Calculate current streak (check if the most recent activity was today or yesterday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Only calculate current streak if there are any activity dates
  if (activityDates.length > 0) {
    // Need to get the most recent activity date
    const mostRecentActivityDate = new Date(activityDates[activityDates.length - 1]);
    mostRecentActivityDate.setHours(0, 0, 0, 0);

    // Check if the most recent activity was today or yesterday
    if (mostRecentActivityDate.getTime() === today.getTime() || 
        mostRecentActivityDate.getTime() === yesterday.getTime()) {
      // If so, count back from the most recent date to find the current streak
      currentStreak = 1;
      for (let i = activityDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(activityDates[i]);
        const nextDate = new Date(activityDates[i + 1]);
        const dayDiff = Math.round((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break; // Streak is broken
        }
      }
    } else {
      // Most recent activity is older than yesterday, so no current streak
      currentStreak = 0;
    }
  }

  const streakData = { currentStreak, longestStreak };
  
  // ============ REPLACED STREAK CALCULATION CODE ENDS HERE ============

  return {
    totalActivities,
    totalDuration,
    totalKilometers,
    averageDuration,
    mostFrequentActivity,
    trendData,
    activityBreakdown,
    weekdayBreakdown,
    streakData,
    avgWeeklyKm,
  };
}, [allActivities, activities]);

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          {translations.personalInsights}
        </h2>
        <p className="text-gray-600">{translations.addActivitiesToSee}</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          {translations.personalInsights}
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {translations.personalInsights}
      </h2>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "overview"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          {translations.overview}
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "activity"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          {translations.activity}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-purple-800 font-medium">
                {translations.totalActivities}
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.totalActivities)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-blue-800 font-medium">
                {translations.totalHours}
              </h3>
              <p className="text-2xl font-bold">
                {(insights.totalDuration / 60).toFixed(1)} h
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-green-800 font-medium">
                {translations.totalKm}
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.totalKilometers)} km
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm text-indigo-800 font-medium">
                {translations.weeklyKm}
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.avgWeeklyKm)} {translations.km}
              </p>
            </div>
          </div>

          {/* Streak Info */}
          <div className="flex space-x-4">
            <div className="flex-1 bg-amber-50 p-4 rounded-lg">
              <h3 className="text-sm text-amber-800 font-medium">
                {translations.currentStreak}
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.streakData.currentStreak)}{" "}
                {translations.days}
              </p>
            </div>
            <div className="flex-1 bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm text-orange-800 font-medium">
                {translations.longestStreak}
              </h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.streakData.longestStreak)}{" "}
                {translations.days}
              </p>
            </div>
          </div>

          {/* Favorite Activity */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm text-purple-800 font-medium">
              {translations.mostFrequentActivity}
            </h3>
            <p className="text-xl font-bold">{insights.mostFrequentActivity}</p>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {translations.personalStatistics}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="text-sm text-gray-500">
                  {translations.avgDuration}
                </h4>
                <p className="text-xl font-medium">
                  {Math.round(insights.averageDuration)} {translations.mins}{" "}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="text-sm text-gray-500">
                  {translations.avgDistance}
                </h4>
                <p className="text-xl font-medium">
                  {Math.round(
                    insights.totalKilometers / insights.totalActivities
                  )}{" "}
                  {translations.km}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">
              {translations.activityBreakdown}
            </h3>
            <div className="space-y-3">
              {insights.activityBreakdown.map((item) => (
                <div key={item.activity} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.activity}</span>
                    <span>
                      {item.count} {translations.times} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInsights;