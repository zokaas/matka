// src/screens/SettingsScreen.tsx - Fixed version with correct notification trigger
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  Switch, 
  Button, 
  List, 
  Chip
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { NotificationService } from '../services/notificationService';
import { ImageService } from '../services/imageService';
import { OfflineStorageService } from '../services/offlineStorageService';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { theme } from '../constants/theme';

export default function SettingsScreen() {
  const [notificationPrefs, setNotificationPrefs] = useState({
    dailyMotivation: true,
    weeklyGoals: true,
    milestones: true,
    leaderboard: false,
    activities: true,
    dailyTime: { hour: 8, minute: 0 },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageCache, setImageCache] = useState({
    totalImages: 0,
    totalSize: '0 B',
    userImages: [] as string[],
  });

  const [offlineCache, setOfflineCache] = useState({
    users: false,
    totalKm: false,
    quotes: false,
    recentActivities: false,
    offlineActivities: 0,
    offlineQuotes: 0,
    lastSync: null as Date | null,
  });

  const { syncStatus, triggerSync, updateSyncStatus } = useOfflineSync();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [prefs, imageCacheInfo, offlineCacheInfo] = await Promise.all([
        NotificationService.getNotificationPreferences(),
        ImageService.getCacheInfo(),
        OfflineStorageService.getCacheInfo(),
      ]);

      setNotificationPrefs(prefs);
      setImageCache(imageCacheInfo);
      setOfflineCache(offlineCacheInfo);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateNotificationPreference = async (key: string, value: boolean) => {
    try {
      const newPrefs = { ...notificationPrefs, [key]: value };
      setNotificationPrefs(newPrefs);
      
      await NotificationService.updateNotificationPreferences({ [key]: value });
      
      if (key === 'dailyMotivation' && value) {
        Alert.alert(
          'Päivittäiset muistutukset',
          'Päivittäiset motivaatioviestit on otettu käyttöön!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Virhe', 'Asetusten päivittäminen epäonnistui');
    }
  };

  const updateDailyTime = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    
    if (selectedTime) {
      const newTime = {
        hour: selectedTime.getHours(),
        minute: selectedTime.getMinutes(),
      };
      
      const newPrefs = { ...notificationPrefs, dailyTime: newTime };
      setNotificationPrefs(newPrefs);
      
      try {
        await NotificationService.updateNotificationPreferences({ dailyTime: newTime });
        Alert.alert('Onnistui', `Päivittäinen muistutus asetettu kello ${newTime.hour}:${newTime.minute.toString().padStart(2, '0')}`);
      } catch (error) {
        Alert.alert('Virhe', 'Ajan päivittäminen epäonnistui');
      }
    }
  };

  const clearImageCache = () => {
    Alert.alert(
      'Tyhjennä kuvat',
      'Haluatko varmasti poistaa kaikki tallennetut profiilikuvat? Ne ladataan uudelleen tarvittaessa.',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await ImageService.clearCache();
              await loadSettings();
              Alert.alert('Onnistui', 'Kuvat poistettu');
            } catch (error) {
              Alert.alert('Virhe', 'Kuvien poistaminen epäonnistui');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const clearOfflineCache = () => {
    Alert.alert(
      'Tyhjennä välimuisti',
      'Haluatko varmasti poistaa kaikki välimuistissa olevat tiedot? Tiedot ladataan uudelleen internetistä.',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await OfflineStorageService.clearCache();
              await loadSettings();
              Alert.alert('Onnistui', 'Välimuisti tyhjennetty');
            } catch (error) {
              Alert.alert('Virhe', 'Välimuistin tyhjentäminen epäonnistui');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const testNotification = async () => {
    try {
      await NotificationService.scheduleNotification(
        {
          type: 'motivation',
          title: 'Testi-ilmoitus 📱',
          body: 'Ilmoitukset toimivat! Tämä on testimuistutus.',
        },
        {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        } as Notifications.TimeIntervalTriggerInput
      );
      Alert.alert('Testi lähetetty', 'Saat testimuistutuksen 2 sekunnin kuluttua');
    } catch (error) {
      Alert.alert('Virhe', 'Testimuistutuksen lähettäminen epäonnistui');
    }
  };

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const renderSyncStatus = () => {
    const { isOnline, isSyncing, lastSyncTime, pendingActivities, pendingQuotes } = syncStatus;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>🔄 Synkronointi</Title>
          
          <List.Item
            title="Yhteyden tila"
            description={isOnline ? 'Yhdistetty' : 'Ei yhteyttä'}
            left={() => (
              <View style={[styles.statusDot, { backgroundColor: isOnline ? theme.colors.success : theme.colors.error }]} />
            )}
          />
          
          {lastSyncTime && (
            <List.Item
              title="Viimeisin synkronointi"
              description={lastSyncTime.toLocaleString('fi-FI')}
            />
          )}
          
          {(pendingActivities > 0 || pendingQuotes > 0) && (
            <View style={styles.pendingContainer}>
              <Text style={styles.pendingTitle}>Odottaa synkronointia:</Text>
              {pendingActivities > 0 && (
                <Chip icon="fitness" style={styles.pendingChip}>
                  {pendingActivities} suoritus{pendingActivities > 1 ? 'ta' : ''}
                </Chip>
              )}
              {pendingQuotes > 0 && (
                <Chip icon="format-quote-close" style={styles.pendingChip}>
                  {pendingQuotes} sitaatti{pendingQuotes > 1 ? 'a' : ''}
                </Chip>
              )}
            </View>
          )}
          
          <Button
            mode="contained"
            onPress={triggerSync}
            loading={isSyncing}
            disabled={!isOnline || isSyncing}
            style={styles.syncButton}
            buttonColor={theme.colors.primary}
          >
            {isSyncing ? 'Synkronoidaan...' : 'Synkronoi nyt'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Notifications Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>📢 Ilmoitukset</Title>
          
          <List.Item
            title="Päivittäiset motivaatioviestit"
            description="Muistutus liikkumisesta"
            left={() => <List.Icon icon="alarm" />}
            right={() => (
              <Switch
                value={notificationPrefs.dailyMotivation}
                onValueChange={(value) => updateNotificationPreference('dailyMotivation', value)}
              />
            )}
          />
          
          {notificationPrefs.dailyMotivation && (
            <List.Item
              title="Muistutuksen aika"
              description={formatTime(notificationPrefs.dailyTime.hour, notificationPrefs.dailyTime.minute)}
              onPress={() => setShowTimePicker(true)}
              left={() => <List.Icon icon="clock-outline" />}
              style={styles.subSetting}
            />
          )}
          
          <List.Item
            title="Viikkotavoitteet"
            description="Muistutukset viikon tavoitteista"
            left={() => <List.Icon icon="calendar-week" />}
            right={() => (
              <Switch
                value={notificationPrefs.weeklyGoals}
                onValueChange={(value) => updateNotificationPreference('weeklyGoals', value)}
              />
            )}
          />
          
          <List.Item
            title="Välitavoitteet"
            description="Ilmoitukset saavutuksista"
            left={() => <List.Icon icon="trophy" />}
            right={() => (
              <Switch
                value={notificationPrefs.milestones}
                onValueChange={(value) => updateNotificationPreference('milestones', value)}
              />
            )}
          />
          
          <List.Item
            title="Sijoitusmuutokset"
            description="Ilmoitukset tulostaulussa"
            left={() => <List.Icon icon="podium" />}
            right={() => (
              <Switch
                value={notificationPrefs.leaderboard}
                onValueChange={(value) => updateNotificationPreference('leaderboard', value)}
              />
            )}
          />
          
          <List.Item
            title="Uudet suoritukset"
            description="Ilmoitukset muiden suorituksista"
            left={() => <List.Icon icon="run" />}
            right={() => (
              <Switch
                value={notificationPrefs.activities}
                onValueChange={(value) => updateNotificationPreference('activities', value)}
              />
            )}
          />
          
          <Button
            mode="outlined"
            onPress={testNotification}
            style={styles.testButton}
            icon="bell-ring"
          >
            Testaa ilmoitukset
          </Button>
        </Card.Content>
      </Card>

      {/* Sync Status */}
      {renderSyncStatus()}

      {/* Cache Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>💾 Tallennustila</Title>
          
          <View style={styles.cacheSection}>
            <Text style={styles.cacheTitle}>Profiilikuvat</Text>
            <List.Item
              title={`${imageCache.totalImages} kuvaa`}
              description={`Käyttää ${imageCache.totalSize} tallennustilaa`}
              left={() => <List.Icon icon="image" />}
              right={() => (
                <Button
                  mode="outlined"
                  onPress={clearImageCache}
                  loading={loading}
                  disabled={loading || imageCache.totalImages === 0}
                  compact
                >
                  Tyhjennä
                </Button>
              )}
            />
            
            {imageCache.userImages.length > 0 && (
              <View style={styles.userImagesContainer}>
                <Text style={styles.userImagesTitle}>Tallennetut profiilit:</Text>
                <View style={styles.userImagesChips}>
                  {imageCache.userImages.slice(0, 10).map((username) => (
                    <Chip key={username} compact style={styles.userChip}>
                      {username}
                    </Chip>
                  ))}
                  {imageCache.userImages.length > 10 && (
                    <Chip compact style={styles.userChip}>
                      +{imageCache.userImages.length - 10} muuta
                    </Chip>
                  )}
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.cacheSection}>
            <Text style={styles.cacheTitle}>Välimuistin tila</Text>
            <List.Item
              title="Käyttäjätiedot"
              left={() => <List.Icon icon="account-group" />}
              right={() => (
                <Chip icon={offlineCache.users ? "check" : "close"} compact>
                  {offlineCache.users ? 'Tallennettu' : 'Ei tallessa'}
                </Chip>
              )}
            />
            <List.Item
              title="Tilastot"
              left={() => <List.Icon icon="chart-line" />}
              right={() => (
                <Chip icon={offlineCache.totalKm ? "check" : "close"} compact>
                  {offlineCache.totalKm ? 'Tallennettu' : 'Ei tallessa'}
                </Chip>
              )}
            />
            <List.Item
              title="Sitaatit"
              left={() => <List.Icon icon="format-quote-close" />}
              right={() => (
                <Chip icon={offlineCache.quotes ? "check" : "close"} compact>
                  {offlineCache.quotes ? 'Tallennettu' : 'Ei tallessa'}
                </Chip>
              )}
            />
            
            {offlineCache.lastSync && (
              <List.Item
                title="Viimeisin päivitys"
                description={offlineCache.lastSync.toLocaleString('fi-FI')}
                left={() => <List.Icon icon="update" />}
              />
            )}
          </View>
          
          <Button
            mode="outlined"
            onPress={clearOfflineCache}
            loading={loading}
            disabled={loading}
            style={styles.clearButton}
            icon="delete-sweep"
          >
            Tyhjennä välimuisti
          </Button>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>ℹ️ Sovellustiedot</Title>
          
          <List.Item
            title="Versio"
            description="1.0.0"
            left={() => <List.Icon icon="information" />}
          />
          <List.Item
            title="Viimeisin päivitys"
            description="Joulukuu 2024"
            left={() => <List.Icon icon="update" />}
          />
          <List.Item
            title="Kehittäjä"
            description="Petolliset Team 🔥"
            left={() => <List.Icon icon="code-tags" />}
          />
          
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Tuki', 'Ota yhteyttä: support@petolliset.fi')}
              style={styles.actionButton}
              icon="help-circle"
            >
              Tuki
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Tietosuoja', 'Tietosuojakäytäntö löytyy verkkosivuilta')}
              style={styles.actionButton}
              icon="shield-account"
            >
              Tietosuoja
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date(0, 0, 0, notificationPrefs.dailyTime.hour, notificationPrefs.dailyTime.minute)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={updateDailyTime}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 18,
  },
  subSetting: {
    marginLeft: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  testButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'center',
  },
  syncButton: {
    marginTop: theme.spacing.md,
  },
  clearButton: {
    marginTop: theme.spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: theme.spacing.md,
  },
  pendingContainer: {
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  pendingChip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  cacheSection: {
    marginBottom: theme.spacing.md,
  },
  cacheTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  userImagesContainer: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  userImagesTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userImagesChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  userChip: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});