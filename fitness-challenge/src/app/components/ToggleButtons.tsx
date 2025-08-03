import { useTheme } from "@/app/hooks/useTheme";

interface ToggleProps {
  showWeeklyProgress: boolean;
  showActivityFeed: boolean;
  setShowWeeklyProgress: (value: boolean) => void;
  setShowActivityFeed: (value: boolean) => void;
}

const ToggleButtons = ({
  showWeeklyProgress,
  showActivityFeed,
  setShowWeeklyProgress,
  setShowActivityFeed,
}: ToggleProps) => {
  const { t } = useTheme();

  const buttons = [
    {
      label: t.tabs.leaderboard,
      shortLabel: "Ranking", // Short label for mobile
      isActive: !showWeeklyProgress && !showActivityFeed,
      onClick: () => {
        setShowWeeklyProgress(false);
        setShowActivityFeed(false);
      }
    },
    {
      label: t.tabs.weekly,
      shortLabel: "Viikkoranking", // Short label for mobile
      isActive: showWeeklyProgress,
      onClick: () => {
        setShowWeeklyProgress(true);
        setShowActivityFeed(false);
      }
    },
    {
      label: t.tabs.quotes,
      shortLabel: "Feed", // Short label for mobile
      isActive: showActivityFeed,
      onClick: () => {
        setShowWeeklyProgress(false);
        setShowActivityFeed(true);
      }
    }
  ];

  return (
    <div className="flex justify-center px-2">
      <div className="inline-flex rounded-lg shadow-lg bg-white border border-yellow-200 w-full max-w-md" role="group">
        {buttons.map((button, index) => (
          <button
            key={button.label}
            type="button"
            className={`flex-1 px-2 sm:px-5 py-2 sm:py-2 text-xs sm:text-sm font-medium border border-yellow-300 transition-all duration-200 ${
              button.isActive
                ? "bg-yellow-400 text-black shadow-inner"
                : "bg-white text-gray-700 hover:bg-yellow-50"
            } ${
              index === 0 ? "rounded-l-lg" : index === buttons.length - 1 ? "rounded-r-lg" : ""
            }`}
            onClick={button.onClick}
          >
            {/* Show short label on mobile, full label on larger screens */}
            <span className="sm:hidden">{button.shortLabel}</span>
            <span className="hidden sm:inline">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButtons;