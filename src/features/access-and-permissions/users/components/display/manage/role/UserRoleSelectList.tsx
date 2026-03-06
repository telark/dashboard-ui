import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { ScrollIndicator } from '../../../../../../../components/display/indicators';
import { SelectableListItem } from '../../../../../../../components/display/list';
import { USERS_CONSTANTS as UC } from '../../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../../constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../../roles/utils';
import { useRoleListScroll } from '../../../../../groups/hooks/scroll/useRoleListScroll';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../../groups/constants';
import { getScopeLabel } from '../../../../utils/role/scope';
import type { Role } from '../../../../../roles/models';

const RoleIcon = Icons.Role;

interface UserRoleSelectListProps {
  roles?: Role[];
  loading: boolean;
  allRoles?: Role[];
  /** Maps role ID → tooltip text for roles that are already inherited via a group. */
  inheritedRoleTooltips?: Map<string, string>;
}

const UserRoleSelectList: React.FC<UserRoleSelectListProps> = ({
  roles,
  loading,
  allRoles,
  inheritedRoleTooltips,
}) => {
  const form = Form.useFormInstance();
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
  } = useRoleListScroll({ itemsCount: roles?.length });

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
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>;
  }

  return (
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
            style={{ ...ARC.LIST.CONTAINER, ...containerStyle }}
          >
            {roles.map((role) => {
              const isProtected = isRoleProtected(role);
              const inheritedTooltip = inheritedRoleTooltips?.get(role.id);
              const isInherited = Boolean(inheritedTooltip);

              const scopesContent = getRoleScopesContent(role, {
                scopesAndPermissions: role.scopesAndPermissions || [],
                getScopeLabel,
                scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
                scopeItemStyle: ARC.LIST.SCOPE_ITEM,
              });

              const listItem = (
                <SelectableListItem
                  value={role.id}
                  disabled={isInherited}
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
                      ...(isInherited ? { opacity: 0.55, cursor: 'not-allowed' } : {}),
                    },
                    hover: isInherited ? ARC.LIST.ITEM.BASE : ARC.LIST.ITEM.HOVER,
                  }}
                  contentStyles={ARC.LIST.ROLE_CONTENT}
                  nameStyles={ARC.LIST.ROLE_NAME}
                  descriptionStyles={ARC.LIST.ROLE_DESCRIPTION}
                />
              );

              return isInherited ? (
                <Tooltip key={role.id} title={inheritedTooltip} placement="left">
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
  );
};

export default UserRoleSelectList;
