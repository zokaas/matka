// src/services/imageService.ts - Fixed version with proper exports and types
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface ImagePickerResult {
  success: boolean;
  uri?: string;
  error?: string;
}

export class ImageService {
  private static readonly PROFILE_PICTURES_DIR = `${FileSystem.documentDirectory}profile_pictures/`;
  private static readonly CACHE_KEY = 'profile_picture_cache';
  private static readonly MAX_IMAGE_SIZE = 1024; // 1024x1024 pixels
  private static readonly JPEG_QUALITY = 0.8;

  // Initialize the service
  static async initialize(): Promise<void> {
    try {
      // Create profile pictures directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.PROFILE_PICTURES_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.PROFILE_PICTURES_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing ImageService:', error);
    }
  }

  // Request camera and media library permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraStatus === 'granted' && mediaStatus === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Show image picker options
  static async pickImage(): Promise<ImagePickerResult> {
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      return {
        success: false,
        error: 'Kameraan ja kuvakirjastoon tarvitaan käyttöoikeudet',
      };
    }

    return new Promise((resolve) => {
      Alert.alert(
        'Valitse kuva',
        'Mistä haluat valita profiilikuvan?',
        [
          {
            text: 'Peruuta',
            style: 'cancel',
            onPress: () => resolve({ success: false }),
          },
          {
            text: 'Kamera',
            onPress: async () => {
              const result = await this.takePhoto();
              resolve(result);
            },
          },
          {
            text: 'Kuvakirjasto',
            onPress: async () => {
              const result = await this.pickFromLibrary();
              resolve(result);
            },
          },
        ],
        { cancelable: true, onDismiss: () => resolve({ success: false }) }
      );
    });
  }

  // Take photo with camera
  private static async takePhoto(): Promise<ImagePickerResult> {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return { success: false };
      }

      const processedUri = await this.processImage(result.assets[0].uri);
      return { success: true, uri: processedUri };
    } catch (error) {
      console.error('Error taking photo:', error);
      return {
        success: false,
        error: 'Kuvan ottaminen epäonnistui',
      };
    }
  }

  // Pick from image library
  private static async pickFromLibrary(): Promise<ImagePickerResult> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return { success: false };
      }

      const processedUri = await this.processImage(result.assets[0].uri);
      return { success: true, uri: processedUri };
    } catch (error) {
      console.error('Error picking from library:', error);
      return {
        success: false,
        error: 'Kuvan valitseminen epäonnistui',
      };
    }
  }

  // Process and optimize image
  private static async processImage(uri: string): Promise<string> {
    try {
      // Get image info to determine if resizing is needed
      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.JPEG });
      
      const manipulateActions: ImageManipulator.Action[] = [];
      
      // Resize if image is too large
      const maxDimension = Math.max(imageInfo.width, imageInfo.height);
      if (maxDimension > this.MAX_IMAGE_SIZE) {
        const ratio = this.MAX_IMAGE_SIZE / maxDimension;
        manipulateActions.push({
          resize: {
            width: Math.round(imageInfo.width * ratio),
            height: Math.round(imageInfo.height * ratio),
          },
        });
      }

      // Apply manipulations and compress
      const result = await ImageManipulator.manipulateAsync(
        uri,
        manipulateActions,
        {
          compress: this.JPEG_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  // Save profile picture locally
  static async saveProfilePicture(username: string, imageUri: string): Promise<string | null> {
    try {
      await this.initialize();
      
      const filename = `${username}_profile.jpg`;
      const destinationUri = `${this.PROFILE_PICTURES_DIR}${filename}`;
      
      // Copy the processed image to our app directory
      await FileSystem.copyAsync({
        from: imageUri,
        to: destinationUri,
      });

      // Update cache
      await this.updateProfilePictureCache(username, destinationUri);
      
      return destinationUri;
    } catch (error) {
      console.error('Error saving profile picture:', error);
      return null;
    }
  }

  // Get local profile picture
  static async getLocalProfilePicture(username: string): Promise<string | null> {
    try {
      // Check cache first
      const cache = await this.getProfilePictureCache();
      if (cache[username]) {
        const fileInfo = await FileSystem.getInfoAsync(cache[username]);
        if (fileInfo.exists) {
          return cache[username];
        } else {
          // File was deleted, remove from cache
          await this.removeFromProfilePictureCache(username);
        }
      }

      // Check if file exists in directory
      const filename = `${username}_profile.jpg`;
      const filePath = `${this.PROFILE_PICTURES_DIR}${filename}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        await this.updateProfilePictureCache(username, filePath);
        return filePath;
      }

      return null;
    } catch (error) {
      console.error('Error getting local profile picture:', error);
      return null;
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(username: string): Promise<boolean> {
    try {
      const localUri = await this.getLocalProfilePicture(username);
      if (localUri) {
        await FileSystem.deleteAsync(localUri);
        await this.removeFromProfilePictureCache(username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return false;
    }
  }

  // Upload profile picture to server
  static async uploadProfilePicture(username: string, imageUri: string): Promise<boolean> {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file info for proper mime type
      const filename = `${username}_profile.jpg`;
      
      formData.append('profilePicture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      // Upload to your backend
      const response = await fetch(`https://matka-zogy.onrender.com/users/${username}/profile-picture`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('Profile picture uploaded successfully');
        return true;
      } else {
        console.error('Upload failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return false;
    }
  }

  // Get profile picture URI (local first, then remote, then fallback)
  static async getProfilePictureUri(username: string, profilePicture?: string): Promise<string> {
    // Try local first
    const localUri = await this.getLocalProfilePicture(username);
    if (localUri) {
      return localUri;
    }

    // Try remote
    if (profilePicture) {
      const remoteUri = `https://matka-xi.vercel.app/${username}.png`;
      // Check if remote image exists and cache it locally
      try {
        const response = await fetch(remoteUri, { method: 'HEAD' });
        if (response.ok) {
          // Download and cache the remote image
          await this.cacheRemoteImage(username, remoteUri);
          return await this.getLocalProfilePicture(username) || this.getFallbackAvatar(username);
        }
      } catch (error) {
        console.log('Remote image not available for', username);
      }
    }

    // Fallback to generated avatar
    return this.getFallbackAvatar(username);
  }

  // Cache remote image locally
  private static async cacheRemoteImage(username: string, remoteUri: string): Promise<void> {
    try {
      await this.initialize();
      
      const filename = `${username}_profile.jpg`;
      const localUri = `${this.PROFILE_PICTURES_DIR}${filename}`;
      
      const downloadResult = await FileSystem.downloadAsync(remoteUri, localUri);
      
      if (downloadResult.status === 200) {
        await this.updateProfilePictureCache(username, localUri);
        console.log('Cached remote image for', username);
      }
    } catch (error) {
      console.error('Error caching remote image:', error);
    }
  }

  // Get fallback avatar URL - NOW PUBLIC
  static getFallbackAvatar(username: string): string {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;
  }

  // Profile picture cache management
  private static async getProfilePictureCache(): Promise<Record<string, string>> {
    try {
      const cache = await AsyncStorage.getItem(this.CACHE_KEY);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error('Error getting profile picture cache:', error);
      return {};
    }
  }

  private static async updateProfilePictureCache(username: string, uri: string): Promise<void> {
    try {
      const cache = await this.getProfilePictureCache();
      cache[username] = uri;
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error updating profile picture cache:', error);
    }
  }

  private static async removeFromProfilePictureCache(username: string): Promise<void> {
    try {
      const cache = await this.getProfilePictureCache();
      delete cache[username];
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error removing from profile picture cache:', error);
    }
  }

  // Get cache info for debugging
  static async getCacheInfo(): Promise<{
    totalImages: number;
    totalSize: string;
    userImages: string[];
  }> {
    try {
      await this.initialize();
      
      const cache = await this.getProfilePictureCache();
      const userImages = Object.keys(cache);
      
      let totalSize = 0;
      for (const uri of Object.values(cache)) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists && fileInfo.size) {
            totalSize += fileInfo.size;
          }
        } catch (error) {
          console.error('Error getting file size:', error);
        }
      }
      
      return {
        totalImages: userImages.length,
        totalSize: this.formatFileSize(totalSize),
        userImages,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return {
        totalImages: 0,
        totalSize: '0 B',
        userImages: [],
      };
    }
  }

  // Clear all cached images
  static async clearCache(): Promise<void> {
    try {
      await this.initialize();
      
      // Remove all files from directory
      const dirInfo = await FileSystem.getInfoAsync(this.PROFILE_PICTURES_DIR);
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(this.PROFILE_PICTURES_DIR);
        for (const file of files) {
          await FileSystem.deleteAsync(`${this.PROFILE_PICTURES_DIR}${file}`);
        }
      }
      
      // Clear cache
      await AsyncStorage.removeItem(this.CACHE_KEY);
      
      console.log('Profile picture cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Format file size for display
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate image file
  static async validateImage(uri: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      
      if (!fileInfo.exists) {
        return { valid: false, error: 'Tiedostoa ei löydy' };
      }
      
      if (fileInfo.size && fileInfo.size > 10 * 1024 * 1024) { // 10MB limit
        return { valid: false, error: 'Kuva on liian suuri (max 10MB)' };
      }
      
      // Try to get image dimensions to validate it's a valid image
      try {
        await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.JPEG });
        return { valid: true };
      } catch (error) {
        return { valid: false, error: 'Virheellinen kuvatiedosto' };
      }
    } catch (error) {
      return { valid: false, error: 'Kuvan validointi epäonnistui' };
    }
  }
}