import React from 'react';
import { Form, Select } from 'antd';
import type { FormInstance } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { useManageUserStatePanel } from '../../hooks/panels/user/useManageUserStatePanel';
import type { ManageUserStateFormValues, User } from '../../models';

const UserIcon = Icons.User;

interface ManageUserStatePanelProps {
  open: boolean;
  onClose: () => void;
  editingUser: User | null;
  form: FormInstance<ManageUserStateFormValues>;
}

const STATE_FIELD_NAME = 'phase';

const ManageUserStatePanel: React.FC<ManageUserStatePanelProps> = ({
  open,
  onClose,
  editingUser,
  form,
}) => {
  const {
    initialValues,
    submitting,
    hasChanges,
    handleValuesChange,
    handleFieldsChange,
    handleSubmit,
  } = useManageUserStatePanel({ open, editingUser, form, onClose });

  if (!editingUser || !initialValues) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.MANAGE_STATE.TITLE}
      subtitle={UC.LABELS.PANELS.MANAGE_STATE.SUBTITLE(editingUser.fullname)}
      formContent={
        <Form.Item
          name={STATE_FIELD_NAME}
          label={UC.LABELS.PANELS.MANAGE_STATE.FIELD_LABEL}
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: 'active', label: UC.LABELS.PANELS.MANAGE_STATE.OPTION_ACTIVE },
              { value: 'suspended', label: UC.LABELS.PANELS.MANAGE_STATE.OPTION_SUSPENDED },
            ]}
          />
        </Form.Item>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.MANAGE_STATE.SUBMIT_BUTTON}
      submitButtonIcon={<UserIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={initialValues as unknown as Record<string, unknown>}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default ManageUserStatePanel;
