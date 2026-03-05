import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { SearchInput } from '../../../../../components/display/inputs';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import { useManageUserRolePanel } from '../../hooks/panels/useManageUserRolePanel';
import UserRoleSelectList from '../../components/display/manage/UserRoleSelectList';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';
import type { User } from '../../models';

const RoleIcon = Icons.Role;

interface ManageUserRolePanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const PANEL_WIDTH = 600;

const ManageUserRolePanel: React.FC<ManageUserRolePanelProps> = ({ open, onClose, user }) => {
  const [form] = Form.useForm();
  const currentSelectedRole = (Form.useWatch('roleID', form) as string) || '';
  const [searchTerm, setSearchTerm] = useState('');

  const { initialSelectedRole, hasChanges, roles, rolesLoading, submitting, handleSubmit } =
    useManageUserRolePanel({ open, user, form, onClose, currentSelectedRole });

  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;
    const lower = searchTerm.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(lower) ||
        (r.description && r.description.toLowerCase().includes(lower)),
    );
  }, [roles, searchTerm]);

  if (!user) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.MANAGE_ROLE.TITLE}
      subtitle={UC.LABELS.PANELS.MANAGE_ROLE.SUBTITLE(
        CapitalizeFirstLetter(user.fullname || user.username),
      )}
      width={PANEL_WIDTH}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={UC.LABELS.PANELS.MANAGE_ROLE.SEARCH_PLACEHOLDER}
            minWidth={300}
          />
          <UserRoleSelectList roles={filteredRoles} loading={rolesLoading} />
        </div>
      }
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.MANAGE_ROLE.SUBMIT_BUTTON}
      submitButtonIcon={<RoleIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={{ roleID: initialSelectedRole }}
    />
  );
};

export default ManageUserRolePanel;
