/**
 * Strategic dependency installation script
 * This script installs core dependencies required for the Onsite Reporting App
 * to enable technicians to capture, document, and manage site observations.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define core capabilities and their corresponding packages
const dependencies = [
  // Data persistence layer
  '@react-native-async-storage/async-storage', // For simple key-value storage
  'expo-sqlite',                              // For structured data storage
  
  // Media capture capabilities
  'expo-camera',                              // For accessing device camera
  'expo-image-picker',                        // For selecting images from gallery
  
  // File system operations
  'expo-file-system',                         // For local file storage
  
  // Device capabilities
  'expo-location',                            // For location awareness (future feature)
  
  // UI enhancements
  'react-native-paper',                       // Material Design components
  'uuid'                                      // For generating unique identifiers
];

console.log('🚀 Installing strategic dependencies for Onsite Reporting App...');

try {
  // Execute the installation command
  const command = `npx expo install ${dependencies.join(' ')}`;
  console.log(`Executing: ${command}`);
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ Dependencies successfully installed.');
  console.log('\nStrategic capabilities now available:');
  console.log('- Offline data persistence');
  console.log('- Photo capture and attachment');
  console.log('- Local file storage');
  console.log('- Location awareness (foundation for future features)');
  console.log('- Enhanced UI components');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}
