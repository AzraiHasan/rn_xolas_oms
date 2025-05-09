import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  let textClasses = '';
  
  // Apply appropriate classes based on the type
  switch (type) {
    case 'default':
      textClasses = 'text-base leading-6';
      break;
    case 'defaultSemiBold':
      textClasses = 'text-base leading-6 font-semibold';
      break;
    case 'title':
      textClasses = 'text-3xl font-bold leading-8';
      break;
    case 'subtitle':
      textClasses = 'text-xl font-bold';
      break;
    case 'link':
      textClasses = 'leading-[30px] text-base';
      break;
  }

  // Combine the className prop with the type-specific classes
  const combinedClasses = `${textClasses} ${className}`;

  return (
    <Text 
      className={combinedClasses}
      style={[
        { color }, // Keep the dynamic color from the hook
        style, // Allow custom styles to override
      ]}
      {...rest}
    />
  );
}
