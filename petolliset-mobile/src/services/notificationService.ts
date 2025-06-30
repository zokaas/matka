// src/services/notificationService.ts - Fixed version with correct types
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  type: 'activity_added' | 'weekly_goal' | 'milestone' | 'motivation' | 'leaderboard';
  title: string;
  body: string;
  data?: any;
}

export class NotificationService {
  private static readonly TOKEN_KEY = 'expo_push_token';
  private static readonly PREFERENCES_KEY = 'notification_preferences';

  // Configure notification behavior
  static configure() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  // Register for push notifications
  static async registerForPushNotifications(): Promise<string | null> {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9333ea',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        await AsyncStorage.setItem(this.TOKEN_KEY, token);
        console.log('Push token:', token);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Get stored push token
  static async getStoredPushToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting stored push token:', error);
      return null;
    }
  }

  // Schedule local notification
  static async scheduleNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: 'default',
      },
      trigger: trigger || null,
    });

    return notificationId;
  }

  // Schedule daily motivation notification
  static async scheduleDailyMotivation(hour: number = 8, minute: number = 0): Promise<void> {
    // Cancel existing daily notifications
    await this.cancelNotificationsByType('motivation');

    const motivationalMessages = [
      'Aika liikuttaa kehoa! 💪',
      'Maailman ympäri -matka odottaa! 🌍',
      'Tänään on loistava päivä urheiluun! ⭐',
      'Joka askel vie lähemmäksi tavoitetta! 🎯',
      'Petolliset tarvitsee sinua! 🔥',
      'Liikunta on paras lääke! 💊',
      'Tee tänään jotain tulevalle itsellesi! 🚀',
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    await this.scheduleNotification(
      {
        type: 'motivation',
        title: 'Petolliset 🔥',
        body: randomMessage,
        data: { type: 'daily_motivation' },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        hour,
        minute,
      } as Notifications.CalendarTriggerInput
    );
  }

  // Schedule weekly goal reminder
  static async scheduleWeeklyGoalReminder(): Promise<void> {
    // Cancel existing weekly notifications
    await this.cancelNotificationsByType('weekly_goal');

    // Schedule for every Monday at 9 AM
    await this.scheduleNotification(
      {
        type: 'weekly_goal',
        title: 'Uusi viikko alkaa! 📅',
        body: 'Katso viikkotavoitteesi ja suunnittele treenit! 💪',
        data: { type: 'weekly_goal_reminder' },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        weekday: 2, // Monday
        hour: 9,
        minute: 0,
      } as Notifications.CalendarTriggerInput
    );
  }

  // Send milestone notification
  static async sendMilestoneNotification(
    username: string,
    milestone: number,
    totalKm: number
  ): Promise<void> {
    await this.scheduleNotification({
      type: 'milestone',
      title: 'Mahtava suoritus! 🎉',
      body: `${username} saavutti ${milestone} km! Kokonaistavoite: ${Math.round(totalKm)} km`,
      data: { 
        type: 'milestone',
        username,
        milestone,
        totalKm 
      },
    });
  }

  // Send leaderboard update notification
  static async sendLeaderboardNotification(
    username: string,
    position: number,
    change: 'up' | 'down' | 'same'
  ): Promise<void> {
    let title = 'Sijoitukset päivittyneet! 📊';
    let body = '';

    switch (change) {
      case 'up':
        body = `${username} nousi sijalle ${position}! 📈`;
        break;
      case 'down':
        body = `${username} putosi sijalle ${position} 📉`;
        break;
      default:
        body = `${username} on edelleen sijalla ${position} 🎯`;
    }

    await this.scheduleNotification({
      type: 'leaderboard',
      title,
      body,
      data: { 
        type: 'leaderboard_update',
        username,
        position,
        change 
      },
    });
  }

  // Send activity celebration notification
  static async sendActivityCelebration(
    username: string,
    activity: string,
    kilometers: number
  ): Promise<void> {
    const celebrations = [
      '🔥 Mahtavaa!',
      '💪 Loistavaa!',
      '⭐ Hienoa!',
      '🎯 Erinomaista!',
      '🚀 Upeaa!',
    ];

    const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];

    await this.scheduleNotification({
      type: 'activity_added',
      title: randomCelebration,
      body: `${username} suoritti ${activity} (${kilometers.toFixed(1)} km)`,
      data: { 
        type: 'activity_celebration',
        username,
        activity,
        kilometers 
      },
    });
  }

  // Cancel notifications by type
  static async cancelNotificationsByType(type: string): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === type) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  // Cancel all notifications
  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get notification preferences
  static async getNotificationPreferences(): Promise<{
    dailyMotivation: boolean;
    weeklyGoals: boolean;
    milestones: boolean;
    leaderboard: boolean;
    activities: boolean;
    dailyTime: { hour: number; minute: number };
  }> {
    try {
      const preferences = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      if (preferences) {
        return JSON.parse(preferences);
      }
    } catch (error) {
      console.error('Error getting notification preferences:', error);
    }

    // Default preferences
    return {
      dailyMotivation: true,
      weeklyGoals: true,
      milestones: true,
      leaderboard: false,
      activities: true,
      dailyTime: { hour: 8, minute: 0 },
    };
  }

  // Update notification preferences
  static async updateNotificationPreferences(preferences: {
    dailyMotivation?: boolean;
    weeklyGoals?: boolean;
    milestones?: boolean;
    leaderboard?: boolean;
    activities?: boolean;
    dailyTime?: { hour: number; minute: number };
  }): Promise<void> {
    try {
      const currentPreferences = await this.getNotificationPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updatedPreferences));

      // Update scheduled notifications based on new preferences
      await this.updateScheduledNotifications(updatedPreferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  }

  // Update scheduled notifications based on preferences
  private static async updateScheduledNotifications(preferences: any): Promise<void> {
    // Cancel all existing scheduled notifications
    await this.cancelAllNotifications();

    // Reschedule based on preferences
    if (preferences.dailyMotivation) {
      await this.scheduleDailyMotivation(
        preferences.dailyTime.hour,
        preferences.dailyTime.minute
      );
    }

    if (preferences.weeklyGoals) {
      await this.scheduleWeeklyGoalReminder();
    }
  }

  // Handle notification received (when app is in foreground)
  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Handle notification response (when user taps notification)
  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Initialize notification service
  static async initialize(): Promise<void> {
    this.configure();
    await this.registerForPushNotifications();
    
    const preferences = await this.getNotificationPreferences();
    await this.updateScheduledNotifications(preferences);
  }
}