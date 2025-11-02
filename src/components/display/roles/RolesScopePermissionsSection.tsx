import React from 'react';
import { Checkbox, Divider, Form, Tooltip } from 'antd';
import Section from '../../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../constants/pages/roles';
import type { RolesScopePermissionsSectionProps } from '../../../interfaces/roles';

const AREAS = RPC.SCOPE.AREAS;
const LEVELS = RPC.SCOPE.LEVELS as readonly ('View' | 'Edit' | 'Delete')[];
const TOOLTIP = RPC.SCOPE.TOOLTIP;

const RolesScopePermissionsSection: React.FC<RolesScopePermissionsSectionProps> = ({ form }) => {
  return (
    <Section
      title={RPC.SCOPE.TITLE}
      subtitle={RPC.SCOPE.SUBTITLE}
      content={
        <>
          {AREAS.map((area, idx) => (
            <div key={area.key} style={{ padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontWeight: 700, color: '#0B1F33' }}>{area.label}</div>
                <Form.Item noStyle shouldUpdate>
                  {() => (
                    <Form.Item name={['scopes', area.key as string]} noStyle>
                      <Checkbox.Group
                        options={LEVELS.map((l) => ({
                          label: (
                            <Tooltip title={TOOLTIP[l]}>
                              <span
                                style={{
                                  fontFamily: 'Roboto Condensed, sans-serif',
                                  fontWeight: 500,
                                  color: '#5B6B7C',
                                }}
                              >
                                {l}
                              </span>
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
              {idx < AREAS.length - 1 ? <Divider style={{ margin: '2px 0' }} /> : null}
            </div>
          ))}
        </>
      }
    />
  );
};

export default RolesScopePermissionsSection;


