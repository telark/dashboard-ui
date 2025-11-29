import { useState, useCallback, useEffect } from 'react';
import type { FormInstance } from 'antd';
import type { RoleFormValues } from '../models';
import { deepEqual } from '../utils/helpers';

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
  const [isInitialized, setIsInitialized] = useState(false);

  const checkFormState = useCallback(() => {
    // Always check for form errors in both create and edit modes
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    // Only check for changes in edit mode
    if (!isEditMode || !initialValues) return;

    const currentValues = form.getFieldsValue();

    // Ensure we have values before comparing (form must be initialized)
    if (!currentValues.name || !isInitialized) {
      // If form is not initialized yet, assume no changes
      if (isInitialized) {
        setHasChanges(false);
      }
      return;
    }

    // Normalize values for comparison (handle undefined arrays and ensure consistent structure)
    const normalizedCurrent: RoleFormValues = {
      name: currentValues.name || '',
      type: currentValues.type || initialValues.type || 'custom',
      status: currentValues.status || initialValues.status || 'Active',
      scopes: currentValues.scopes || {},
      assignedTo: Array.isArray(currentValues.assignedTo) ? currentValues.assignedTo : [],
    };

    const normalizedInitial: RoleFormValues = {
      name: initialValues.name || '',
      type: initialValues.type || 'custom',
      status: initialValues.status || 'Active',
      scopes: initialValues.scopes || {},
      assignedTo: Array.isArray(initialValues.assignedTo) ? initialValues.assignedTo : [],
    };

    const changed = !deepEqual(normalizedCurrent, normalizedInitial);
    setHasChanges(changed);
  }, [form, isEditMode, initialValues, isInitialized]);

  const handleValuesChange = useCallback(() => {
    // Trigger validation to ensure async validators complete
    form
      .validateFields()
      .then(() => {
        checkFormState();
      })
      .catch(() => {
        checkFormState();
      });
  }, [form, checkFormState]);

  const handleFieldsChange = useCallback(() => {
    // onFieldsChange fires when field status changes (including validation)
    checkFormState();
  }, [checkFormState]);

  // Check form state after form is initialized with values
  useEffect(() => {
    if (isEditMode && initialValues) {
      // Wait for form to be initialized, then check state
      const timer = setTimeout(() => {
        const currentValues = form.getFieldsValue();
        // Check if form has been populated (has at least name field)
        if (currentValues.name) {
          setIsInitialized(true);
          checkFormState();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, initialValues, form]);

  // Also check when form values are set via setFieldsValue
  useEffect(() => {
    if (isEditMode && isInitialized) {
      checkFormState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  return {
    hasFormErrors,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
  };
};

