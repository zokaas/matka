"use client";

import { useState, useMemo, useEffect } from "react";
import _ from "lodash";
import { useTheme } from "@/app/hooks/useTheme";
import { TrendingUp, Calendar, Target, Clock, Activity, Award, BarChart3, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { challengeParams } from "@/app/constants/challengeParams";
import ClearWeeklyProgress from "./UserWeeklyProgress";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string;
}

interface PersonalInsightProps {
  activities: Activity[];
  username: string;
  user?: any;
}

const PersonalInsights: React.FC<PersonalInsightProps> = ({
  activities,
  username,
  user,
}) => {
  const { t } = useTheme();
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'breakdown'>('overview');
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
        const response = await fetch(`${backendUrl}/users/${username}/activities/all`);
        if (response.ok) {
          const data = await response.json();
          setAllActivities(data);
        } else {
          setAllActivities(activities);
        }
      } catch (error) {
        console.error("Error fetching all activities:", error);
        setAllActivities(activities);
      } finally {
        setLoading(false);
      }
    };
    fetchAllActivities();
  }, [username, activities]);

  const personalWeeklyTarget = useMemo(() => {
    const totalUsers = 10;
    const individualTarget = challengeParams.totalDistance / totalUsers;
    const challengeStart = new Date(challengeParams.startDate);
    const challengeEnd = new Date(challengeParams.endDate);
    const totalWeeks = Math.ceil((challengeEnd.getTime() - challengeStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return individualTarget / totalWeeks;
  }, []);

  const analytics = useMemo(() => {
    const activitiesToUse = allActivities.length > 0 ? allActivities : activities;
    if (!activitiesToUse || activitiesToUse.length === 0) {
      return null;
    }

    const today = new Date();
    
    // Get current week (Monday to Sunday)
    const getCurrentWeekStart = (date: Date) => {
      const d = new Date(date);
      const dayOfWeek = d.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      d.setDate(d.getDate() - daysToMonday);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const startOfWeek = getCurrentWeekStart(today);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate time periods
    const thisWeekActivities = activitiesToUse.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek;
    });

    const thisMonthActivities = activitiesToUse.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfMonth;
    });

    // Last 7 days activities
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    const last7DaysActivities = activitiesToUse.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= last7Days;
    });

    // Activity breakdown
    const activityCounts = _.countBy(activitiesToUse, "activity");
    const activityBreakdown = Object.entries(activityCounts)
      .map(([activity, count]) => ({
        activity,
        count,
        percentage: Math.round((count / activitiesToUse.length) * 100),
        totalKm: activitiesToUse.filter(a => a.activity === activity).reduce((sum, a) => sum + a.kilometers, 0)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Current streak calculation
    const sortedDates = activitiesToUse
      .map(a => new Date(a.date).toDateString())
      .filter((date, i, arr) => arr.indexOf(date) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    if (sortedDates.length > 0) {
      const lastActivityDate = new Date(sortedDates[0]);
      const daysSinceLastActivity = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastActivity <= 1) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const prevDate = new Date(sortedDates[i - 1]);
          const diffDays = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Daily totals for records
    const dailyTotals: Record<string, number> = {};
    activitiesToUse.forEach(activity => {
      const dateKey = activity.date.split('T')[0];
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + activity.kilometers;
    });

    // CORRECTED: Weekly breakdown calculation with proper Monday-Sunday weeks
    const getMondayOfWeek = (date: Date): Date => {
      const d = new Date(date);
      const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // Calculate days to subtract to get to Monday
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      d.setDate(d.getDate() - daysToMonday);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const weeklyData: Record<string, { km: number; activities: number; dates: string[]; monday: Date }> = {};

    activitiesToUse.forEach(activity => {
      const activityDate = new Date(activity.date);
      const monday = getMondayOfWeek(activityDate);
      const weekKey = monday.toISOString().split('T')[0];

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { 
          km: 0, 
          activities: 0, 
          dates: [],
          monday: monday
        };
      }

      weeklyData[weekKey].km += activity.kilometers;
      weeklyData[weekKey].activities += 1;

      const dateKey = activity.date.split('T')[0];
      if (!weeklyData[weekKey].dates.includes(dateKey)) {
        weeklyData[weekKey].dates.push(dateKey);
      }
    });

    const weeklyBreakdown = Object.entries(weeklyData)
      .map(([weekKey, data]) => {
        const weekStart = data.monday; // Monday
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday
        weekEnd.setHours(23, 59, 59, 999);

        // Calculate week number (ISO week number)
        const year = weekStart.getFullYear();
        const jan1 = new Date(year, 0, 1);
        const jan1Day = jan1.getDay() || 7; // Make Sunday = 7
        const firstMonday = new Date(year, 0, 1 + (8 - jan1Day) % 7);
        
        const weekNumber = Math.floor((weekStart.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

        // Check if this is the current week
        const currentWeekMonday = getMondayOfWeek(today);
        const isCurrentWeek = weekStart.getTime() === currentWeekMonday.getTime();
        
        const achievementRate = data.km / personalWeeklyTarget;

        return {
          weekStart,
          weekEnd,
          weekNumber: weekNumber > 0 ? weekNumber : 1, // Ensure positive week number
          km: data.km,
          activities: data.activities,
          activeDays: data.dates.length,
          isCurrentWeek,
          achievementRate,
          target: personalWeeklyTarget
        };
      })
      .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
      .slice(0, 8); // Last 8 weeks

    // Records
    const longestWorkout = activitiesToUse.reduce((longest, activity) => {
      return activity.duration > (longest?.duration || 0) ? activity : longest;
    }, null as typeof activitiesToUse[0] | null);

    const bestDay = Object.entries(dailyTotals).reduce((best, [date, km]) => {
      return km > (best?.km || 0) ? { date, km } : best;
    }, null as { date: string; km: number } | null);

    return {
      // Totals
      totalKm: _.sumBy(activitiesToUse, "kilometers"),
      totalActivities: activitiesToUse.length,
      totalHours: _.sumBy(activitiesToUse, "duration") / 60,

      // Time periods
      thisWeekKm: _.sumBy(thisWeekActivities, "kilometers"),
      thisWeekActivities: thisWeekActivities.length,
      thisMonthKm: _.sumBy(thisMonthActivities, "kilometers"),
      thisMonthActivities: thisMonthActivities.length,
      last7DaysKm: _.sumBy(last7DaysActivities, "kilometers"),

      // Averages
      avgPerActivity: activitiesToUse.length > 0 ? _.sumBy(activitiesToUse, "kilometers") / activitiesToUse.length : 0,
      avgDuration: activitiesToUse.length > 0 ? _.sumBy(activitiesToUse, "duration") / activitiesToUse.length : 0,
      dailyAverage: activitiesToUse.length > 0 ? _.sumBy(activitiesToUse, "kilometers") / Math.max(1, Object.keys(dailyTotals).length) : 0,

      // Current status
      currentStreak,
      activeDays: Object.keys(dailyTotals).length,

      // Breakdown
      activityBreakdown,
      weeklyBreakdown,

      // Records
      longestWorkout,
      bestDay,
    };
  }, [allActivities, activities, personalWeeklyTarget]);

  if (!activities || activities.length === 0) {
    return (
      <div className="space-y-6">
        {user && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tavoitteet</h2>
            <ClearWeeklyProgress user={user} totalUsers={10} />
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tilastot</h2>
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600">Lisää suorituksia nähdäksesi tilastoja</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        {user && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tavoitteet</h2>
            <ClearWeeklyProgress user={user} totalUsers={10} />
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded-xl"></div>
              <div className="h-20 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Yleiskatsaus', icon: BarChart3 },
    { key: 'weekly', label: 'Viikot', icon: Calendar },
    { key: 'breakdown', label: 'Lajit', icon: Activity },
  ] as const;

  return (
    <div className="space-y-6">
      {user && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tavoitteet</h2>
          <ClearWeeklyProgress user={user} totalUsers={10} />
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tilastot</h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium ${activeTab === key
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{analytics.totalKm.toFixed(1)}</div>
                  <div className="text-sm text-blue-700">Kilometrit</div>
                </div>
                <div className="text-center bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{analytics.totalActivities}</div>
                  <div className="text-sm text-green-700">Suoritukset</div>
                </div>
                <div className="text-center bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{analytics.totalHours.toFixed(1)}</div>
                  <div className="text-sm text-purple-700">Tuntia</div>
                </div>
                <div className="text-center bg-orange-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{analytics.currentStreak}</div>
                  <div className="text-sm text-orange-700">Nykyinen putki</div>
                </div>
              </div>

              {/* Time Period Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Tämä viikko</h4>
                  <div className="text-lg font-bold text-gray-900">{analytics.thisWeekKm.toFixed(1)} km</div>
                  <div className="text-sm text-gray-600">{analytics.thisWeekActivities} suoritusta</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Tämä kuukausi</h4>
                  <div className="text-lg font-bold text-gray-900">{analytics.thisMonthKm.toFixed(1)} km</div>
                  <div className="text-sm text-gray-600">{analytics.thisMonthActivities} suoritusta</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Viimeiset 7 päivää</h4>
                  <div className="text-lg font-bold text-gray-900">{analytics.last7DaysKm.toFixed(1)} km</div>
                  <div className="text-sm text-gray-600">Keskiarvo: {(analytics.last7DaysKm / 7).toFixed(1)} km/pv</div>
                </div>
              </div>

              {/* Personal Records */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Henkilökohtaiset ennätykset</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Paras päivä</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-900">
                      {analytics.bestDay ? `${analytics.bestDay.km.toFixed(1)} km` : 'Ei dataa'}
                    </div>
                    {analytics.bestDay && (
                      <div className="text-sm text-yellow-700">
                        {format(new Date(analytics.bestDay.date), 'd.M.yyyy')}
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Pisin treeni</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {analytics.longestWorkout ? `${analytics.longestWorkout.duration} min` : 'Ei dataa'}
                    </div>
                    {analytics.longestWorkout && (
                      <div className="text-sm text-blue-700">{analytics.longestWorkout.activity}</div>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Aktiivisia päiviä</span>
                    </div>
                    <div className="text-lg font-bold text-green-900">{analytics.activeDays}</div>
                    <div className="text-sm text-green-700">
                      Keskiarvo: {analytics.dailyAverage.toFixed(1)} km/aktiivipäivä
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="space-y-6">
              {/* Weekly Breakdown List */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Viikkotilastot (maanantai-sunnuntai)</h3>
                <div className="space-y-3">
                  {analytics.weeklyBreakdown.slice(0, showAllWeeks ? undefined : 3).map((week, index) => {
                    const TrendIcon = week.achievementRate >= 1 ? TrendingUp : TrendingDown;

                    return (
                      <div
                        key={week.weekStart.toISOString()}
                        className={`p-4 rounded-lg border ${week.isCurrentWeek
                            ? 'bg-yellow-50 border-yellow-300'
                            : week.achievementRate >= 1
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <TrendIcon className={`w-4 h-4 ${week.isCurrentWeek ? 'text-yellow-600' :
                                week.achievementRate >= 1 ? 'text-green-600' : 'text-red-600'
                              }`} />
                            <span className="font-medium text-gray-900">
                              Viikko {week.weekNumber}
                            </span>
                            {week.isCurrentWeek && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                                Nykyinen
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${week.isCurrentWeek ? 'text-yellow-600' :
                                week.achievementRate >= 1 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {week.km.toFixed(1)} km
                            </div>
                            <div className="text-sm text-gray-600">
                              Tavoite: {Number(week.target).toFixed(1)} km
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${week.isCurrentWeek
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                  : week.achievementRate >= 1
                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                    : 'bg-gradient-to-r from-red-400 to-red-500'
                                }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(week.achievementRate * 100, 100)}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Saavutus</div>
                            <div className="font-medium">
                              {(week.achievementRate * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Suoritukset</div>
                            <div className="font-medium">{week.activities} kpl</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Aktiivisia päiviä</div>
                            <div className="font-medium">{week.activeDays}/7</div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-2">
                          {week.weekStart.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' })} - {' '}
                          {week.weekEnd.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {analytics.weeklyBreakdown.length > 3 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAllWeeks(!showAllWeeks)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline"
                    >
                      {showAllWeeks ? 'Näytä vähemmän' : `Näytä kaikki ${analytics.weeklyBreakdown.length} viikkoa`}
                    </button>
                  </div>
                )}
              </div>

              {/* Weekly Performance Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {analytics.weeklyBreakdown.filter(w => w.achievementRate >= 1).length}
                    </div>
                    <div className="text-sm text-blue-700">Onnistunutta viikkoa</div>
                    <div className="text-xs text-blue-600">
                      / {analytics.weeklyBreakdown.length} viikkoa yhteensä
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {analytics.weeklyBreakdown.length > 0 ?
                        (analytics.weeklyBreakdown.reduce((sum, w) => sum + w.achievementRate, 0) / analytics.weeklyBreakdown.length * 100).toFixed(0)
                        : 0}%
                    </div>
                    <div className="text-sm text-green-700">Keskimääräinen saavutus</div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {analytics.weeklyBreakdown.length > 0 ?
                        Math.max(...analytics.weeklyBreakdown.map(w => w.km)).toFixed(1)
                        : 0}
                    </div>
                    <div className="text-sm text-purple-700">Paras viikko (km)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              {/* Activity Breakdown */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Lajien jakautuminen</h3>
                <div className="space-y-4">
                  {analytics.activityBreakdown.map(({ activity, count, percentage, totalKm }, index) => (
                    <div key={activity} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-yellow-600">#{index + 1}</span>
                          <span className="font-medium">{activity}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{count} kertaa ({percentage}%)</div>
                          <div className="text-xs text-gray-500">{totalKm.toFixed(1)} km yhteensä</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Keskimäärin {(totalKm / count).toFixed(1)} km per kerta</span>
                        <span>Keskikesto: {Math.round(analytics.totalHours * 60 * (count / analytics.totalActivities) / count)} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Yhteenveto</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Eri lajeja harrastettu:</span>
                    <span className="font-medium">{analytics.activityBreakdown.length} kpl</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suosituin laji:</span>
                    <span className="font-medium">{analytics.activityBreakdown[0]?.activity || 'Ei dataa'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monipuolisuus:</span>
                    <span className="font-medium">
                      {analytics.activityBreakdown.length > 3 ? 'Erittäin monipuolinen' :
                        analytics.activityBreakdown.length > 1 ? 'Monipuolinen' : 'Keskittynyt'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalInsights;