import React, { useState } from 'react';
import {
  View,
  Pressable,
  Modal,
  Image,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Photo } from '@/types/models/Issue';

interface PhotoPickerProps {
  /**
   * Array of photos currently selected
   */
  photos: Photo[];
  
  /**
   * Callback when photos are added or removed
   */
  onPhotosChange: (photos: Photo[]) => void;
  
  /**
   * Maximum number of photos allowed
   * @default 5
   */
  maxPhotos?: number;
  
  /**
   * Optional label for the component
   */
  label?: string;
  
  /**
   * Whether the field is required
   */
  required?: boolean;
}

/**
 * Component for selecting and managing photos for issue reports
 */
export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 5,
  label = 'Photos',
  required = false,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Helper to generate a unique ID for photos
  const generatePhotoId = () => `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Request permissions for camera and media library
  const requestPermissions = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
          Alert.alert(
            'Permissions Required',
            'Please grant camera and photo library permissions to use this feature',
            [{ text: 'OK' }]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };
  
  // Take a new photo with the camera
  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only add up to ${maxPhotos} photos`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto: Photo = {
          id: generatePhotoId(),
          uri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
        };
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Pick an existing photo from the gallery
  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    
    if (photos.length >= maxPhotos) {
      Alert.alert(
        'Maximum Photos Reached',
        `You can only add up to ${maxPhotos} photos`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhoto: Photo = {
          id: generatePhotoId(),
          uri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
        };
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  // Remove a photo from the selected photos
  const removePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
  };
  
  // View a photo in full screen modal
  const viewPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    setModalVisible(true);
  };
  
  return (
    <ThemedView className="mb-5">
      {/* Label */}
      {label && (
        <View className="flex-row mb-1.5">
          <ThemedText className="text-sm font-medium">{label}</ThemedText>
          {required && <ThemedText className="text-[#E11D48] font-medium"> *</ThemedText>}
        </View>
      )}
      
      {/* Photo Grid */}
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable 
              className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-lg mr-2 overflow-hidden relative" 
              onPress={() => viewPhoto(index)}
            >
              <Image source={{ uri: item.uri }} className="w-full h-full" />
              <Pressable
                className="absolute top-1 right-1 z-10 bg-black/30 rounded-full"
                onPress={() => removePhoto(item.id)}
              >
                <Ionicons name="close-circle" size={24} color="#E11D48" />
              </Pressable>
            </Pressable>
          )}
          ListFooterComponent={
            photos.length < maxPhotos ? (
              <View className="flex-row justify-center items-center gap-4">
                <Pressable
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={24} color="white" />
                </Pressable>
                <Pressable
                  className="w-20 h-20 md:w-24 md:h-24 rounded-lg items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                  onPress={pickImage}
                >
                  <Ionicons name="images" size={24} color="white" />
                </Pressable>
              </View>
            ) : null
          }
        />
      ) : (
        <ThemedView 
          className="h-[150px] md:h-[180px] rounded-lg border border-dashed items-center justify-center p-4"
          style={{ borderColor: colorScheme === 'dark' ? '#3E4144' : '#9CA3AF' }}
        >
          <View className="flex-row justify-center items-center gap-4">
            <Pressable
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary }}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="white" />
              <ThemedText className="text-white mt-1 text-xs">Camera</ThemedText>
            </Pressable>
            <Pressable
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary }}
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color="white" />
              <ThemedText className="text-white mt-1 text-xs">Gallery</ThemedText>
            </Pressable>
          </View>
          <ThemedText className="opacity-50 mt-2 text-center">
            Take or select up to {maxPhotos} photos
          </ThemedText>
        </ThemedView>
      )}
      
      {/* Photo Modal for full-screen preview */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <Pressable
            className="absolute top-10 right-5 z-10"
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={30} color="white" />
          </Pressable>
          
          {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
            <Image
              source={{ uri: photos[selectedPhotoIndex].uri }}
              className="w-full h-[80%]"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
};

// NativeWind classes replace StyleSheet