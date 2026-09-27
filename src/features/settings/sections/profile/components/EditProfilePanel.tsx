import React, { memo } from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import LabeledInput from '../../../../../components/display/inputs/LabeledInput';
import { PROFILE_SECTION_CONSTANTS } from '../constants';
import type { EditProfileFormValues } from '../hooks/useEditProfile';

const { LABELS } = PROFILE_SECTION_CONSTANTS;
const P = LABELS.EDIT_PROFILE_PANEL;
const UserIcon = Icons.User;

export interface EditProfilePanelProps {
  open: boolean;
  onClose: () => void;
  form: ReturnType<typeof import('antd').Form.useForm<EditProfileFormValues>>[0];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onValuesChange: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  onFieldsChange: (changedFields: unknown[], allFields: unknown[]) => void;
  submitting: boolean;
  hasFormErrors: boolean;
  hasChanges: boolean;
  initialValues: EditProfileFormValues | null;
  usernameRules: Array<{ validator: (a: unknown, b: string) => Promise<void> }>;
  fullnameRules: Array<{ validator: (a: unknown, b: string) => Promise<void> }>;
  emailRules: Array<{ validator: (a: unknown, b: string) => Promise<void> }>;
}

const EditProfilePanel: React.FC<EditProfilePanelProps> = memo(
  ({
    open,
    onClose,
    form,
    onSubmit,
    onValuesChange,
    onFieldsChange,
    submitting,
    hasFormErrors,
    hasChanges,
    initialValues,
    usernameRules,
    fullnameRules,
    emailRules,
  }) => (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={P.TITLE}
      formContent={
        <>
          <LabeledInput
            name="username"
            label={P.USERNAME_LABEL}
            placeholder={P.USERNAME_PLACEHOLDER}
            required
            rules={usernameRules}
            marginBottom={16}
            validateTrigger="onChange"
          />
          <LabeledInput
            name="fullname"
            label={P.FULLNAME_LABEL}
            placeholder={P.FULLNAME_PLACEHOLDER}
            required
            rules={fullnameRules}
            marginBottom={16}
            validateTrigger="onChange"
          />
          <LabeledInput
            name="email"
            label={P.EMAIL_LABEL}
            placeholder={P.EMAIL_PLACEHOLDER}
            required
            rules={emailRules}
            marginBottom={0}
            validateTrigger="onChange"
          />
        </>
      }
      onSubmit={onSubmit}
      onCancel={onClose}
      submitButtonText={P.SAVE}
      submitButtonIcon={<UserIcon size={16} />}
      cancelButtonText={P.CANCEL}
      loading={submitting}
      disabled={hasFormErrors || !hasChanges}
      form={form}
      initialValues={(initialValues ?? undefined) as Record<string, unknown> | undefined}
      onValuesChange={onValuesChange}
      onFieldsChange={onFieldsChange}
    />
  ),
);

EditProfilePanel.displayName = 'EditProfilePanel';

export default EditProfilePanel;
