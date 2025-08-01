import React from "react";
import { Award } from "lucide-react";
import { Activity } from "@/app/types/types";

interface TopSports {
  count: number;
  sports: { name: string }[];
}

interface LongestActivity extends Activity {
  username: string;
}

interface TopPerformers {
  kilometers: number;
  users: { username: string }[];
}

interface Props {
  getWeekTopSports: () => TopSports | null;
  getLongestActivities: () => LongestActivity[];
  getWeeklyTopPerformers: () => TopPerformers | null;
}

const KeyMetrics: React.FC<Props> = ({
  getWeekTopSports,
  getLongestActivities,
  getWeeklyTopPerformers,
}) => {
  const topSports = getWeekTopSports();
  const longestActivities = getLongestActivities();
  const topPerformers = getWeeklyTopPerformers();

  // Step 1: Find the maximum kilometers
  const maxKilometers = Math.max(
    ...longestActivities.map((activity) => activity.kilometers)
  );

  // Step 2: Keep only activities with max kilometers and remove duplicates
  const longestMatchingActivities = longestActivities
    .filter((activity) => activity.kilometers === maxKilometers)
    .filter(
      (activity, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.username === activity.username && a.activity === activity.activity
        )
    );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Viikon parhaat
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Top Sport */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Viikon suosituimmat
              </h3>
              {topSports ? (
                <>
                  <div className="text-2xl font-bold text-gray-800">
                    {topSports.sports.map((sport) => sport.name).join(" / ")}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {topSports.count} suoritusta tällä viikolla
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Ei vielä suorituksia</p>
              )}
            </div>
          </div>
        </div>

        {/* Longest Workout */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Viikon pisin treeni
              </h3>
              {longestMatchingActivities.length > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round(longestMatchingActivities[0].kilometers)} km
                  </p>
                  <ul className="text-xs text-gray-500 mt-1">
                    {longestMatchingActivities.map((activity) => (
                      <li
                          key={`${activity.username}-${activity.activity}`}
                      >
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

        {/* Weekly Top Performer */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-bg-slate" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Viikon ahkerimmat
              </h3>
              {topPerformers && topPerformers.kilometers > 0 ? (
                <>
                  <p className="text-2xl font-bold text-gray-800">
                    {topPerformers.users
                      .map((user) => user.username)
                      .join(" / ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(topPerformers.kilometers)} km tällä viikolla
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Ei vielä suorituksia</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
