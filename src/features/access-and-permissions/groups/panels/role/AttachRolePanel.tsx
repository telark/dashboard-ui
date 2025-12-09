import React from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { useAttachRolePanel } from '../../hooks';
import RoleTypeFilter from '../../components/display/role/RoleTypeFilter';
import RoleList from '../../components/display/role/RoleList';
import type { Group } from '../../models';

const RoleIcon = Icons.Role;

interface AttachRolePanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachRolePanel: React.FC<AttachRolePanelProps> = ({ open, onClose, group }) => {
  const [form] = Form.useForm();
  const currentSelectedRoles = Form.useWatch('assignedRolesIDs', form) || [];
  const {
    currentGroup,
    initialSelectedRoles,
    hasChanges,
    filteredRoles,
    rolesLoading,
    submitting,
    selectedRoleType,
    setSelectedRoleType,
    handleSubmit,
  } = useAttachRolePanel({
    open,
    group,
    form,
    onClose,
    currentSelectedRoles,
  });

  if (!currentGroup) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title="Attach Roles"
      subtitle={`Select roles to attach to ${currentGroup.name}`}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <RoleTypeFilter
            selectedRoleType={selectedRoleType}
            onTypeChange={setSelectedRoleType}
          />
          <RoleList roles={filteredRoles} loading={rolesLoading} />
        </div>
      }
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText="Attach Roles"
      submitButtonIcon={<RoleIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={{ assignedRolesIDs: initialSelectedRoles }}
    />
  );
};

export default AttachRolePanel;
