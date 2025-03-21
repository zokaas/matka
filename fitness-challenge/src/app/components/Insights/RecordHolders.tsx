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

const calculateBestDay = (activities: Activity[]) => {
  const grouped = _.groupBy(activities, (a) => new Date(a.date).toISOString().split("T")[0]);
  const dailyTotals = Object.entries(grouped).map(([date, acts]) => ({
    date,
    kilometers: _.sumBy(acts, "kilometers"),
    activities: acts,
  }));
  return _.maxBy(dailyTotals, "kilometers");
};

const findLongestWorkout = (activities: Activity[]) => {
  return _.maxBy(activities, "duration");
};

const calculateStreak = (activities: Activity[]) => {
  const dates = Object.keys(
    _.groupBy(activities, (a) => new Date(a.date).toISOString().split("T")[0])
  ).sort((a, b) => a.localeCompare(b));

  let currentStreak = 0;
  let maxStreak = 0;
  let maxStreakStart = "";
  let tempStart = "";

  for (let i = 0; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const nextDate = i < dates.length - 1 ? new Date(dates[i + 1]) : null;

    if (currentStreak === 0) tempStart = dates[i];
    currentStreak++;

    const isStreakBroken = !nextDate || Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) > 1;

    if (isStreakBroken) {
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
        maxStreakStart = tempStart;
      }
      currentStreak = 0;
    }
  }

  return maxStreak > 0 ? { value: maxStreak, date: maxStreakStart } : null;
};

const mapUserRecord = async (username: string): Promise<{
  username: string;
  bestKm: RecordHolder | null;
  longestWorkout: RecordHolder | null;
  streak: RecordHolder | null;
} | null> => {
  try {
    const response = await fetch(`https://matka-zogy.onrender.com/users/${username}?page=1&limit=1000`);
    if (!response.ok) return null;
    const data = await response.json();
    const activities: Activity[] = data.activities;

    const bestDay = calculateBestDay(activities);
    const longest = findLongestWorkout(activities);
    const streak = calculateStreak(activities);

    return {
      username,
      bestKm: bestDay ? { username, value: bestDay.kilometers, date: bestDay.date, activities: bestDay.activities } : null,
      longestWorkout: longest ? { username, value: longest.duration, date: longest.date, activities: [longest] } : null,
      streak: streak ? { username, value: streak.value, date: streak.date, activities: [] } : null,
    };
  } catch {
    return null;
  }
};

const renderHolders = (holders: RecordHolder[]) => (
  holders.map((holder, index) => (
    <React.Fragment key={holder.username}>
      <span className="font-bold">{holder.username}</span>
      {index < holders.length - 1 && <span className="mx-1">&</span>}
    </React.Fragment>
  ))
);

const renderActivityList = (activities: Activity[], type: "km" | "min") => (
  activities.map((activity) => (
    <div key={activity.id}>
      {activity.activity} (
      {type === "km"
        ? `${activity.kilometers.toFixed(1)} km`
        : `${activity.duration} min`}
      )
      {activity.bonus && type === "km" && (
        <span className="text-purple-500 ml-1">★ bonukset laskettu mukaan</span>
      )}
    </div>
  ))
);

const renderRecordCard = (
  title: string,
  colorClass: string,
  holders: RecordHolder[],
  valueLabel: string,
  dateLabel: string,
  activityType: "km" | "min"
) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className={`text-sm ${colorClass} font-medium mb-1`}>{title}</div>
    <div>{renderHolders(holders)}</div>
    <div className={`text-2xl font-bold ${colorClass} mt-1`}>{valueLabel}</div>
    <div className="text-sm text-gray-500">{dateLabel}</div>
    {holders[0].activities.length > 0 && (
      <div className="mt-2 text-xs text-gray-500">
        {renderActivityList(holders[0].activities, activityType)}
      </div>
    )}
  </div>
);

const RecordHolders = () => {
  const [records, setRecords] = useState<Records | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const usersRes = await fetch("https://matka-zogy.onrender.com/users");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const users = await usersRes.json();

        const allRecords = await Promise.all(users.map((u: { username: string }) => mapUserRecord(u.username)));
        const valid = allRecords.filter(Boolean);

        const maxByField = (field: keyof Records) =>
          Math.max(...valid.map((r) => r?.[field]?.value || 0));

        const maxKm = maxByField("bestKm");
        const maxWorkout = maxByField("longestWorkout");
        const maxStreak = maxByField("longestStreak");

        const filterMax = (field: keyof Records, max: number) =>
          valid
            .filter((r) => r?.[field]?.value === max)
            .map((r) => r![field])
            .filter(Boolean) as RecordHolder[];

        setRecords({
          bestKm: filterMax("bestKm", maxKm),
          longestWorkout: filterMax("longestWorkout", maxWorkout),
          longestStreak: filterMax("longestStreak", maxStreak),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) return <div className="text-center p-4">Ladataan ennätyksiä...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!records) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Nykyiset ennätykset</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderRecordCard(
          "Eniten kilometrejä päivässä",
          "text-purple-600",
          records.bestKm,
          `${records.bestKm[0].value.toFixed(1)} km`,
          new Date(records.bestKm[0].date).toLocaleDateString("fi-FI"),
          "km"
        )}
        {renderRecordCard(
          "Pisin treeni",
          "text-blue-600",
          records.longestWorkout,
          `${records.longestWorkout[0].value} min`,
          new Date(records.longestWorkout[0].date).toLocaleDateString("fi-FI"),
          "min"
        )}
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
              Alkaen {new Date(records.longestStreak[0].date).toLocaleDateString("fi-FI")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordHolders;