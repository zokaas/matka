// Minimal App.tsx - This should definitely work
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Simple screens for testing
const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>🏠 Home</Text>
    <Text>Welcome to Petolliset!</Text>
  </View>
);

const MapScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>🗺️ Map</Text>
    <Text>Map coming soon...</Text>
  </View>
);

const AddActivityScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>➕ Add Activity</Text>
    <Text>Add workouts here</Text>
  </View>
);

const InsightsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>📊 Insights</Text>
    <Text>Statistics coming soon...</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>👤 Profile</Text>
    <Text>Profile and settings</Text>
  </View>
);

const styles = StyleSheet.create({
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

const theme = {
  colors: {
    primary: '#9333ea',
    background: '#f8fafc',
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
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
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profiili' }} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}