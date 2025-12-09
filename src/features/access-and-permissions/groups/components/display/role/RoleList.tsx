import React, { useCallback, useMemo } from 'react';
import { Checkbox, Form } from 'antd';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import { truncateText } from '../../../../../../utils/helpers/format';
import type { Role } from '../../../../roles/models';

interface RoleListProps {
  roles: Role[] | undefined;
  loading: boolean;
  allRoles?: Role[] | undefined;
}

const RoleList: React.FC<RoleListProps> = ({ roles, loading, allRoles }) => {
  const form = Form.useFormInstance();
  const watchedSelectedRoles = Form.useWatch('assignedRolesIDs', form);
  const currentSelectedRoles = useMemo(
    () => (watchedSelectedRoles as string[]) || [],
    [watchedSelectedRoles],
  );

  const handleChange = useCallback(
    (checkedValues: string[]) => {
      if (!allRoles) {
        form.setFieldsValue({ assignedRolesIDs: checkedValues });
        return;
      }

      const filteredRoleIds = roles?.map((role) => role.id) || [];
      const preservedSelections = (currentSelectedRoles as string[]).filter(
        (roleId) => !filteredRoleIds.includes(roleId),
      );

      const mergedSelections = [...preservedSelections, ...checkedValues];
      const uniqueSelections = Array.from(new Set(mergedSelections));
      form.setFieldsValue({ assignedRolesIDs: uniqueSelections });
    },
    [form, allRoles, roles, currentSelectedRoles],
  );

  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>;
  }

  const filteredSelectedRoles = (currentSelectedRoles as string[]).filter((roleId) =>
    roles.some((role) => role.id === roleId),
  );

  return (
    <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group
        style={{ width: '100%' }}
        value={filteredSelectedRoles}
        onChange={handleChange}
      >
        <div style={ARC.LIST.CONTAINER}>
          {roles.map((role) => {
            return (
              <div
                key={role.id}
                style={ARC.LIST.ITEM.BASE}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, ARC.LIST.ITEM.HOVER);
                }}
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
            );
          })}
        </div>
      </Checkbox.Group>
    </Form.Item>
  );
};

export default RoleList;
