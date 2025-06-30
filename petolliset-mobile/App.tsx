// App.tsx - Enhanced with notification and image services
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Alert, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

// Import services
import { NotificationService } from './src/services/notificationService';
import { ImageService } from './src/services/imageService';
import { OfflineStorageService } from './src/services/offlineStorageService';
import { OfflineSyncService } from './src/hooks/useOfflineSync';
import SettingsScreen from './src/screens/SettingsScreen';

const theme = {
  colors: {
    primary: '#9333ea',
    background: '#f8fafc',
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Profile tab (includes UserProfile screen)
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profiili',
          headerStyle: { backgroundColor: '#9333ea' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
        options={({ route }: { route: { params?: { username?: string } } }) => ({ 
          title: route.params?.username || 'Käyttäjä',
          headerStyle: { backgroundColor: '#9333ea' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Asetukset',
          headerStyle: { backgroundColor: '#9333ea' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Add':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Insights':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            default:
              iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: { backgroundColor: '#9333ea' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Etusivu' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Kartta' }} />
      <Tab.Screen name="Add" component={AddActivityScreen} options={{ title: 'Lisää' }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ title: 'Tilastot' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Profiili', headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Handle app state changes for offline sync
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App became active, sync offline data
        OfflineSyncService.syncOfflineData().catch(console.error);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize services
      await Promise.all([
        NotificationService.initialize(),
        ImageService.initialize(),
        OfflineStorageService.clearCache(), // Optional: clear old cache on startup
      ]);

      // Set up notification listeners
      const notificationListener = NotificationService.addNotificationReceivedListener(
        (notification) => {
          console.log('Notification received:', notification);
        }
      );

      const responseListener = NotificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log('Notification response:', response);
          handleNotificationResponse(response);
        }
      );

      setIsInitialized(true);

      // Clean up listeners
      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert(
        'Alustusvirhe',
        'Sovelluksen alustamisessa tapahtui virhe. Jotkin ominaisuudet eivät välttämättä toimi oikein.',
        [{ text: 'OK' }]
      );
      setIsInitialized(true); // Continue anyway
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    switch (data?.type) {
      case 'daily_motivation':
        // Navigate to add activity screen
        console.log('Navigate to add activity');
        break;
      case 'weekly_goal_reminder':
        // Navigate to insights screen
        console.log('Navigate to insights');
        break;
      case 'milestone':
        // Navigate to leaderboard
        console.log('Navigate to leaderboard');
        break;
      case 'activity_celebration':
        // Navigate to user profile
        console.log('Navigate to user profile:', data.username);
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  };

  if (!isInitialized) {
    // You could show a splash screen here
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfileScreen}
            options={({
              route,
            }: {
              route: { params?: { username?: string } };
            }) => ({
              title: route.params?.username || 'Käyttäjä',
              headerShown: true,
              headerStyle: { backgroundColor: '#9333ea' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            })}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Asetukset',
              headerShown: true,
              headerStyle: { backgroundColor: '#9333ea' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}