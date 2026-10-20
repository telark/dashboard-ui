import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form } from 'antd';
import { SelectableListItem } from '../../../../../../../components/display/list';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { Role } from '../../../../../roles/models';
import { ACTION_PERMISSIONS, useCanGrantScopes, usePermission } from '../../../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../../../components/shared';
import LockedRolePill from '../../../../../groups/components/display/role/LockedRolePill';

const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

interface UserRoleSelectListProps {
  roles?: Role[];
  loading: boolean;
  allRoles?: Role[];
  /** Maps role ID → why it can't be picked, for roles the user already gets through a group. */
  inheritedRoleReasons?: Map<string, string>;
  blockedReason?: (roleId: string) => string | undefined;
}

const UserRoleSelectList: React.FC<UserRoleSelectListProps> = ({
  roles,
  loading,
  allRoles,
  inheritedRoleReasons,
  blockedReason,
}) => {
  const form = Form.useFormInstance();
  const canGrant = useCanGrantScopes();
  const canViewRoles = usePermission(VIEW_ROLES.scope, VIEW_ROLES.level);
  const watchedSelectedRoles = Form.useWatch('roleRefs', form);
  const currentSelectedRoles = useMemo(
    () => (watchedSelectedRoles as string[]) || [],
    [watchedSelectedRoles],
  );

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allRoles || !roles) {
        form.setFieldsValue({ roleRefs: checkedValues });
        return;
      }

      const roleIdsOnScreen = roles.map((r) => r.id);
      const preservedSelections = currentSelectedRoles.filter(
        (id) => !roleIdsOnScreen.includes(id),
      );

      form.setFieldsValue({
        roleRefs: Array.from(new Set([...preservedSelections, ...checkedValues])),
      });
    },
    [form, allRoles, roles, currentSelectedRoles],
  );

  if (!canViewRoles) {
    return (
      <NoPermissionCard
        featureName={UC.LABELS.FORM.FIELDS.ROLE_LABEL}
        permission={VIEW_ROLES}
        compact
      />
    );
  }

  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>;
  }

  return (
    <Form.Item name="roleRefs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        value={currentSelectedRoles}
        onChange={handleChange}
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div className="role-list-container" style={ARC.LIST.CONTAINER}>
          {roles.map((role) => {
            const reason =
              inheritedRoleReasons?.get(role.id) ??
              blockedReason?.(role.id) ??
              (canGrant(role.scopesAndPermissions || [])
                ? undefined
                : ARC.LABELS.EXCEEDS_OWN_ACCESS);
            const isBlocked = Boolean(reason);

            const scopesContent = getRoleScopesContent(role, {
              scopesAndPermissions: role.scopesAndPermissions || [],
              getScopeLabel,
              scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
              scopeItemStyle: ARC.LIST.SCOPE_ITEM,
            });

            return (
              <SelectableListItem
                key={role.id}
                value={role.id}
                disabled={isBlocked}
                disabledReason={reason}
                name={CapitalizeFirstLetter(role.name)}
                description={
                  role.description
                    ? CapitalizeFirstLetter(truncateText(role.description, 100))
                    : undefined
                }
                customContent={scopesContent}
                protectionBadge={isRoleProtected(role) ? <LockedRolePill /> : undefined}
                itemStyles={{
                  base: {
                    ...ARC.LIST.ITEM.BASE,
                    ...(isBlocked ? ARC.LIST.ITEM.DISABLED : {}),
                  },
                  hover: isBlocked ? ARC.LIST.ITEM.DISABLED : ARC.LIST.ITEM.HOVER,
                }}
                contentStyles={ARC.LIST.ROLE_CONTENT}
                nameStyles={ARC.LIST.ROLE_NAME}
                descriptionStyles={ARC.LIST.ROLE_DESCRIPTION}
              />
            );
          })}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default UserRoleSelectList;
