import React from 'react';
import { Checkbox, Divider, Form, Tooltip } from 'antd';
import type { RoleScopePermission, RolesScopesAndPermissionsListProps } from '../../../models';

const RolesScopesAndPermissionsList: React.FC<RolesScopesAndPermissionsListProps> = ({
  areas,
  permissions,
  tooltipMap,
  rowPaddingPx = 4,
  dividerMarginPx = 2,
}) => {
  return (
    <>
      {areas.map((area: { key: string; label: string }, idx: number) => (
        <div key={area.key} style={{ padding: `${rowPaddingPx}px 0` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              minHeight: 30,
            }}
          >
            <div style={{ fontWeight: 700, color: '#0B1F33' }}>{area.label}</div>
            <Form.Item noStyle shouldUpdate>
              {() => (
                <Form.Item name={['scopes', area.key]} noStyle>
                  <Checkbox.Group
                    options={permissions.map((l: RoleScopePermission) => ({
                      label: (
                        <Tooltip title={tooltipMap[l]}>
                          <span className="permission-label">{l}</span>
                        </Tooltip>
                      ),
                      value: l,
                    }))}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </div>
          {idx < areas.length - 1 ? <Divider style={{ margin: `${dividerMarginPx}px 0` }} /> : null}
        </div>
      ))}
    </>
  );
};

export default RolesScopesAndPermissionsList;
