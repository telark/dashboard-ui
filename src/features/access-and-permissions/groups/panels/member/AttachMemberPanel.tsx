import React from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { useAttachMemberPanel } from '../../hooks';
import MemberList from '../../components/display/member/MemberList';
import type { Group } from '../../models';

const UserIcon = Icons.User;

interface AttachMemberPanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachMemberPanel: React.FC<AttachMemberPanelProps> = ({ open, onClose, group }) => {
  const [form] = Form.useForm();
  const currentSelectedUsers = Form.useWatch('assignedUsersIDs', form) || [];
  const {
    currentGroup,
    initialSelectedUsers,
    hasChanges,
    allUsers,
    usersLoading,
    submitting,
    handleSubmit,
  } = useAttachMemberPanel({
    open,
    group,
    form,
    onClose,
    currentSelectedUsers,
  });

  if (!currentGroup) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title="Assign Members"
      subtitle={`Select members to assign to ${currentGroup.name}`}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <MemberList users={allUsers} loading={usersLoading} allUsers={allUsers} />
        </div>
      }
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText="Assign Members"
      submitButtonIcon={<UserIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={{ assignedUsersIDs: initialSelectedUsers }}
    />
  );
};

export default AttachMemberPanel;
