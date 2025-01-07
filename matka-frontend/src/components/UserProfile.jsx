import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((error) => console.error('Error fetching user data:', error.message));
  }, [id]);

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.25rem' }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5', backgroundColor: '#F9FAFB', padding: '1rem' }}>
      {/* Banner Section */}
      <section
        style={{
          backgroundColor: '#2C5F2D',
          color: '#F5F5DC',
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{userData.name}</h1>
        <p style={{ fontSize: '1rem' }}>Total Points: {userData.total_points}</p>
      </section>

      {/* Activities Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C5F2D', marginBottom: '1rem' }}>Activities</h2>
        {userData.activities.length > 0 ? (
          <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
            {userData.activities.map((activity, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: '#F9FAFB',
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <strong style={{ color: '#2C5F2D' }}>{activity.activityType}</strong> - {activity.points} km (
                {new Date(activity.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', color: '#4C7C5A', fontSize: '1rem' }}>
            No activities yet. Start your journey!
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
