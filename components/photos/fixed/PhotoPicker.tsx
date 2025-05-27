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
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FullScreenCamera } from '@/components/photos/camera/FullScreenCamera';
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
  const [cameraVisible, setCameraVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Helper to generate a unique ID for photos
  const generatePhotoId = () => `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Request permissions for camera and media library
  const requestPermissions = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
        
        if (cameraStatus !== 'granted' || libraryStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
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
  
  // Take a new photo with the full-screen camera
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
        allowsEditing: false,
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
  
  // Handle photo capture from full-screen camera
  const handlePhotoCapture = (photo: Photo) => {
    onPhotosChange([...photos, photo]);
    setCameraVisible(false);
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
        exif: true, // Request EXIF data
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Get creation time from the media library
        let timestamp = new Date().toISOString(); // Default to current time
        
        try {
          // Create an asset from the selected image URI
          const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
          
          // If we have a creation time, use it
          if (asset && asset.creationTime) {
            timestamp = new Date(asset.creationTime).toISOString();
            console.log('Using photo creation time:', timestamp);
          }
        } catch (mediaError) {
          console.error('Error getting media asset details:', mediaError);
          // Continue with current timestamp if media library fails
        }
        
        const newPhoto: Photo = {
          id: generatePhotoId(),
          uri: result.assets[0].uri,
          timestamp: timestamp,
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
      
      {/* Photo Grid and Camera/Gallery Buttons */}
      <ThemedView className="">
        {photos.length > 0 ? (
          <ThemedView>
            <FlatList
            data={photos}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
            <Pressable 
            className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-lg mr-2 mb-3 overflow-hidden relative" 
            onPress={() => viewPhoto(index)}
            >
            <Image 
            source={{ uri: item.uri }} 
            style={{ width: '100%', height: '100%' }}
            onError={(error) => {
            console.log('Image load error:', error, 'URI:', item.uri);
            }}
            onLoad={() => {
            console.log('Image loaded successfully:', item.uri);
            }}
            />
                    <Pressable
                      className="absolute top-1 right-1 z-10 bg-black/30 rounded-full"
                      onPress={() => removePhoto(item.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#E11D48" />
                    </Pressable>
                  </Pressable>
                )}
            />
          </ThemedView>
        ) : null}
        
        {/* Camera and Gallery buttons - always at bottom */}
        <ThemedView className={`${photos.length === 0 ? 'h-[150px] md:h-[180px] rounded-lg border border-dashed' : ''} flex-row justify-center items-center`}
          style={{ borderColor: photos.length === 0 ? (colorScheme === 'dark' ? '#3E4144' : '#9CA3AF') : 'transparent' }}
        >
          {photos.length < maxPhotos && (
            <ThemedView className="flex-row justify-center items-center gap-4">
              <Pressable
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg items-center justify-center border"
                style={{ borderColor: '#FF8C38' }}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color="#FF8C38" />
              </Pressable>
              <Pressable
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg items-center justify-center border"
                style={{ borderColor: '#FF8C38' }}
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color="#FF8C38" />
              </Pressable>
            </ThemedView>
          )}
          
          {photos.length === 0 && (
            <ThemedText className="opacity-50 absolute bottom-2 text-xs text-center">
              Take or select up to {maxPhotos} photos
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
      
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
            <View className="w-full h-[90%] items-center justify-center">
              <Image
                source={{ uri: photos[selectedPhotoIndex].uri }}
                className="w-full h-[80%]"
                resizeMode="contain"
              />
              {photos[selectedPhotoIndex].timestamp && (
                <View className="absolute bottom-5 bg-black/50 px-4 py-2 rounded-lg">
                  <ThemedText className="text-white text-sm">
                    {new Date(photos[selectedPhotoIndex].timestamp).toLocaleString()}
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>
    </ThemedView>
  );
};

// NativeWind classes replace StyleSheet