// Example usage of ImprovedWeeklyDisplay component
// File: components/WeeklyGoalsPage.tsx or Dashboard.tsx

import React from 'react';
import { useFetchUsers } from '@/app/hooks/useFetchUsers';
import { useWeeklyGoal} from '@/app/hooks/useWeeklyGoal';
import ImprovedWeeklyDisplay from '@/app/components/ImprovedWeeklyDisplay';

export default function WeeklyGoalsPage() {
  // 1. Fetch users data
  const { users, loading, error } = useFetchUsers();
  
  // 2. Get weekly goal data using the improved hook
  const weeklyGoalData = useWeeklyGoal(users);

  // 3. Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 4. Handle error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error loading data: {error}</p>
      </div>
    );
  }

  // 5. Find current week data
  const currentWeek = weeklyGoalData.allWeeksData.find(week => week.isCurrent);
  
  if (!currentWeek) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">No current week found</p>
      </div>
    );
  }

  // 6. Render the component
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Weekly Progress</h1>
      
      {/* Use the ImprovedWeeklyDisplay component */}
      <ImprovedWeeklyDisplay
        // Locked goal (set Monday)
        weeklyGoal={weeklyGoalData.weeklyGoal}
        weeklyProgress={weeklyGoalData.weeklyProgress}
        progressPercentage={weeklyGoalData.progressPercentage}
        
        // Pace context
        currentPaceNeeded={weeklyGoalData.currentPaceNeeded}
        isPaceAhead={weeklyGoalData.isPaceAhead}
        paceAdjustment={weeklyGoalData.paceAdjustment}
        
        // Week info
        daysRemaining={weeklyGoalData.daysRemaining}
        weekNumber={currentWeek.weekNumber}
      />

      {/* Optional: Show historical weeks */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Previous Weeks</h2>
        <div className="space-y-4">
          {weeklyGoalData.allWeeksData
            .filter(week => week.isCompleted)
            .reverse() // Show most recent first
            .map(week => (
              <WeekHistoryCard key={week.weekKey} week={week} />
            ))}
        </div>
      </div>
    </div>
  );
}

// Optional: Component to show historical weeks
function WeekHistoryCard({ week }: { week: any }) {
  const percentage = (week.achieved / week.goalSetOnMonday) * 100;
  const isSuccess = percentage >= 100;
  
  return (
    <div className={`p-4 rounded-lg border-2 ${
      isSuccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Week {week.weekNumber}</h3>
          <p className="text-sm text-gray-600">
            {week.weekStart.toLocaleDateString()} - {week.weekEnd.toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {week.achieved.toFixed(1)} / {week.goalSetOnMonday.toFixed(1)} km
          </p>
          <p className={`text-sm font-medium ${
            isSuccess ? 'text-green-600' : 'text-gray-600'
          }`}>
            {percentage.toFixed(0)}% {isSuccess ? '✓' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}