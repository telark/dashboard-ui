import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import type { FormInstance } from 'antd';
import { useDeassignModal } from '../../../../shared';
import { updateUserThunk } from '../../../store';
import type { AppDispatch } from '../../../../../../store';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import type { User } from '../../../models';

type AssignmentField = 'assignedRolesIDs' | 'assignedGroupsIDs';

export interface UseDeassignUserFieldOptions<
  T extends { id: string; name: string } = { id: string; name: string },
> {
  user: User | null;
  form: FormInstance;
  fieldName: AssignmentField;
  successMessage: (name: string) => string;
  failMessage: string;
  onSuccess?: (updatedIds: string[]) => void;
  /** Called after user update succeeds (e.g. to sync inverse side when deassigning a group). */
  onAfterDeassign?: (item: T, updatedIds: string[]) => void | Promise<void>;
}

export const useDeassignUserField = <T extends { id: string; name: string }>({
  user,
  form,
  fieldName,
  successMessage,
  failMessage,
  onSuccess,
  onAfterDeassign,
}: UseDeassignUserFieldOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();

  const performDeassign = useCallback(
    async (item: T) => {
      if (!user) throw new Error('No user selected');
      const current = (form.getFieldValue(fieldName) as string[]) ?? [];
      const updated = current.filter((id) => id !== item.id);
      try {
        await dispatch(updateUserThunk({ id: user.id, user: { [fieldName]: updated } })).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        form.setFieldsValue({ [fieldName]: updated });
        await onAfterDeassign?.(item, updated);
        message.success(successMessage(item.name));
      } catch {
        message.error(failMessage);
        throw new Error(failMessage);
      }
    },
    [user, form, dispatch, fieldName, successMessage, failMessage, onAfterDeassign, message],
  );

  const handleDeassignSuccess = useCallback(() => {
    const updatedIds = (form.getFieldValue(fieldName) as string[]) ?? [];
    onSuccess?.(updatedIds);
  }, [form, fieldName, onSuccess]);

  return useDeassignModal<T>({ onConfirm: performDeassign, onSuccess: handleDeassignSuccess });
};
