import React, { useMemo } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ScrollIndicator } from '../../../../../../components/display/indicators';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { isRoleProtected, getRoleScopesContent } from '../../../../roles/utils';
import { useRoleListScroll } from '../../../../groups/hooks/scroll/useRoleListScroll';
import { truncateText, CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import { ATTACHED_ROLES_CONSTANTS as ARC } from '../../../../groups/constants';
import type { Role } from '../../../../roles/models';

const RoleIcon = Icons.Role;

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

interface UserAssignedRolesViewProps {
  assignedRoleIds: string[];
  allRoles?: Role[];
  loading: boolean;
}

const cardStyle: React.CSSProperties = {
  ...ARC.LIST.ITEM.BASE,
  cursor: 'default',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
};

const UserAssignedRolesView: React.FC<UserAssignedRolesViewProps> = ({
  assignedRoleIds,
  allRoles,
  loading,
}) => {
  const assignedRoles = useMemo(() => {
    if (!allRoles) return [];
    return allRoles.filter((r) => assignedRoleIds.includes(r.id));
  }, [allRoles, assignedRoleIds]);

  const {
    scrollContainerRef,
    setShowScrollIndicator,
    isScrollable,
    containerClassName,
    containerStyle,
    wrapperStyle,
  } = useRoleListScroll({ itemsCount: assignedRoles.length });

  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (assignedRoles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{UC.LABELS.MESSAGES.NO_ASSIGNED_ROLES}</div>;
  }

  return (
    <div style={wrapperStyle}>
      <div
        ref={scrollContainerRef}
        className={containerClassName}
        style={{ ...ARC.LIST.CONTAINER, ...containerStyle }}
      >
        {assignedRoles.map((role) => {
          const isProtected = isRoleProtected(role);

          const scopesContent = getRoleScopesContent(role, {
            scopesAndPermissions: role.scopesAndPermissions || [],
            getScopeLabel,
            scopesContainerStyle: ARC.LIST.ROLE_SCOPES,
            scopeItemStyle: ARC.LIST.SCOPE_ITEM,
          });

          return (
            <div key={role.id} style={cardStyle}>
              <div style={{ ...ARC.LIST.ROLE_CONTENT, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isProtected && <RoleIcon size={14} color={DEFAULT_COLORS.SUCCESS} />}
                  <span style={ARC.LIST.ROLE_NAME}>{CapitalizeFirstLetter(role.name)}</span>
                </div>
                {role.description && (
                  <span style={ARC.LIST.ROLE_DESCRIPTION}>
                    {CapitalizeFirstLetter(truncateText(role.description, 100))}
                  </span>
                )}
                {scopesContent}
              </div>
              <CheckCircleOutlined
                style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, marginTop: 4, flexShrink: 0 }}
              />
            </div>
          );
        })}
      </div>
      <ScrollIndicator
        containerRef={scrollContainerRef}
        isScrollable={isScrollable}
        onVisibilityChange={setShowScrollIndicator}
      />
    </div>
  );
};

export default UserAssignedRolesView;
