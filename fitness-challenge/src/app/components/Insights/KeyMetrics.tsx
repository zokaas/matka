import React from "react";
import { Award } from "lucide-react";
import { Activity } from "@/app/types/types";
import { useTheme } from "@/app/hooks/useTheme";

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
  const { t, colors } = useTheme();
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
      <h3 
        className="text-xl font-semibold mb-6"
        style={{ color: colors.text }}
      >
        {t.records.weeksBest}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Top Sport */}
        <div 
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8" style={{ color: colors.accent }} />
            <div>
              <h3 
                className="text-sm font-medium"
                style={{ color: colors.mutedText }}
              >
                {t.records.mostPopularSports}
              </h3>
              {topSports ? (
                <>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {topSports.sports.map((sport) => sport.name).join(" / ")}
                  </div>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.mutedText }}
                  >
                    {topSports.count} {t.records.performancesThisWeek}
                  </p>
                </>
              ) : (
                <p style={{ color: colors.mutedText }}>
                  {t.records.noPerformancesYet}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Longest Workout */}
        <div 
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8" style={{ color: colors.accent }} />
            <div>
              <h3 
                className="text-sm font-medium"
                style={{ color: colors.mutedText }}
              >
                {t.records.longestWorkoutOfWeek}
              </h3>
              {longestMatchingActivities.length > 0 ? (
                <>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {Math.round(longestMatchingActivities[0].kilometers)} km
                  </p>
                  <ul className="text-xs mt-1" style={{ color: colors.mutedText }}>
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
                <p style={{ color: colors.mutedText }}>
                  {t.activityFeed.noActivities}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Top Performer */}
        <div 
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8" style={{ color: colors.accent }} />
            <div>
              <h3 
                className="text-sm font-medium"
                style={{ color: colors.mutedText }}
              >
                {t.records.weeklyTopPerformers}
              </h3>
              {topPerformers && topPerformers.kilometers > 0 ? (
                <>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {topPerformers.users
                      .map((user) => user.username)
                      .join(" / ")}
                  </p>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.mutedText }}
                  >
                    {Math.round(topPerformers.kilometers)} {t.records.kmThisWeek}
                  </p>
                </>
              ) : (
                <p style={{ color: colors.mutedText }}>
                  {t.records.noPerformancesYet}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;