import React from 'react';

const UserList = ({ users }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Käyttäjät ja pisteet</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.name}: {user.total_points} pistettä
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
