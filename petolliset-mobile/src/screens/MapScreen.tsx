// src/screens/MapScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { theme } from '../constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>🗺️ Kartta</Text>
          <Text style={styles.subtitle}>
            Karttanäkymä tulee tähän. Voit integroida sen myöhemmin.
          </Text>
          <Text style={styles.description}>
            Tässä näkymässä näkyisi:
            {'\n'}• Reitti maailman ympäri
            {'\n'}• Nykyinen sijainti
            {'\n'}• Saavutetut kaupungit
            {'\n'}• Edistyminen reitillä
          </Text>
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