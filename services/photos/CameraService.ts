/**
 * Camera Service
 * 
 * Provides a unified interface for camera operations including capturing photos,
 * managing permissions, and processing images for use in the application.
 * This service abstracts the complexity of camera interactions and ensures
 * consistent behavior across the application.
 */

import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { fileStorage } from '../StorageService';
import { Photo } from '@/types/models/Issue';

/**
 * Options for photo capture and processing
 */
export interface PhotoCaptureOptions {
  /** Quality of the captured image (0.0 - 1.0) */
  quality?: number;
  /** Whether to allow editing the photo after capture */
  allowsEditing?: boolean;
  /** Aspect ratio to maintain during editing (width/height) */
  aspect?: [number, number];
  /** Whether to include location metadata */
  includeLocation?: boolean;
  /** Maximum dimensions to resize the image to (preserves aspect ratio) */
  maxDimensions?: { width: number; height: number };
  /** Optional photo title */
  title?: string;
}

/**
 * Default options for photo capture
 */
const DEFAULT_OPTIONS: PhotoCaptureOptions = {
  quality: 0.8,
  allowsEditing: true,
  aspect: [4, 3],
  includeLocation: false,
  maxDimensions: { width: 1600, height: 1200 },
};

/**
 * Camera Service for handling photo capture and management
 */
export const CameraService = {
  /**
   * Check and request camera permissions
   * @returns Promise resolving to whether permission is granted
   */
  requestCameraPermissions: async (): Promise<boolean> => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'Please grant camera permission to use this feature',
            [{ text: 'OK' }]
          );
          return false;
        }
        return true;
      }
      return true; // Web platform doesn't require permissions
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  },

  /**
   * Check and request photo library permissions
   * @returns Promise resolving to whether permission is granted
   */
  requestMediaLibraryPermissions: async (): Promise<boolean> => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Photo Library Permission Required',
            'Please grant photo library access to use this feature',
            [{ text: 'OK' }]
          );
          return false;
        }
        return true;
      }
      return true; // Web platform doesn't require permissions
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  },

  /**
   * Process an image URI through image manipulator
   * @param uri Original image URI
   * @param options Processing options
   * @returns Promise resolving to processed image URI
   */
  processImage: async (
    uri: string, 
    options: PhotoCaptureOptions = DEFAULT_OPTIONS
  ): Promise<string> => {
    try {
      const actions: ImageManipulator.Action[] = [];
      
      // Add resize action if maxDimensions is specified
      if (options.maxDimensions) {
        actions.push({
          resize: {
            width: options.maxDimensions.width,
            height: options.maxDimensions.height,
          },
        });
      }
      
      // Process the image if we have actions to perform
      if (actions.length > 0) {
        const processedImage = await ImageManipulator.manipulateAsync(
          uri,
          actions,
          { compress: options.quality || 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return processedImage.uri;
      }
      
      return uri; // Return original URI if no processing needed
    } catch (error) {
      console.error('Error processing image:', error);
      return uri; // Return original URI on error
    }
  },

  /**
   * Take a photo using the device camera
   * @param options Photo capture options
   * @returns Promise resolving to the captured photo
   */
  takePhoto: async (
    options: PhotoCaptureOptions = DEFAULT_OPTIONS
  ): Promise<Photo | null> => {
    try {
      // Request camera permissions
      const hasPermission = await CameraService.requestCameraPermissions();
      if (!hasPermission) return null;
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing,
        aspect: options.aspect,
        quality: options.quality,
      });
      
      // Return null if the user cancelled or no assets were captured
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }
      
      // Process the image if needed
      const processedUri = await CameraService.processImage(result.assets[0].uri, options);
      
      // Save the image to local storage
      const savedImage = await fileStorage.saveImage(processedUri, options.title);
      
      // Create and return the Photo object
      const photo: Photo = {
        id: savedImage.id,
        uri: savedImage.uri,
        timestamp: new Date().toISOString(),
        title: options.title,
      };
      
      return photo;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    }
  },

  /**
   * Select a photo from the device's media library
   * @param options Photo selection options
   * @returns Promise resolving to the selected photo
   */
  selectPhoto: async (
    options: PhotoCaptureOptions = DEFAULT_OPTIONS
  ): Promise<Photo | null> => {
    try {
      // Request media library permissions
      const hasPermission = await CameraService.requestMediaLibraryPermissions();
      if (!hasPermission) return null;
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing,
        aspect: options.aspect,
        quality: options.quality,
      });
      
      // Return null if the user cancelled or no assets were selected
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }
      
      // Process the image if needed
      const processedUri = await CameraService.processImage(result.assets[0].uri, options);
      
      // Save the image to local storage
      const savedImage = await fileStorage.saveImage(processedUri, options.title);
      
      // Create and return the Photo object
      const photo: Photo = {
        id: savedImage.id,
        uri: savedImage.uri,
        timestamp: new Date().toISOString(),
        title: options.title,
      };
      
      return photo;
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
      return null;
    }
  },

  /**
   * Capture multiple photos in sequence
   * @param count Maximum number of photos to capture
   * @param options Photo capture options
   * @returns Promise resolving to an array of captured photos
   */
  captureMultiplePhotos: async (
    count: number,
    options: PhotoCaptureOptions = DEFAULT_OPTIONS
  ): Promise<Photo[]> => {
    const photos: Photo[] = [];
    
    for (let i = 0; i < count; i++) {
      // Capture a single photo
      const photo = await CameraService.takePhoto(options);
      
      // Add to collection if successful
      if (photo) {
        photos.push(photo);
      } else {
        // Break the loop if user cancels
        break;
      }
    }
    
    return photos;
  },

  /**
   * Delete a photo
   * @param photo Photo to delete
   * @returns Promise resolving to whether the deletion was successful
   */
  deletePhoto: async (photo: Photo): Promise<boolean> => {
    try {
      return await fileStorage.deleteImage(photo.uri);
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  },
};

// Export the service interface for type checking
export type ICameraService = typeof CameraService;
