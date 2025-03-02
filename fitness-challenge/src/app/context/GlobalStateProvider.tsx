"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { User, Activity, WeeklyInsight, TargetPaces } from "@/app/types/types";
import { useCalculateStats } from "../hooks/useCalculateStats";

// Define what our global state will look like
interface GlobalState {
  users: User[];
  totalKm: number;
  activities: Record<string, Activity[]>; // Cache for user activities
  weeklyInsights: WeeklyInsight[];
  targetPaces: TargetPaces | null;
  loading: {
    users: boolean;
    totalKm: boolean;
    activities: Record<string, boolean>; // Loading state per username
  };
  error: {
    users: string | null;
    totalKm: string | null;
    activities: Record<string, string | null>; // Error state per username
  };
  lastUpdated: {
    users: Date | null;
    totalKm: Date | null;
    activities: Record<string, Date | null>; // Last updated timestamp per username
  };
}

// Define the context API shape
interface GlobalStateContextType {
  state: GlobalState;
  refreshUsers: () => Promise<void>;
  refreshTotalKm: () => Promise<void>;
  refreshAll: () => Promise<void>;
  getUser: (username: string) => User | undefined;
  getUserActivities: (username: string) => Promise<Activity[]>;
  invalidateCache: () => void;
  clearActivityCache: (username: string) => void;
}

// Create the context with a default value
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

// Backend URL
const backendUrl = "https://matka-zogy.onrender.com";

// Cache time - how long before we consider the data stale (in milliseconds)
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Provider component that will wrap your app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state
  const [state, setState] = useState<GlobalState>({
    users: [],
    totalKm: 0,
    activities: {},
    weeklyInsights: [],
    targetPaces: null,
    loading: {
      users: true,
      totalKm: true,
      activities: {},
    },
    error: {
      users: null,
      totalKm: null,
      activities: {},
    },
    lastUpdated: {
      users: null,
      totalKm: null,
      activities: {},
    },
  });

  // Calculate target paces using the useCalculateStats hook
  const targetPaces = useCalculateStats(state.users);

  // Update target paces in state when they change
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      targetPaces,
    }));
  }, [targetPaces]);

  // Check if data is fresh enough or needs refreshing
  const isDataFresh = useCallback((lastUpdated: Date | null): boolean => {
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated.getTime() < CACHE_TIME;
  }, []);

  // Fetch all users
  const fetchUsers = useCallback(async (): Promise<User[]> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, users: true },
        error: { ...prev.error, users: null },
      }));

      const response = await fetch(`${backendUrl}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data: User[] = await response.json();

      setState((prev) => ({
        ...prev,
        users: data,
        loading: { ...prev.loading, users: false },
        lastUpdated: { ...prev.lastUpdated, users: new Date() },
      }));

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, users: false },
        error: { ...prev.error, users: errorMessage },
      }));
      return [];
    }
  }, []);

  // Fetch total kilometers
  const fetchTotalKm = useCallback(async (): Promise<number> => {
    try {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, totalKm: true },
        error: { ...prev.error, totalKm: null },
      }));

      const response = await fetch(`${backendUrl}/total-kilometers`);
      if (!response.ok) throw new Error("Failed to fetch total kilometers");

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        totalKm: data.totalKm,
        loading: { ...prev.loading, totalKm: false },
        lastUpdated: { ...prev.lastUpdated, totalKm: new Date() },
      }));

      return data.totalKm;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, totalKm: false },
        error: { ...prev.error, totalKm: errorMessage },
      }));
      return 0;
    }
  }, []);

  // Fetch a specific user's activities
  const fetchUserActivities = useCallback(
    async (username: string): Promise<Activity[]> => {
      try {
        setState((prev) => ({
          ...prev,
          loading: {
            ...prev.loading,
            activities: {
              ...prev.loading.activities,
              [username]: true,
            },
          },
          error: {
            ...prev.error,
            activities: {
              ...prev.error.activities,
              [username]: null,
            },
          },
        }));

        const response = await fetch(
          `${backendUrl}/users/${username}?page=1&limit=1000`
        );
        if (!response.ok) throw new Error("Failed to fetch user activities");

        const userData = await response.json();
        const activities = userData.activities || [];

        setState((prev) => ({
          ...prev,
          activities: {
            ...prev.activities,
            [username]: activities,
          },
          loading: {
            ...prev.loading,
            activities: {
              ...prev.loading.activities,
              [username]: false,
            },
          },
          lastUpdated: {
            ...prev.lastUpdated,
            activities: {
              ...prev.lastUpdated.activities,
              [username]: new Date(),
            },
          },
        }));

        return activities;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setState((prev) => ({
          ...prev,
          loading: {
            ...prev.loading,
            activities: {
              ...prev.loading.activities,
              [username]: false,
            },
          },
          error: {
            ...prev.error,
            activities: {
              ...prev.error.activities,
              [username]: errorMessage,
            },
          },
        }));
        return [];
      }
    },
    []
  );

  // Function to get a specific user by username
  const getUser = useCallback(
    (username: string): User | undefined => {
      return state.users.find((user) => user.username === username);
    },
    [state.users]
  );

  // Function to get a user's activities with caching
  const getUserActivities = useCallback(
    async (username: string): Promise<Activity[]> => {
      // Check if we already have fresh cached activities
      const cachedActivities = state.activities[username];
      const lastUpdated = state.lastUpdated.activities[username];

      if (cachedActivities && isDataFresh(lastUpdated)) {
        return cachedActivities;
      }

      // Otherwise fetch from API
      return fetchUserActivities(username);
    },
    [
      state.activities,
      state.lastUpdated.activities,
      isDataFresh,
      fetchUserActivities,
    ]
  );

  // Public function to refresh users data
  const refreshUsers = useCallback(async (): Promise<void> => {
    await fetchUsers();
  }, [fetchUsers]);

  // Public function to refresh total kilometers
  const refreshTotalKm = useCallback(async (): Promise<void> => {
    await fetchTotalKm();
  }, [fetchTotalKm]);

  // Public function to refresh all data
  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([fetchUsers(), fetchTotalKm()]);
  }, [fetchUsers, fetchTotalKm]);

  // Function to invalidate the cache and force a refresh
  const invalidateCache = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      lastUpdated: {
        users: null,
        totalKm: null,
        activities: {},
      },
    }));
  }, []);

  // Function to clear activity cache for a specific user
  const clearActivityCache = useCallback((username: string): void => {
    setState((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [username]: [],
      },
      lastUpdated: {
        ...prev.lastUpdated,
        activities: {
          ...prev.lastUpdated.activities,
          [username]: null,
        },
      },
    }));
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isDataFresh(state.lastUpdated.users)) {
        await fetchUsers();
      }

      if (!isDataFresh(state.lastUpdated.totalKm)) {
        await fetchTotalKm();
      }
    };

    loadInitialData();
  }, [
    fetchTotalKm,
    fetchUsers,
    isDataFresh,
    state.lastUpdated.totalKm,
    state.lastUpdated.users,
  ]);

  // Create the context value
  const contextValue = useMemo<GlobalStateContextType>(
    () => ({
      state,
      refreshUsers,
      refreshTotalKm,
      refreshAll,
      getUser,
      getUserActivities,
      invalidateCache,
      clearActivityCache,
    }),
    [
      state,
      refreshUsers,
      refreshTotalKm,
      refreshAll,
      getUser,
      getUserActivities,
      invalidateCache,
      clearActivityCache,
    ]
  );

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
