"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  Calendar,
  Activity,
  Clock,
  Award,
  BarChart3,
  MapPin,
  Users,
  Zap
} from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";
import { format, differenceInDays } from "date-fns";

interface User {
  username: string;
  totalKm: number;
  profilePicture?: string; // LISÄTTY: profiilikuva
  activities: Array<{
    id: number;
    activity: string;
    duration: number;
    date: string;
    kilometers: number;
    bonus?: string;
  }>;
}

interface InsightMetrics {
  totalProgress: number;
  totalActivities: number;
  avgKmPerUser: number;
  activeUsers: number;
  completionPercentage: number;
  daysRemaining: number;
  daysSinceStart: number;
  dailyAverage: number;
  weeklyAverage: number;
  progressStatus: 'ahead' | 'onTrack' | 'behind';
  expectedProgress: number;
  progressDifference: number;
}

interface WeeklyStats {
  username: string;
  profilePicture?: string; // LISÄTTY: profiilikuva
  weeklyKm: number;
  weeklyPercentage: number;
  dailyTarget: number;
}

interface RecordData {
  bestKmDay: { username: string; kilometers: number; date: string } | null;
  longestWorkout: { username: string; duration: number; activity: string; date: string } | null;
  currentStreak: { username: string; days: number } | null;
  topSports: Array<{ name: string; count: number }>;
}

