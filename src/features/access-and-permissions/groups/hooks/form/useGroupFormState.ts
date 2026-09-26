import { useState, useCallback, useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import type { GroupFormData } from '../../models';

interface UseGroupFormStateOptions {
  form: FormInstance<GroupFormData>;
  isEditMode?: boolean;
  initialValues?: GroupFormData | null;
}

const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
};

export const useGroupFormState = ({
  form,
  isEditMode = false,
  initialValues,
}: UseGroupFormStateOptions) => {
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(!isEditMode);
  const initialValuesRef = useRef<GroupFormData | null>(null);
  const needsResetRef = useRef(false);

  useEffect(() => {
    if (initialValues) {
      const previousInitial = initialValuesRef.current;
      initialValuesRef.current = initialValues;

      if (isEditMode && previousInitial !== null && previousInitial !== initialValues) {
        needsResetRef.current = true;
      }
    }
  }, [initialValues, isEditMode]);

  const checkFormState = useCallback(() => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    if (needsResetRef.current) {
      setHasChanges(false);
      needsResetRef.current = false;
    }

    if (isEditMode && initialValuesRef.current) {
      const currentValues = form.getFieldsValue();
      const initial = initialValuesRef.current;

      const nameChanged = currentValues.name !== initial.name;
      const descriptionChanged = currentValues.description !== initial.description;
      const categoryChanged = currentValues.categoryRef !== initial.categoryRef;
      const assignedUsersChanged = !arraysEqual(
        currentValues.userRefs || [],
        initial.userRefs || [],
      );

      const changed = nameChanged || descriptionChanged || categoryChanged || assignedUsersChanged;
      if (!needsResetRef.current) {
        setHasChanges(changed);
      }
    }
  }, [form, isEditMode]);

  const handleValuesChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  const handleFieldsChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  return {
    hasFormErrors,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
  };
};
