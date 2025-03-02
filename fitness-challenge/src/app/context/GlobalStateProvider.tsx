import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Activity, Comment, Reaction } from "@/app/types/types";

// Define what our global state will look like
interface GlobalState {
  users: User[];
  totalKm: number;
  loading: {
    users: boolean;
    totalKm: boolean;
  };
  error: {
    users: string | null;
    totalKm: string | null;
  };
  lastUpdated: {
    users: Date | null;
    totalKm: Date | null;
  };
}

// Define the context API shape
interface GlobalStateContextType {
  state: GlobalState;
  refreshUsers: () => Promise<void>;
  refreshTotalKm: () => Promise<void>;
  refreshAll: () => Promise<void>;
  getUser: (username: string) => User | undefined;
  getUserActivities: (username: string) => Activity[];
  fetchUserDetails: (username: string) => Promise<User | null>;
  invalidateCache: () => void;
}

// Create the context with a default value
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

// Backend URL - consider moving this to an environment variable
const backendUrl = "https://matka-zogy.onrender.com";

// Provider component that will wrap your app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state
  const [state, setState] = useState<GlobalState>({
    users: [],
    totalKm: 0,
    loading: {
      users: true,
      totalKm: true,
    },
    error: {
      users: null,
      totalKm: null,
    },
    lastUpdated: {
      users: null,
      totalKm: null,
    },
  });

  // Cache time - how long before we consider the data stale (in milliseconds)
  const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  // Check if data is fresh enough or needs refreshing
  const isDataFresh = (lastUpdated: Date | null): boolean => {
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated.getTime() < CACHE_TIME;
  };

  // Fetch all users
  const fetchUsers = async (): Promise<User[]> => {
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
  };

  // Fetch total kilometers
  const fetchTotalKm = async (): Promise<number> => {
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
  };

  // Fetch a specific user's details
  const fetchUserDetails = async (username: string): Promise<User | null> => {
    try {
      const response = await fetch(
        `${backendUrl}/users/${username}?page=1&limit=1000`
      );
      if (!response.ok) throw new Error("Failed to fetch user details");

      const userData: User = await response.json();

      // Update the user in our global state
      setState((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.username === username
            ? { ...u, activities: userData.activities }
            : u
        ),
      }));

      return userData;
    } catch (err) {
      console.error("Error fetching user details:", err);
      return null;
    }
  };

  // Function to get a specific user by username
  const getUser = (username: string): User | undefined => {
    return state.users.find((user) => user.username === username);
  };

  // Function to get a user's activities
  const getUserActivities = (username: string): Activity[] => {
    const user = getUser(username);
    return user?.activities || [];
  };

  // Public function to refresh users data
  const refreshUsers = async (): Promise<void> => {
    await fetchUsers();
  };

  // Public function to refresh total kilometers
  const refreshTotalKm = async (): Promise<void> => {
    await fetchTotalKm();
  };

  // Public function to refresh all data
  const refreshAll = async (): Promise<void> => {
    await Promise.all([fetchUsers(), fetchTotalKm()]);
  };

  // Function to invalidate the cache and force a refresh
  const invalidateCache = (): void => {
    setState((prev) => ({
      ...prev,
      lastUpdated: {
        users: null,
        totalKm: null,
      },
    }));
  };

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
  }, []);

  // Create the context value
  const contextValue: GlobalStateContextType = {
    state,
    refreshUsers,
    refreshTotalKm,
    refreshAll,
    getUser,
    getUserActivities,
    fetchUserDetails,
    invalidateCache,
  };

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
