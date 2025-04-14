// src/app/services/apiService.ts
import { Activity, User, Comment, Reaction, Quote, ReactionResponse } from "../types/types";

const BACKEND_URL = "https://matka-zogy.onrender.com";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Extract error details if possible
    try {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    } catch {
      // If parsing fails, use standard error
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  // For empty responses (like 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Parse JSON for non-empty responses
  try {
    return await response.json();
  } catch (parseError) {
    console.error("Error parsing response:", parseError);
    throw new Error("Failed to parse server response");
  }
};

/**
 * User-related API calls
 */
export const userAPI = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${BACKEND_URL}/users`);
    return handleResponse(response);
  },

  // Get a specific user with pagination
  getUser: async (
    username: string,
    page: number = 1,
    limit: number = 10
  ): Promise<User> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}?page=${page}&limit=${limit}`
    );
    return handleResponse(response);
  },

  // Get all activities for a user
  getUserActivities: async (username: string): Promise<Activity[]> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/all`
    );
    return handleResponse(response);
  },

  // Add a new user
  addUser: async (username: string, totalKm: number = 0): Promise<User> => {
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, totalKm }),
    });
    return handleResponse(response);
  },

  // Get total kilometers for all users
  getTotalKilometers: async (): Promise<number> => {
    const response = await fetch(`${BACKEND_URL}/total-kilometers`);
    const data = await handleResponse<{ totalKm: number }>(response);
    return data.totalKm;
  },
};

/**
 * Activity-related API calls
 */
export const activityAPI = {
  // Add a new activity
  addActivity: async (
    username: string,
    activityData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    }
  ): Promise<{ activity: Activity; user: User }> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      }
    );
    return handleResponse(response);
  },

  // Update an existing activity
  updateActivity: async (
    username: string,
    activityId: number,
    activityData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    }
  ): Promise<{
    message: string;
    updatedActivity: Activity;
    updatedTotalKm: number;
  }> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      }
    );
    return handleResponse(response);
  },

  // Delete an activity
  deleteActivity: async (
    username: string,
    activityId: number
  ): Promise<User> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    return handleResponse(response);
  },
};

/**
 * Comments-related API calls
 */
export const commentAPI = {
  // Get comments for an activity
  getComments: async (activityId: number): Promise<Comment[]> => {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/comments`
    );
    return handleResponse(response);
  },

  // Add a comment to an activity
  addComment: async (activityId: number, text: string): Promise<Comment> => {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    return handleResponse(response);
  },
};


/**
 * Reactions-related API calls
 */
// Consistent error handling for reactionAPI
export const reactionAPI = {
  // Get reactions for an activity
  getReactions: async (activityId: number): Promise<Reaction[]> => {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/reactions`
    );
    return handleResponse(response);
  },

  // Toggle a reaction on an activity
  toggleReaction: async (
    activityId: number,
    type: string
  ): Promise<ReactionResponse> => {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/reactions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      }
    );
    return handleResponse(response);
  },
};
/**
 * Quotes-related API calls
 */
export const quoteAPI = {
  // Get all quotes
  getAllQuotes: async (): Promise<Quote[]> => {
    const response = await fetch(`${BACKEND_URL}/quotes`);
    return handleResponse(response);
  },

  // Add a new quote
  addQuote: async (text: string): Promise<Quote> => {
    const response = await fetch(`${BACKEND_URL}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Health check API
export const healthAPI = {
  // Check backend health
  checkHealth: async (): Promise<{ status: string; uptime: number }> => {
    const response = await fetch(`${BACKEND_URL}/health`);
    return handleResponse(response);
  },
};

// Export a default object with all APIs
const apiService = {
  user: userAPI,
  activity: activityAPI,
  comment: commentAPI,
  reaction: reactionAPI,
  quote: quoteAPI,
  health: healthAPI,
};

export default apiService;
