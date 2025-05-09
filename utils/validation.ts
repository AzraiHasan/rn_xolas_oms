/**
 * Form validation utility functions
 * Provides type-safe validators for common form field types
 */

export type ValidationRule<T = string> = {
  validator: (value: T) => boolean;
  message: string;
};

export type FieldValidationResult = {
  isValid: boolean;
  errorMessage: string | undefined;
};

/**
 * Validates a value against a set of validation rules
 * Returns the result of the first failed validation or success if all pass
 */
export const validateField = <T>(
  value: T, 
  rules: ValidationRule<T>[]
): FieldValidationResult => {
  for (const rule of rules) {
    if (!rule.validator(value)) {
      return {
        isValid: false,
        errorMessage: rule.message
      };
    }
  }

  return {
    isValid: true,
    errorMessage: undefined
  };
};

/**
 * Common validation rules
 */
export const requiredValidator: ValidationRule<any> = {
  validator: (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },
  message: 'This field is required'
};

export const minLengthValidator = (minLength: number): ValidationRule<string> => ({
  validator: (value) => value?.length >= minLength,
  message: `Must be at least ${minLength} characters`
});

export const maxLengthValidator = (maxLength: number): ValidationRule<string> => ({
  validator: (value) => value?.length <= maxLength,
  message: `Must be no more than ${maxLength} characters`
});

export const emailValidator: ValidationRule<string> = {
  validator: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  message: 'Must be a valid email address'
};

export const phoneValidator: ValidationRule<string> = {
  validator: (value) => {
    // Basic phone validation - can be customized based on requirements
    const phoneRegex = /^[\d\+\-\(\) ]{7,15}$/;
    return phoneRegex.test(value);
  },
  message: 'Must be a valid phone number'
};
