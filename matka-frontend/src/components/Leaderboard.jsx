import React from 'react';

const Leaderboard = ({ users = [] }) => {
  // Sort users by points in descending order
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Top Contributors</h2>
      {sortedUsers.length > 0 ? (
        <ul className="space-y-2">
          {sortedUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-green-600">{Math.round(user.points)} km</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No activities recorded yet</p>
      )}
    </div>
  );
};

export default Leaderboard;