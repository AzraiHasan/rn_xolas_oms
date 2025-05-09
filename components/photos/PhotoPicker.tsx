import React, { useState } from 'react';
import {
  StyleSheet,
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    <ThemedView style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>{label}</ThemedText>
          {required && <ThemedText style={styles.requiredIndicator}> *</ThemedText>}
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
              style={styles.photoItem} 
              onPress={() => viewPhoto(index)}
            >
              <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
              <Pressable
                style={styles.removeButton}
                onPress={() => removePhoto(item.id)}
              >
                <Ionicons name="close-circle" size={24} color="#E11D48" />
              </Pressable>
            </Pressable>
          )}
          ListFooterComponent={
            photos.length < maxPhotos ? (
              <View style={styles.photoActionsContainer}>
                <Pressable
                  style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={24} color="white" />
                </Pressable>
                <Pressable
                  style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
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
          style={[
            styles.photoPlaceholder,
            { borderColor: colorScheme === 'dark' ? '#3E4144' : '#9CA3AF' }
          ]}
        >
          <View style={styles.photoActionsContainer}>
            <Pressable
              style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="white" />
              <ThemedText style={styles.photoActionText}>Camera</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
              onPress={pickImage}
            >
              <Ionicons name="images" size={24} color="white" />
              <ThemedText style={styles.photoActionText}>Gallery</ThemedText>
            </Pressable>
          </View>
          <ThemedText style={styles.photoPlaceholderText}>
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
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={30} color="white" />
          </Pressable>
          
          {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
            <Image
              source={{ uri: photos[selectedPhotoIndex].uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  requiredIndicator: {
    color: '#E11D48',
    fontWeight: '500',
  },
  photoPlaceholder: {
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  photoPlaceholderText: {
    opacity: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },
  photoActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  photoActionButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  photoItem: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
