import { useState, useCallback, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import { updateUser } from '../../../../access-and-permissions/users/clients';
import { setCurrentUser } from '../../../../auth/utils/session/user';
import {
  makeEmailFormatRule,
  makeFullnameCharsRule,
} from '../../../../access-and-permissions/users/utils';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { User } from '../../../../access-and-permissions/users/models';

const { LABELS } = PROFILE_SECTION_CONSTANTS;
const P = LABELS.EDIT_PROFILE_PANEL;

export interface EditProfileFormValues {
  fullname: string;
  email: string;
}

export interface UseEditProfileOptions {
  currentUser: User | null;
  refetch: (updatedUser?: User) => Promise<void>;
}

export interface UseEditProfileResult {
  panelOpen: boolean;
  openEditPanel: () => void;
  closeEditPanel: () => void;
  form: ReturnType<typeof Form.useForm<EditProfileFormValues>>[0];
  submitting: boolean;
  hasFormErrors: boolean;
  hasChanges: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
  handleValuesChange: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  handleFieldsChange: (changedFields: unknown[], allFields: unknown[]) => void;
  initialValues: EditProfileFormValues | null;
  fullnameRules: ReturnType<typeof makeFullnameCharsRule>[];
  emailRules: ReturnType<typeof makeEmailFormatRule>[];
}

export function useEditProfile({
  currentUser,
  refetch,
}: UseEditProfileOptions): UseEditProfileResult {
  const [form] = Form.useForm<EditProfileFormValues>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const previousOpenRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  const fullnameRules = [makeFullnameCharsRule()];
  const emailRules = [makeEmailFormatRule()];

  const initialValues: EditProfileFormValues | null =
    currentUser != null ? { fullname: currentUser.fullname, email: currentUser.email } : null;

  const checkFormState = useCallback(() => {
    const errors = form.getFieldsError();
    setHasFormErrors(errors.some((f) => f.errors.length > 0));
    if (!currentUser) return;
    const current = form.getFieldsValue();
    setHasChanges(
      current.fullname?.trim() !== currentUser.fullname ||
        current.email?.trim() !== currentUser.email,
    );
  }, [form, currentUser]);

  const openEditPanel = useCallback(() => {
    if (currentUser) {
      form.setFieldsValue({ fullname: currentUser.fullname, email: currentUser.email });
      setHasChanges(false);
    }
    setPanelOpen(true);
  }, [currentUser, form]);

  const closeEditPanel = useCallback(() => {
    setPanelOpen(false);
    form.resetFields();
  }, [form]);

  useEffect(() => {
    const isOpening = panelOpen && !previousOpenRef.current;
    const userChanged = currentUser?.id !== previousUserIdRef.current;
    if (panelOpen && initialValues && (isOpening || userChanged)) {
      form.setFieldsValue(initialValues);
      setHasChanges(false);
    }
    previousOpenRef.current = panelOpen;
    previousUserIdRef.current = currentUser?.id ?? null;
  }, [panelOpen, currentUser?.id, initialValues, form]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!currentUser?.id) return;
      setSubmitting(true);
      try {
        const response = await updateUser(currentUser.id, {
          fullname: String(values.fullname ?? '').trim(),
          email: String(values.email ?? '').trim(),
        });
        if (response?.data) {
          setCurrentUser(response.data);
          await refetch(response.data);
          message.success(P.SUCCESS);
        } else {
          message.error(P.ERROR);
        }
      } catch {
        message.error(P.ERROR);
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, refetch],
  );

  const handleValuesChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  const handleFieldsChange = useCallback(() => {
    checkFormState();
  }, [checkFormState]);

  return {
    panelOpen,
    openEditPanel,
    closeEditPanel,
    form,
    submitting,
    hasFormErrors,
    hasChanges,
    handleSubmit,
    handleValuesChange,
    handleFieldsChange,
    initialValues,
    fullnameRules,
    emailRules,
  };
}
