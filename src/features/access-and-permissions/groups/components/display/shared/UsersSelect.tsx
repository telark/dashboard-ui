import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../store';
import { fetchAllUsersThunk } from '../../../../users/store';
import { UserDisplay } from '../../../../../../components/display/users';
import type { User } from '../../../../users/models';
import AssignmentSelect from '../../../../roles/components/display/sections/assignment/AssignmentSelect';
import type { AssignmentSelectOption } from '../../../../roles/models';

interface UsersSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const UsersSelect: React.FC<UsersSelectProps> = memo(({ value, onChange }) => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.users);
  const [allOptionsMap, setAllOptionsMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const userOptions = useMemo((): AssignmentSelectOption[] => {
    return users.map((user: User) => {
      const displayName = user.fullname || user.username;
      return {
        label: <UserDisplay user={user} size="small" />,
        value: user.id,
        displayName,
      };
    });
  }, [users]);

  useEffect(() => {
    const map = new Map<string, string>();
    users.forEach((user: User) => {
      map.set(user.id, user.fullname || user.username);
    });
    setAllOptionsMap(map);
  }, [users]);

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
});

UsersSelect.displayName = 'UsersSelect';

export default UsersSelect;
