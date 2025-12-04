import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../../store';
import { fetchAllGroupsThunk } from '../../../../../groups/store';
import type { Group } from '../../../../../groups/models';
import AssignmentSelect, { type AssignmentSelectOption } from './AssignmentSelect';

export interface GroupsSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  allOptionsMap?: Map<string, string>;
  onOptionsMapUpdate?: (map: Map<string, string>) => void;
}

const GroupsSelect: React.FC<GroupsSelectProps> = memo(
  ({ value, onChange, allOptionsMap, onOptionsMapUpdate }) => {
    const dispatch: AppDispatch = useDispatch();
    const { groups, loading: groupsLoading } = useSelector((state: RootState) => state.groups);

    useEffect(() => {
      dispatch(fetchAllGroupsThunk());
    }, [dispatch]);

    const groupOptions = useMemo((): AssignmentSelectOption[] => {
      return groups.map((group: Group) => ({
        label: group.name,
        value: `group-${group.id}`,
        displayName: group.name,
      }));
    }, [groups]);

    useEffect(() => {
      // Update the options map if callback provided
      if (onOptionsMapUpdate) {
        const map = new Map<string, string>();
        groups.forEach((group: Group) => {
          map.set(`group-${group.id}`, group.name);
        });
        onOptionsMapUpdate(map);
      }
    }, [groups, onOptionsMapUpdate]);

    return (
      <AssignmentSelect
        value={value}
        onChange={onChange}
        options={groupOptions}
        placeholder="Select groups"
        loading={groupsLoading}
        allOptionsMap={allOptionsMap}
        className="role-assignment-select-groups"
        filterOption={(input, option) => {
          const displayName = option?.displayName || '';
          return displayName.toLowerCase().includes(input.toLowerCase());
        }}
      />
    );
  },
);

GroupsSelect.displayName = 'GroupsSelect';

export default GroupsSelect;
