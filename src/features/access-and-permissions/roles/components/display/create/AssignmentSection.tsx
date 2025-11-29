import React, { useEffect, useMemo } from 'react';
import { Form, Select, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../store';
import { fetchAllGroupsThunk } from '../../../../groups/store';
import { fetchAllUsersThunk } from '../../../../users/store';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { Group } from '../../../../groups/models';
import type { User } from '../../../../users/models';

const AssignmentSection: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading: groupsLoading } = useSelector((state: RootState) => state.groups);
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const allOptions = useMemo(() => {
    const groupOptions = groups.map((group: Group) => ({
      label: group.name,
      value: `group-${group.id}`,
    }));
    const userOptions = users.map((user: User) => ({
      label: user.fullname || user.username,
      value: `user-${user.id}`,
    }));
    return [...groupOptions, ...userOptions];
  }, [groups, users]);

  return (
    <Section
      title={RC.ASSIGNMENT.TITLE}
      subtitle={RC.ASSIGNMENT.SUBTITLE}
      content={
        <Form.Item name="assignedTo" label={RC.ASSIGNMENT.LABEL}>
          <Select
            mode="multiple"
            placeholder={RC.ASSIGNMENT.PLACEHOLDER}
            loading={groupsLoading || usersLoading}
            maxTagCount="responsive"
            options={allOptions}
            popupRender={(menu) => (
              <div>
                <div
                  style={{
                    padding: '8px 12px',
                    fontWeight: 600,
                    color: RC.COLORS.TEXT_PRIMARY,
                  }}
                >
                  {RC.ASSIGNMENT.GROUPS_LABEL}
                </div>
                <Divider style={{ margin: '4px 0' }} />
                <div
                  style={{
                    padding: '8px 12px',
                    fontWeight: 600,
                    color: RC.COLORS.TEXT_PRIMARY,
                  }}
                >
                  {RC.ASSIGNMENT.USERS_LABEL}
                </div>
                {menu}
              </div>
            )}
          />
        </Form.Item>
      }
    />
  );
};

export default AssignmentSection;
