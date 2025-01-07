const ActivityHistory = ({ activities, onDelete, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Activity History</h2>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">{activity.activityType}</p>
              <p className="text-sm text-gray-600">
                {new Date(activity.date).toLocaleDateString()} - {activity.points} km
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(activity)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(activity.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ActivityHistory;