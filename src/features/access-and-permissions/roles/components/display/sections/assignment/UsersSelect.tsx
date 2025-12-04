import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../../store';
import { fetchAllUsersThunk } from '../../../../../users/store';
import UserAvatar from '../../../../../../../components/display/avatars/UserAvatar';
import { DEFAULT_COLORS } from '../../../../../../../constants/shared/colors';
import type { User } from '../../../../../users/models';
import AssignmentSelect, { type AssignmentSelectOption } from './AssignmentSelect';

export interface UsersSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  allOptionsMap?: Map<string, string>;
  onOptionsMapUpdate?: (map: Map<string, string>) => void;
}

const UsersSelect: React.FC<UsersSelectProps> = memo(
  ({ value, onChange, allOptionsMap, onOptionsMapUpdate }) => {
    const dispatch: AppDispatch = useDispatch();
    const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);

    useEffect(() => {
      dispatch(fetchAllUsersThunk());
    }, [dispatch]);

    const userOptions = useMemo((): AssignmentSelectOption[] => {
      return users.map((user: User) => {
        const displayName = user.fullname || user.username;
        return {
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
              <span>{displayName}</span>
            </div>
          ),
          value: `user-${user.id}`,
          displayName,
        };
      });
    }, [users]);

    useEffect(() => {
      // Update the options map if callback provided
      if (onOptionsMapUpdate) {
        const map = new Map<string, string>();
        users.forEach((user: User) => {
          map.set(`user-${user.id}`, user.fullname || user.username);
        });
        onOptionsMapUpdate(map);
      }
    }, [users, onOptionsMapUpdate]);

    return (
      <AssignmentSelect
        value={value}
        onChange={onChange}
        options={userOptions}
        placeholder="Select users"
        loading={usersLoading}
        allOptionsMap={allOptionsMap}
        className="role-assignment-select-users"
        filterOption={(input, option) => {
          const displayName = option?.displayName || '';
          return displayName.toLowerCase().includes(input.toLowerCase());
        }}
      />
    );
  },
);

UsersSelect.displayName = 'UsersSelect';

export default UsersSelect;
