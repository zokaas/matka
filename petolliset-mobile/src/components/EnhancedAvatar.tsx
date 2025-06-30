
// src/components/EnhancedAvatar.tsx - Simple enhanced avatar component for lists
import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { ImageService } from '../services/imageService';

interface EnhancedAvatarProps {
  username: string;
  profilePicture?: string;
  size?: number;
  style?: any;
}

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  username,
  profilePicture,
  size = 40,
  style,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    loadImage();
  }, [username, profilePicture]);

  const loadImage = async () => {
    try {
      const uri = await ImageService.getProfilePictureUri(username, profilePicture);
      setImageUri(uri);
    } catch (error) {
      console.error('Error loading avatar:', error);
      setImageUri(`https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`);
    }
  };

  return (
    <Avatar.Image
      size={size}
      source={{
        uri: imageUri || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      }}
      style={style}
    />
  );
};