import { useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import ActivityFeedPage from "./ActivityFeedPage";
import Leaderboard from "./Leaderboard";
import SubmitQuote from "./SubmitQuote";
import ToggleButtons from "./ToggleButtons";
import MapWithGlobalState from "./MapWithGlobalState";
import WeeklyProgress from "./WeeklyProgress";

export default function QuickAccess() {
  const { users, loading: loadingUsers, error: errorUsers } = useLeaderboard();
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-8">
      {/* Map takes full width on mobile */}
      <div className="w-full">
        <MapWithGlobalState />
      </div>

      {/* Toggle buttons with better mobile spacing */}
      <div className="w-full">
        <ToggleButtons
          showWeeklyProgress={showWeeklyProgress}
          showActivityFeed={showActivityFeed}
          setShowWeeklyProgress={setShowWeeklyProgress}
          setShowActivityFeed={setShowActivityFeed}
        />
      </div>

      {/* Loading and error states */}
      {loadingUsers && (
        <div className="text-center py-4 text-gray-500 animate-pulse">
          Ladataan käyttäjiä...
        </div>
      )}
      {errorUsers && (
        <div className="text-center py-4 text-red-500">Virhe: {errorUsers}</div>
      )}

      {/* Content sections with proper mobile handling */}
      <div className="w-full">
        {!loadingUsers && !errorUsers && showActivityFeed && (
          <ActivityFeedPage />
        )}
        {!loadingUsers &&
          !errorUsers &&
          !showWeeklyProgress &&
          !showActivityFeed && <Leaderboard users={users} />}
        {!loadingUsers &&
          !errorUsers &&
          showWeeklyProgress &&
          !showActivityFeed && <WeeklyProgress users={users} />}
      </div>

      {/* Submit quote with proper spacing */}
      <div className="w-full pt-2 sm:pt-4">
        <SubmitQuote />
      </div>
    </div>
  );
}
