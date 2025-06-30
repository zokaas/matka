// src/screens/ProfileScreen.tsx - Simplified with authentication context
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Avatar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../hooks/useUser';
import { theme } from '../constants/theme';

type RootStackParamList = {
  UserProfile: { username: string };
  Settings: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { user: authUser, logout, recentUsers, switchUser } = useAuth();
  const { user: userProfile, loading } = useUser(authUser?.username || null);
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Kirjaudu ulos',
      'Haluatko varmasti kirjautua ulos?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Kirjaudu ulos',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleSwitchUser = (username: string) => {
    Alert.alert(
      'Vaihda käyttäjää',
      `Haluatko vaihtaa käyttäjään ${username}?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Vaihda',
          onPress: async () => {
            const result = await switchUser(username);
            if (!result.success) {
              Alert.alert('Virhe', result.error || 'Käyttäjän vaihtaminen epäonnistui');
            }
          },
        },
      ]
    );
  };

  const goToUserProfile = () => {
    if (authUser?.username) {
      navigation.navigate('UserProfile', { username: authUser.username });
    }
  };

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info Card */}
      <Card style={styles.userCard}>
        <Card.Content style={styles.userContent}>
          <View style={styles.userHeader}>
            <Avatar.Text
              size={60}
              label={authUser?.username?.charAt(0).toUpperCase() || '?'}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{authUser?.username}</Text>
              {userProfile && (
                <Text style={styles.userStats}>
                  {Math.round(userProfile.totalKm)} km • {userProfile.activities.length} suoritusta
                </Text>
              )}
              <Text style={styles.memberSince}>
                Jäsen {new Date(authUser?.loginTime || Date.now()).toLocaleDateString('fi-FI')} lähtien
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Pika-toiminnot</Text>
          
          <List.Item
            title="Omat suoritukset"
            description="Katso ja hallinnoi suorituksiasi"
            left={() => <List.Icon icon="fitness" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={goToUserProfile}
            style={styles.listItem}
          />
          
          <Divider />
          
          <List.Item
            title="Asetukset"
            description="Ilmoitukset ja sovelluksen asetukset"
            left={() => <List.Icon icon="cog" color={theme.colors.primary} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={goToSettings}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Recent Users - Quick Switch */}
      {recentUsers.length > 1 && (
        <Card style={styles.recentCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Vaihda käyttäjää</Text>
            <Text style={styles.sectionDescription}>
              Paina käyttäjänimeä vaihtaaksesi nopeasti
            </Text>
            
            {recentUsers
              .filter(username => username !== authUser?.username)
              .map((username) => (
                <List.Item
                  key={username}
                  title={username}
                  description="Vaihda tähän käyttäjään"
                  left={() => (
                    <Avatar.Text
                      size={40}
                      label={username.charAt(0).toUpperCase()}
                      style={styles.recentAvatar}
                    />
                  )}
                  right={() => <List.Icon icon="account-switch" />}
                  onPress={() => handleSwitchUser(username)}
                  style={styles.listItem}
                />
              ))}
          </Card.Content>
        </Card>
      )}

      {/* App Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Sovellustiedot</Text>
          
          <List.Item
            title="Versio"
            description="1.0.0"
            left={() => <List.Icon icon="information" color={theme.colors.textMuted} />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Kehittäjä"
            description="Petolliset Team 🔥"
            left={() => <List.Icon icon="code-tags" color={theme.colors.textMuted} />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={theme.colors.error}
            icon="logout"
          >
            Kirjaudu ulos
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  userCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  userContent: {
    padding: theme.spacing.lg,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  userInfo: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  username: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userStats: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  memberSince: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actionsCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  recentCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  logoutCard: {
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  listItem: {
    paddingVertical: theme.spacing.xs,
  },
  recentAvatar: {
    backgroundColor: theme.colors.secondary,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});