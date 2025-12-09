import React from 'react';
import { Checkbox, Form } from 'antd';
import { GROUPS_CONSTANTS as GC, ATTACHED_ROLES_CONSTANTS as ARC } from '../../../constants';
import type { Role } from '../../../../roles/models';

interface RoleListProps {
  roles: Role[] | undefined;
  loading: boolean;
}

const RoleList: React.FC<RoleListProps> = ({ roles, loading }) => {
  if (loading) {
    return <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.LOADING_ROLES}</div>;
  }

  if (!roles || roles.length === 0) {
    return (
      <div style={ARC.LIST.EMPTY_STATE}>{GC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}</div>
    );
  }

  return (
    <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
      <Checkbox.Group style={{ width: '100%' }}>
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
                        {role.description.length > 60
                          ? `${role.description.substring(0, 60)}...`
                          : role.description}
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
