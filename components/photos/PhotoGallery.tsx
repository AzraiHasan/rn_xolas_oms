import { Image } from 'expo-image';
import React, { useState, useCallback } from 'react';
import { 
  Dimensions, 
  FlatList, 
  Modal, 
  Pressable, 
  TouchableOpacity,
  ActivityIndicator,
  View,
  StyleSheet,
  Text
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
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

  /**
   * Optional callback for photo removal
   */
  onPhotoRemove?: (photoId: string) => void;
}

/**
 * Component for displaying a grid of photos with fullscreen viewer
 */
export function PhotoGallery({ photos, title = 'Photos', onPhotoRemove }: PhotoGalleryProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  const { width, height } = Dimensions.get('window');
  
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
  
  // Handle photo removal
  const handleRemovePhoto = useCallback((photoId: string) => {
    if (onPhotoRemove) {
      onPhotoRemove(photoId);
    }
  }, [onPhotoRemove]);
  
  // PhotoItem component to fix hooks error
  const PhotoItem = React.memo(({ photo, index, onPress }: {
    photo: Photo;
    index: number;
    onPress: (index: number) => void;
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    
    return (
      <View className="w-1/3 aspect-square p-1.5 md:w-1/4 lg:w-1/5">
        <TouchableOpacity 
          className="rounded-lg overflow-hidden mb-1"
          onPress={() => onPress(index)}
          activeOpacity={0.7}
          style={{aspectRatio: 1}}
        >
          <View style={styles.imageContainer}>
            {isLoading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.tint} />
              </View>
            )}
            
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
                <IconSymbol name="exclamationmark.triangle" size={20} color={colors.error || '#E11D48'} />
                <ThemedText style={styles.errorText}>Failed to load</ThemedText>
              </View>
            ) : (
              <Image
                source={{ uri: photo.uri }}
                className="flex-1"
                contentFit="cover"
                style={styles.image}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError(true);
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  });
  
  // Simple grid layout to avoid FlatList nesting issues
  const renderSimpleGrid = () => {
    return (
      <ThemedView className="flex-row flex-wrap">
        {photos.map((photo, index) => {
          return (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={index}
              onPress={openPhotoViewer}
              onRemove={onPhotoRemove}
            />
          );
        })}
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
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <ThemedText style={styles.photoCounter}>
              {selectedPhotoIndex + 1} / {photos.length}
            </ThemedText>
          </View>
          
          {/* Image Container */}
          <View style={styles.imageViewerContainer}>
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.fullScreenImage}
              contentFit="contain"
              transition={200}
            />
          </View>
          
          {/* Navigation overlay */}
          {photos.length > 1 && (
            <View style={styles.navOverlay}>
              <TouchableOpacity
                style={styles.navButtonLeft}
                onPress={() => navigateToPhoto('prev')}
              >
                <IconSymbol name="chevron.left" size={36} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.navButtonRight}
                onPress={() => navigateToPhoto('next')}
              >
                <IconSymbol name="chevron.right" size={36} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Footer */}
          <View style={styles.modalFooter}>
            {selectedPhoto.title && (
              <ThemedText style={styles.photoTitle}>{selectedPhoto.title}</ThemedText>
            )}
            
            <ThemedText style={styles.timestamp}>
              {formatTimestamp(selectedPhoto.timestamp)}
            </ThemedText>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ThemedView className="mb-6">
      {title && <ThemedText type="subtitle" className="mb-4">{title} ({photos.length})</ThemedText>}
      
      <ThemedView style={{minHeight: photos.length > 0 ? 200 : 'auto', maxHeight: 320}}>
        {photos.length === 0 ? (
          <ThemedView className="items-center justify-center p-8 border border-[#E4E7EB] dark:border-gray-700 border-dashed rounded-lg">
            <IconSymbol name="photo.fill" size={32} color={colors.icon} />
            <ThemedText className="mt-2 text-[#687076] dark:text-gray-400">No photos available</ThemedText>
          </ThemedView>
        ) : renderSimpleGrid()}
      </ThemedView>
      {renderPhotoViewer()}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Grid Styles
  imageContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
  },
  errorText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCounter: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height - 180,
  },
  navOverlay: {
    position: 'absolute',
    top: 60,
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  navButtonLeft: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonRight: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    padding: 16,
  },
  photoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  timestamp: {
    color: '#CCCCCC',
    fontSize: 14,
  },
});
