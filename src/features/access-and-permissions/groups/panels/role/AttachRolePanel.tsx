import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Form, Space } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons, DEFAULT_COLORS } from '../../../../../constants';
import { useGroupMutations } from '../../hooks';
import { useRoles } from '../../../roles/hooks';
import type { Group } from '../../models';
import type { RootState } from '../../../../../store';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import { ROLES_CONSTANTS as RC } from '../../../roles/constants';

const RoleIcon = Icons.Role;

interface AttachRolePanelProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

const AttachRolePanel: React.FC<AttachRolePanelProps> = ({ open, onClose, group }) => {
  const { roles, loading: rolesLoading } = useRoles();
  const { handleUpdate, submitting } = useGroupMutations();
  const [form] = Form.useForm();
  const groups = useSelector((state: RootState) => state.groups.groups);
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');

  const currentGroup = useMemo(() => {
    if (!group) return null;
    return groups.find((g) => g.id === group.id) || group;
  }, [group, groups]);

  const initialSelectedRoles = useMemo(() => {
    return currentGroup?.assignedRolesIDs || [];
  }, [currentGroup]);

  const currentSelectedRoles = Form.useWatch('assignedRolesIDs', form) || [];

  const hasChanges = useMemo(() => {
    return !arraysEqual(
      (currentSelectedRoles as string[]) || [],
      initialSelectedRoles || [],
    );
  }, [currentSelectedRoles, initialSelectedRoles]);

  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    if (selectedRoleType === 'all') return roles;
    return roles.filter((role) => role.type === selectedRoleType);
  }, [roles, selectedRoleType]);

  useEffect(() => {
    if (open && currentGroup && !rolesLoading && roles) {
      const assignedRoles = currentGroup.assignedRolesIDs || [];
      form.setFieldsValue({ assignedRolesIDs: assignedRoles });
      setSelectedRoleType('all');
    }
  }, [open, currentGroup?.id, currentGroup?.assignedRolesIDs, rolesLoading, roles, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!currentGroup) return;
    const assignedRolesIDs = (values.assignedRolesIDs as string[]) || [];
    await handleUpdate(currentGroup.id, { assignedRolesIDs });
    form.resetFields();
    onClose();
  };

  if (!currentGroup) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title="Attach Roles"
      subtitle={`Select roles to attach to ${currentGroup.name}`}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontFamily: "'Roboto Condensed', sans-serif",
              }}
            >
              Role Type
            </span>
            <Space wrap={false} size={[8, 8]}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedRoleType('all');
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  borderRadius: 20,
                  height: 28,
                  padding: '0 16px',
                  fontSize: 13,
                  fontWeight: selectedRoleType === 'all' ? 600 : 500,
                  border: `1px solid ${selectedRoleType === 'all' ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                  backgroundColor: selectedRoleType === 'all' ? DEFAULT_COLORS.SUCCESS : '#fff',
                  color: selectedRoleType === 'all' ? '#fff' : '#64748b',
                  fontFamily: "'Roboto Condensed', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                All
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedRoleType(RC.VALUES.ROLE_TYPE_BUILT_IN);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  borderRadius: 20,
                  height: 28,
                  padding: '0 16px',
                  fontSize: 13,
                  fontWeight: selectedRoleType === RC.VALUES.ROLE_TYPE_BUILT_IN ? 600 : 500,
                  border: `1px solid ${selectedRoleType === RC.VALUES.ROLE_TYPE_BUILT_IN ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                  backgroundColor: selectedRoleType === RC.VALUES.ROLE_TYPE_BUILT_IN ? DEFAULT_COLORS.SUCCESS : '#fff',
                  color: selectedRoleType === RC.VALUES.ROLE_TYPE_BUILT_IN ? '#fff' : '#64748b',
                  fontFamily: "'Roboto Condensed', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                Built-in
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedRoleType(RC.VALUES.ROLE_TYPE_CUSTOM);
                }}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  borderRadius: 20,
                  height: 28,
                  padding: '0 16px',
                  fontSize: 13,
                  fontWeight: selectedRoleType === RC.VALUES.ROLE_TYPE_CUSTOM ? 600 : 500,
                  border: `1px solid ${selectedRoleType === RC.VALUES.ROLE_TYPE_CUSTOM ? DEFAULT_COLORS.SUCCESS : '#d9d9d9'}`,
                  backgroundColor: selectedRoleType === RC.VALUES.ROLE_TYPE_CUSTOM ? DEFAULT_COLORS.SUCCESS : '#fff',
                  color: selectedRoleType === RC.VALUES.ROLE_TYPE_CUSTOM ? '#fff' : '#64748b',
                  fontFamily: "'Roboto Condensed', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                Custom
              </button>
            </Space>
          </div>
          {rolesLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              {GC.LABELS.MESSAGES.LOADING_ROLES}
            </div>
          ) : filteredRoles && filteredRoles.length > 0 ? (
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
                    padding: '0 0px',
                    boxSizing: 'border-box',
                    alignItems: 'stretch',
                  }}
                >
                  {filteredRoles.map((role) => {
                    return (
                      <div
                        key={role.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px 14px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8,
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          minHeight: '48px',
                          width: '100%',
                          maxWidth: '100%',
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
              {GC.LABELS.MESSAGES.NO_ROLES_AVAILABLE}
            </div>
          )}
        </div>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText="Attach Roles"
      submitButtonIcon={<RoleIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={{ assignedRolesIDs: initialSelectedRoles }}
    />
  );
};

export default AttachRolePanel;
