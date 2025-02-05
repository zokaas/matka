import React from "react";

interface Activity {
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
}

interface Props {
  activities: Activity[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const ActivityList: React.FC<Props> = ({ activities, onEdit, onDelete }) => {
  return (
    <div>
      {activities.length === 0 ? (
        <p className="text-center text-gray-500">No activities found.</p>
      ) : (
        activities.map((activity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{activity.activity}</h3>
                <p className="text-sm text-gray-600">
                  {activity.kilometers.toFixed(1)} km | {activity.duration} mins
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString("fi-FI")}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="text-purple-500" onClick={() => onEdit(index)}>
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => onDelete(index)}
                >
                  Delete
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
