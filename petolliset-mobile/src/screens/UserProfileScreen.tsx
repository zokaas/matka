// src/screens/UserProfileScreen.tsx - Enhanced with editing capabilities and insights
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert, RefreshControl } from 'react-native';
import { Text, Card, FAB, List, Button, Avatar, SegmentedButtons, Modal, Portal, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../hooks/useUser';
import { PersonalInsights } from '../components/PersonalInsights';
import { theme } from '../constants/theme';
import { sportsOptions, bonusOptions } from '../constants/sportsOptions';
import apiService from '../services/apiService';

export default function UserProfileScreen() {
  const route = useRoute();
  const { username } = route.params as { username: string };
  const { user, loading, error, refetch } = useUser(username);
  
  // State for adding/editing activities
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  type Activity = {
    id: number;
    activity: string;
    duration: number;
    date: string;
    bonus?: string | null;
    kilometers: number;
  };
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bonus, setBonus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('activities');

  const needsCustomName = activity === 'Muu(100km/h)' || activity === 'Muu(50km/h)';

  const resetForm = () => {
    setActivity('');
    setCustomActivity('');
    setDuration('');
    setDate(new Date());
    setBonus(null);
    setIsEditing(false);
    setEditingActivity(null);
    setShowAddForm(false);
  };

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
      setSubmitting(true);
      
      let selectedActivity = activity;
      if (needsCustomName) {
        selectedActivity = `${customActivity.trim()} / ${activity}`;
      }

      const activityData = {
        activity: selectedActivity,
        duration: parseInt(duration),
        date: date.toISOString().split('T')[0],
        bonus,
      };

      if (isEditing && editingActivity) {
        await apiService.activity.updateActivity(username, editingActivity.id, activityData);
        Alert.alert('Onnistui!', 'Suoritus päivitetty');
      } else {
        await apiService.activity.addActivity(username, activityData);
        Alert.alert('Onnistui!', 'Suoritus lisätty');
      }

      resetForm();
      refetch();
    } catch (error) {
      Alert.alert('Virhe', `Suorituksen ${isEditing ? 'päivittäminen' : 'lisääminen'} epäonnistui`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (activityToEdit: Activity) => {
    // Parse custom activity if it exists
    const muuMatch = activityToEdit.activity.match(/(.*?)\s*\/\s*(Muu\(.*?\))/);
    
    if (muuMatch) {
      setCustomActivity(muuMatch[1]);
      setActivity(muuMatch[2]);
    } else {
      setActivity(activityToEdit.activity);
      setCustomActivity('');
    }

    setEditingActivity(activityToEdit);
    setDuration(activityToEdit.duration.toString());
    setDate(new Date(activityToEdit.date));
    setBonus(activityToEdit.bonus || null);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteActivity = async (activityId: number, activityName: string) => {
    Alert.alert(
      'Poista suoritus',
      `Haluatko varmasti poistaa suorituksen "${activityName}"?`,
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.activity.deleteActivity(username, activityId);
              refetch();
            } catch (error) {
              Alert.alert('Virhe', 'Suorituksen poistaminen epäonnistui');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI');
  };

  const getBonusText = (bonus: string | null) => {
    if (!bonus) return '';
    switch (bonus) {
      case 'juhlapäivä':
        return ' (2x km)';
      case 'enemmän kuin kolme urheilee yhdessä':
        return ' (1.5x km)';
      case 'kaikki yhdessä':
        return ' (3x km)';
      default:
        return '';
    }
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ladataan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Virhe: {error}</Text>
        <Button onPress={refetch}>Yritä uudelleen</Button>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Käyttäjää ei löytynyt</Text>
      </View>
    );
  }

  const renderAddEditForm = () => (
    <Portal>
      <Modal
        visible={showAddForm}
        onDismiss={resetForm}
        contentContainerStyle={styles.modalContainer}
      >
        <Card>
          <Card.Content>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Muokkaa suoritusta' : 'Lisää suoritus'}
            </Text>

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

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={resetForm}
                style={styles.modalButton}
              >
                Peruuta
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={styles.modalButton}
                buttonColor={theme.colors.primary}
              >
                {isEditing ? 'Päivitä' : 'Lisää'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );

  const renderActivities = () => (
    <Card style={styles.activitiesCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>Suoritukset</Text>
        {user.activities.length === 0 ? (
          <Text style={styles.noActivities}>
            Ei suorituksia vielä
          </Text>
        ) : (
          user.activities
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((activity) => (
              <List.Item
                key={activity.id}
                title={activity.activity}
                description={`${activity.kilometers.toFixed(1)} km • ${activity.duration} min • ${formatDate(activity.date)}${getBonusText(activity.bonus ?? null)}`}
                right={() => (
                  <View style={styles.activityActions}>
                    <Button
                      mode="text"
                      onPress={() => handleEdit(activity)}
                      textColor={theme.colors.primary}
                      compact
                    >
                      Muokkaa
                    </Button>
                    <Button
                      mode="text"
                      onPress={() => handleDeleteActivity(activity.id, activity.activity)}
                      textColor={theme.colors.error}
                      compact
                    >
                      Poista
                    </Button>
                  </View>
                )}
                style={styles.activityItem}
              />
            ))
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* User Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Image
              size={80}
              source={{
                uri: user.profilePicture
                  ? `https://matka-xi.vercel.app/${user.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
              }}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.totalKm}>
                {Math.round(user.totalKm)} km
              </Text>
              <Text style={styles.activityCount}>
                {user.activities.length} suoritusta
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Tab Navigation */}
        <Card style={styles.tabCard}>
          <Card.Content>
            <SegmentedButtons
              value={activeTab}
              onValueChange={setActiveTab}
              buttons={[
                { value: 'activities', label: 'Suoritukset' },
                { value: 'insights', label: 'Tilastot' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Tab Content */}
        {activeTab === 'activities' ? renderActivities() : (
          <PersonalInsights activities={user.activities} username={user.username} />
        )}
      </ScrollView>

      {/* Add/Edit Form Modal */}
      {renderAddEditForm()}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowAddForm(true);
        }}
        label="Lisää"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  headerCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: theme.spacing.lg,
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalKm: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  activityCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  tabCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  segmentedButtons: {
    marginVertical: theme.spacing.xs,
  },
  activitiesCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  noActivities: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: theme.spacing.lg,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
});