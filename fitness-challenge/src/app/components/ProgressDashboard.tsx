// src/app/components/ProgressDashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Define types to match your application
interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

interface User {
  id: string;
  username: string;
  totalKm: number;
  activities: Activity[];
  profilePicture?: string;
}

interface DailyProgress {
  date: string;
  dailyKm: number;
  cumulativeKm: number;
}

interface ActivityStats {
  type: string;
  count: number;
  kilometers: number;
}

interface WeeklyData {
  name: string;
  kilometers: number;
  activities: number;
  users: number | Set<string>;
}

const ProgressDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalKm, setTotalKm] = useState(0);
  const [activeTab, setActiveTab] = useState('team');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [progressOverTime, setProgressOverTime] = useState<DailyProgress[]>([]);
  const [activityBreakdown, setActivityBreakdown] = useState<ActivityStats[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyData[]>([]);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const backendUrl = "https://matka-zogy.onrender.com";
        
        // Fetch users
        const usersResponse = await fetch(`${backendUrl}/users`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        
        // Fetch total kilometers
        const totalResponse = await fetch(`${backendUrl}/total-kilometers`);
        if (!totalResponse.ok) throw new Error("Failed to fetch total kilometers");
        const totalData = await totalResponse.json();
        
        setUsers(usersData);
        setTotalKm(totalData.totalKm);
        setSelectedUser(usersData[0]?.username || null);
        
        // Process data for visualizations
        processTeamData(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Use useCallback to memoize the processUserData function to avoid the React hook dependency warning
  const processUserData = React.useCallback((userData: User) => {
    if (!userData?.activities?.length) return;
    
    // Filter activities based on the selected timeframe
    const filteredActivities = userData.activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      
      if (timeframe === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return activityDate >= weekAgo;
      } else if (timeframe === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return activityDate >= monthAgo;
      }
      
      return true; // 'all' timeframe
    });
    
    // Sort activities by date
    const sortedActivities = [...filteredActivities].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Process user progress over time
    const dailyProgress: Record<string, DailyProgress> = {};
    let cumulativeDistance = 0;
    
    sortedActivities.forEach(activity => {
      const dateStr = new Date(activity.date).toISOString().split('T')[0];
      
      if (!dailyProgress[dateStr]) {
        dailyProgress[dateStr] = {
          date: dateStr,
          dailyKm: 0,
          cumulativeKm: 0
        };
      }
      
      dailyProgress[dateStr].dailyKm += activity.kilometers;
    });
    
    // Calculate cumulative distance
    const progressData = Object.values(dailyProgress);
    progressData.forEach((day) => {
      cumulativeDistance += day.dailyKm;
      day.cumulativeKm = cumulativeDistance;
    });
    
    // Create activity breakdown by type
    const activityCounts: Record<string, ActivityStats> = {};
    sortedActivities.forEach(activity => {
      const type = activity.activity.split('/')[0].trim();
      if (!activityCounts[type]) {
        activityCounts[type] = {
          type,
          count: 0,
          kilometers: 0
        };
      }
      
      activityCounts[type].count += 1;
      activityCounts[type].kilometers += activity.kilometers;
    });
    
    const activityBreakdownData = Object.values(activityCounts)
      .sort((a, b) => b.kilometers - a.kilometers)
      .slice(0, 10); // Top 10 activities
    
    setProgressOverTime(progressData);
    setActivityBreakdown(activityBreakdownData);
  }, [timeframe]);
  
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const userData = users.find(u => u.username === selectedUser);
      if (userData) {
        processUserData(userData);
      }
    }
  }, [selectedUser, users, timeframe, processUserData]);
  
  const processTeamData = (usersData: User[]) => {
    // Process team progress over time
    type EnhancedActivity = Activity & { username: string };
    const allActivities: EnhancedActivity[] = [];
    
    usersData.forEach(user => {
      user.activities.forEach(activity => {
        allActivities.push({
          ...activity,
          username: user.username,
          date: new Date(activity.date).toISOString().split('T')[0]
        });
      });
    });
    
    // Sort activities by date
    allActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Aggregate activities by date
    const dailyProgress: Record<string, DailyProgress> = {};
    let cumulativeDistance = 0;
    
    allActivities.forEach(activity => {
      if (!dailyProgress[activity.date]) {
        dailyProgress[activity.date] = {
          date: activity.date,
          dailyKm: 0,
          cumulativeKm: 0
        };
      }
      
      dailyProgress[activity.date].dailyKm += activity.kilometers;
    });
    
    // Calculate cumulative distance
    const progressData = Object.values(dailyProgress);
    progressData.forEach((day) => {
      cumulativeDistance += day.dailyKm;
      day.cumulativeKm = cumulativeDistance;
    });
    
    // Create activity breakdown by type
    const activityCounts: Record<string, ActivityStats> = {};
    allActivities.forEach(activity => {
      const type = activity.activity.split('/')[0].trim();
      if (!activityCounts[type]) {
        activityCounts[type] = {
          type,
          count: 0,
          kilometers: 0
        };
      }
      
      activityCounts[type].count += 1;
      activityCounts[type].kilometers += activity.kilometers;
    });
    
    const activityBreakdownData = Object.values(activityCounts)
      .sort((a, b) => b.kilometers - a.kilometers)
      .slice(0, 10); // Top 10 activities
    
    // Weekly comparison
    const weeklyData: Record<string, WeeklyData> = {};
    const now = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - ((now.getDay() || 7) - 1) - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekKey = `Week ${i === 0 ? 'Current' : i}`;
      
      weeklyData[weekKey] = {
        name: weekKey,
        kilometers: 0,
        activities: 0,
        users: new Set<string>()
      };
      
      allActivities.forEach(activity => {
        const activityDate = new Date(activity.date);
        if (activityDate >= weekStart && activityDate <= weekEnd) {
          weeklyData[weekKey].kilometers += activity.kilometers;
          weeklyData[weekKey].activities += 1;
          (weeklyData[weekKey].users as Set<string>).add(activity.username);
        }
      });
      
      weeklyData[weekKey].users = (weeklyData[weekKey].users as Set<string>).size;
    }
    
    const weeklyComparisonData = Object.values(weeklyData).reverse();
    
    setProgressOverTime(progressData);
    setActivityBreakdown(activityBreakdownData);
    setWeeklyComparison(weeklyComparisonData);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600">
        <p>{error}</p>
      </div>
    );
  }
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Fitness Challenge Dashboard</h2>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'team' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Team Progress
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'individual' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Individual Progress
            </button>
          </div>
          
          {activeTab === 'individual' && (
            <div className="flex items-center space-x-4">
              <select
                value={selectedUser || ''}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-purple-200"
              >
                {users.map(user => (
                  <option key={user.username} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 text-sm ${timeframe === 'week' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white text-gray-700'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 text-sm ${timeframe === 'month' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white text-gray-700'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-3 py-1 text-sm ${timeframe === 'all' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-white text-gray-700'}`}
                >
                  All
                </button>
              </div>
            </div>
          )}
        </div>
        
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Distance</h3>
                <p className="text-3xl font-bold text-purple-700">{Math.round(totalKm).toLocaleString()} km</p>
                <p className="text-sm text-purple-600">of 100,000 km target</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (totalKm / 100000) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-500 mt-1">
                  {Math.round((totalKm / 100000) * 100)}% complete
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Active Participants</h3>
                <p className="text-3xl font-bold text-blue-700">{users.length}</p>
                <p className="text-sm text-blue-600">registered users</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Avg. Per Person</h3>
                <p className="text-3xl font-bold text-green-700">
                  {users.length ? Math.round(totalKm / users.length).toLocaleString() : 0} km
                </p>
                <p className="text-sm text-green-600">total distance per participant</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Total Progress Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      minTickGap={30}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${Math.round(value)} km`, '']}
                      labelFormatter={(label: string) => formatDate(label)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeKm" 
                      name="Cumulative Distance" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Activity Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="type" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value: number) => [`${Math.round(value)} km`, '']} />
                      <Legend />
                      <Bar dataKey="kilometers" name="Total Distance" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Weekly Comparison</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${Math.round(value)}`, '']} />
                      <Legend />
                      <Bar dataKey="kilometers" name="Total Distance (km)" fill="#8884d8" />
                      <Bar dataKey="activities" name="Activities" fill="#82ca9d" />
                      <Bar dataKey="users" name="Active Users" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'individual' && selectedUser && (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Individual Progress Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      minTickGap={30}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${Math.round(value)} km`, '']}
                      labelFormatter={(label: string) => formatDate(label)}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeKm" 
                      name="Cumulative Distance" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dailyKm" 
                      name="Daily Distance" 
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Activity Breakdown</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="kilometers"
                        nameKey="type"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {activityBreakdown.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${Math.round(value)} km`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Frequency by Activity</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="type" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Activities" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Distance per Activity Type</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${Math.round(value)} km`, '']} />
                    <Legend />
                    <Bar dataKey="kilometers" name="Total Distance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;