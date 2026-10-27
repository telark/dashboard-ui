import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form } from 'antd';
import { SelectableListItem } from '../../../../../../components/display/list';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';
import { ACTION_PERMISSIONS, useCanGrantScopes, usePermission } from '../../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../../components/shared';
import LockedRolePill from './LockedRolePill';
import { SPACING } from '../../../../../../constants';

const VIEW_ROLES = ACTION_PERMISSIONS.roles.view;

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

interface RoleListProps {
  roles?: Role[];
  loading: boolean;
  allRoles?: Role[];
  blockedReason?: (roleId: string) => string | undefined;
}

const RoleList: React.FC<RoleListProps> = ({ roles, loading, allRoles, blockedReason }) => {
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
      <NoPermissionCard featureName={RC.LABELS.HEADER_TITLE} permission={VIEW_ROLES} compact />
    );
  }

  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      <Form.Item name="roleRefs" style={{ margin: SPACING.NONE, width: '100%' }}>
        <Checkbox.Group
          value={currentSelectedRoles}
          onChange={handleChange}
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div className="role-list-container" style={ARC.LIST.CONTAINER}>
            {roles.map((role) => {
              const scopesContent = getRoleScopesContent(role, {
                scopesAndPermissions: role.scopesAndPermissions || [],
                getScopeLabel,
                scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
                scopeItemStyle: ARC.LIST.SCOPE_ITEM,
              });

              const reason =
                blockedReason?.(role.id) ??
                (canGrant(role.scopesAndPermissions || [])
                  ? undefined
                  : ARC.LABELS.EXCEEDS_OWN_ACCESS);
              return (
                <SelectableListItem
                  key={role.id}
                  value={role.id}
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
                      ...(reason ? ARC.LIST.ITEM.DISABLED : {}),
                    },
                    hover: reason ? ARC.LIST.ITEM.DISABLED : ARC.LIST.ITEM.HOVER,
                  }}
                  contentStyles={ARC.LIST.ROLE_CONTENT}
                  nameStyles={ARC.LIST.ROLE_NAME}
                  descriptionStyles={ARC.LIST.ROLE_DESCRIPTION}
                  disabled={Boolean(reason)}
                  disabledReason={reason}
                />
              );
            })}
          </div>
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
};

export default RoleList;
