import { Image } from 'expo-image';
import React, { useState } from 'react';
import { 
  Dimensions, 
  FlatList, 
  Modal, 
  Pressable, 
  TouchableOpacity
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Photo } from '@/types/models/Issue';

interface PhotoGalleryProps {
  /**
   * Photos to display in the gallery
   */
  photos: Photo[];
  
  /**
   * Title for the gallery section
   */
  title?: string;
}

/**
 * Component for displaying a grid of photos with fullscreen viewer
 */
export function PhotoGallery({ photos, title = 'Photos' }: PhotoGalleryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  const { width: screenWidth } = Dimensions.get('window');
  
  // Format timestamp to a readable date
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Open full-screen viewer for a photo
  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setModalVisible(true);
  };
  
  // Handle navigation in full-screen viewer
  const navigateToPhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedPhotoIndex(prev => (prev > 0 ? prev - 1 : photos.length - 1));
    } else {
      setSelectedPhotoIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
    }
  };
  
  // Render the photo grid
  const renderPhotoGrid = () => {
    if (photos.length === 0) {
      return (
        <ThemedView className="items-center justify-center p-8 border border-[#E4E7EB] dark:border-gray-700 border-dashed rounded-lg">
          <IconSymbol size={32} name="photo.fill" color={colors.icon} />
          <ThemedText className="mt-2 text-[#687076] dark:text-gray-400">No photos available</ThemedText>
        </ThemedView>
      );
    }
    
    return (
      <ThemedView className="flex-row flex-wrap -mx-1.5">
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={photo.id} 
            className="w-1/3 aspect-square p-1.5 md:w-1/4 lg:w-1/5"
            onPress={() => openPhotoViewer(index)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: photo.uri }}
              className="flex-1 rounded-lg"
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </ThemedView>
    );
  };
  
  // Render the full-screen photo viewer
  const renderPhotoViewer = () => {
    if (photos.length === 0) return null;
    
    const selectedPhoto = photos[selectedPhotoIndex];
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView className="flex-1 bg-black/90">
          <ThemedView className="flex-row justify-between items-center px-4 py-3">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-11 h-11 items-center justify-center"
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <ThemedText className="text-white text-base">
              {selectedPhotoIndex + 1} / {photos.length}
            </ThemedText>
          </ThemedView>
          
          <Pressable 
            className="flex-1 justify-center"
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={{ uri: selectedPhoto.uri }}
              className="w-full h-full"
              contentFit="contain"
            />
            
            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <TouchableOpacity
                  className="absolute w-15 h-15 rounded-full bg-black/30 items-center justify-center left-4"
                  onPress={(e) => {
                    e.stopPropagation();
                    navigateToPhoto('prev');
                  }}
                >
                  <IconSymbol name="chevron.left" size={36} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="absolute w-15 h-15 rounded-full bg-black/30 items-center justify-center right-4"
                  onPress={(e) => {
                    e.stopPropagation();
                    navigateToPhoto('next');
                  }}
                >
                  <IconSymbol name="chevron.right" size={36} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
          </Pressable>
          
          <ThemedView className="p-4">
            {selectedPhoto.title && (
              <ThemedText className="text-white text-base font-medium mb-1">{selectedPhoto.title}</ThemedText>
            )}
            
            <ThemedText className="text-[#CCCCCC] text-sm">
              {formatTimestamp(selectedPhoto.timestamp)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    );
  };
  
  return (
    <ThemedView className="mb-6">
      {title && <ThemedText type="subtitle" className="mb-4">{title} ({photos.length})</ThemedText>}
      
      {renderPhotoGrid()}
      {renderPhotoViewer()}
    </ThemedView>
  );
}

// NativeWind classes replace StyleSheet
