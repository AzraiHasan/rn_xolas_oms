import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';

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
        className="min-h-[100px] pt-3 md:min-h-[120px]"
        style={style}
        {...rest}
      />
    );
  }
);


// Display name for better debugging
TextAreaField.displayName = 'TextAreaField';
