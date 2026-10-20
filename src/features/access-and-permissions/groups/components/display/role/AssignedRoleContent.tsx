import React from 'react';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import { getScopeLabel } from '../../../../users/utils/role/scope';
import type { Role } from '../../../../roles/models';
import LockedRolePill from './LockedRolePill';

interface AssignedRoleContentProps {
  role: Role;
  /** Groups that grant the role, named in plain text: a tag would read as the role's own label. */
  fromGroups?: string[];
}

// One role row of the assigned-role lists (members' and groups' panels and their Manage panels).
const AssignedRoleContent: React.FC<AssignedRoleContentProps> = ({ role, fromGroups }) => (
  <div style={ARC.LIST.ROLE_CONTENT}>
    <div style={ARC.LIST.ROLE_NAME_ROW}>
      <span style={ARC.LIST.ROLE_NAME}>{CapitalizeFirstLetter(role.name)}</span>
      {isRoleProtected(role) && <LockedRolePill />}
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
