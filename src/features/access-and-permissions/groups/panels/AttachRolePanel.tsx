import React, { useMemo, useEffect } from 'react';
import { Checkbox, Form } from 'antd';
import { SlideOutPanel } from '../../../../components/display/panels/slide-out';
import { Icons } from '../../../../constants';
import { useGroupMutations } from '../hooks';
import { useRoles } from '../../roles/hooks';
import type { Group } from '../models';

const RoleIcon = Icons.Role;

interface AttachRolePanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const AttachRolePanel: React.FC<AttachRolePanelProps> = ({ open, onClose, group }) => {
  const { roles, loading: rolesLoading } = useRoles();
  const { handleUpdate, submitting } = useGroupMutations();
  const [form] = Form.useForm();

  const initialSelectedRoles = useMemo(() => {
    return group?.assignedRolesIDs || [];
  }, [group]);

  useEffect(() => {
    if (open && group) {
      form.setFieldsValue({ assignedRolesIDs: initialSelectedRoles });
    }
  }, [open, group, initialSelectedRoles, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!group) return;
    const assignedRolesIDs = (values.assignedRolesIDs as string[]) || [];
    await handleUpdate(group.id, { assignedRolesIDs });
    form.resetFields();
    onClose();
  };

  if (!group) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title="Attach Roles"
      subtitle={`Select roles to attach to ${group.name}`}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {rolesLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              Loading roles...
            </div>
          ) : roles && roles.length > 0 ? (
            <Form.Item name="assignedRolesIDs" style={{ margin: 0, width: '100%' }}>
              <Checkbox.Group style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    width: '100%',
                    padding: '0 16px',
                    boxSizing: 'border-box',
                    alignItems: 'center',
                  }}
                >
                  {roles.map((role) => {
                    return (
                      <div
                        key={role.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          minHeight: '48px',
                          width: '100%',
                          maxWidth: 420,
                          boxSizing: 'border-box',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8fafc';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <Checkbox value={role.id} style={{ margin: 0 }}>
                          <div style={{ marginLeft: 8, width: '100%' }}>
                            <div
                              style={{
                                fontSize: 14,
                                color: '#0B1F33',
                                fontWeight: 500,
                                lineHeight: 1.4,
                              }}
                            >
                              {role.name}
                            </div>

                            {role.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: '#64748b',
                                  marginTop: 2,
                                  lineHeight: 1.3,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
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
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              No roles available
            </div>
          )}
        </div>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText="Attach Roles"
      submitButtonIcon={<RoleIcon size={16} />}
      loading={submitting}
      disabled={false}
      form={form}
      initialValues={{ assignedRolesIDs: initialSelectedRoles }}
    />
  );
};

export default AttachRolePanel;
