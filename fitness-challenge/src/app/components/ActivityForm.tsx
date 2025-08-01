import React from "react";
import { useTheme } from "@/app/hooks/useTheme";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

interface Props {
  activities: Activity[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ActivityList: React.FC<Props> = ({ activities, onEdit, onDelete }) => {
  const { t } = useTheme();

  return (
    <div>
      {activities.length === 0 ? (
        <p className="text-center text-gray-500">{t.activityForm.noActivitiesFound}</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white p-4 rounded-lg shadow mb-4"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{activity.activity}</h3>
                <p className="text-sm text-gray-600">
                  {activity.kilometers.toFixed(1)} km | {activity.duration} {t.insights.mins}
                </p>
                {activity.bonus && (
                  <p className="text-sm text-slate-500">
                    🎉 Bonus: {activity.bonus}
                    {activity.bonus === "juhlapäivä"
                      ? " (2x km)"
                      : activity.bonus === "enemmän kuin kolme urheilee yhdessä"
                      ? " (1.5x km)"
                      : " (3x km)"}
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString("fi-FI")}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-slate-500"
                  onClick={() => onEdit(activity.id)}
                >
                  {t.ui.edit}
                </button>
                <button
                  className="text-red-500"
                  onClick={() => onDelete(activity.id)}
                >
                  {t.ui.delete}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityList;