import React, { useCallback, useMemo, useRef } from 'react';
import { Checkbox, Form } from 'antd';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { truncateText } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';

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

  const isScrollable = roles.length > PAGE_SIZE;

  return (
    <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        value={currentSelectedRoles}
        onChange={handleChange}
        style={{ width: '100%' }}
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
          {roles.map((role) => (
            <div
              key={role.id}
              style={ARC.LIST.ITEM.BASE}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, ARC.LIST.ITEM.HOVER)}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ARC.LIST.ITEM.BASE.background;
                e.currentTarget.style.borderColor = ARC.LIST.ITEM.BASE.border;
              }}
            >
              <Checkbox value={role.id} style={{ margin: 0 }}>
                <div style={ARC.LIST.ROLE_CONTENT}>
                  <div style={ARC.LIST.ROLE_NAME}>{role.name}</div>
                  {role.description && (
                    <div style={ARC.LIST.ROLE_DESCRIPTION}>
                      {truncateText(role.description, 60)}
                    </div>
                  )}
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default RoleList;
