import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUserThunk } from '../../../store';
import type { AppDispatch } from '../../../../../../store';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import type { ManageUserStateFormValues, User, UserAccountState } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';

interface UseManageUserStatePanelOptions {
  open: boolean;
  editingUser: User | null;
  form: FormInstance<ManageUserStateFormValues>;
  onClose: () => void;
}

export const useManageUserStatePanel = ({
  open,
  editingUser,
  form,
  onClose,
}: UseManageUserStatePanelOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const previousOpenRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  const initialValues = useMemo<ManageUserStateFormValues | null>(() => {
    if (!editingUser) return null;
    return { phase: editingUser.status.phase };
  }, [editingUser]);

  useEffect(() => {
    const isOpening = open && !previousOpenRef.current;
    const userChanged = editingUser?.id !== previousUserIdRef.current;
    if (open && initialValues && (isOpening || userChanged)) {
      form.setFieldsValue(initialValues);
      setHasChanges(false);
    }
    previousOpenRef.current = open;
    previousUserIdRef.current = editingUser?.id ?? null;
  }, [open, editingUser?.id, initialValues, form]);

  const checkFormState = useCallback(() => {
    if (!initialValues) return;
    const current = form.getFieldsValue() as ManageUserStateFormValues;
    setHasChanges(current.phase !== initialValues.phase);
  }, [form, initialValues]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!editingUser) return;
      setSubmitting(true);
      try {
        const phase = values.phase as UserAccountState;
        const updated: Partial<User> = {
          status: { ...editingUser.status, phase },
        };
        await dispatch(updateUserThunk({ id: editingUser.id, user: updated })).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(UC.LABELS.MESSAGES.UPDATED(editingUser.fullname));
        form.resetFields();
        onClose();
      } catch {
        message.error(UC.LABELS.MESSAGES.UPDATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, editingUser, form, onClose],
  );

  return {
    initialValues,
    submitting,
    hasChanges,
    handleValuesChange: checkFormState,
    handleFieldsChange: checkFormState,
    handleSubmit,
  };
};
