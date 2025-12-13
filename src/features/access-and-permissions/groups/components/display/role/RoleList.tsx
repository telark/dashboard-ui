import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox, Form, Tooltip } from 'antd';
import { ScrollIndicator } from '../../../../../../components/display/indicators';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { Icons, DEFAULT_COLORS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { truncateText } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';

const RoleIcon = Icons.Role;

const getScopeLabel = (scopeKey: string): string => {
  const area = RC.SCOPE.DEFAULT_AREAS.find((a) => a.key === scopeKey);
  return area?.label || scopeKey;
};

interface RoleListProps {
  roles?: Role[];
  loading: boolean;
  allRoles?: Role[];
}

const PAGE_SIZE = 11;
const MAX_HEIGHT = `${PAGE_SIZE * 56}px`; // 48px minHeight + 8px gap per item

const RoleList: React.FC<RoleListProps> = ({ roles, loading, allRoles }) => {
  const form = Form.useFormInstance();
  const watchedSelectedRoles = Form.useWatch('assignedRolesIDs', form);
  const currentSelectedRoles = useMemo(
    () => (watchedSelectedRoles as string[]) || [],
    [watchedSelectedRoles],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const isScrollable = useMemo(() => (roles?.length || 0) > PAGE_SIZE, [roles]);

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
    <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        value={currentSelectedRoles}
        onChange={handleChange}
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: isScrollable && showScrollIndicator ? 24 : 0,
          }}
        >
          <div
            ref={scrollContainerRef}
            className={`role-list-container ${isScrollable ? 'role-list-scroll' : ''}`}
            style={{
              ...ARC.LIST.CONTAINER,
              maxHeight: isScrollable ? MAX_HEIGHT : 'auto',
              height: isScrollable ? MAX_HEIGHT : 'auto',
              overflowY: isScrollable ? 'auto' : 'visible',
            }}
          >
            {roles.map((role) => {
              const isProtected =
                role.protection?.preventDeletion === true &&
                role.protection?.preventModification === true;

              return (
                <div
                  key={role.id}
                  style={{
                    ...ARC.LIST.ITEM.BASE,
                    width: '100%',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, ARC.LIST.ITEM.HOVER)}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ARC.LIST.ITEM.BASE.background;
                    e.currentTarget.style.borderColor = ARC.LIST.ITEM.BASE.border;
                  }}
                >
                  {isProtected && (
                    <Tooltip title="This role is protected from deletion and modification">
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <RoleIcon
                          style={{
                            fontSize: 18,
                            color: DEFAULT_COLORS.SUCCESS,
                          }}
                        />
                      </div>
                    </Tooltip>
                  )}
                  <Checkbox value={role.id} style={{ margin: 0, width: '100%' }}>
                    <div style={ARC.LIST.ROLE_CONTENT}>
                      <div style={ARC.LIST.ROLE_NAME}>{role.name}</div>
                      {role.description && (
                        <div style={ARC.LIST.ROLE_DESCRIPTION}>
                          {truncateText(role.description, 60)}
                        </div>
                      )}
                      {role.scopesAndPermissions && role.scopesAndPermissions.length > 0 && (
                        <div style={ARC.LIST.ROLE_SCOPES}>
                          {role.scopesAndPermissions.map((scope, index) => (
                            <span key={`${scope.scope}-${index}`} style={ARC.LIST.SCOPE_ITEM}>
                              {getScopeLabel(scope.scope)}: {scope.level}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Checkbox>
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
      </Checkbox.Group>
    </Form.Item>
  );
};

export default RoleList;
