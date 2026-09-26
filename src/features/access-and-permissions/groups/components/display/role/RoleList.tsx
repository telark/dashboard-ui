import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { ScrollIndicator } from '../../../../../../components/display/indicators';
import { SelectableListItem } from '../../../../../../components/display/list';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { useRoleListScroll } from '../../../hooks';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';
import { useCanGrantScopes } from '../../../../../auth/hooks';

const RoleIcon = Icons.Role;

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
  const watchedSelectedRoles = Form.useWatch('assignedRolesIDs', form);
  const currentSelectedRoles = useMemo(
    () => (watchedSelectedRoles as string[]) || [],
    [watchedSelectedRoles],
  );

  const {
    scrollContainerRef,
    setShowScrollIndicator,
    isScrollable,
    containerClassName,
    containerStyle,
    wrapperStyle,
  } = useRoleListScroll({
    itemsCount: roles?.length,
  });

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allRoles || !roles) {
        form.setFieldsValue({ assignedRolesIDs: checkedValues });
        return;
      }

      const roleIdsOnScreen = roles.map((r) => r.id);
      const preservedSelections = currentSelectedRoles.filter(
        (id) => !roleIdsOnScreen.includes(id),
      );

      form.setFieldsValue({
        assignedRolesIDs: Array.from(new Set([...preservedSelections, ...checkedValues])),
      });
    },
    [form, allRoles, roles, currentSelectedRoles],
  );

  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
        <Checkbox.Group
          value={currentSelectedRoles}
          onChange={handleChange}
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div style={wrapperStyle}>
            <div
              ref={scrollContainerRef}
              className={containerClassName}
              style={{
                ...ARC.LIST.CONTAINER,
                ...containerStyle,
              }}
            >
              {roles.map((role) => {
                const isProtected = isRoleProtected(role);

                const scopesContent = getRoleScopesContent(role, {
                  scopesAndPermissions: role.scopesAndPermissions || [],
                  getScopeLabel,
                  scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
                  scopeItemStyle: ARC.LIST.SCOPE_ITEM,
                });

                const blockedTooltip =
                  blockedReason?.(role.id) ??
                  (canGrant(role.scopesAndPermissions || [])
                    ? undefined
                    : ARC.TOOLTIPS.EXCEEDS_OWN_ACCESS);
                const listItem = (
                  <SelectableListItem
                    value={role.id}
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
                        ...(blockedTooltip ? ARC.LIST.ITEM.DISABLED : {}),
                      },
                      hover: blockedTooltip ? ARC.LIST.ITEM.DISABLED : ARC.LIST.ITEM.HOVER,
                    }}
                    contentStyles={ARC.LIST.ROLE_CONTENT}
                    nameStyles={ARC.LIST.ROLE_NAME}
                    descriptionStyles={ARC.LIST.ROLE_DESCRIPTION}
                    disabled={Boolean(blockedTooltip)}
                  />
                );

                return blockedTooltip ? (
                  <Tooltip key={role.id} title={blockedTooltip} placement="left">
                    <div>{listItem}</div>
                  </Tooltip>
                ) : (
                  <React.Fragment key={role.id}>{listItem}</React.Fragment>
                );
              })}
            </div>
            <ScrollIndicator
              containerRef={scrollContainerRef}
              isScrollable={isScrollable}
              onVisibilityChange={setShowScrollIndicator}
            />
          </div>
        </Checkbox.Group>
      </Form.Item>
    </div>
  );
};

export default RoleList;
