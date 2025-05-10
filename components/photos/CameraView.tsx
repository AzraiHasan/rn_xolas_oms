import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert,
  Platform,
  Modal,
  Pressable
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { CameraService } from '@/services/photos/CameraService';
import { Photo } from '@/types/models/Issue';

interface CameraViewProps {
  /**
   * Whether the camera view is visible
   */
  visible: boolean;
  
  /**
   * Callback when the camera view is closed
   */
  onClose: () => void;
  
  /**
   * Callback when a photo is captured and confirmed
   */
  onPhotoTaken: (photo: Photo) => void;
  
  /**
   * Optional title for the captured photo
   */
  photoTitle?: string;
}

/**
 * Full-screen camera interface for capturing photos
 */
export const CameraView: React.FC<CameraViewProps> = ({
  visible,
  onClose,
  onPhotoTaken,
  photoTitle,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const cameraRef = useRef<Camera>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Request camera permissions on mount
  useEffect(() => {
    (async () => {
      if (visible) {
        const granted = await CameraService.requestCameraPermissions();
        setHasPermission(granted);
      }
    })();
  }, [visible]);
  
  // Handle camera type toggle (front/back)
  const toggleCameraType = () => {
    setCameraType(current => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  };
  
  // Handle flash mode toggle
  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case FlashMode.off:
          return FlashMode.on;
        case FlashMode.on:
          return FlashMode.auto;
        case FlashMode.auto:
          return FlashMode.off;
        default:
          return FlashMode.off;
      }
    });
  };
  
  // Get flash icon based on current mode
  const getFlashIcon = () => {
    switch (flashMode) {
      case FlashMode.on:
        return 'bolt.fill';
      case FlashMode.auto:
        return 'bolt';
      case FlashMode.off:
        return 'bolt.slash';
      default:
        return 'bolt.slash';
    }
  };
  
  // Take photo using camera
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };
  
  // Discard captured image and return to camera
  const retakePhoto = () => {
    setCapturedImage(null);
  };
  
  // Save captured photo
  const savePhoto = async () => {
    if (!capturedImage) return;
    
    try {
      // Process and save the captured photo
      const processedUri = await CameraService.processImage(capturedImage, {
        maxDimensions: { width: 1600, height: 1200 },
        quality: 0.8,
        title: photoTitle,
      });
      
      // Save to file storage and get Photo object
      const savedImage = await fileStorage.saveImage(processedUri, photoTitle);
      
      const photo: Photo = {
        id: savedImage.id,
        uri: savedImage.uri,
        timestamp: new Date().toISOString(),
        title: photoTitle,
      };
      
      // Pass the photo back to parent
      onPhotoTaken(photo);
      
      // Reset the camera view
      setCapturedImage(null);
      onClose();
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };
  
  // Render permission error
  if (hasPermission === false) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <ThemedView className="flex-1 justify-center items-center p-6">
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color={colors.warning} />
          <ThemedText className="text-lg font-medium mt-4 mb-2">Camera Permission Required</ThemedText>
          <ThemedText className="text-center mb-6">
            Please grant camera permission in your device settings to use this feature.
          </ThemedText>
          <TouchableOpacity
            className="px-6 py-3 rounded-lg"
            style={{ backgroundColor: colors.primary }}
            onPress={onClose}
          >
            <ThemedText className="text-white font-medium">Close</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    );
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ThemedView className="flex-1 bg-black">
        {/* Camera preview or image preview */}
        {!capturedImage ? (
          // Camera preview
          <View className="flex-1">
            {hasPermission && (
              <Camera
                ref={cameraRef}
                type={cameraType}
                flashMode={flashMode}
                className="flex-1"
              />
            )}
            
            {/* Camera controls overlay - top */}
            <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                onPress={onClose}
              >
                <IconSymbol name="xmark" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                  onPress={toggleFlashMode}
                >
                  <IconSymbol name={getFlashIcon()} size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                  onPress={toggleCameraType}
                >
                  <IconSymbol name="camera.rotate" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Camera controls overlay - bottom */}
            <View className="absolute bottom-10 left-0 right-0 items-center">
              <TouchableOpacity
                className="w-18 h-18 rounded-full bg-white items-center justify-center"
                onPress={takePhoto}
              >
                <View className="w-16 h-16 rounded-full border-2 border-black" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Captured image preview
          <View className="flex-1">
            <Image
              source={{ uri: capturedImage }}
              className="flex-1"
              contentFit="cover"
            />
            
            {/* Preview controls overlay */}
            <View className="absolute bottom-10 left-0 right-0 flex-row justify-center items-center gap-8">
              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-white/20 items-center justify-center"
                onPress={retakePhoto}
              >
                <IconSymbol name="arrow.counterclockwise" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-white items-center justify-center"
                onPress={savePhoto}
              >
                <IconSymbol name="checkmark" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ThemedView>
    </Modal>
  );
};

// Import for file storage
import { fileStorage } from '@/services/StorageService';
