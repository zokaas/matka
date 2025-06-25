
// src/components/Leaderboard.tsx - Updated with proper navigation
import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Card, Title, List, Avatar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { User } from '../types/types';
import { theme } from '../constants/theme';

interface LeaderboardProps {
  users: User[];
}
type RootStackParamList = {
  UserProfile: { username: string };
  // add other routes here if needed
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const sortedUsers = [...users].sort((a, b) => b.totalKm - a.totalKm);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  const handleUserPress = (username: string) => {
    navigation.navigate('UserProfile', { username });
  };

  const renderUser = ({ item: user, index }: { item: User; index: number }) => (
    <TouchableOpacity onPress={() => handleUserPress(user.username)}>
      <List.Item
        title={user.username}
        description={`${Math.round(user.totalKm)} km`}
        left={() => (
          <Avatar.Image
            size={50}
            source={{
              uri: user.profilePicture
                ? `https://matka-xi.vercel.app/${user.username}.png`
                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
            }}
          />
        )}
        right={() => (
          <View style={[
            styles.rankBadge,
            index < 3 && styles.medalBadge
          ]}>
            <Text style={styles.rankText}>
              {getMedal(index)}
            </Text>
          </View>
        )}
        style={[
          styles.userItem,
          index < 3 && styles.topThree
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>🏆 Sijoitukset</Title>
        <FlatList
          data={sortedUsers}
          renderItem={renderUser}
          keyExtractor={(user) => user.username}
          showsVerticalScrollIndicator={false}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  userItem: {
    paddingVertical: theme.spacing.sm,
  },
  topThree: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  rankBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.textSecondary,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  medalBadge: {
    backgroundColor: theme.colors.primary,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});