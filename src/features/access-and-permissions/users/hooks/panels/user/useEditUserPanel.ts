import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUserThunk } from '../../../store';
import type { AppDispatch, RootState } from '../../../../../../store';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import type { User, CreateUserFormValues, UserAvatar } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { makeUsernameUniqueRule, makeEmailFormatRule, makeFullnameCharsRule } from '../../../utils';

interface UseEditUserPanelOptions {
  open: boolean;
  editingUser: User | null;
  form: FormInstance<CreateUserFormValues>;
  onClose: () => void;
}

export const useEditUserPanel = ({ open, editingUser, form, onClose }: UseEditUserPanelOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const existingUsers = useSelector((state: RootState) => state.users.users);
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const usernameRules = useMemo(
    () => [makeUsernameUniqueRule(existingUsers, editingUser?.id)],
    [existingUsers, editingUser?.id],
  );

  const emailRules = useMemo(() => [makeEmailFormatRule()], []);

  const fullnameRules = useMemo(() => [makeFullnameCharsRule()], []);
  const previousOpenRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  const initialValues = useMemo<CreateUserFormValues | null>(() => {
    if (!editingUser) return null;
    return {
      username: editingUser.username,
      fullname: editingUser.fullname,
      email: editingUser.email,
      avatar: editingUser.avatar,
    };
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
    const errors = form.getFieldsError();
    setHasFormErrors(errors.some((f) => f.errors.length > 0));

    if (!initialValues) return;
    const current = form.getFieldsValue() as CreateUserFormValues;
    setHasChanges(
      current.username !== initialValues.username ||
        current.fullname !== initialValues.fullname ||
        current.email !== initialValues.email ||
        current.avatar?.style !== initialValues.avatar?.style ||
        current.avatar?.seed !== initialValues.avatar?.seed,
    );
  }, [form, initialValues]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!editingUser) return;
      setSubmitting(true);
      try {
        const updated: Partial<User> = {
          username: values.username as string,
          fullname: values.fullname as string,
          email: values.email as string,
          avatar: (values.avatar as UserAvatar | undefined) ?? editingUser.avatar,
        };
        await dispatch(updateUserThunk({ id: editingUser.id, user: updated })).unwrap();
        store.dispatch(fetchMyPermissionsThunk());
        message.success(UC.LABELS.MESSAGES.UPDATED(values.fullname as string));
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
    hasFormErrors,
    hasChanges,
    usernameRules,
    emailRules,
    fullnameRules,
    handleValuesChange: checkFormState,
    handleFieldsChange: checkFormState,
    handleSubmit,
  };
};
