// src/screens/LoginScreen.tsx - Modern, simple login screen
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Chip,
  ActivityIndicator 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { login, recentUsers } = useAuth();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Virhe', 'Anna käyttäjänimi');
      return;
    }

    try {
      setIsLogging(true);
      const result = await login(username.trim());
      
      if (!result.success) {
        Alert.alert('Kirjautuminen epäonnistui', result.error || 'Tuntematon virhe');
      }
    } catch (error) {
      Alert.alert('Virhe', 'Kirjautuminen epäonnistui');
    } finally {
      setIsLogging(false);
    }
  };

  const handleQuickLogin = async (selectedUsername: string) => {
    try {
      setIsLogging(true);
      const result = await login(selectedUsername);
      
      if (!result.success) {
        Alert.alert('Kirjautuminen epäonnistui', result.error || 'Tuntematon virhe');
      }
    } catch (error) {
      Alert.alert('Virhe', 'Kirjautuminen epäonnistui');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Petolliset</Text>
          <Text style={styles.subtitle}>Maailman ympäri -haaste</Text>
          <Text style={styles.description}>
            Liity mukaan yhteiseen matkaan ja seuraa edistymistä!
          </Text>
        </View>

        {/* Login Form */}
        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.formTitle}>Kirjaudu sisään</Text>
            
            <TextInput
              label="Käyttäjänimi"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              placeholder="Anna tai luo käyttäjänimi"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              disabled={isLogging}
              left={<TextInput.Icon icon="account" />}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLogging}
              disabled={isLogging || !username.trim()}
              style={styles.loginButton}
              buttonColor={theme.colors.primary}
              contentStyle={styles.buttonContent}
            >
              {isLogging ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
            </Button>

            <Text style={styles.helpText}>
              Jos käyttäjää ei ole, se luodaan automaattisesti
            </Text>
          </Card.Content>
        </Card>

        {/* Recent Users */}
        {recentUsers.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content>
              <Text style={styles.recentTitle}>Viimeisimmät käyttäjät</Text>
              <Text style={styles.recentSubtitle}>
                Paina käyttäjänimeä kirjautuaksesi nopeasti
              </Text>
              
              <View style={styles.recentUsers}>
                {recentUsers.map((user) => (
                  <TouchableOpacity
                    key={user}
                    onPress={() => handleQuickLogin(user)}
                    disabled={isLogging}
                  >
                    <Chip
                      mode="outlined"
                      style={[
                        styles.userChip,
                        isLogging && styles.userChipDisabled
                      ]}
                      textStyle={styles.userChipText}
                      icon="account"
                    >
                      {user}
                    </Chip>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Loading Overlay */}
        {isLogging && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  loginCard: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  cardContent: {
    padding: theme.spacing.xl,
  },
  formTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  loginButton: {
    marginBottom: theme.spacing.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  helpText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recentCard: {
    ...theme.shadows.md,
  },
  recentTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recentSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  recentUsers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  userChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  userChipDisabled: {
    opacity: 0.6,
  },
  userChipText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});