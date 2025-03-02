"use client";

import { useState, useEffect, useCallback } from "react";
import { useGlobalState } from "../context/GlobalStateProvider";
import { Activity, UserWithPagination } from "../types/types";

export const useUserProfile = (
  username: string,
  page: number = 1,
  itemsPerPage: number = 10
) => {
  const { state, getUser, getUserActivities, clearActivityCache } =
    useGlobalState();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
  }>({
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user from global state
  const user = getUser(username);

  // Fetch activities using the global state
  const fetchActivities = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    try {
      // Get all activities from global state (cached or from API)
      const allActivities = await getUserActivities(username);

      // Apply pagination locally
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedActivities = allActivities.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setActivities(paginatedActivities);
      setPagination({
        total: allActivities.length,
        totalPages: Math.ceil(allActivities.length / itemsPerPage),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [username, page, itemsPerPage, getUserActivities]);

  // Fetch activities when parameters change
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Helper function to clear cache and refresh data
  const refreshActivities = useCallback(() => {
    if (username) {
      clearActivityCache(username);
      fetchActivities();
    }
  }, [username, clearActivityCache, fetchActivities]);

  // Combine user and activities data
  const userData: UserWithPagination | null = user
    ? {
        ...user,
        activities,
        pagination: {
          total: pagination.total,
          page,
          limit: itemsPerPage,
          totalPages: pagination.totalPages,
        },
      }
    : null;

  return {
    user: userData,
    loading: state.loading.users || loading,
    error: error || state.error.users || null,
    refreshActivities,
  };
};
