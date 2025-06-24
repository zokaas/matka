// App.tsx - Simplified version without gesture handler
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Placeholder screens for now - we'll create these
const HomeScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🏠 Home Screen</Text>
      <Text>Welcome to Petolliset!</Text>
    </View>
  );
};

const MapScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🗺️ Map Screen</Text>
      <Text>World map coming soon...</Text>
    </View>
  );
};

const AddActivityScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>➕ Add Activity</Text>
      <Text>Add your workouts here</Text>
    </View>
  );
};

const InsightsScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📊 Insights</Text>
      <Text>Statistics and analytics</Text>
    </View>
  );
};

const ProfileScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profile</Text>
      <Text>Your profile and settings</Text>
    </View>
  );
};

const UserProfileScreen = () => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>User Profile Details</Text>
    </View>
  );
};

const styles = require('react-native').StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#9333ea',
  },
});

// Theme for React Native Paper
const theme = {
  colors: {
    primary: '#9333ea',
    primaryContainer: '#a855f7',
    secondary: '#06b6d4',
    surface: '#ffffff',
    background: '#f8fafc',
  },
};

// Type definitions for navigation
export type RootStackParamList = {
  Main: undefined;
  UserProfile: { username: string };
};

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Add: undefined;
  Insights: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#9333ea',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#9333ea',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Etusivu' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Kartta' }}
      />
      <Tab.Screen 
        name="Add" 
        component={AddActivityScreen} 
        options={{ title: 'Lisää' }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{ title: 'Tilastot' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profiili' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfileScreen}
            options={({ route }) => ({ 
              title: route.params?.username || 'Käyttäjäprofiili',
              headerStyle: {
                backgroundColor: '#9333ea',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}