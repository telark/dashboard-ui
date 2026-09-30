import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { SelectableListItem } from '../../../../../../../components/display/list';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { Role } from '../../../../../roles/models';
import { ACTION_PERMISSIONS, useCanGrantScopes, usePermission } from '../../../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../../../components/shared';

const RoleIcon = Icons.Role;
const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

interface UserRoleSelectListProps {
  roles?: Role[];
  loading: boolean;
  allRoles?: Role[];
  /** Maps role ID → tooltip text for roles that are already inherited via a group. */
  inheritedRoleTooltips?: Map<string, string>;
  blockedReason?: (roleId: string) => string | undefined;
}

const UserRoleSelectList: React.FC<UserRoleSelectListProps> = ({
  roles,
  loading,
  allRoles,
  inheritedRoleTooltips,
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
            const isProtected = isRoleProtected(role);
            const blockedTooltip =
              inheritedRoleTooltips?.get(role.id) ??
              blockedReason?.(role.id) ??
              (canGrant(role.scopesAndPermissions || [])
                ? undefined
                : ARC.TOOLTIPS.EXCEEDS_OWN_ACCESS);
            const isBlocked = Boolean(blockedTooltip);

            const scopesContent = getRoleScopesContent(role, {
              scopesAndPermissions: role.scopesAndPermissions || [],
              getScopeLabel,
              scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
              scopeItemStyle: ARC.LIST.SCOPE_ITEM,
            });

            const listItem = (
              <SelectableListItem
                value={role.id}
                disabled={isBlocked}
                name={CapitalizeFirstLetter(role.name)}
                description={
                  role.description
                    ? CapitalizeFirstLetter(truncateText(role.description, 100))
                    : undefined
                }
                customContent={scopesContent}
                isProtected={isProtected}
                protectionIcon={<RoleIcon />}
                protectionTooltip={ARC.TOOLTIPS.PROTECTED_ROLE}
                protectionIconColor={DEFAULT_COLORS.SUCCESS}
                protectionIconSize={18}
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

            return isBlocked ? (
              <Tooltip key={role.id} title={blockedTooltip} placement="left">
                <div>{listItem}</div>
              </Tooltip>
            ) : (
              <React.Fragment key={role.id}>{listItem}</React.Fragment>
            );
          })}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default UserRoleSelectList;
