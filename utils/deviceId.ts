/**
 * Device ID Utility
 * 
 * Generates and persists unique device identifiers for backend data isolation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'xolas_oms.device_id';

/**
 * Get or generate a unique device identifier
 * Device ID persists across app sessions for consistent data isolation
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Check if device ID already exists
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Generate new device ID
      deviceId = uuidv4();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Failed to get/generate device ID:', error);
    // Fallback to temporary ID if storage fails
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

/**
 * Reset device ID (for testing or data isolation reset)
 */
export async function resetDeviceId(): Promise<string> {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
    return await getDeviceId();
  } catch (error) {
    console.error('Failed to reset device ID:', error);
    throw error;
  }
}
