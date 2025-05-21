import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Define Material Community Icons mapping
const MATERIAL_ICON_MAPPING: Record<string, string> = {
  // SF Symbol to Material Community Icon mapping
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-tags',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'exclamationmark.circle.fill': 'alert-circle',
  'doc.text.fill': 'file-document',
  'plus.circle.fill': 'plus-circle',  
  'plus': 'plus',
  'exclamationmark.triangle.fill': 'alert',
  'checkmark.circle.fill': 'check-circle',
  'list.bullet': 'format-list-bulleted',
  'tray.fill': 'inbox',
  'mappin.circle.fill': 'map-marker',
  'info.circle.fill': 'information',
  'calendar': 'calendar',
  'calendar.circle': 'calendar',
  'xmark': 'close',
  'photo.fill': 'image',
  'pencil': 'pencil',
  'trash.fill': 'delete',
  'square.and.arrow.up': 'share',
  // Additional mappings for problematic icons
  'person.crop.circle.fill': 'account-circle',
  'arrow.triangle.2.circlepath': 'sync',
  'checkmark.seal.fill': 'check-decagram',
  'person.crop.circle': 'account',
  'checkmark.seal': 'check-decagram-outline',
  'line.3.horizontal.decrease.circle': 'filter-variant',
  'event': 'calendar-month',
  'arrow.counterclockwise': 'refresh',
  'chart.bar': 'chart-bar'
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
    <MaterialCommunityIcons 
      name={iconName as ComponentProps<typeof MaterialCommunityIcons>["name"]} 
      size={size} 
      color={color} 
      style={style}
      onError={handleError}
    />
  );
}

