import { useState, useCallback, useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import type { RoleFormValues } from '../models';
import { deepEqual } from '../utils';

interface UseRoleFormStateOptions {
  form: FormInstance<RoleFormValues>;
  isEditMode?: boolean;
  initialValues?: RoleFormValues | null;
}

export const useRoleFormState = ({
  form,
  isEditMode = false,
  initialValues,
}: UseRoleFormStateOptions) => {
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const isInitializedRef = useRef(false);
  const initialValuesRef = useRef(initialValues);

  // Update ref when initialValues change (refs can be updated in effects)
  useEffect(() => {
    if (initialValues !== initialValuesRef.current) {
      initialValuesRef.current = initialValues;
      // Reset initialization when initialValues change
      if (initialValues) {
        isInitializedRef.current = false;
      }
    }
  }, [initialValues]);

  const checkFormState = useCallback(() => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    // Only check for changes in edit mode
    if (!isEditMode || !initialValuesRef.current) return;

    const currentValues = form.getFieldsValue();

    // Ensure we have values before comparing (form must be initialized)
    if (!currentValues.name || !isInitializedRef.current) {
      if (isInitializedRef.current) {
        setHasChanges(false);
      }
      return;
    }

    // Normalize values for comparison (handle undefined arrays and ensure consistent structure)
    const normalizedCurrent: RoleFormValues = {
      name: currentValues.name || '',
      description: currentValues.description || '',
      categoryID: currentValues.categoryID || '',
      type: currentValues.type || initialValuesRef.current.type || 'custom',
      status: currentValues.status || initialValuesRef.current.status || 'Active',
      scopes: currentValues.scopes || {},
      validity: currentValues.validity,
      protection: currentValues.protection,
      assignedTo: Array.isArray(currentValues.assignedTo) ? currentValues.assignedTo : [],
    };

    const normalizedInitial: RoleFormValues = {
      name: initialValuesRef.current.name || '',
      description: initialValuesRef.current.description || '',
      categoryID: initialValuesRef.current.categoryID || '',
      type: initialValuesRef.current.type || 'custom',
      status: initialValuesRef.current.status || 'Active',
      scopes: initialValuesRef.current.scopes || {},
      validity: initialValuesRef.current.validity,
      protection: initialValuesRef.current.protection,
      assignedTo: Array.isArray(initialValuesRef.current.assignedTo)
        ? initialValuesRef.current.assignedTo
        : [],
    };

    const changed = !deepEqual(normalizedCurrent, normalizedInitial);
    setHasChanges(changed);
  }, [form, isEditMode]);

  const handleValuesChange = useCallback(() => {
    // Check if form is initialized (has name field populated)
    if (isEditMode && !isInitializedRef.current) {
      const currentValues = form.getFieldsValue();
      if (currentValues.name) {
        isInitializedRef.current = true;
        // Check form state after initialization
        checkFormState();
        return;
      }
    }

    // Trigger validation to ensure async validators complete
    form
      .validateFields()
      .then(() => {
        checkFormState();
      })
      .catch(() => {
        checkFormState();
      });
  }, [form, isEditMode, checkFormState]);

  const handleFieldsChange = useCallback(() => {
    // onFieldsChange fires when field status changes (including validation)
    checkFormState();
  }, [checkFormState]);

  return {
    hasFormErrors,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
  };
};
