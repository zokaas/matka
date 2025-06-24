
// src/screens/AddActivityScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, TextInput } from 'react-native-paper';
import { ActivityForm } from '../components/ActivityForm';
import { theme } from '../constants/theme';

export default function AddActivityScreen() {
  const [selectedUser, setSelectedUser] = useState('');
  const [showForm, setShowForm] = useState(false);

  // In a real app, you might get this from AsyncStorage or a login system
  const handleUserSelect = () => {
    if (selectedUser.trim()) {
      setShowForm(true);
    }
  };

  const handleActivityAdded = () => {
    // Optionally reset form or navigate somewhere
    setShowForm(false);
    setSelectedUser('');
  };

  if (!showForm) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Kuka olet?</Text>
            <TextInput
              label="Käyttäjänimi"
              value={selectedUser}
              onChangeText={setSelectedUser}
              style={styles.input}
              placeholder="Kirjoita käyttäjänimesi"
            />
            <Button
              mode="contained"
              onPress={handleUserSelect}
              disabled={!selectedUser.trim()}
              style={styles.button}
              buttonColor={theme.colors.primary}
            >
              Jatka
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ActivityForm 
        username={selectedUser} 
        onActivityAdded={handleActivityAdded}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xl * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
