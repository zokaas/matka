// src/services/apiService.ts - Updated with correct backend URL and better error handling
import { User, Activity, Quote, Comment, Reaction, ActivityWithUser } from '../types/types';

// Use your live backend URL
const BACKEND_URL = 'https://matka-zogy.onrender.com';

// Add timeout and better error handling
const TIMEOUT = 10000; // 10 seconds

// Create a fetch wrapper with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && (error as any).name === 'AbortError') {
      throw new Error('Yhteys aikakatkaistiin. Tarkista internetyhteys.');
    }
    throw error;
  }
};

// Central error handling with better messages
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'Tuntematon virhe';
    
    try {
      const errorText = await response.text();
      
      if (errorText && errorText.trim().startsWith("{")) {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || `Virhe ${response.status}`;
      } else if (errorText) {
        errorMessage = errorText;
      }
      
      // Provide user-friendly error messages
      switch (response.status) {
        case 400:
          errorMessage = 'Virheelliset tiedot. ' + errorMessage;
          break;
        case 401:
          errorMessage = 'Ei käyttöoikeutta. Kirjaudu uudelleen.';
          break;
        case 403:
          errorMessage = 'Toiminto kielletty.';
          break;
        case 404:
          errorMessage = 'Tietoja ei löydy.';
          break;
        case 500:
          errorMessage = 'Palvelinvirhe. Yritä myöhemmin uudelleen.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Palvelu ei ole käytettävissä. Yritä myöhemmin uudelleen.';
          break;
        default:
          errorMessage = `Virhe ${response.status}: ${errorMessage}`;
      }
    } catch (parseError) {
      console.error('Error parsing error response:', parseError);
      errorMessage = `Virhe ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new Error('Palvelimen vastauksen käsittely epäonnistui');
  }
};

// Test backend connection
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing connection to:', BACKEND_URL);
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`);
    const result = await handleResponse(response);
    console.log('Backend connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// User API
export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    console.log('Fetching all users from:', `${BACKEND_URL}/users`);
    const response = await fetchWithTimeout(`${BACKEND_URL}/users`);
    return handleResponse(response);
  },

  getUser: async (username: string, page: number = 1, limit: number = 10): Promise<User> => {
    console.log('Fetching user:', username);
    const response = await fetchWithTimeout(`${BACKEND_URL}/users/${username}?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  getUserActivities: async (username: string): Promise<Activity[]> => {
    console.log('Fetching activities for user:', username);
    const response = await fetchWithTimeout(`${BACKEND_URL}/users/${username}/activities/all`);
    return handleResponse(response);
  },

  addUser: async (username: string, totalKm: number = 0): Promise<User> => {
    console.log('Adding new user:', username);
    const response = await fetchWithTimeout(`${BACKEND_URL}/users`, {
      method: 'POST',
      body: JSON.stringify({ username, totalKm }),
    });
    return handleResponse(response);
  },

  getTotalKilometers: async (): Promise<{ totalKm: number }> => {
    console.log('Fetching total kilometers');
    const response = await fetchWithTimeout(`${BACKEND_URL}/total-kilometers`);
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
    console.log('Adding activity for user:', username, activityData);
    const response = await fetchWithTimeout(`${BACKEND_URL}/users/${username}/activities`, {
      method: 'POST',
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
    console.log('Updating activity:', activityId, 'for user:', username);
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: 'PUT',
        body: JSON.stringify(activityData),
      }
    );
    return handleResponse(response);
  },

  deleteActivity: async (username: string, activityId: number): Promise<User> => {
    console.log('Deleting activity:', activityId, 'for user:', username);
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: 'DELETE',
      }
    );
    return handleResponse(response);
  },

  getRecentActivities: async (limit: number = 20): Promise<ActivityWithUser[]> => {
    try {
      console.log('Fetching recent activities, limit:', limit);
      const response = await fetchWithTimeout(`${BACKEND_URL}/activities/recent?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      // Fallback to fetching from all users if new endpoint doesn't exist
      console.log('Falling back to legacy activity fetching method');
      
      try {
        const users = await userAPI.getAllUsers();
        const allActivities: ActivityWithUser[] = [];

        for (const user of users) {
          try {
            const userActivities = await userAPI.getUserActivities(user.username);
            userActivities.forEach(activity => {
              allActivities.push({
                ...activity,
                username: user.username,
                profilePicture: user.profilePicture,
              });
            });
          } catch (userError) {
            console.warn(`Failed to fetch activities for ${user.username}:`, userError);
          }
        }

        return allActivities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        throw new Error('Suoritusten lataaminen epäonnistui');
      }
    }
  },
};

// Comments API
export const commentAPI = {
  getComments: async (activityId: number): Promise<Comment[]> => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/activity/${activityId}/comments`);
    return handleResponse(response);
  },

  addComment: async (activityId: number, text: string): Promise<Comment> => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/activity/${activityId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Reactions API
export const reactionAPI = {
  getReactions: async (activityId: number): Promise<Reaction[]> => {
    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/activity/${activityId}/reactions`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      throw new Error('Reaktioiden lataaminen epäonnistui');
    }
  },

  toggleReaction: async (activityId: number, type: string): Promise<any> => {
    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/activity/${activityId}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      throw new Error('Reaktion käsittely epäonnistui');
    }
  },
};

// Quotes API
export const quoteAPI = {
  getAllQuotes: async (): Promise<Quote[]> => {
    console.log('Fetching all quotes');
    const response = await fetchWithTimeout(`${BACKEND_URL}/quotes`);
    return handleResponse(response);
  },

  addQuote: async (text: string): Promise<Quote> => {
    console.log('Adding new quote');
    const response = await fetchWithTimeout(`${BACKEND_URL}/quotes`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Health check API
export const healthAPI = {
  checkHealth: async (): Promise<{ status: string; uptime: number }> => {
    console.log('Checking backend health');
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`);
    return handleResponse(response);
  },
};

// Export convenience methods that match the web app exactly
const apiService = {
  user: userAPI,
  activity: activityAPI,
  comment: commentAPI,
  reaction: reactionAPI,
  quote: quoteAPI,
  health: healthAPI,

  // Test connection method
  testConnection,

  // Convenience methods to match web app exactly
  getAllUsers: userAPI.getAllUsers,
  getUser: userAPI.getUser,
  getUserActivities: userAPI.getUserActivities,
  addUser: userAPI.addUser,
  getTotalKilometers: userAPI.getTotalKilometers,
  
  addActivity: activityAPI.addActivity,
  updateActivity: activityAPI.updateActivity,
  deleteActivity: activityAPI.deleteActivity,
  getRecentActivities: activityAPI.getRecentActivities,
  
  getAllQuotes: quoteAPI.getAllQuotes,
  addQuote: quoteAPI.addQuote,
  
  getComments: commentAPI.getComments,
  addComment: commentAPI.addComment,
  
  getReactions: reactionAPI.getReactions,
  toggleReaction: reactionAPI.toggleReaction,
  
  checkHealth: healthAPI.checkHealth,
};

export default apiService;