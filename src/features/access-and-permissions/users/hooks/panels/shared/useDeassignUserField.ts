import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { useDeassignModal } from '../../../../shared';
import { updateUserThunk } from '../../../store';
import type { AppDispatch } from '../../../../../../store';
import type { User } from '../../../models';

type AssignmentField = 'assignedRolesIDs' | 'assignedGroupsIDs';

export interface UseDeassignUserFieldOptions {
  user: User | null;
  form: FormInstance;
  fieldName: AssignmentField;
  successMessage: (name: string) => string;
  failMessage: string;
  onSuccess?: (updatedIds: string[]) => void;
}

export const useDeassignUserField = <T extends { id: string; name: string }>({
  user,
  form,
  fieldName,
  successMessage,
  failMessage,
  onSuccess,
}: UseDeassignUserFieldOptions) => {
  const dispatch: AppDispatch = useDispatch();

  const performDeassign = useCallback(
    async (item: T) => {
      if (!user) throw new Error('No user selected');
      const current = (form.getFieldValue(fieldName) as string[]) ?? [];
      const updated = current.filter((id) => id !== item.id);
      try {
        await dispatch(
          updateUserThunk({ id: user.id, user: { [fieldName]: updated } }),
        ).unwrap();
        form.setFieldsValue({ [fieldName]: updated });
        message.success(successMessage(item.name));
      } catch {
        message.error(failMessage);
        throw new Error(failMessage);
      }
    },
    [user, form, dispatch, fieldName, successMessage, failMessage],
  );

  const handleDeassignSuccess = useCallback(() => {
    const updatedIds = (form.getFieldValue(fieldName) as string[]) ?? [];
    onSuccess?.(updatedIds);
  }, [form, fieldName, onSuccess]);

  return useDeassignModal<T>({ onConfirm: performDeassign, onSuccess: handleDeassignSuccess });
};
