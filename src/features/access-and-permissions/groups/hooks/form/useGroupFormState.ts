import { useState, useCallback } from 'react';
import type { FormInstance } from 'antd';
import type { GroupFormData } from '../../models';

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
      const currentAssignedUsers = currentValues.assignedUsersIDs || [];
      const initialAssignedUsers = initialValues.assignedUsersIDs || [];
      const assignedUsersChanged =
        currentAssignedUsers.length !== initialAssignedUsers.length ||
        currentAssignedUsers.some((id: string) => !initialAssignedUsers.includes(id));
      const changed =
        currentValues.name !== initialValues.name ||
        currentValues.description !== initialValues.description ||
        currentValues.categoryID !== initialValues.categoryID ||
        assignedUsersChanged;
      setHasChanges(changed);
    }
  }, [form, isEditMode, initialValues]);

  const handleValuesChange = useCallback(() => {
    // Just update form state to reflect changes
    checkFormState();
  }, [checkFormState]);

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
