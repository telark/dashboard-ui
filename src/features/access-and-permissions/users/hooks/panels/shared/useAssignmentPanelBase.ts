import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import type { FormInstance } from 'antd';
import { updateUserThunk } from '../../../store';
import { arraysEqual } from '../../../utils/assignment/arrays';
import type { AppDispatch } from '../../../../../../store';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import type { User } from '../../../models';
import { rejectionMessage } from '../../../../../../utils/helpers/format';
import { fetchFreshUserIds } from '../../../utils';
import { applySelectionChange } from '../../../../shared';

type AssignmentField = 'roleRefs' | 'groupRefs';

export interface UseAssignmentPanelBaseOptions {
  open: boolean;
  user: User | null;
  form: FormInstance;
  onClose: () => void;
  fieldName: AssignmentField;
  currentSelected: string[];
  /** True when the backing data (roles/groups) is ready — gates the form population effect. */
  dataReady: boolean;
  successMessage: (userName: string) => string;
  failMessage: string;
  /** Called after the user update succeeds (e.g. to reload the side the backend mirrors). */
  onSuccess?: () => void;
}

export interface UseAssignmentPanelBaseReturn {
  initialSelectedIds: string[];
  hasChanges: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useAssignmentPanelBase = ({
  open,
  user,
  form,
  onClose,
  fieldName,
  currentSelected,
  dataReady,
  successMessage,
  failMessage,
  onSuccess,
}: UseAssignmentPanelBaseOptions): UseAssignmentPanelBaseReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const initialSelectedIds = useMemo(() => user?.[fieldName] ?? [], [user, fieldName]);

  useEffect(() => {
    if (open && user && dataReady) {
      form.setFieldsValue({ [fieldName]: user[fieldName] ?? [] });
    }
  }, [open, user, dataReady, form, fieldName]);

  const hasChanges = useMemo(
    () => !arraysEqual(currentSelected, initialSelectedIds),
    [currentSelected, initialSelectedIds],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const newIds = (values[fieldName] as string[]) ?? [];
      const freshIds = await fetchFreshUserIds(user.id, fieldName);
      await dispatch(
        updateUserThunk({
          id: user.id,
          user: { [fieldName]: applySelectionChange(freshIds, initialSelectedIds, newIds) },
        }),
      ).unwrap();
      store.dispatch(fetchMyPermissionsThunk());
      onSuccess?.();
      message.success(successMessage(user.fullname || user.username));
      form.resetFields();
      onClose();
    } catch (rejection) {
      message.error(rejectionMessage(rejection, failMessage));
    } finally {
      setSubmitting(false);
    }
  };

  return { initialSelectedIds, hasChanges, submitting, handleSubmit };
};
