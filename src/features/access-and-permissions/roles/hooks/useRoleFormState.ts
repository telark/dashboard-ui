import { useState, useCallback, useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import type { RoleFormValues } from '../models';
import { deepEqual, normalizeValue } from '../utils';

export interface UseRoleFormStateOptions {
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

  useEffect(() => {
    if (initialValues !== initialValuesRef.current) {
      initialValuesRef.current = initialValues;
      if (initialValues) {
        isInitializedRef.current = false;
      }
    }
  }, [initialValues]);

  const checkFormState = useCallback(() => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field: { errors: unknown[] }) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    if (!isEditMode || !initialValuesRef.current) return;

    const currentValues = form.getFieldsValue(true);

    if (!currentValues.name || !isInitializedRef.current) {
      if (isInitializedRef.current) {
        setHasChanges(false);
      }
      return;
    }
    const normalizedCurrent = {
      name: currentValues.name || '',
      description: currentValues.description || '',
      categoryID: currentValues.categoryID || '',
      type: currentValues.type || 'custom',
      status: currentValues.status || 'Active',
      scopes: normalizeValue(currentValues.scopes) || {},
      validity: normalizeValue(currentValues.validity),
      protection: normalizeValue(currentValues.protection),
      assignedTo: normalizeValue(currentValues.assignedTo) || [],
    };

    const normalizedInitial = {
      name: initialValuesRef.current.name || '',
      description: initialValuesRef.current.description || '',
      categoryID: initialValuesRef.current.categoryID || '',
      type: initialValuesRef.current.type || 'custom',
      status: initialValuesRef.current.status || 'Active',
      scopes: normalizeValue(initialValuesRef.current.scopes) || {},
      validity: normalizeValue(initialValuesRef.current.validity),
      protection: normalizeValue(initialValuesRef.current.protection),
      assignedTo: normalizeValue(initialValuesRef.current.assignedTo) || [],
    };

    const changed = !deepEqual(normalizedCurrent, normalizedInitial);
    setHasChanges(changed);
  }, [form, isEditMode]);

  const handleValuesChange = useCallback(() => {
    if (isEditMode && !isInitializedRef.current) {
      const currentValues = form.getFieldsValue(true);
      if (currentValues.name) {
        isInitializedRef.current = true;
      }
    }
    requestAnimationFrame(() => checkFormState());
  }, [form, isEditMode, checkFormState]);

  const handleFieldsChange = useCallback(() => {
    requestAnimationFrame(() => {
      checkFormState();
    });
  }, [checkFormState]);

  return {
    hasFormErrors,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
  };
};
