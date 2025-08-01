import React, { useState, useEffect, ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import _ from "lodash";
import { useTheme } from "@/app/hooks/useTheme";

const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

const CardContent = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`p-4 ${className}`}>{children}</div>;

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

interface DayData {
  date: string;
  totalKm: number;
  totalActivities: number;
  activities: Activity[];
}

interface WeekData {
  days: DayData[];
  totalKm: number;
  totalActivities: number;
}

interface UserInsightsProps {
  username: string;
}

const formatWeekday = (date: string) =>
  new Date(date).toLocaleDateString("fi-FI", { weekday: "short" });
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const UserInsights: React.FC<UserInsightsProps> = ({ username }) => {
  const { t } = useTheme();
  const [thisWeek, setThisWeek] = useState<WeekData | null>(null);
  const [lastWeek, setLastWeek] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setError("Username is required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://matka-zogy.onrender.com/users/${username}?page=1&limit=1000`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get start of this week and last week
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);

        // Process activities
        const activities = data.activities
          .map((a: Activity) => ({
            ...a,
            date: new Date(a.date).toISOString().split("T")[0],
          }))
          .sort(
            (a: Activity, b: Activity) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );

        // Function to get week data
        const getWeekData = (startDate: Date): WeekData => {
          const days: DayData[] = [];
          let totalKm = 0;
          let totalActivities = 0;

          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toISOString().split("T")[0];

            const dayActivities = activities.filter((a: Activity) => a.date === dateStr);
            const dayData: DayData = {
              date: dateStr,
              totalKm: _.sumBy(dayActivities, "kilometers"),
              totalActivities: dayActivities.length,
              activities: dayActivities,
            };

            days.push(dayData);
            totalKm += dayData.totalKm;
            totalActivities += dayData.totalActivities;
          }

          return { days, totalKm, totalActivities };
        };

        setThisWeek(getWeekData(thisWeekStart));
        setLastWeek(getWeekData(lastWeekStart));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading)
    return <div className="text-center p-4">{t.userInsights.title}</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!thisWeek || !lastWeek)
    return <div className="text-center p-4">{t.userInsights.noDataAvailable}</div>;

  // Prepare data for the comparison chart
  const chartData = thisWeek.days.map((day, index) => ({
    date: day.date,
    weekday: formatWeekday(day.date),
    "This Week": day.totalKm,
    "Last Week": lastWeek.days[index].totalKm,
  }));

  const today = new Date();
  const dayIndex = today.getDay();
  const todayData = thisWeek.days[dayIndex];
  const lastWeekSameDay = lastWeek.days[dayIndex];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">{t.userInsights.todayVsLastWeek}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-600">
                  {todayData.totalKm.toFixed(1)} /{" "}
                  {lastWeekSameDay.totalKm.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">{t.userInsights.kmTodayLastWeek}</div>
                {lastWeekSameDay.totalKm > 0 && (
                  <div className="text-xs text-gray-500">
                    {(
                      ((todayData.totalKm - lastWeekSameDay.totalKm) /
                        lastWeekSameDay.totalKm) *
                      100
                    ).toFixed(1)}
                    % {t.userInsights.change}
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold bg-slate-600">
                  {todayData.totalActivities} /{" "}
                  {lastWeekSameDay.totalActivities}
                </div>
                <div className="text-sm text-gray-600">
                  {t.userInsights.activitiesTodayLastWeek}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">{t.userInsights.weekComparison}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold bg-slate-600">
                  {thisWeek.totalKm.toFixed(1)} / {lastWeek.totalKm.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">
                  {t.userInsights.totalKmThisLastWeek}
                </div>
                {lastWeek.totalKm > 0 && (
                  <div className="text-xs text-gray-500">
                    {(
                      ((thisWeek.totalKm - lastWeek.totalKm) /
                        lastWeek.totalKm) *
                      100
                    ).toFixed(1)}
                    % {t.userInsights.change}
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {thisWeek.totalActivities} / {lastWeek.totalActivities}
                </div>
                <div className="text-sm text-gray-600">
                  {t.userInsights.activitiesThisLastWeek}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="h-64">
          <h3 className="font-semibold mb-2">{t.userInsights.weekOverWeekComparison}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekday" tickFormatter={(weekday) => weekday} />
              <YAxis />
              <Tooltip
                labelFormatter={(weekday) => {
                  const date = chartData.find(
                    (d) => d.weekday === weekday
                  )?.date;
                  return date ? formatDate(date) : weekday;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="This Week"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Last Week"
                stroke="#82ca9d"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-semibold mb-2">{t.userInsights.dailyComparison}</h3>
          <div className="space-y-2">
            {thisWeek.days.map((day, index) => {
              const lastWeekDay = lastWeek.days[index];
              const weekday = formatWeekday(day.date);
              const isToday = index === dayIndex;

              return (
                <div
                  key={day.date}
                  className={`flex justify-between items-center p-2 rounded ${
                    isToday ? "bg-slate-50" : "bg-gray-50"
                  }`}
                >
                  <div className="w-24">
                    <div className="font-medium">{weekday}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(day.date)}
                    </div>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="flex justify-between">
                      <span>This Week: {day.totalKm.toFixed(1)} km</span>
                      <span>
                        Last Week: {lastWeekDay.totalKm.toFixed(1)} km
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex justify-between">
                      <span>{day.totalActivities} activities</span>
                      <span>{lastWeekDay.totalActivities} activities</span>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    {lastWeekDay.totalKm > 0 && (
                      <div
                        className={`text-sm ${
                          day.totalKm > lastWeekDay.totalKm
                            ? "bg-slate-600"
                            : "text-red-600"
                        }`}
                      >
                        {(
                          ((day.totalKm - lastWeekDay.totalKm) /
                            lastWeekDay.totalKm) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInsights;