import React, { useState } from 'react';

const ActivityForm = ({ onSubmit, users = [] }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !activityType || duration <= 0) {
      alert('Please fill out all fields correctly!');
      return;
    }
    onSubmit(selectedUser, activityType, parseFloat(duration));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
      className="p-6 rounded-lg shadow-lg"
    >
      <h2 style={{ color: '#2C5F2D' }} className="text-xl font-bold mb-4">Lisää sportti</h2>

      {/* User Selection */}
      <div className="mb-4">
        <label style={{ color: '#374151' }} className="block text-sm font-medium mb-2">Valitse käyttäjä</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ border: '1px solid #D1D5DB' }}
          className="block w-full px-3 py-2 rounded-md shadow-sm"
        >
          <option value="" disabled>
            Choose a user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Dropdown */}
      <div className="mb-4">
        <label style={{ color: '#374151' }} className="block text-sm font-medium mb-2">Valitse laji</label>
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          style={{ border: '1px solid #D1D5DB' }}
          className="block w-full px-3 py-2 rounded-md shadow-sm"
        >
          <option value="" disabled>
            Valitse
          </option>
          {["Juoksu", "Sali", "Tennis", "Pyöräily", "Hiihto", "Uinti", "Crossfit", "Tribe", "Ryhmä, pump", "Ryhmä, dance", "Ryhmä, combat", "Spinning", "Squash", "Sulkapallo", "Padel", "Jooga", "Liikkuvuus", "Golf", "Muu", "Ryhmä, HIIT", "Kehonpainotreeni", "Jalkapallo", "Jääkiekko", "Kamppailulaji"].map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>
      </div>

      {/* Duration Input */}
      <div className="mb-4">
        <label style={{ color: '#374151' }} className="block text-sm font-medium mb-2">
          Kesto (h)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ border: '1px solid #D1D5DB' }}
          className="block w-full px-3 py-2 rounded-md shadow-sm"
        />
      </div>

      <button
        type="submit"
        style={{ backgroundColor: '#2C5F2D', color: '#FFFFFF' }}
        className="w-full py-2 px-4 rounded-md shadow hover:bg-green-800"
      >
        Add Activity
      </button>
    </form>
  );
};

export default ActivityForm;