import React, { useState, useEffect } from "react";
import _ from "lodash";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

interface RecordHolder {
  username: string;
  value: number;
  date: string;
  activities: Activity[];
}

interface Records {
  bestKm: RecordHolder[];
  longestWorkout: RecordHolder[];
  longestStreak: RecordHolder[];
}

const RecordHolders = () => {
  const [records, setRecords] = useState<Records | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
const fetchRecords = async () => {
  try {
    const usersResponse = await fetch("https://matka-zogy.onrender.com/users");
    if (!usersResponse.ok) throw new Error("Failed to fetch users");
    const users = await usersResponse.json();

    // Collect all records first
    const allRecords = await Promise.all(
      users.map(async (user: { username: string }) => {
        const response = await fetch(
          `https://matka-zogy.onrender.com/users/${user.username}?page=1&limit=1000`
        );
        if (!response.ok) return null;
        const data = await response.json();

        const activities: Activity[] = data.activities;

        // Best kilometers in a day
        const dailyActivities = _.groupBy(
          activities,
          (activity) => new Date(activity.date).toISOString().split("T")[0]
        );

        const dailyKilometers = Object.entries(dailyActivities).map(
          ([date, acts]) => ({
            date,
            kilometers: _.sumBy(acts, "kilometers"),
            activities: acts,
          })
        );
        const bestDay = _.maxBy(dailyKilometers, "kilometers");

        // Find the single longest workout (not the sum of a day)
        const longestWorkout = _.maxBy(activities, "duration");

        // Find longest streak (consecutive active days)
        const dates = Object.keys(dailyActivities).sort();
        let currentStreak = 0;
        let maxStreak = 0;
        let maxStreakStart = "";
        let tempStreakStart = "";

        for (let i = 0; i < dates.length; i++) {
          const currentDate = new Date(dates[i]);
          const nextDate = i < dates.length - 1 ? new Date(dates[i + 1]) : null;

          if (currentStreak === 0) {
            tempStreakStart = dates[i];
          }

          currentStreak++;

          if (nextDate) {
            const diffDays = Math.floor(
              (nextDate.getTime() - currentDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (diffDays > 1) {
              // Streak broken
              if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
                maxStreakStart = tempStreakStart;
              }
              currentStreak = 0;
            }
          } else {
            // End of dates array - check if this is the longest streak
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
              maxStreakStart = tempStreakStart;
            }
          }
        }

        return {
          username: user.username,
          bestKm: bestDay
            ? {
                username: user.username,
                value: bestDay.kilometers,
                date: bestDay.date,
                activities: bestDay.activities,
              }
            : null,
          longestWorkout: longestWorkout
            ? {
                username: user.username,
                value: longestWorkout.duration,
                date: longestWorkout.date,
                activities: [longestWorkout], // Only the single longest workout
              }
            : null,
          streak:
            maxStreak > 0
              ? {
                  username: user.username,
                  value: maxStreak,
                  date: maxStreakStart,
                  activities: [],
                }
              : null,
        };
      })
    );

    // Filter out nulls and find max values
    const validRecords = allRecords.filter(Boolean);
    const maxKm = Math.max(...validRecords.map((r) => r?.bestKm?.value || 0));
    const maxWorkout = Math.max(
      ...validRecords.map((r) => r?.longestWorkout?.value || 0)
    );
    const maxStreak = Math.max(
      ...validRecords.map((r) => r?.streak?.value || 0)
    );

    // Find all users with max values
    const bestKmHolders = validRecords
      .filter((r) => r?.bestKm?.value === maxKm)
      .filter((r) => r?.bestKm !== undefined)
      .map((r) => r!.bestKm)
      .filter(Boolean);

    const longestWorkoutHolders = validRecords
      .filter((r) => r?.longestWorkout?.value === maxWorkout)
      .filter((r) => r?.longestWorkout !== undefined)
      .map((r) => r!.longestWorkout)
      .filter(Boolean);

    const longestStreakHolders = validRecords
      .filter((r) => r?.streak?.value === maxStreak)
      .filter((r) => r?.streak !== undefined)
      .map((r) => r!.streak)
      .filter(Boolean);

    setRecords({
      bestKm: bestKmHolders,
      longestWorkout: longestWorkoutHolders,
      longestStreak: longestStreakHolders,
    });
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};


    fetchRecords();
  }, []);

  if (loading)
    return <div className="text-center p-4">Ladataan ennätyksiä...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!records) return null;

  const renderHolders = (holders: RecordHolder[]) => {
    return holders.map((holder, index) => (
      <React.Fragment key={holder.username}>
        <span className="font-bold">{holder.username}</span>
        {index < holders.length - 1 && <span className="mx-1">&</span>}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Nykyiset ennätykset
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-purple-600 font-medium mb-1">
            Eniten kilometrejä päivässä
          </div>
          <div>{renderHolders(records.bestKm)}</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {records.bestKm[0].value.toFixed(1)} km
          </div>
          <div className="text-sm text-gray-500">
            {new Date(records.bestKm[0].date).toLocaleDateString("fi-FI")}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {records.bestKm[0].activities.map((activity) => (
              <div key={activity.id}>
                {activity.activity} ({activity.kilometers.toFixed(1)} km)
                {activity.bonus && (
                  <span className="text-purple-500 ml-1">
                    ★ bonukset laskettu mukaan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">
            Pisin treeni
          </div>
          <div>{renderHolders(records.longestWorkout)}</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {records.longestWorkout[0].value} min
          </div>
          <div className="text-sm text-gray-500">
            {new Date(records.longestWorkout[0].date).toLocaleDateString(
              "fi-FI"
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {records.longestWorkout[0].activities.map((activity) => (
              <div key={activity.id}>
                {activity.activity} ({activity.duration} min)
                {/* {activity.bonus && (
                  <span className="text-blue-500 ml-1">
                    ★ bonukset laskettu
                  </span>
                )} */}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-green-600 font-medium mb-1">
            Pisin urheiluputki
          </div>
          <div>{renderHolders(records.longestStreak)}</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {records.longestStreak[0].value} päivää
          </div>
          {records.longestStreak[0].date && (
            <div className="text-sm text-gray-500">
              Alkaen{" "}
              {new Date(records.longestStreak[0].date).toLocaleDateString(
                "fi-FI"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordHolders;
