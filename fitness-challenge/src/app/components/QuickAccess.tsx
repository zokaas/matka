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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <MapWithGlobalState />
      <ToggleButtons
        showWeeklyProgress={showWeeklyProgress}
        showActivityFeed={showActivityFeed}
        setShowWeeklyProgress={setShowWeeklyProgress}
        setShowActivityFeed={setShowActivityFeed}
      />

      {loadingUsers && (
        <div className="text-center text-gray-500 animate-pulse">
          Ladataan käyttäjiä...
        </div>
      )}
      {errorUsers && (
        <div className="text-center text-red-500">Virhe: {errorUsers}</div>
      )}

      {!loadingUsers && !errorUsers && showActivityFeed && <ActivityFeedPage />}
      {!loadingUsers &&
        !errorUsers &&
        !showWeeklyProgress &&
        !showActivityFeed && <Leaderboard users={users} />}
      {!loadingUsers &&
        !errorUsers &&
        showWeeklyProgress &&
        !showActivityFeed && <WeeklyProgress users={users} />}

      <SubmitQuote />
    </div>
  );
}
