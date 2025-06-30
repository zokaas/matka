// src/components/ProfileImagePicker.tsx - Enhanced profile image component
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Button, Menu, Text, ActivityIndicator } from 'react-native-paper';
import { ImageService } from '../services/imageService';
import { theme } from '../constants/theme';

interface ProfileImagePickerProps {
  username: string;
  currentImageUri?: string;
  size?: number;
  onImageChanged?: (newUri: string | null) => void;
  editable?: boolean;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  username,
  currentImageUri,
  size = 100,
  onImageChanged,
  editable = false,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadProfileImage();
  }, [username, currentImageUri]);

  const loadProfileImage = async () => {
    try {
      setLoading(true);
      const uri = await ImageService.getProfilePictureUri(username, currentImageUri);
      setImageUri(uri);
    } catch (error) {
      console.error('Error loading profile image:', error);
      setImageUri(ImageService.getFallbackAvatar(username));
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      setMenuVisible(false);
      setLoading(true);

      const result = await ImageService.pickImage();
      
      if (result.success && result.uri) {
        // Validate the image
        const validation = await ImageService.validateImage(result.uri);
        if (!validation.valid) {
          Alert.alert('Virheellinen kuva', validation.error || 'Kuva ei kelpaa');
          return;
        }

        // Save locally first
        const localUri = await ImageService.saveProfilePicture(username, result.uri);
        if (localUri) {
          setImageUri(localUri);
          onImageChanged?.(localUri);

          // Try to upload to server
          setUploading(true);
          const uploadSuccess = await ImageService.uploadProfilePicture(username, result.uri);
          
          if (uploadSuccess) {
            Alert.alert('Onnistui!', 'Profiilikuva päivitetty');
          } else {
            Alert.alert(
              'Lataus epäonnistui',
              'Kuva tallennettiin laitteelle, mutta ei voitu ladata palvelimelle. Kuva lähetetään kun yhteys on parempi.'
            );
          }
        } else {
          Alert.alert('Virhe', 'Kuvan tallentaminen epäonnistui');
        }
      } else if (result.error) {
        Alert.alert('Virhe', result.error);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Virhe', 'Kuvan valitseminen epäonnistui');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleImageDelete = () => {
    Alert.alert(
      'Poista profiilikuva',
      'Haluatko varmasti poistaa profiilikuvan?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              setMenuVisible(false);
              setLoading(true);
              
              const success = await ImageService.deleteProfilePicture(username);
              if (success) {
                const fallbackUri = await ImageService.getProfilePictureUri(username);
                setImageUri(fallbackUri);
                onImageChanged?.(null);
                Alert.alert('Onnistui', 'Profiilikuva poistettu');
              } else {
                Alert.alert('Virhe', 'Kuvan poistaminen epäonnistui');
              }
            } catch (error) {
              console.error('Error deleting image:', error);
              Alert.alert('Virhe', 'Kuvan poistaminen epäonnistui');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderAvatar = () => {
    if (loading) {
      return (
        <View style={[styles.avatarContainer, { width: size, height: size }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    return (
      <Avatar.Image
        size={size}
        source={{ uri: imageUri || ImageService.getFallbackAvatar(username) }}
        style={styles.avatar}
      />
    );
  };

  if (!editable) {
    return (
      <View style={styles.container}>
        {renderAvatar()}
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.uploadingText}>Lähetetään...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.editableContainer}
            disabled={loading || uploading}
          >
            {renderAvatar()}
            <View style={styles.editOverlay}>
              <Text style={styles.editText}>Muokkaa</Text>
            </View>
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.uploadingText}>Lähetetään...</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      >
        <Menu.Item
          onPress={handleImagePick}
          title="Vaihda kuva"
          leadingIcon="camera"
        />
        <Menu.Item
          onPress={handleImageDelete}
          title="Poista kuva"
          leadingIcon="delete"
        />
        <Menu.Item
          onPress={() => setMenuVisible(false)}
          title="Peruuta"
          leadingIcon="close"
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    borderRadius: 50,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  avatar: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  editableContainer: {
    position: 'relative',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  editText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
});
