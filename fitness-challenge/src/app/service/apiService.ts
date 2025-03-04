// src/app/services/apiService.ts
import { Activity, User, Comment, Reaction, Quote } from "../types/types";

const BACKEND_URL = "https://matka-zogy.onrender.com";

// Central error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Use a try-catch block to safely handle any parsing errors
    try {
      const errorText = await response.text();
      let errorMessage;

      // Only parse as JSON if it's actually JSON format
      if (errorText && errorText.trim().startsWith("{")) {
        const errorData = JSON.parse(errorText);
        errorMessage =
          errorData.message ||
          `Error ${response.status}: ${response.statusText}`;
      } else {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    } catch (parseError) {
      // If there's any error in parsing, default to a standard error message
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  // For successful responses, check if there's any content before trying to parse
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
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
    const data = await handleResponse(response);
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
export const reactionAPI = {
  // Get reactions for an activity
  getReactions: async (activityId: number): Promise<Reaction[]> => {
    try {
      // Try regular endpoint first
      const response = await fetch(`${BACKEND_URL}/activity/${activityId}/reactions`);
      
      // If regular endpoint succeeds, parse and return the data
      if (response.ok) {
        return handleResponse(response);
      }
      
      // If it fails with 500, try the fallback endpoint
      if (response.status === 500) {
        try {
          const fallbackResponse = await fetch(`${BACKEND_URL}/activity/${activityId}/reactions/raw`);
          if (fallbackResponse.ok) {
            return handleResponse(fallbackResponse);
          }
        } catch (fallbackError) {
          console.error(`Fallback endpoint also failed:`, fallbackError);
          // Both endpoints failed, return empty array
        }
      }
      
      // If we got here, both endpoints failed or we got a non-500 error
      console.warn(`Could not load reactions for activity ${activityId}, using local reactions instead`);
      return [];
    } catch (error) {
      console.error(`Error fetching reactions for activity ${activityId}:`, error);
      // Return empty array instead of throwing to prevent UI breaking
      return [];
    }
  },

  // Add a reaction to an activity - always succeeds locally even if server fails
  toggleReaction: async (
    activityId: number,
    type: string
  ): Promise<{ added: boolean; type: string }> => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/activity/${activityId}/reactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        }
      );
      
      if (response.ok) {
        return handleResponse(response);
      }
      
      // If server fails, return success anyway to maintain UI consistency
      console.warn(`Server rejected reaction, proceeding with local-only reaction`);
      return { added: true, type };
    } catch (error) {
      console.error(`Error adding reaction to activity ${activityId}:`, error);
      // Return a mock success response to maintain UI consistency
      return { added: true, type };
    }
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
