
// src/components/ActivityForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  TextInput, 
  Button, 
  Text,
  SegmentedButtons,
  Menu,
  Divider
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sportsOptions, bonusOptions } from '../constants/sportsOptions';
import { theme } from '../constants/theme';
import apiService from '../services/apiService';

interface ActivityFormProps {
  username: string;
  onActivityAdded?: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ 
  username, 
  onActivityAdded 
}) => {
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bonus, setBonus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const needsCustomName = activity === 'Muu(100km/h)' || activity === 'Muu(50km/h)';

  const handleSubmit = async () => {
    if (!activity || !duration) {
      Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät');
      return;
    }

    if (needsCustomName && !customActivity.trim()) {
      Alert.alert('Virhe', 'Anna lajin nimi');
      return;
    }

    try {
      setLoading(true);
      
      let selectedActivity = activity;
      if (needsCustomName) {
        selectedActivity = `${customActivity.trim()} / ${activity}`;
      }

      await apiService.activity.addActivity(username, {
        activity: selectedActivity,
        duration: parseInt(duration),
        date: date.toISOString().split('T')[0],
        bonus,
      });

      Alert.alert('Onnistui!', 'Suoritus lisätty');
      
      // Reset form
      setActivity('');
      setCustomActivity('');
      setDuration('');
      setDate(new Date());
      setBonus(null);
      
      onActivityAdded?.();
    } catch (error) {
      Alert.alert('Virhe', 'Suorituksen lisääminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Lisää suoritus</Title>
        
        <Text style={styles.label}>Laji *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={activity}
            onValueChange={setActivity}
            style={styles.picker}
          >
            <Picker.Item label="Valitse laji..." value="" />
            {sportsOptions.map((sport) => (
              <Picker.Item key={sport} label={sport} value={sport} />
            ))}
          </Picker>
        </View>

        {needsCustomName && (
          <TextInput
            label="Lajin nimi *"
            value={customActivity}
            onChangeText={setCustomActivity}
            style={styles.input}
            placeholder="Kirjoita lajin nimi"
          />
        )}

        <TextInput
          label="Kesto (minuutit) *"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Päivämäärä</Text>
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {date.toLocaleDateString('fi-FI')}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Bonus</Text>
        <SegmentedButtons
          value={bonus || ''}
          onValueChange={(value) => setBonus(value || null)}
          buttons={bonusOptions.map(option => ({
            value: option.value || '',
            label: option.label,
          }))}
          style={styles.segmentedButtons}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          buttonColor={theme.colors.primary}
        >
          Lisää suoritus
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  picker: {
    height: 50,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    marginBottom: theme.spacing.md,
  },
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});
