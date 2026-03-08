import React, { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../../../../../components/display/table/DataTable';
import type { Group, GroupsTableProps } from '../../../models';
import Columns from './Columns';
import { selectGroupsCategories } from '../../../../categories/store/selectors/categorySelectors';
import { deduplicateCategoriesByName } from '../../../../categories/utils/helpers';
import ActionBar from '../../../../../../components/display/actions/ActionBar';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';

type SortKey = 'name' | 'categoryID' | 'creationDate';

const GroupsTable: React.FC<GroupsTableProps> = ({ groups, onView, onEdit }) => {
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const categoriesFromStore = useSelector(selectGroupsCategories);
  const categories = useMemo(
    () => deduplicateCategoriesByName(categoriesFromStore),
    [categoriesFromStore],
  );

  const selectedCount = selectedGroups.size;
  const hasSelection = selectedCount > 0;

  const sorted = useMemo(() => {
    const items = [...groups];
    const compare = (a: Group, b: Group) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'categoryID':
          return String(a.categoryID).localeCompare(String(b.categoryID));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [groups, sortKey, sortOrder]);

  const handleView = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = Array.from(selectedGroups)[0];
      const selectedGroup = groups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        onView?.(selectedGroup);
      }
    }
  }, [selectedCount, selectedGroups, groups, onView]);

  const handleEdit = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = Array.from(selectedGroups)[0];
      const selectedGroup = groups.find((g) => g.id === selectedId);
      if (selectedGroup) {
        onEdit?.(selectedGroup);
      }
    }
  }, [selectedCount, selectedGroups, groups, onEdit]);

  const handleRowSelection = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedGroups(new Set(selectedRowKeys as string[]));
  }, []);

  const columns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: (k: string) => {
          const key = k as SortKey;
          setSortKey(key);
          setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        },
        categories,
      }),
    [sortKey, categories],
  );

  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 16,
        boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
        padding: 16,
        overflow: 'hidden',
      }}
    >
      <ActionBar
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        onView={handleView}
        onEdit={handleEdit}
      />
      <DataTable<Group>
        className="app-table"
        columns={columns}
        data={sorted}
        rowKey={(r) => r.id}
        rowHeight={GC.SIZES.ROW_HEIGHT}
        containerStyle={{
          background: 'transparent',
          borderRadius: 0,
          boxShadow: 'none',
          padding: 0,
        }}
        tableProps={{
          rowSelection: {
            selectedRowKeys: Array.from(selectedGroups),
            onChange: handleRowSelection,
          },
        }}
        onRowClick={(record) => onView?.(record)}
      />
    </div>
  );
};

export default GroupsTable;
