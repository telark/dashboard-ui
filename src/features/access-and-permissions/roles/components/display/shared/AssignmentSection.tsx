import React, { useEffect, useMemo } from 'react';
import { Form, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../store';
import { fetchAllGroupsThunk } from '../../../../groups/store';
import { fetchAllUsersThunk } from '../../../../users/store';
import Section from '../../../../../../components/display/sections/Section';
import UserAvatar from '../../../../../../components/display/avatars/UserAvatar';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants/shared/colors';
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
      displayName: group.name,
    }));
    const userOptions = users.map((user: User) => ({
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 23,
              height: 23,
              borderRadius: '50%',
              border: `1.5px solid ${DEFAULT_COLORS.SUCCESS}`,
              padding: 1.5,
              background: 'transparent',
            }}
          >
            <UserAvatar
              avatar={user.avatar}
              username={user.username}
              size={16}
              style={{ border: 'none' }}
            />
          </div>
          <span>{user.fullname || user.username}</span>
        </div>
      ),
      value: `user-${user.id}`,
      displayName: user.fullname || user.username,
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

  const allOptionsMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((group) => {
      map.set(`group-${group.id}`, group.name);
    });
    users.forEach((user) => {
      map.set(`user-${user.id}`, user.fullname || user.username);
    });
    return map;
  }, [groups, users]);

  return (
    <Section
      title={RC.ASSIGNMENT.TITLE}
      subtitle={RC.ASSIGNMENT.SUBTITLE}
      content={
        <Form.Item name="assignedTo" style={{ marginBottom: 0 }} className="form-item-compact">
          <Select
            mode="multiple"
            placeholder={RC.ASSIGNMENT.PLACEHOLDER}
            loading={groupsLoading || usersLoading}
            maxTagCount="responsive"
            options={groupedOptions}
            className="role-assignment-select"
            tagRender={(props) => {
              const { label, value } = props;
              const displayName = allOptionsMap.get(value as string) || label;
              return (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    height: '24px',
                    lineHeight: '24px',
                    backgroundColor: DEFAULT_COLORS.SUCCESS,
                    color: 'white',
                    borderRadius: '4px',
                    marginRight: '4px',
                    fontSize: '14px',
                  }}
                >
                  {displayName}
                  <span
                    onClick={props.onClose}
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    ×
                  </span>
                </span>
              );
            }}
          />
        </Form.Item>
      }
    />
  );
};

export default AssignmentSection;
