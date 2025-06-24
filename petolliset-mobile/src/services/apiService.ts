// src/services/apiService.ts - Updated to match web app
import { User, Activity, Quote, Comment, Reaction } from '../types/types';

const BACKEND_URL = 'https://matka-zogy.onrender.com'; // Same as web app

// Central error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorText = await response.text();
      let errorMessage;

      if (errorText && errorText.trim().startsWith("{")) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
      } else {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    } catch (parseError) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new Error('Failed to parse server response');
  }
};

// User API
export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${BACKEND_URL}/users`);
    return handleResponse(response);
  },

  getUser: async (username: string, page: number = 1, limit: number = 10): Promise<User> => {
    const response = await fetch(`${BACKEND_URL}/users/${username}?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  getUserActivities: async (username: string): Promise<Activity[]> => {
    const response = await fetch(`${BACKEND_URL}/users/${username}/activities/all`);
    return handleResponse(response);
  },

  addUser: async (username: string, totalKm: number = 0): Promise<User> => {
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, totalKm }),
    });
    return handleResponse(response);
  },

  getTotalKilometers: async (): Promise<{ totalKm: number }> => {
    const response = await fetch(`${BACKEND_URL}/total-kilometers`);
    return handleResponse(response);
  },
};

// Activity API
export const activityAPI = {
  addActivity: async (
    username: string,
    activityData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    }
  ): Promise<{ activity: Activity; user: User }> => {
    const response = await fetch(`${BACKEND_URL}/users/${username}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData),
    });
    return handleResponse(response);
  },

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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      }
    );
    return handleResponse(response);
  },

  deleteActivity: async (username: string, activityId: number): Promise<User> => {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return handleResponse(response);
  },

  getRecentActivities: async (limit: number = 20): Promise<Activity[]> => {
    const response = await fetch(`${BACKEND_URL}/activities/recent?limit=${limit}`);
    return handleResponse(response);
  },
};

// Comments API
export const commentAPI = {
  getComments: async (activityId: number): Promise<Comment[]> => {
    const response = await fetch(`${BACKEND_URL}/activity/${activityId}/comments`);
    return handleResponse(response);
  },

  addComment: async (activityId: number, text: string): Promise<Comment> => {
    const response = await fetch(`${BACKEND_URL}/activity/${activityId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Reactions API
export const reactionAPI = {
  getReactions: async (activityId: number): Promise<Reaction[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/activity/${activityId}/reactions`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      throw new Error('Failed to fetch reactions');
    }
  },

  toggleReaction: async (activityId: number, type: string): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/activity/${activityId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      throw new Error('Failed to process reaction request');
    }
  },
};

// Quotes API
export const quoteAPI = {
  getAllQuotes: async (): Promise<Quote[]> => {
    const response = await fetch(`${BACKEND_URL}/quotes`);
    return handleResponse(response);
  },

  addQuote: async (text: string): Promise<Quote> => {
    const response = await fetch(`${BACKEND_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Health check API
export const healthAPI = {
  checkHealth: async (): Promise<{ status: string; uptime: number }> => {
    const response = await fetch(`${BACKEND_URL}/health`);
    return handleResponse(response);
  },
};

// Export default object with all APIs
const apiService = {
  user: userAPI,
  activity: activityAPI,
  comment: commentAPI,
  reaction: reactionAPI,
  quote: quoteAPI,
  health: healthAPI,
};

export default apiService;