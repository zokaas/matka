// src/hooks/useOfflineSync.ts - CORRECTED VERSION
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { OfflineStorageService } from '../services/offlineStorageService';
import apiService from '../services/apiService';

export interface OfflineSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingActivities: number;
  pendingQuotes: number;
  hasErrors: boolean;
}

export class OfflineSyncService {
  // FIXED: Made syncInProgress public with getter
  private static _syncInProgress = false;

  static get syncInProgress(): boolean {
    return this._syncInProgress;
  }

  // Sync all offline data
  static async syncOfflineData(): Promise<void> {
    if (this._syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    try {
      this._syncInProgress = true;
      
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('No network connection, skipping sync');
        return;
      }

      console.log('Starting offline data sync...');

      // Sync offline activities
      await this.syncOfflineActivities();
      
      // Sync offline quotes
      await this.syncOfflineQuotes();
      
      // Update last sync time
      await OfflineStorageService.setLastSyncTime();
      
      console.log('Offline data sync completed');
    } catch (error) {
      console.error('Error syncing offline data:', error);
      throw error;
    } finally {
      this._syncInProgress = false;
    }
  }

  // Sync offline activities
  private static async syncOfflineActivities(): Promise<void> {
    const offlineActivities = await OfflineStorageService.getOfflineActivities();
    
    for (const activity of offlineActivities) {
      try {
        await apiService.activity.addActivity(activity.username, {
          activity: activity.activity,
          duration: activity.duration,
          date: activity.date,
          bonus: activity.bonus,
        });
        
        // Remove successfully synced activity
        await OfflineStorageService.removeOfflineActivity(activity.tempId);
        console.log('Synced offline activity:', activity.tempId);
      } catch (error) {
        console.error('Error syncing activity:', activity.tempId, error);
        // Keep the activity for retry later
      }
    }
  }

  // Sync offline quotes
  private static async syncOfflineQuotes(): Promise<void> {
    const offlineQuotes = await OfflineStorageService.getOfflineQuotes();
    
    for (const quote of offlineQuotes) {
      try {
        await apiService.quote.addQuote(quote.text);
        
        // Remove successfully synced quote
        await OfflineStorageService.removeOfflineQuote(quote.tempId);
        console.log('Synced offline quote:', quote.tempId);
      } catch (error) {
        console.error('Error syncing quote:', quote.tempId, error);
        // Keep the quote for retry later
      }
    }
  }
}

export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = useState<OfflineSyncStatus>({
    isOnline: true,
    isSyncing: false,
    lastSyncTime: null,
    pendingActivities: 0,
    pendingQuotes: 0,
    hasErrors: false,
  });

  // Update sync status
  const updateSyncStatus = async () => {
    try {
      const [
        netInfo,
        lastSyncTime,
        offlineActivities,
        offlineQuotes,
      ] = await Promise.all([
        NetInfo.fetch(),
        OfflineStorageService.getLastSyncTime(),
        OfflineStorageService.getOfflineActivities(),
        OfflineStorageService.getOfflineQuotes(),
      ]);

      setSyncStatus({
        isOnline: netInfo.isConnected ?? false,
        isSyncing: OfflineSyncService.syncInProgress, // FIXED: Now accessible
        lastSyncTime: lastSyncTime ? new Date(lastSyncTime) : null,
        pendingActivities: offlineActivities.length,
        pendingQuotes: offlineQuotes.length,
        hasErrors: false,
      });
    } catch (error) {
      console.error('Error updating sync status:', error);
      setSyncStatus(prev => ({ ...prev, hasErrors: true }));
    }
  };

  // Manual sync trigger
  const triggerSync = async (): Promise<boolean> => {
    if (!syncStatus.isOnline) {
      Alert.alert('Ei yhteyttä', 'Tarkista internetyhteys ja yritä uudelleen');
      return false;
    }

    if (syncStatus.pendingActivities === 0 && syncStatus.pendingQuotes === 0) {
      Alert.alert('Ei synkronoitavaa', 'Kaikki tiedot ovat jo synkronoitu');
      return true;
    }

    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));
      
      await OfflineSyncService.syncOfflineData();
      await updateSyncStatus();
      
      Alert.alert('Synkronointi valmis', 'Kaikki tiedot on synkronoitu palvelimelle');
      return true;
    } catch (error) {
      console.error('Manual sync failed:', error);
      Alert.alert('Synkronointi epäonnistui', 'Yritä myöhemmin uudelleen');
      return false;
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  // Add activity to offline queue
  const addOfflineActivity = async (
    username: string,
    activityData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    }
  ): Promise<void> => {
    const tempId = `offline_activity_${Date.now()}_${Math.random()}`;
    
    await OfflineStorageService.addOfflineActivity({
      ...activityData,
      username,
      tempId,
    });
    
    await updateSyncStatus();
    
    // Try to sync immediately if online
    if (syncStatus.isOnline) {
      OfflineSyncService.syncOfflineData().catch(console.error);
    }
  };

  // Add quote to offline queue
  const addOfflineQuote = async (text: string): Promise<void> => {
    const tempId = `offline_quote_${Date.now()}_${Math.random()}`;
    
    await OfflineStorageService.addOfflineQuote({
      text,
      tempId,
    });
    
    await updateSyncStatus();
    
    // Try to sync immediately if online
    if (syncStatus.isOnline) {
      OfflineSyncService.syncOfflineData().catch(console.error);
    }
  };

  // Set up listeners and automatic sync
  useEffect(() => {
    // Initial status update
    updateSyncStatus();

    // FIXED: Added proper type for NetInfo state
    const unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      setSyncStatus(prev => ({ 
        ...prev, 
        isOnline: state.isConnected ?? false 
      }));
      
      // Auto-sync when coming back online
      if (state.isConnected && !OfflineSyncService.syncInProgress) {
        OfflineSyncService.syncOfflineData().catch(console.error);
      }
    });

    // Periodic status updates
    const statusInterval = setInterval(updateSyncStatus, 30000); // Every 30 seconds

    // Auto-sync interval (when online)
    const syncInterval = setInterval(() => {
      if (syncStatus.isOnline && !OfflineSyncService.syncInProgress) {
        OfflineSyncService.syncOfflineData().catch(console.error);
      }
    }, 300000); // Every 5 minutes

    return () => {
      unsubscribeNetInfo();
      clearInterval(statusInterval);
      clearInterval(syncInterval);
    };
  }, [syncStatus.isOnline]);

  return {
    syncStatus,
    triggerSync,
    addOfflineActivity,
    addOfflineQuote,
    updateSyncStatus,
  };
};