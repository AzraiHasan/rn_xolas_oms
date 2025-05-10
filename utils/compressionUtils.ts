import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { PhotoData } from '@/types/services/Storage';

/**
 * Utility functions for optimizing data for network transmission
 */

/**
 * Compress an image file to reduce size for upload
 * @param uri Original image URI
 * @param quality Compression quality (0-1)
 * @returns Promise resolving to the compressed image URI
 */
export async function compressImage(
  uri: string, 
  quality: number = 0.7
): Promise<string> {
  try {
    // Check file size first
    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    // If already small, don't compress
    if (fileInfo.size && fileInfo.size < 200 * 1024) { // Less than 200KB
      return uri;
    }
    
    // Manipulate image to compress
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Resize to max width of 1200px
      { compress: quality, format: SaveFormat.JPEG }
    );
    
    return result.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original on error
    return uri;
  }
}

/**
 * Prepare photos for upload by compressing them
 * @param photoData Photo data object
 * @returns Promise resolving to the photo data with updated URI
 */
export async function preparePhotoForUpload(
  photoData: PhotoData
): Promise<PhotoData> {
  // Compress the image
  const compressedUri = await compressImage(photoData.uri);
  
  // If the URI changed (image was compressed)
  if (compressedUri !== photoData.uri) {
    return {
      ...photoData,
      // Store original URI but use compressed for upload
      originalUri: photoData.uri,
      uri: compressedUri,
    };
  }
  
  return photoData;
}

/**
 * Compress a batch of photos in parallel
 * @param photos Array of photo data objects
 * @returns Promise resolving to compressed photo data objects
 */
export async function compressPhotoBatch(
  photos: PhotoData[]
): Promise<PhotoData[]> {
  return Promise.all(photos.map(photo => preparePhotoForUpload(photo)));
}

/**
 * Simple data compaction for JSON data
 * Removes null and undefined values, trims strings
 * @param data Object to compact
 * @returns Compacted object
 */
export function compactJSON<T extends Record<string, any>>(data: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const key in data) {
    const value = data[key];
    
    if (value === null || value === undefined) {
      // Skip null/undefined values
      continue;
    }
    
    if (typeof value === 'string') {
      // Trim strings
      result[key] = value.trim() as any;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively compact objects
      result[key] = compactJSON(value) as any;
    } else {
      // Keep other values as is
      result[key] = value;
    }
  }
  
  return result;
}
