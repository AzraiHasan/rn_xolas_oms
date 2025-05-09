import React, { forwardRef } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { FormField, FormFieldProps } from './FormField';

export interface TextAreaFieldProps extends Omit<FormFieldProps, 'multiline' | 'numberOfLines' | 'textAlignVertical'> {
  /**
   * Number of lines to display
   * @default 4
   */
  numberOfLines?: number;
}

/**
 * Multiline text input field with validation
 */
export const TextAreaField = forwardRef<TextInput, TextAreaFieldProps>(
  ({ numberOfLines = 4, style, ...rest }, ref) => {
    return (
      <FormField
        ref={ref}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        style={[styles.textArea, style]}
        {...rest}
      />
    );
  }
);

const styles = StyleSheet.create({
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
});

// Display name for better debugging
TextAreaField.displayName = 'TextAreaField';
