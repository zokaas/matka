import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import io from 'socket.io-client';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';

const socket = io('http://localhost:3000');

function App() {
  const [progress, setProgress] = useState(0); // Total points
  const [users, setUsers] = useState([]);
  const [route, setRoute] = useState([]);

  // Fetch initial data (users and progress)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:3000/users');
        if (!usersResponse.ok) throw new Error(`Users fetch failed: ${usersResponse.status}`);
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const progressResponse = await fetch('http://localhost:3000/progress');
        if (!progressResponse.ok) throw new Error(`Progress fetch failed: ${progressResponse.status}`);
        const progressData = await progressResponse.json();

        setProgress(progressData.totalPoints);
        setRoute(progressData.route);
      } catch (error) {
        console.error('Error during initial data fetch:', error.message);
      }
    };

    fetchInitialData();
  }, []);

  // Update route and progress dynamically with Socket.IO
  useEffect(() => {
    socket.on('ROUTE_UPDATE', (data) => {
      console.log('Received route update via socket:', data);
      if (data.totalPoints && data.route) {
        setProgress(data.totalPoints);
        setRoute(data.route);
      }
    });

    return () => {
      socket.off('ROUTE_UPDATE');
    };
  }, []);

  const handleActivitySubmit = async (userId, activityType, duration) => {
    try {
      const response = await fetch('http://localhost:3000/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, activityType, duration }),
      });

      if (!response.ok) throw new Error(`Activity submission failed: ${response.status}`);
      const updatedProgress = await response.json();

      const progressResponse = await fetch('http://localhost:3000/progress');
      if (!progressResponse.ok) throw new Error(`Progress fetch failed: ${progressResponse.status}`);
      const progressData = await progressResponse.json();

      setProgress(progressData.totalPoints);
      setRoute(progressData.route);
    } catch (error) {
      console.error('Error submitting activity:', error.message);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCWN3NhfmX5svzs3lknU5Y2FyoiEPNyWYM">
      <Router>
        <Header />
        <Navigation users={users} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                progress={progress}
                route={route}
                onSubmit={handleActivitySubmit}
                users={users}
              />
            }
          />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

export default App;
