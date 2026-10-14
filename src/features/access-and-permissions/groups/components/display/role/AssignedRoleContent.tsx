import React from 'react';
import { Tooltip } from 'antd';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';

const RoleIcon = Icons.Role;

interface AssignedRoleContentProps {
  role: Role;
  getScopeLabel: (scopeKey: string) => string;
  /** Groups that grant the role, named in plain text: a tag would read as the role's own label. */
  fromGroups?: string[];
}

// One role row of the assigned-role lists (members' and groups' panels and their Manage panels).
const AssignedRoleContent: React.FC<AssignedRoleContentProps> = ({
  role,
  getScopeLabel,
  fromGroups,
}) => (
  <div style={ARC.LIST.ROLE_CONTENT}>
    <div style={ARC.LIST.ROLE_NAME_ROW}>
      <span style={ARC.LIST.ROLE_NAME}>{CapitalizeFirstLetter(role.name)}</span>
      {isRoleProtected(role) && (
        <Tooltip title={ARC.TOOLTIPS.PROTECTED_ROLE}>
          <span style={ARC.LIST.ROLE_FLAG} tabIndex={0} aria-label={ARC.TOOLTIPS.PROTECTED_ROLE}>
            <RoleIcon size={14} color={DEFAULT_COLORS.SUCCESS} />
          </span>
        </Tooltip>
      )}
    </div>
    {role.description && (
      <span style={ARC.LIST.ROLE_DESCRIPTION}>
        {CapitalizeFirstLetter(truncateText(role.description, 100))}
      </span>
    )}
    {getRoleScopesContent(role, {
      scopesAndPermissions: role.scopesAndPermissions || [],
      getScopeLabel,
      scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
      scopeItemStyle: ARC.LIST.SCOPE_ITEM,
    })}
    {fromGroups && fromGroups.length > 0 && (
      <span style={ARC.LIST.ROLE_SOURCE}>{ARC.LABELS.FROM_GROUPS(fromGroups.join(', '))}</span>
    )}
  </div>
);

export default AssignedRoleContent;
