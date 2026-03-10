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
  fullnameRules: Array<{ validator: (a: unknown, b: string) => Promise<void> }>;
  emailRules: Array<{ validator: (a: unknown, b: string) => Promise<void> }>;
  username: string;
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
    fullnameRules,
    emailRules,
    username,
  }) => (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={P.TITLE}
      subtitle={P.SUBTITLE}
      formContent={
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 4 }}>
              {P.USERNAME_LABEL}
            </label>
            <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.85)' }}>{username}</span>
          </div>
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
