import React from "react";
import { Award } from "lucide-react";
import { TargetPaces, Activity } from "@/app/types/types";

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
  targetPaces: TargetPaces;
  getWeekTopSports: () => TopSports | null;
  getLongestActivities: () => LongestActivity[];
  getWeeklyTopPerformers: () => TopPerformers | null;
}

const KeyMetrics: React.FC<Props> = ({
  targetPaces,
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
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Progress */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-800">Tähän mennessä</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")} km
          </p>
          <p className="text-sm text-purple-600">/ 100 000 km</p>
        </div>

        {/* Weekly Goal */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-800">Viikon tavoite</h3>
          <p className="text-2xl font-bold text-orange-600">
            {targetPaces.weeklyPerUser.toFixed(0)} km / hlö
          </p>
        </div>

        {/* Days Remaining */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-800">Aikaa jäljellä</h3>
          <p className="text-2xl font-bold text-green-600">
            {targetPaces.daysRemaining} päivää
          </p>
        </div>

        {/* Weekly Top Sport */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-green-500" />
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

        {/* Longest Activities */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Viikon pisimmät
              </h3>
              {longestMatchingActivities.length > 0 ? (
                <>
                  <ul className="text-xs text-gray-500 mt-1">
                    {longestMatchingActivities.map((activity, index) => (
                      <li
                        key={index}
                        className="text-2xl font-bold text-gray-800"
                      >
                        {activity.username} - {activity.activity} (
                        {Math.round(activity.kilometers)} km)
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
            <Award className="w-8 h-8 text-orange-500" />
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
