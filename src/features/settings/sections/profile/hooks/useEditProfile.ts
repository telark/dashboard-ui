import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Form, App as AntdApp } from 'antd';
import { updateUser } from '../../../../access-and-permissions/users/clients';
import { USERS_CONSTANTS } from '../../../../access-and-permissions/users/constants';
import { useUsers } from '../../../../access-and-permissions/users/hooks';
import { setCurrentUser } from '../../../../auth/utils/session/user';
import {
  makeEmailFormatRule,
  makeEmailUniqueRule,
  makeFullnameCharsRule,
  makeUsernameUniqueRule,
} from '../../../../access-and-permissions/users/utils';
import { HTTP_STATUS } from '../../../../../constants';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { User } from '../../../../access-and-permissions/users/models';
import type { ExtendedAxiosError } from '../../../../../api/client/normalize';

const { LABELS, CONFLICT_FIELDS } = PROFILE_SECTION_CONSTANTS;
const P = LABELS.EDIT_PROFILE_PANEL;
const TAKEN = {
  username: USERS_CONSTANTS.LABELS.VALIDATION.USERNAME_TAKEN,
  email: USERS_CONSTANTS.LABELS.VALIDATION.EMAIL_TAKEN,
} as const;

export interface EditProfileFormValues {
  username: string;
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
  usernameRules: ReturnType<typeof makeUsernameUniqueRule>[];
  fullnameRules: ReturnType<typeof makeFullnameCharsRule>[];
  emailRules: ReturnType<typeof makeEmailFormatRule>[];
}

// Unchanged fields stay out of the PATCH, so the server re-checks only what the user edited.
const changedValue = (value: unknown, current: string): string | undefined => {
  const next = String(value ?? '').trim();
  return next === current ? undefined : next;
};

// Accounts hidden from the caller (administrators) can't be checked while typing, so the
// server's 409 (taken) or 403 (reserved bootstrap email) lands on the field it names.
const serverFieldError = (error: unknown) => {
  const { normalized } = error as ExtendedAxiosError;
  const name = CONFLICT_FIELDS.find((field) => normalized?.message?.includes(field));
  if (!name) return undefined;
  if (normalized?.status === HTTP_STATUS.CONFLICT) return { name, errors: [TAKEN[name]] };
  if (normalized?.status === HTTP_STATUS.FORBIDDEN && name === 'email') {
    return { name, errors: [P.EMAIL_RESERVED] };
  }
  return undefined;
};

export function useEditProfile({
  currentUser,
  refetch,
}: UseEditProfileOptions): UseEditProfileResult {
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm<EditProfileFormValues>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const previousOpenRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);
  const { users: existingUsers } = useUsers();

  const usernameRules = useMemo(
    () => [makeUsernameUniqueRule(existingUsers, currentUser?.id)],
    [existingUsers, currentUser?.id],
  );
  const fullnameRules = [makeFullnameCharsRule()];
  const emailRules = useMemo(
    () => [makeEmailFormatRule(), makeEmailUniqueRule(existingUsers, currentUser?.id)],
    [existingUsers, currentUser?.id],
  );

  const initialValues = useMemo<EditProfileFormValues | null>(
    () =>
      currentUser != null
        ? {
            username: currentUser.username,
            fullname: currentUser.fullname,
            email: currentUser.email,
          }
        : null,
    [currentUser],
  );

  const checkFormState = useCallback(() => {
    const errors = form.getFieldsError();
    setHasFormErrors(errors.some((f) => f.errors.length > 0));
    if (!currentUser) return;
    const current = form.getFieldsValue();
    setHasChanges(
      current.username?.trim() !== currentUser.username ||
        current.fullname?.trim() !== currentUser.fullname ||
        current.email?.trim() !== currentUser.email,
    );
  }, [form, currentUser]);

  const openEditPanel = useCallback(() => {
    if (currentUser) {
      form.setFieldsValue({
        username: currentUser.username,
        fullname: currentUser.fullname,
        email: currentUser.email,
      });
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
          username: changedValue(values.username, currentUser.username),
          fullname: changedValue(values.fullname, currentUser.fullname),
          email: changedValue(values.email, currentUser.email),
        });
        if (response?.data) {
          setCurrentUser(response.data);
          await refetch(response.data);
          message.success(P.SUCCESS);
        } else {
          message.error(P.ERROR);
        }
      } catch (error) {
        const fieldError = serverFieldError(error);
        if (!fieldError) {
          message.error(P.ERROR);
          return;
        }
        form.setFields([fieldError]);
        checkFormState();
        // Rejecting keeps the panel open on the field error.
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [currentUser, refetch, message, form, checkFormState],
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
    usernameRules,
    fullnameRules,
    emailRules,
  };
}
