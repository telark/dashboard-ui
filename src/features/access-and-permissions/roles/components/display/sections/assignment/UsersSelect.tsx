import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../../store';
import { fetchAllUsersThunk } from '../../../../../users/store';
import { UserDisplay } from '../../../../../../../components/display/users';
import type { User } from '../../../../../users/models';
import AssignmentSelect from './AssignmentSelect';
import type { AssignmentSelectOption, UsersSelectProps } from '../../../../models';

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
          label: <UserDisplay user={user} size="small" />,
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
