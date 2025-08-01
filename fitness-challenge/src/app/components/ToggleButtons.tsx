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
      isActive: !showWeeklyProgress && !showActivityFeed,
      onClick: () => {
        setShowWeeklyProgress(false);
        setShowActivityFeed(false);
      }
    },
    {
      label: t.tabs.weekly,
      isActive: showWeeklyProgress,
      onClick: () => {
        setShowWeeklyProgress(true);
        setShowActivityFeed(false);
      }
    },
    {
      label: t.tabs.quotes,
      isActive: showActivityFeed,
      onClick: () => {
        setShowWeeklyProgress(false);
        setShowActivityFeed(true);
      }
    }
  ];

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-md shadow" role="group">
        {buttons.map((button, index) => (
          <button
            key={button.label}
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              button.isActive
                ? "bg-slate-800 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } ${
              index === 0 ? "rounded-l-lg" : index === buttons.length - 1 ? "rounded-r-lg" : ""
            }`}
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButtons;