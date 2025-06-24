// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../constants/theme';

type RootStackParamList = {
  UserProfile: { username: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Virhe', 'Anna käyttäjänimi');
      return;
    }

    try {
      await AsyncStorage.setItem('username', username.trim());
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Virhe', 'Kirjautuminen epäonnistui');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      setUsername('');
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui');
    }
  };

  const goToUserProfile = () => {
    navigation.navigate('UserProfile', { username });
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Kirjaudu sisään</Text>
            <TextInput
              label="Käyttäjänimi"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholder="Anna käyttäjänimesi"
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              buttonColor={theme.colors.primary}
            >
              Kirjaudu
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Profiili</Text>
          <Text style={styles.welcomeText}>
            Tervetuloa, {username}!
          </Text>
          
          <Button
            mode="contained"
            onPress={goToUserProfile}
            style={styles.button}
            buttonColor={theme.colors.primary}
          >
            Näytä omat suoritukset
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.button}
            textColor={theme.colors.error}
          >
            Kirjaudu ulos
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});