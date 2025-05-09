/**
 * Helper functions for conditional NativeWind class names
 */

/**
 * Combines multiple class names, filtering out falsy values
 * @param classes - Array of class name strings or undefined/null/false values
 * @returns Combined class name string
 */
export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditionally applies class names based on conditions
 * @param baseClasses - Base class names to always include
 * @param conditionalClasses - Object where keys are class names and values are boolean conditions
 * @returns Combined class name string
 */
export function cn(
  baseClasses: string,
  conditionalClasses: Record<string, boolean> = {}
): string {
  const conditionalClassNames = Object.entries(conditionalClasses)
    .filter(([_, condition]) => condition)
    .map(([className]) => className);
  
  return clsx(baseClasses, ...conditionalClassNames);
}

/**
 * Get color variant class name based on theme and variant
 * @param baseColor - Base color name (e.g., "primary", "danger")
 * @param variant - Variant type (e.g., "solid", "outline", "ghost")
 * @param element - Element type (e.g., "bg", "text", "border")
 * @returns Appropriate class name for the color variant
 */
export function colorVariant(
  baseColor: 'primary' | 'secondary' | 'success' | 'warning' | 'danger',
  variant: 'solid' | 'outline' | 'ghost' = 'solid',
  element: 'bg' | 'text' | 'border' = 'bg'
): string {
  const colorMap = {
    primary: {
      solid: {
        bg: 'bg-primary-500 dark:bg-primary-400',
        text: 'text-white',
        border: 'border-primary-500 dark:border-primary-400'
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-primary-500 dark:text-primary-400',
        border: 'border-primary-500 dark:border-primary-400'
      },
      ghost: {
        bg: 'bg-primary-50/50 dark:bg-primary-900/20',
        text: 'text-primary-600 dark:text-primary-300',
        border: 'border-transparent'
      }
    },
    secondary: {
      solid: {
        bg: 'bg-secondary-500 dark:bg-secondary-400',
        text: 'text-white',
        border: 'border-secondary-500 dark:border-secondary-400'
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-secondary-500 dark:text-secondary-400',
        border: 'border-secondary-500 dark:border-secondary-400'
      },
      ghost: {
        bg: 'bg-secondary-50/50 dark:bg-secondary-900/20',
        text: 'text-secondary-600 dark:text-secondary-300',
        border: 'border-transparent'
      }
    },
    success: {
      solid: {
        bg: 'bg-success-500 dark:bg-success-400',
        text: 'text-white',
        border: 'border-success-500 dark:border-success-400'
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-success-500 dark:text-success-400',
        border: 'border-success-500 dark:border-success-400'
      },
      ghost: {
        bg: 'bg-success-50/50 dark:bg-success-900/20',
        text: 'text-success-600 dark:text-success-300',
        border: 'border-transparent'
      }
    },
    warning: {
      solid: {
        bg: 'bg-warning-500 dark:bg-warning-400',
        text: 'text-white',
        border: 'border-warning-500 dark:border-warning-400'
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-warning-500 dark:text-warning-400',
        border: 'border-warning-500 dark:border-warning-400'
      },
      ghost: {
        bg: 'bg-warning-50/50 dark:bg-warning-900/20',
        text: 'text-warning-600 dark:text-warning-300',
        border: 'border-transparent'
      }
    },
    danger: {
      solid: {
        bg: 'bg-danger-500 dark:bg-danger-400',
        text: 'text-white',
        border: 'border-danger-500 dark:border-danger-400'
      },
      outline: {
        bg: 'bg-transparent',
        text: 'text-danger-500 dark:text-danger-400',
        border: 'border-danger-500 dark:border-danger-400'
      },
      ghost: {
        bg: 'bg-danger-50/50 dark:bg-danger-900/20',
        text: 'text-danger-600 dark:text-danger-300',
        border: 'border-transparent'
      }
    }
  };

  return colorMap[baseColor][variant][element];
}
