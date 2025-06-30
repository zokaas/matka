// App.tsx - Minimal Expo-safe version
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Platform, Alert } from 'react-native';


// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { theme } from './src/constants/theme';

// Simple Paper theme
const paperTheme = {
  colors: {
    primary: theme.colors.primary,
    onPrimary: theme.colors.textOnPrimary,
    primaryContainer: theme.colors.primaryLight,
    background: theme.colors.background,
    surface: theme.colors.surface,
    onSurface: theme.colors.text,
    outline: theme.colors.border,
    error: theme.colors.error,
  },
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
            Oops! Jotain meni pieleen
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center', color: '#666' }}>
            Käynnistä sovellus uudelleen
          </Text>
        </View>
      );
    }

    return (this.props as any).children;
  }
}

// Loading Screen
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.colors.background 
  }}>
    <Text style={{ 
      fontSize: 18, 
      color: theme.colors.text,
      marginTop: 16 
    }}>
      Ladataan...
    </Text>
  </View>
);

// Main tabs with safe icon handling
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'circle';

          try {
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Add':
                iconName = focused ? 'add-circle' : 'add-circle-outline';
                break;
              case 'Insights':
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          } catch (error) {
            console.warn('Icon error:', iconName, error);
            return <Ionicons name="help" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: { 
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { 
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Koti',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="Add" 
        component={AddActivityScreen} 
        options={{ 
          title: 'Lisää',
        }} 
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{ 
          title: 'Tilastot',
          headerShown: false,
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profiili',
        }} 
      />
    </Tab.Navigator>
  );
}

// App navigator
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App component
export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simple initialization
    const initializeApp = async () => {
      try {
        console.log('App initializing...');
        // Minimal initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('App initialized');
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization error:', error);
        Alert.alert('Alustusvirhe', 'Sovelluksen käynnistäminen epäonnistui');
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}