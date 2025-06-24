// App.tsx - Updated with proper navigation structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import AddActivityScreen from './src/screens/AddActivityScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';

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
        options={({
          route,
        }: {
          route: { params?: { username?: string } };
        }) => ({
          title: route.params?.username || 'Käyttäjä',
          headerStyle: { backgroundColor: '#9333ea' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
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
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
