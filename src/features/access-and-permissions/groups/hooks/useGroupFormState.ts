import { useState, useCallback } from 'react';
import type { FormInstance } from 'antd';
import type { GroupFormData } from '../models';

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

  const checkFormState = useCallback(() => {
    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    if (isEditMode && initialValues) {
      const currentValues = form.getFieldsValue();
      const changed =
        currentValues.name !== initialValues.name ||
        currentValues.description !== initialValues.description ||
        currentValues.categoryID !== initialValues.categoryID;
      setHasChanges(changed);
    }
  }, [form, isEditMode, initialValues]);

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

  return {
    hasFormErrors,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
  };
};