const InsightsWithTabs = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'weekly' | 'records' | 'stages'>('overview');
  
  // Calculated metrics
  const [metrics, setMetrics] = useState<InsightMetrics>({
    totalProgress: 0,
    totalActivities: 0,
    avgKmPerUser: 0,
    activeUsers: 0,
    completionPercentage: 0,
    daysRemaining: 0,
    daysSinceStart: 0,
    dailyAverage: 0,
    weeklyAverage: 0,
    progressStatus: 'onTrack',
    expectedProgress: 0,
    progressDifference: 0
  });
  
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [records, setRecords] = useState<RecordData>({
    bestKmDay: null,
    longestWorkout: null,
    currentStreak: null,
    topSports: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
        const userData: User[] = await response.json();
        
        // Calculate all metrics at once
        calculateMetrics(userData);
        calculateWeeklyStats(userData);
        calculateRecords(userData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (userData: User[]) => {
    const today = new Date();
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);
    
    // KORJATTU: Laske vain haasteen aikana tehdyt aktiviteetit
    const challengeActivities = userData.flatMap(user => 
      user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      })
    );
    
    const totalProgress = challengeActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
    const totalActivities = challengeActivities.length;
    const avgKmPerUser = userData.length > 0 ? totalProgress / userData.length : 0;
    const completionPercentage = Math.min(100, (totalProgress / challengeParams.totalDistance) * 100);
    
    const daysSinceStart = Math.max(1, differenceInDays(today, startDate));
    const daysRemaining = Math.max(0, differenceInDays(endDate, today));
    
    // KORJATTU: Jos haaste on kestänyt alle viikon, älä näytä viikkovauhtia
    const dailyAverage = totalProgress / daysSinceStart;
    let weeklyAverage = 0;
    
    if (daysSinceStart >= 7) {
      // Vasta viikon jälkeen lasketaan viikkovauhti
      weeklyAverage = dailyAverage * 7;
    } else {
      // Alle viikossa ei lasketa viikkovauhtia
      weeklyAverage = 0;
    }
    
    const expectedProgress = (challengeParams.totalDistance * daysSinceStart) / challengeParams.totalDays;
    const progressDifference = Math.abs(totalProgress - expectedProgress);
    const progressStatus = totalProgress >= expectedProgress * 1.05 ? 'ahead' : 
                          totalProgress >= expectedProgress * 0.95 ? 'onTrack' : 'behind';
    
    setMetrics({
      totalProgress,
      totalActivities,
      avgKmPerUser,
      activeUsers: userData.length,
      completionPercentage,
      daysRemaining,
      daysSinceStart,
      dailyAverage,
      weeklyAverage,
      progressStatus,
      expectedProgress,
      progressDifference
    });
  };

  const calculateWeeklyStats = (userData: User[]) => {
    const today = new Date();
    const startDate = new Date(challengeParams.startDate);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const daysLeftInWeek = Math.max(1, 7 - today.getDay());
    const weeklyTarget = Math.round(challengeParams.weeklyTarget / userData.length);
    
    const stats = userData.map(user => {
      // KORJATTU: Ota vain haasteen aikana tehdyt aktiviteetit
      const challengeActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= new Date(challengeParams.endDate);
      });
      
      // Tämän viikon aktiviteetit
      const weekActivities = challengeActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      const weeklyKm = weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
      const weeklyPercentage = Math.min(200, (weeklyKm / weeklyTarget) * 100);
      const remainingKm = Math.max(0, weeklyTarget - weeklyKm);
      const dailyTarget = Math.round(remainingKm / daysLeftInWeek);
      
      return {
        username: user.username,
        profilePicture: user.profilePicture, // LISÄTTY: profiilikuva
        weeklyKm,
        weeklyPercentage,
        dailyTarget
      };
    }).sort((a, b) => b.weeklyKm - a.weeklyKm);
    
    setWeeklyStats(stats);
  };

  const calculateRecords = (userData: User[]) => {
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);
    
    let bestKmDay: { username: string; kilometers: number; date: string } | null = null;
    let longestWorkout: { username: string; duration: number; activity: string; date: string } | null = null;
    let bestStreak: { username: string; days: number } | null = null;
    const sportCounts: Record<string, number> = {};
    
    userData.forEach(user => {
      // KORJATTU: Ota vain haasteen aikana tehdyt aktiviteetit
      const challengeActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });
      
      // Calculate daily totals for best km day
      const dailyTotals: Record<string, number> = {};
      challengeActivities.forEach(activity => {
        const dateKey = activity.date.split('T')[0];
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + activity.kilometers;
      });
      
      // Find user's best day
      const userBestDay = Object.entries(dailyTotals).reduce((best, [date, km]) => {
        return km > (best?.kilometers || 0) ? { date, kilometers: km } : best;
      }, null as { date: string; kilometers: number } | null);
      
      if (userBestDay && (!bestKmDay || userBestDay.kilometers > bestKmDay.kilometers)) {
        bestKmDay = { username: user.username, ...userBestDay };
      }
      
      // Find longest workout (from challenge activities only)
      const userLongest = challengeActivities.reduce((longest, activity) => {
        return activity.duration > (longest?.duration || 0) ? activity : longest;
      }, null as typeof challengeActivities[0] | null);
      
      if (userLongest && (!longestWorkout || userLongest.duration > longestWorkout.duration)) {
        longestWorkout = {
          username: user.username,
          duration: userLongest.duration,
          activity: userLongest.activity,
          date: userLongest.date
        };
      }
      
      // Calculate streak (from challenge activities only)
      const activityDates = [...new Set(challengeActivities.map(a => a.date.split('T')[0]))].sort();
      let currentStreak = 0;
      let maxStreak = 0;
      
      for (let i = 0; i < activityDates.length; i++) {
        if (i === 0 || 
            Math.abs(new Date(activityDates[i]).getTime() - new Date(activityDates[i-1]).getTime()) <= 2 * 24 * 60 * 60 * 1000) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      
      if (maxStreak > (bestStreak?.days || 0)) {
        bestStreak = { username: user.username, days: maxStreak };
      }
      
      // Count sports (from challenge activities only)
      challengeActivities.forEach(activity => {
        sportCounts[activity.activity] = (sportCounts[activity.activity] || 0) + 1;
      });
    });
    
    const topSports = Object.entries(sportCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    setRecords({
      bestKmDay,
      longestWorkout,
      currentStreak: bestStreak,
      topSports
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  const sections = [
    { key: 'overview', label: 'Yleiskatsaus', icon: BarChart3 },
    { key: 'weekly', label: 'Viikko', icon: Calendar },
    { key: 'records', label: 'Ennätykset', icon: Trophy },
    { key: 'stages', label: 'Etapit', icon: MapPin },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-4">
            📊 Tilastot
          </h1>
          <p className="text-gray-600 mb-6">Tour de France -haasteen edistyminen</p>
          
          {/* Challenge Progress Banner */}
          <div className={`p-4 rounded-xl border-2 mb-6 ${
            metrics.progressStatus === 'ahead' ? 'bg-green-50 border-green-300' :
            metrics.progressStatus === 'behind' ? 'bg-red-50 border-red-300' :
            'bg-blue-50 border-blue-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl">
                {metrics.progressStatus === 'ahead' ? '🚀' : 
                 metrics.progressStatus === 'behind' ? '⚠️' : '🎯'}
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">
                  {metrics.progressStatus === 'ahead' ? 'Etuajassa!' :
                   metrics.progressStatus === 'behind' ? 'Tavoitteesta jäljessä' :
                   'Aikataulussa'}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(metrics.progressDifference)} km {metrics.progressStatus === 'ahead' ? 'yli' : 
                   metrics.progressStatus === 'behind' ? 'alle' : ''} tavoitteen
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat
              icon={<Trophy className="w-5 h-5" />}
              value={`${Math.round(metrics.totalProgress).toLocaleString('fi-FI')} km`}
              label="Yhteensä"
              color="text-yellow-600"
            />
            <QuickStat
              icon={<Target className="w-5 h-5" />}
              value={`${metrics.completionPercentage.toFixed(0)}%`}
              label="Valmis"
              color="text-green-600"
            />
            <QuickStat
              icon={<Users className="w-5 h-5" />}
              value={metrics.activeUsers.toString()}
              label="Pyöräilijää"
              color='#facc15'
            />
            <QuickStat
              icon={<Calendar className="w-5 h-5" />}
              value={metrics.daysRemaining.toString()}
              label="Päivää jäljellä"
              color="text-purple-600"
            />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-yellow-200 inline-flex">
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeSection === key
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  icon={<Target className="w-6 h-6" />}
                  title="Keskiarvo per henkilö"
                  value={`${Math.round(metrics.avgKmPerUser)} km`}
                  subtitle={`${metrics.totalActivities} suoritusta yhteensä`}
                />
                <MetricCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Keskimääräinen päivävauhti"
                  value={`${Math.round(metrics.dailyAverage)} km`}
                  subtitle={`Tavoite: ${challengeParams.dailyTarget} km`}
                />
                <MetricCard
                  icon={<Zap className="w-6 h-6" />}
                  title="Keskimääräinen viikkovauhti"
                  value={metrics.daysSinceStart >= 7 ? `${Math.round(metrics.weeklyAverage)} km` : 'Ei vielä dataa'}
                  subtitle={metrics.daysSinceStart >= 7 ? `Tavoite: ${Math.round(challengeParams.weeklyTarget)} km` : 'Tarvitaan vähintään viikko dataa'}
                />
              </div>
            </div>
          )}

          {activeSection === 'weekly' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">📊 Viikon tilanne</h2>
              <div className="grid gap-4">
                {weeklyStats.map((stat, index) => (
                  <div key={stat.username} className="bg-white p-4 rounded-lg shadow border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar-kuva Dashboardista */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={
                              stat.profilePicture
                                ? `https://matka-xi.vercel.app/${stat.username}.png`
                                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${stat.username}`
                            }
                            alt={`${stat.username}'s avatar`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                        
                        {/* Sija-emoji */}
                        <div className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🚴‍♂️'}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{stat.username}</h3>
                          <p className="text-sm text-gray-600">Sija {index + 1}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-slate-600">{Math.round(stat.weeklyKm)} km</div>
                        <div className="text-sm text-gray-600">{Math.round(stat.weeklyPercentage)}% tavoitteesta</div>
                        {stat.dailyTarget > 0 && (
                          <div className="text-xs text-gray-500">
                            Tarvitaan: {stat.dailyTarget} km/päivä
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-slate-500"
                          style={{ width: `${Math.min(100, stat.weeklyPercentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'records' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">🏆 Ennätykset</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <RecordCard
                  icon={<Trophy className="w-6 h-6" />}
                  title="Paras päivä"
                  value={records.bestKmDay ? `${Math.round(records.bestKmDay.kilometers)} km` : 'Ei dataa'}
                  subtitle={records.bestKmDay ? records.bestKmDay.username : ''}
                  detail={records.bestKmDay ? format(new Date(records.bestKmDay.date), 'd.M.yyyy') : ''}
                />
                <RecordCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Pisin treeni"
                  value={records.longestWorkout ? `${records.longestWorkout.duration} min` : 'Ei dataa'}
                  subtitle={records.longestWorkout ? records.longestWorkout.username : ''}
                  detail={records.longestWorkout ? records.longestWorkout.activity : ''}
                />
                <RecordCard
                  icon={<Activity className="w-6 h-6" />}
                  title="Pisin putki"
                  value={records.currentStreak ? `${records.currentStreak.days} päivää` : 'Ei dataa'}
                  subtitle={records.currentStreak ? records.currentStreak.username : ''}
                  detail=""
                />
              </div>
              
              {/* Popular Sports */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Suosituimmat lajit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {records.topSports.map((sport, index) => (
                    <div key={sport.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-yellow-600">{index + 1}.</span>
                        <span className="font-medium">{sport.name}</span>
                      </div>
                      <span className="text-gray-600">{sport.count} kertaa</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'stages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">🗺️ Tour de France Etapit</h2>
              
              {/* Current Stage Display */}
              {(() => {
                let currentStage = 0;
                for (let i = theme.stages.length - 1; i >= 0; i--) {
                  if (metrics.totalProgress >= theme.stages[i].pointsRequired) {
                    currentStage = i;
                    break;
                  }
                }
                
                const currentStageData = theme.stages[currentStage];
                const nextStage = theme.stages[currentStage + 1];
                const progressToNext = nextStage
                  ? ((metrics.totalProgress - currentStageData.pointsRequired) / 
                     (nextStage.pointsRequired - currentStageData.pointsRequired)) * 100
                  : 100;

                return (
                  <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-6 rounded-xl shadow-lg border-2 border-yellow-500">
                    <div className="text-center text-black">
                      <div className="text-6xl mb-4">{currentStageData.emoji}</div>
                      <h3 className="text-2xl font-bold mb-2">
                        Etappi {currentStage + 1}: {currentStageData.name}
                      </h3>
                      <p className="text-lg mb-2">{currentStageData.description}</p>
                      <div className="flex justify-center gap-4 mb-4 text-sm">
                        <span>📍 {currentStageData.location}</span>
                        <span>{theme.weatherIcons[currentStageData.weather]} {currentStageData.weather}</span>
                        <span>🚴 {currentStageData.stageType}</span>
                      </div>
                      
                      {nextStage && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Seuraava etappi: {nextStage.name}</span>
                            <span>{Math.round(progressToNext)}%</span>
                          </div>
                          <div className="w-full bg-black/20 rounded-full h-3">
                            <div
                              className="h-3 rounded-full bg-white"
                              style={{ width: `${Math.min(progressToNext, 100)}%` }}
                            />
                          </div>
                          <p className="text-sm mt-2">
                            {Math.round(nextStage.pointsRequired - metrics.totalProgress)} km seuraavaan etappiin
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Stage Progress Overview */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-4">🏁 Etappien edistyminen</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {theme.stages.filter((_, i) => metrics.totalProgress >= theme.stages[i].pointsRequired).length}
                    </div>
                    <div className="text-sm text-gray-600">Suoritetut etapit</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold" style={{ color: '#facc15' }}>
                      {theme.stages.length - theme.stages.filter((_, i) => metrics.totalProgress >= theme.stages[i].pointsRequired).length}
                    </div>
                    <div className="text-sm text-gray-600">Jäljellä olevia</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.round((theme.stages.filter((_, i) => metrics.totalProgress >= theme.stages[i].pointsRequired).length / theme.stages.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Etapeista valmis</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {theme.stages.length}
                    </div>
                    <div className="text-sm text-gray-600">Etappeja yhteensä</div>
                  </div>
                </div>

                {/* Stages List Preview */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {theme.stages.slice(0, 10).map((stage, index) => {
                    const isCompleted = metrics.totalProgress >= stage.pointsRequired;
                    const isCurrent = index === theme.stages.findIndex((s, i) => {
                      return i === theme.stages.length - 1 || 
                             (metrics.totalProgress >= s.pointsRequired && 
                              metrics.totalProgress < theme.stages[i + 1]?.pointsRequired);
                    });
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isCompleted ? 'bg-green-50 border border-green-200' :
                          isCurrent ? 'bg-yellow-50 border border-yellow-300' :
                          'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="text-2xl">{stage.emoji}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            Etappi {index + 1}: {stage.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            📍 {stage.location} • {stage.stageType}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {stage.pointsRequired.toLocaleString('fi-FI')} km
                          </div>
                          <div className={`text-xs ${
                            isCompleted ? 'text-green-600' : 
                            isCurrent ? 'text-yellow-600' : 'text-gray-500'
                          }`}>
                            {isCompleted ? '✅ Valmis' : isCurrent ? '🎯 Nykyinen' : '⏳ Tulossa'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {theme.stages.length > 10 && (
                    <div className="text-center text-gray-500 text-sm py-2">
                      ... ja {theme.stages.length - 10} etappia lisää
                    </div>
                  )}
                </div>
              </div>

              {/* Pace Projection */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-4">🎯 Vauhtiennuste</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {metrics.daysSinceStart >= 7 ? `${Math.round(metrics.weeklyAverage)} km/vko` : 'Ei vielä dataa'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {metrics.daysSinceStart >= 7 ? 'Keskimääräinen viikkovauhti' : 'Viikkovauhti'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {metrics.daysSinceStart >= 7 ? 
                        `(${metrics.daysSinceStart} päivän keskiarvo)` : 
                        `(tarvitaan ${7 - metrics.daysSinceStart} päivää lisää)`
                      }
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800">
                      {Math.round(challengeParams.weeklyTarget)} km/vko
                    </div>
                    <div className="text-sm text-gray-600">Vaadittu vauhti</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${
                    metrics.progressStatus === 'ahead' ? 'bg-green-50' :
                    metrics.progressStatus === 'behind' ? 'bg-red-50' :
                    'bg-blue-50'
                  }`}>
                    <div className={`text-lg font-bold ${
                      metrics.progressStatus === 'ahead' ? 'text-green-600' :
                      metrics.progressStatus === 'behind' ? 'text-red-600' :
                      '"#facc15"'
                    }`}>
                      {(() => {
                        const remainingDays = Math.max(1, metrics.daysRemaining);
                        const remainingKm = challengeParams.totalDistance - metrics.totalProgress;
                        const requiredDaily = remainingKm / remainingDays;
                        const projectedFinish = new Date();
                        const remainingAtCurrentPace = remainingKm / metrics.dailyAverage;
                        projectedFinish.setDate(projectedFinish.getDate() + Math.ceil(remainingAtCurrentPace));
                        
                        const daysFromTarget = Math.ceil((projectedFinish.getTime() - new Date(challengeParams.endDate).getTime()) / (1000 * 60 * 60 * 24));
                        
                        if (daysFromTarget === 0) return 'Täsmälleen aikataulussa';
                        return daysFromTarget > 0 ? `${daysFromTarget} päivää myöhässä` : `${Math.abs(daysFromTarget)} päivää etuajassa`;
                      })()}
                    </div>
                    <div className="text-sm text-gray-600">Ennustettu lopputulos</div>
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

// Helper Components
const QuickStat = ({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  color: string; 
}) => (
  <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
    <div className={`flex justify-center mb-2 ${color}`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-600 text-center">{value}</div>
    <div className="text-sm text-gray-600 text-center">{label}</div>
  </div>
);

const MetricCard = ({ 
  icon, 
  title, 
  value, 
  subtitle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
}) => (
  <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-yellow-500">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-slate-600 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{subtitle}</div>
  </div>
);

const RecordCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  detail 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle: string; 
  detail: string; 
}) => (
  <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-yellow-500">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-slate-600 mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-700">{subtitle}</div>
    {detail && <div className="text-xs text-gray-500 mt-1">{detail}</div>}
  </div>
);

export default InsightsWithTabs;