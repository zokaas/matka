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
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-md shadow" role="group">
        {["Sijoitukset", "Viikon tilanne", "Kannustus"].map((label, index) => {
          const isActive =
            (index === 0 && !showWeeklyProgress && !showActivityFeed) ||
            (index === 1 && showWeeklyProgress) ||
            (index === 2 && showActivityFeed);

          return (
            <button
              key={label}
              type="button"
              className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } ${
                index === 0 ? "rounded-l-lg" : index === 2 ? "rounded-r-lg" : ""
              }`}
              onClick={() => {
                setShowWeeklyProgress(index === 1);
                setShowActivityFeed(index === 2);
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToggleButtons;
