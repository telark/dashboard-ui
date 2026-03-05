import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUser } from '../../store';
import type { AppDispatch } from '../../../../../store';
import type { User, CreateUserFormValues, UserAvatar } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';
import { useRoles } from '../../../roles/hooks';
import { useFetchGroups } from '../../../groups/hooks';

interface UseEditUserPanelOptions {
  open: boolean;
  editingUser: User | null;
  form: FormInstance<CreateUserFormValues>;
  onClose: () => void;
}

export const useEditUserPanel = ({ open, editingUser, form, onClose }: UseEditUserPanelOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const { roles } = useRoles();
  const { groups } = useFetchGroups();
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const previousOpenRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  const roleOptions = useMemo(() => roles.map((r) => ({ label: r.name, value: r.id })), [roles]);

  const groupOptions = useMemo(
    () => (groups || []).map((g) => ({ label: g.name, value: g.id })),
    [groups],
  );

  const initialValues = useMemo<CreateUserFormValues | null>(() => {
    if (!editingUser) return null;
    return {
      username: editingUser.username,
      fullname: editingUser.fullname,
      email: editingUser.email,
      roleID: editingUser.roleID,
      groupID: editingUser.groupID,
      avatar: editingUser.avatar,
    };
  }, [editingUser]);

  useEffect(() => {
    const isOpening = open && !previousOpenRef.current;
    const userChanged = editingUser?.id !== previousUserIdRef.current;
    if (open && initialValues && (isOpening || userChanged)) {
      form.setFieldsValue(initialValues);
    }
    previousOpenRef.current = open;
    previousUserIdRef.current = editingUser?.id ?? null;
  }, [open, editingUser?.id, initialValues, form]);

  const checkFormState = useCallback(() => {
    const errors = form.getFieldsError();
    setHasFormErrors(errors.some((f) => f.errors.length > 0));
  }, [form]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!editingUser) return;
      setSubmitting(true);
      try {
        const updated: User = {
          ...editingUser,
          username: values.username as string,
          fullname: values.fullname as string,
          email: values.email as string,
          roleID: values.roleID as string,
          groupID: (values.groupID as string) || editingUser.groupID,
          avatar: (values.avatar as UserAvatar | undefined) ?? editingUser.avatar,
        };
        dispatch(updateUser(updated));
        message.success(UC.LABELS.MESSAGES.UPDATED(updated.fullname));
        form.resetFields();
        onClose();
      } catch {
        message.error('Failed to update user');
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, editingUser, form, onClose],
  );

  return {
    initialValues,
    roleOptions,
    groupOptions,
    submitting,
    hasFormErrors,
    handleValuesChange: checkFormState,
    handleFieldsChange: checkFormState,
    handleSubmit,
  };
};
