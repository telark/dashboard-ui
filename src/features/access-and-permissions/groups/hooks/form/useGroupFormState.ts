import { useState, useCallback, useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import type { GroupFormData } from '../../models';
import { textChanged } from '../../../../shared';

interface UseGroupFormStateOptions {
  form: FormInstance<GroupFormData>;
  isEditMode?: boolean;
  initialValues?: GroupFormData | null;
}

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

      const nameChanged = textChanged(initial.name, currentValues.name);
      const descriptionChanged = textChanged(initial.description, currentValues.description);
      const categoryChanged = textChanged(initial.categoryRef, currentValues.categoryRef);

      // Members have no field here (Manage Members edits them), so they never count as changed.
      const changed = nameChanged || descriptionChanged || categoryChanged;
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
