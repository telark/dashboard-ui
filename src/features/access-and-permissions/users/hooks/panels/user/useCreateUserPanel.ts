import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { createUserThunk } from '../../../store';
import type { AppDispatch, RootState } from '../../../../../../store';
import type { CreateUserFormValues, UserAvatar } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { makeUsernameUniqueRule, makeEmailFormatRule, makeFullnameCharsRule } from '../../../utils';

interface UseCreateUserPanelOptions {
  form: FormInstance<CreateUserFormValues>;
  onClose: () => void;
}

export const useCreateUserPanel = ({ form, onClose }: UseCreateUserPanelOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const existingUsers = useSelector((state: RootState) => state.users.users);
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);

  const usernameRules = useMemo(() => [makeUsernameUniqueRule(existingUsers)], [existingUsers]);

  const emailRules = useMemo(() => [makeEmailFormatRule()], []);

  const fullnameRules = useMemo(() => [makeFullnameCharsRule()], []);

  const checkFormState = useCallback(() => {
    const errors = form.getFieldsError();
    setHasFormErrors(errors.some((f) => f.errors.length > 0));
  }, [form]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      setSubmitting(true);
      try {
        const userData: CreateUserFormValues = {
          username: values.username as string,
          fullname: values.fullname as string,
          email: values.email as string,
          assignedRolesIDs: [],
          assignedGroupsIDs: [],
          avatar: values.avatar as UserAvatar | undefined,
        };
        await dispatch(createUserThunk(userData)).unwrap();
        message.success(UC.LABELS.MESSAGES.CREATED(userData.fullname));
        form.resetFields();
        onClose();
      } catch {
        message.error(UC.LABELS.MESSAGES.CREATE_FAILED);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, form, onClose],
  );

  return {
    submitting,
    hasFormErrors,
    usernameRules,
    emailRules,
    fullnameRules,
    handleValuesChange: checkFormState,
    handleFieldsChange: checkFormState,
    handleSubmit,
  };
};
