import React from "react";
import { format } from "date-fns";
import {
  TrendingUp,
  Calendar,
  Flag,
  Clock,
  Zap,
} from "lucide-react";
import { useTargetPace } from "../TargetPaceContext";
import { formatNumberWithSpaces } from "@/app/utils/formatDate";
import Loader from "../common/Loader";
import { useTheme } from "@/app/hooks/useTheme";

interface HeaderProps {
  participantCount: number;
}

const Header: React.FC<HeaderProps> = () => {
  const targetPaces = useTargetPace();
  const { colors } = useTheme();

  if (!targetPaces) return <Loader />;

  const {
    totalProgress,
    projectedEndDate,
    historicalPace,
    remainingDistance,
    daysRemaining,
    behindAmount,
    expectedProgressToday,
  } = targetPaces;

  const formattedProjectedDate = projectedEndDate
    ? format(new Date(projectedEndDate), "d.M.yyyy")
    : "Ei tiedossa";

  const completionPercentage = Math.min(
    100,
    Math.round((totalProgress / 100000) * 100)
  );

  const formattedTotalProgress = formatNumberWithSpaces(Math.round(totalProgress));
  const formattedHistoricalPace = formatNumberWithSpaces(Math.round(historicalPace));
  const formattedRemainingDistance = formatNumberWithSpaces(Math.round(remainingDistance));

  return (
    <div
      className="rounded-xl shadow-sm overflow-hidden max-w-md mx-auto"
      style={{ backgroundColor: colors.card, color: colors.text }}
    >
      {/* Progress Bar Section */}
      <div
        className="p-3"
        style={{ backgroundColor: colors.primary, color: colors.background }}
      >
        <h2 className="text-base font-medium flex items-center">
          <Zap className="w-4 h-4 mr-1.5" />
          Eteneminen kohti tavoitetta
        </h2>
        <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: colors.background,
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-1.5 text-xs">
          <span>{completionPercentage}% valmis</span>
          <span>{formattedTotalProgress} / 100 000 km</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            value={`${formattedHistoricalPace}`}
            label="Vauhtikeskiarvo"
            unit="km/hlö/vko"
          />
          <StatCard
            icon={<Flag className="w-4 h-4" />}
            value={formattedRemainingDistance}
            label="Matkaa jäljellä"
            unit="km"
          />
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            value={Math.round(daysRemaining).toString()}
            label="Päiviä juhannukseen"
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            value={formattedProjectedDate}
            label="Nykyvauhdilla maalissa"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;

function StatCard({
  icon,
  value,
  label,
  unit,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  unit?: string;
}) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-xl p-3 flex flex-col"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="text-xs font-medium mb-1 flex items-center justify-center" style={{ color: colors.mutedText }}>
        {icon}
        <span className="ml-1">{label}</span>
      </div>
      <div className="text-center">
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold" style={{ color: colors.text }}>
            {value}
          </span>
          {unit && <span className="text-sm ml-1" style={{ color: colors.mutedText }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}
