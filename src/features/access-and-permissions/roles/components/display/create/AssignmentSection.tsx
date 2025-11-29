import React, { useEffect, useMemo } from 'react';
import { Form, Select } from 'antd';
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

  const groupedOptions = useMemo(() => {
    const groupOptions = groups.map((group: Group) => ({
      label: group.name,
      value: `group-${group.id}`,
    }));
    const userOptions = users.map((user: User) => ({
      label: user.fullname || user.username,
      value: `user-${user.id}`,
    }));

    return [
      {
        label: RC.ASSIGNMENT.GROUPS_LABEL,
        options: groupOptions,
      },
      {
        label: RC.ASSIGNMENT.USERS_LABEL,
        options: userOptions,
      },
    ];
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
            options={groupedOptions}
          />
        </Form.Item>
      }
    />
  );
};

export default AssignmentSection;
