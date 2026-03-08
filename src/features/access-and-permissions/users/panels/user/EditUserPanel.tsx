import React from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import UserFormFields from '../../components/display/shared/UserFormFields';
import { useEditUserPanel } from '../../hooks/panels/user/useEditUserPanel';
import type { FormInstance } from 'antd';
import type { User, CreateUserFormValues } from '../../models';

const UserIcon = Icons.User;

interface EditUserPanelProps {
  open: boolean;
  onClose: () => void;
  editingUser: User | null;
  form: FormInstance<CreateUserFormValues>;
}

const EditUserPanel: React.FC<EditUserPanelProps> = ({ open, onClose, editingUser, form }) => {
  const {
    initialValues,
    submitting,
    hasFormErrors,
    hasChanges,
    usernameRules,
    emailRules,
    fullnameRules,
    handleValuesChange,
    handleFieldsChange,
    handleSubmit,
  } = useEditUserPanel({ open, editingUser, form, onClose });

  if (!editingUser || !initialValues) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.EDIT.TITLE}
      subtitle={UC.LABELS.PANELS.EDIT.SUBTITLE(editingUser.fullname)}
      formContent={
        <UserFormFields
          usernameRules={usernameRules}
          emailRules={emailRules}
          fullnameRules={fullnameRules}
        />
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.EDIT.SUBMIT_BUTTON}
      submitButtonIcon={<UserIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors || !hasChanges}
      form={form}
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default EditUserPanel;
