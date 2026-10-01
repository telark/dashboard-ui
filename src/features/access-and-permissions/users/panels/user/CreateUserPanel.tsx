import React, { useMemo, useState } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { SearchInput } from '../../../../../components/display/inputs';
import { Icons } from '../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../constants';
import UserFormFields from '../../components/display/shared/UserFormFields';
import UserRoleSelectList from '../../components/display/manage/role/UserRoleSelectList';
import { useCreateUserPanel } from '../../hooks/panels/user/useCreateUserPanel';
import { useRoles } from '../../../roles/hooks';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';
import { filterBySearchTerm } from '../../utils/search/filter';
import type { FormInstance } from 'antd';
import type { CreateUserFormValues } from '../../models';

const UserIcon = Icons.User;
const ASSIGN_ROLE = ACTION_PERMISSIONS.users.manageRoles;
const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

interface CreateUserPanelProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance<CreateUserFormValues>;
}

const CreateUserPanel: React.FC<CreateUserPanelProps> = ({ open, onClose, form }) => {
  const {
    submitting,
    hasFormErrors,
    usernameRules,
    emailRules,
    handleValuesChange,
    handleFieldsChange,
    handleSubmit,
  } = useCreateUserPanel({ form, onClose });
  const canAssignRole = usePermission(ASSIGN_ROLE.scope, ASSIGN_ROLE.level, ASSIGN_ROLE.deny);
  // Without it the role list shows its no-access card, so there is nothing to search.
  const canViewRoles = usePermission(VIEW_ROLES.scope, VIEW_ROLES.level);
  const { roles, loading: rolesLoading } = useRoles();
  const [roleSearch, setRoleSearch] = useState('');
  const filteredRoles = useMemo(
    () => filterBySearchTerm(roles, roleSearch, (r) => [r.name, r.description]),
    [roles, roleSearch],
  );

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.CREATE.TITLE}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <UserFormFields usernameRules={usernameRules} emailRules={emailRules} />
          <Form.Item
            label={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
            className="form-item-compact"
            style={{ marginBottom: 0 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {canViewRoles ? (
                <SearchInput
                  value={roleSearch}
                  onChange={setRoleSearch}
                  placeholder={UC.LABELS.PANELS.MANAGE_ROLE.SEARCH_PLACEHOLDER}
                  block
                />
              ) : null}
              <UserRoleSelectList
                roles={filteredRoles}
                loading={rolesLoading}
                allRoles={roles}
                blockedReason={
                  canAssignRole ? undefined : () => UC.LABELS.ACTIONS.ASSIGN_ROLE_DISABLED_TOOLTIP
                }
              />
            </div>
          </Form.Item>
        </div>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.CREATE.SUBMIT_BUTTON}
      submitButtonIcon={<UserIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors}
      form={form}
      initialValues={{ username: '', email: '', roleRefs: [] }}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default CreateUserPanel;
