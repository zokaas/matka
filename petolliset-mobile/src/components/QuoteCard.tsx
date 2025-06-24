
// src/components/QuoteCard.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Title, Text, TextInput, Button } from 'react-native-paper';
import { useQuotes } from '../hooks/useQuotes';
import { theme } from '../constants/theme';

export const QuoteCard: React.FC = () => {
  const { currentQuote, loading, addQuote } = useQuotes();
  const [newQuote, setNewQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuote = async () => {
    if (!newQuote.trim()) {
      Alert.alert('Virhe', 'Kirjoita sitaatti');
      return;
    }

    try {
      setSubmitting(true);
      await addQuote(newQuote.trim());
      setNewQuote('');
      Alert.alert('Onnistui!', 'Sitaatti lisätty');
    } catch (error) {
      Alert.alert('Virhe', 'Sitaatin lisääminen epäonnistui');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>💪 Motivaatio</Title>
        
        {loading ? (
          <Text style={styles.quote}>Ladataan sitaattia...</Text>
        ) : (
          <Text style={styles.quote}>"{currentQuote}"</Text>
        )}

        <View style={styles.addQuoteSection}>
          <TextInput
            label="Lisää oma motivaatiosanaansa"
            value={newQuote}
            onChangeText={setNewQuote}
            multiline
            numberOfLines={3}
            style={styles.quoteInput}
          />
          <Button
            mode="contained"
            onPress={handleSubmitQuote}
            loading={submitting}
            disabled={submitting || !newQuote.trim()}
            style={styles.submitButton}
            buttonColor={theme.colors.primary}
          >
            Lähetä
          </Button>
        </View>
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
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  addQuoteSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  quoteInput: {
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    alignSelf: 'center',
  },
});