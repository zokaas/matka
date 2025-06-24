// src/services/apiService.ts
import { User, Activity, Quote, Comment, Reaction } from '../types/types';

const BACKEND_URL = 'https://matka-zogy.onrender.com';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText && errorText.trim().startsWith('{')) {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (parseError) {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    try {
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error('Failed to parse server response');
    }
  }

  // User APIs
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${BACKEND_URL}/users`);
    return this.handleResponse<User[]>(response);
  }

  async getUser(username: string, page: number = 1, limit: number = 10): Promise<User> {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}?page=${page}&limit=${limit}`
    );
    return this.handleResponse<User>(response);
  }

  async getUserActivities(username: string): Promise<Activity[]> {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/all`
    );
    return this.handleResponse<Activity[]>(response);
  }

  async addUser(username: string, totalKm: number = 0): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, totalKm }),
    });
    return this.handleResponse<User>(response);
  }

  async getTotalKilometers(): Promise<{ totalKm: number }> {
    const response = await fetch(`${BACKEND_URL}/total-kilometers`);
    return this.handleResponse<{ totalKm: number }>(response);
  }

  // Activity APIs
  async addActivity(
    username: string,
    activityData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    }
  ): Promise<{ activity: Activity; user: User }> {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      }
    );
    return this.handleResponse<{ activity: Activity; user: User }>(response);
  }

  async updateActivity(
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
  }> {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      }
    );
    return this.handleResponse<{
      message: string;
      updatedActivity: Activity;
      updatedTotalKm: number;
    }>(response);
  }

  async deleteActivity(username: string, activityId: number): Promise<User> {
    const response = await fetch(
      `${BACKEND_URL}/users/${username}/activities/${activityId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return this.handleResponse<User>(response);
  }

  // Recent activities
  async getRecentActivities(limit: number = 20): Promise<Activity[]> {
    const response = await fetch(
      `${BACKEND_URL}/activities/recent?limit=${limit}`
    );
    return this.handleResponse<Activity[]>(response);
  }

  // Comments APIs
  async getComments(activityId: number): Promise<Comment[]> {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/comments`
    );
    return this.handleResponse<Comment[]>(response);
  }

  async addComment(activityId: number, text: string): Promise<Comment> {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      }
    );
    return this.handleResponse<Comment>(response);
  }

  // Reactions APIs
  async getReactions(activityId: number): Promise<Reaction[]> {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/reactions`
    );
    return this.handleResponse<Reaction[]>(response);
  }

  async toggleReaction(activityId: number, type: string): Promise<any> {
    const response = await fetch(
      `${BACKEND_URL}/activity/${activityId}/reactions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      }
    );
    return this.handleResponse<any>(response);
  }

  // Quotes APIs
  async getAllQuotes(): Promise<Quote[]> {
    const response = await fetch(`${BACKEND_URL}/quotes`);
    return this.handleResponse<Quote[]>(response);
  }

  async addQuote(text: string): Promise<Quote> {
    const response = await fetch(`${BACKEND_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return this.handleResponse<Quote>(response);
  }

  // Health check
  async checkHealth(): Promise<{ status: string; uptime: number }> {
    const response = await fetch(`${BACKEND_URL}/health`);
    return this.handleResponse<{ status: string; uptime: number }>(response);
  }
}

export default new ApiService();