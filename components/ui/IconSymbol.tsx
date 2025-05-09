import { MaterialIcons } from '@expo/vector-icons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, Platform, Text } from 'react-native';

// Define Material Icons mapping
const MATERIAL_ICON_MAPPING: Record<string, string> = {
  // SF Symbol to Material Icon mapping
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'exclamationmark.circle.fill': 'error',
  'doc.text.fill': 'description',
  'plus.circle.fill': 'add',  // Using simpler icon names
  'exclamationmark.triangle.fill': 'warning',
  'checkmark.circle.fill': 'check',
  'list.bullet': 'list',
  'tray.fill': 'inbox',
  'mappin.circle.fill': 'place',
  'info.circle.fill': 'info',
};

// Get safe icon name for Material Icons
function getSafeMaterialIconName(name: string): string {
  // Use mapping if available
  if (MATERIAL_ICON_MAPPING[name]) {
    return MATERIAL_ICON_MAPPING[name];
  }
  
  // Convert SF Symbol format to Material format
  // Replace dots with underscores, remove '.fill' suffix
  return name
    .replace(/\.fill$/, '')
    .replace(/\./g, '_');
}

/**
 * Cross-platform icon component that uses Material Icons
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Get safe icon name for the current platform
  const iconName = getSafeMaterialIconName(name);
  
  // Fallback for missing icons
  const handleError = () => {
    console.warn(`Icon name "${name}" could not be mapped to a valid Material icon`);
  };
  
  return (
    <MaterialIcons 
      name={iconName} 
      size={size} 
      color={color} 
      style={style}
      onError={handleError}
    />
  );
}
