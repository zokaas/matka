"use client";

import { useEffect } from "react";
import { useGlobalState } from "../context/GlobalStateProvider";

export const useLeaderboard = () => {
  const { state, refreshUsers } = useGlobalState();
  const { users, loading, error, lastUpdated } = state;

  // Fetch users if needed
  useEffect(() => {
    if (!loading.users && !lastUpdated.users) {
      refreshUsers();
    }
  }, [loading.users, refreshUsers, lastUpdated.users]);

  // Sort users by total kilometers
  const sortedUsers = [...users].sort((a, b) => b.totalKm - a.totalKm);

  return {
    users: sortedUsers,
    loading: loading.users,
    error: error.users,
    refresh: refreshUsers,
  };
};
