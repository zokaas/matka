// src/types/navigation.ts - Proper navigation types
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  UserProfile: { username: string };
};

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Add: undefined;
  Insights: undefined;
  Profile: undefined;
  ProfileMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  UserProfile: { username: string };
};

// Navigation prop types
export type HomeScreenNavigationProp = StackNavigationProp<TabParamList, 'Home'>;
export type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;
export type UserProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserProfile'>;

// Route prop types
export type UserProfileScreenRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;