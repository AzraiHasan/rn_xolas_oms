import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';

import { Input, InputProps } from '@/components/ui/Input/Input';
import { ValidationRule, validateField } from '@/utils/validation';

export interface FormFieldProps extends InputProps {
  /**
   * Name of the field (used for validation)
   */
  name: string;
  
  /**
   * Current value of the field
   */
  value: string;
  
  /**
   * Function to call when value changes
   */
  onChangeValue: (name: string, value: string) => void;
  
  /**
   * Validation rules for the field
   */
  validationRules?: ValidationRule<string>[];
  
  /**
   * Whether to validate on blur (default) or change
   * @default 'blur'
   */
  validateOn?: 'blur' | 'change';
}

/**
 * Enhanced form field component with validation
 */
export const FormField = forwardRef<TextInput, FormFieldProps>(
  (
    {
      name,
      value,
      onChangeValue,
      validationRules = [],
      validateOn = 'blur',
      required = false,
      error,
      isError = false,
      onBlur,
      onChangeText,
      className,
      ...rest
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [validationError, setValidationError] = useState<string | undefined>(undefined);
    
    const handleValidation = () => {
      if (validationRules.length === 0) return;
      
      const result = validateField(value, validationRules);
      setValidationError(result.errorMessage);
    };
    
    const handleChangeText = (text: string) => {
      onChangeValue(name, text);
      onChangeText?.(text);
      
      if (validateOn === 'change' && touched) {
        handleValidation();
      }
    };
    
    const handleBlur = (e: any) => {
      setTouched(true);
      if (validateOn === 'blur') {
        handleValidation();
      }
      onBlur?.(e);
    };
    
    // Use either the externally provided error or the validation error
    const displayError = error || validationError;
    const hasError = isError || (touched && !!validationError);
    
    return (
      <Input
        ref={ref}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        error={displayError}
        isError={hasError}
        required={required}
        className={className}
        {...rest}
      />
    );
  }
);

// Display name for better debugging
FormField.displayName = 'FormField';
