import React from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import UserFormFields from '../../components/display/shared/UserFormFields';
import { useCreateUserPanel } from '../../hooks/panels/user/useCreateUserPanel';
import type { FormInstance } from 'antd';
import type { CreateUserFormValues } from '../../models';

const UserIcon = Icons.User;

interface CreateUserPanelProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance<CreateUserFormValues>;
}

const CreateUserPanel: React.FC<CreateUserPanelProps> = ({ open, onClose, form }) => {
  const { submitting, hasFormErrors, handleValuesChange, handleFieldsChange, handleSubmit } =
    useCreateUserPanel({ form, onClose });

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.CREATE.TITLE}
      subtitle={UC.LABELS.PANELS.CREATE.SUBTITLE}
      formContent={<UserFormFields />}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.CREATE.SUBMIT_BUTTON}
      submitButtonIcon={<UserIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors}
      form={form}
      initialValues={{ username: '', fullname: '', email: '' }}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default CreateUserPanel;
