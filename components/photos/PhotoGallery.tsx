import { Image } from 'expo-image';
import React, { useState } from 'react';
import { 
  Dimensions, 
  FlatList, 
  Modal, 
  Pressable, 
  StyleSheet, 
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
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol size={32} name="photo.fill" color={colors.icon} />
          <ThemedText style={styles.emptyText}>No photos available</ThemedText>
        </ThemedView>
      );
    }
    
    return (
      <ThemedView style={styles.gridContainer}>
        {photos.map((photo, index) => (
          <TouchableOpacity 
            key={photo.id} 
            style={styles.gridItem}
            onPress={() => openPhotoViewer(index)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: photo.uri }}
              style={styles.gridImage}
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
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <ThemedText style={styles.photoCounter}>
              {selectedPhotoIndex + 1} / {photos.length}
            </ThemedText>
          </ThemedView>
          
          <Pressable 
            style={styles.imageContainer}
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.fullImage}
              contentFit="contain"
            />
            
            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigateToPhoto('prev');
                  }}
                >
                  <IconSymbol name="chevron.left" size={36} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
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
          
          <ThemedView style={styles.modalFooter}>
            {selectedPhoto.title && (
              <ThemedText style={styles.photoTitle}>{selectedPhoto.title}</ThemedText>
            )}
            
            <ThemedText style={styles.photoDate}>
              {formatTimestamp(selectedPhoto.timestamp)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </Modal>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      {title && <ThemedText type="subtitle" style={styles.title}>{title} ({photos.length})</ThemedText>}
      
      {renderPhotoGrid()}
      {renderPhotoViewer()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 8,
    color: '#687076',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '33.333%',
    aspectRatio: 1,
    padding: 6,
  },
  gridImage: {
    flex: 1,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
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
  photoDate: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  navButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    left: 16,
  },
  nextButton: {
    right: 16,
  },
});
