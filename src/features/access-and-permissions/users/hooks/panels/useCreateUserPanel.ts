import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { createUserThunk } from '../../store';
import type { AppDispatch } from '../../../../../store';
import type { CreateUserFormValues, UserAvatar } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

interface UseCreateUserPanelOptions {
  form: FormInstance<CreateUserFormValues>;
  onClose: () => void;
}

export const useCreateUserPanel = ({ form, onClose }: UseCreateUserPanelOptions) => {
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);

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
          roleID: '',
          groupID: '',
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
    handleValuesChange: checkFormState,
    handleFieldsChange: checkFormState,
    handleSubmit,
  };
};
