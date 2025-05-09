import { useCallback, useState } from 'react';
import { ValidationRule, validateField } from '@/utils/validation';

export type FieldValidators<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type FieldErrors<T extends Record<string, any>> = {
  [K in keyof T]?: string;
};

export type TouchedFields<T extends Record<string, any>> = {
  [K in keyof T]?: boolean;
};

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validators?: FieldValidators<T>;
  onSubmit?: (values: T) => void;
}

export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: FieldErrors<T>;
  touched: TouchedFields<T>;
  isValid: boolean;
  dirty: boolean;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  handleSubmit: () => void;
}

/**
 * Custom hook for form management with validation
 */
export const useForm = <T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> => {
  const { initialValues, validators = {}, onSubmit } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [dirty, setDirty] = useState(false);
  
  // Handle field change
  const handleChange = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setDirty(true);
    
    // Validate on change if the field has been touched
    if (touched[field]) {
      validateSingleField(field, value);
    }
  }, [touched, validators]);
  
  // Handle field blur event
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateSingleField(field, values[field]);
  }, [values, validators]);
  
  // Validate a single field
  const validateSingleField = useCallback((field: keyof T, value: T[keyof T]) => {
    const fieldValidators = validators[field];
    
    if (!fieldValidators || fieldValidators.length === 0) {
      return true;
    }
    
    const result = validateField(value, fieldValidators);
    
    setErrors(prev => ({
      ...prev,
      [field]: result.errorMessage
    }));
    
    return result.isValid;
  }, [validators]);
  
  // Expose validateField method
  const validateFieldExposed = useCallback((field: keyof T) => {
    return validateSingleField(field, values[field]);
  }, [values, validateSingleField]);
  
  // Validate all form fields
  const validateForm = useCallback(() => {
    const newErrors: FieldErrors<T> = {};
    let isValid = true;
    
    // Touch all fields
    const allTouched: TouchedFields<T> = {};
    
    // Validate each field with validators
    Object.keys(validators).forEach(key => {
      const field = key as keyof T;
      const fieldValidators = validators[field];
      allTouched[field] = true;
      
      if (fieldValidators && fieldValidators.length > 0) {
        const result = validateField(values[field], fieldValidators);
        if (!result.isValid) {
          newErrors[field] = result.errorMessage;
          isValid = false;
        }
      }
    });
    
    setTouched(allTouched);
    setErrors(newErrors);
    return isValid;
  }, [values, validators]);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty(false);
  }, [initialValues]);
  
  // Set a specific field value programmatically
  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(() => {
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      onSubmit(values);
    }
  }, [values, validateForm, onSubmit]);
  
  // Check if the form is valid - both no errors and all required validations pass
  // This ensures the form is not considered valid until all required fields are filled
  const isValid = Object.keys(errors).length === 0 && 
    Object.keys(validators).every(key => {
      const field = key as keyof T;
      const fieldValidators = validators[field] || [];
      const requiredValidator = fieldValidators.find(v => v.message === 'This field is required');
      // If there's a required validator, make sure the field has a value
      if (requiredValidator) {
        return requiredValidator.validator(values[field]);
      }
      return true;
    });
  
  return {
    values,
    errors,
    touched,
    isValid,
    dirty,
    handleChange,
    handleBlur,
    validateField: validateFieldExposed,
    validateForm,
    resetForm,
    setFieldValue,
    handleSubmit
  };
};
