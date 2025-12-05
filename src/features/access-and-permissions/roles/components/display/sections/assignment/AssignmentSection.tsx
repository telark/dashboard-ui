import React, { memo, useMemo, useState, useCallback } from 'react';
import { Form } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RC } from '../../../../constants';
import GroupsSelect from './GroupsSelect';
import UsersSelect from './UsersSelect';
import type { AssignmentSectionProps } from '../../../../models';

const AssignmentSection: React.FC<AssignmentSectionProps> = memo(({ onManualChange }) => {
  const form = Form.useFormInstance();
  const watchedAssignedTo = Form.useWatch('assignedTo', form);

  const assignedToValue = useMemo(() => {
    return watchedAssignedTo || [];
  }, [watchedAssignedTo]);

  const [allOptionsMap, setAllOptionsMap] = useState<Map<string, string>>(new Map());

  const handleGroupsMapUpdate = useCallback((map: Map<string, string>) => {
    setAllOptionsMap((prev) => {
      const newMap = new Map(prev);
      map.forEach((value, key) => {
        newMap.set(key, value);
      });
      return newMap;
    });
  }, []);

  const handleUsersMapUpdate = useCallback((map: Map<string, string>) => {
    setAllOptionsMap((prev) => {
      const newMap = new Map(prev);
      map.forEach((value, key) => {
        newMap.set(key, value);
      });
      return newMap;
    });
  }, []);

  const groupValues = useMemo(() => {
    return assignedToValue.filter((v: string) => v.startsWith('group-'));
  }, [assignedToValue]);

  const userValues = useMemo(() => {
    return assignedToValue.filter((v: string) => v.startsWith('user-'));
  }, [assignedToValue]);

  const handleGroupsChange = useCallback(
    (values: string[]) => {
      const currentAssignedTo = form.getFieldValue('assignedTo') || [];
      const otherValues = currentAssignedTo.filter((v: string) => !v.startsWith('group-'));
      const newAssignedTo = [...otherValues, ...values];
      form.setFieldsValue({ assignedTo: newAssignedTo });
      requestAnimationFrame(() => onManualChange?.());
    },
    [form, onManualChange],
  );

  const handleUsersChange = useCallback(
    (values: string[]) => {
      const currentAssignedTo = form.getFieldValue('assignedTo') || [];
      const otherValues = currentAssignedTo.filter((v: string) => !v.startsWith('user-'));
      const newAssignedTo = [...otherValues, ...values];
      form.setFieldsValue({ assignedTo: newAssignedTo });
      requestAnimationFrame(() => onManualChange?.());
    },
    [form, onManualChange],
  );

  return (
    <Section
      title={RC.ASSIGNMENT.TITLE}
      subtitle={RC.ASSIGNMENT.SUBTITLE}
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Form.Item
            name="assignedTo"
            noStyle
            style={{ marginBottom: 0 }}
            className="form-item-compact"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#0B1F33',
                  }}
                >
                  {RC.ASSIGNMENT.GROUPS_LABEL}
                </label>
                <GroupsSelect
                  value={groupValues}
                  onChange={handleGroupsChange}
                  allOptionsMap={allOptionsMap}
                  onOptionsMapUpdate={handleGroupsMapUpdate}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#0B1F33',
                  }}
                >
                  {RC.ASSIGNMENT.USERS_LABEL}
                </label>
                <UsersSelect
                  value={userValues}
                  onChange={handleUsersChange}
                  allOptionsMap={allOptionsMap}
                  onOptionsMapUpdate={handleUsersMapUpdate}
                />
              </div>
            </div>
          </Form.Item>
        </div>
      }
    />
  );
});

AssignmentSection.displayName = 'AssignmentSection';

export default AssignmentSection;
