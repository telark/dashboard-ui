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
import { rejectionMessage } from '../../../../../../utils/helpers/format';
import { fetchFreshUserIds } from '../../../utils';
import { applySelectionChange } from '../../../../shared';

type AssignmentField = 'assignedRolesIDs' | 'assignedGroupsIDs';

export interface UseDeassignUserFieldOptions {
  user: User | null;
  form: FormInstance;
  fieldName: AssignmentField;
  successMessage: (name: string) => string;
  failMessage: string;
  onSuccess?: (updatedIds: string[]) => void;
  /** Called after the user update succeeds (e.g. to reload the side the backend mirrors). */
  onAfterDeassign?: () => void;
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
      try {
        const freshIds = await fetchFreshUserIds(user.id, fieldName);
        const updated = applySelectionChange(freshIds, [item.id], []);
        await dispatch(updateUserThunk({ id: user.id, user: { [fieldName]: updated } })).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        form.setFieldsValue({ [fieldName]: current.filter((id) => id !== item.id) });
        onAfterDeassign?.();
        message.success(successMessage(item.name));
      } catch (rejection) {
        message.error(rejectionMessage(rejection, failMessage));
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
