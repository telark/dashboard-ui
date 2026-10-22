import React, { memo } from 'react';
import type { DashboardRowItem } from '../../models';
import DashboardBox, { type DashboardBoxProps } from '../box/DashboardBox';
import RowList from '../display/RowList';

interface ListBoxProps extends Omit<DashboardBoxProps, 'children'> {
  rows: DashboardRowItem[];
  emptyText: string;
  emptyIcon?: React.ComponentType;
}

const ListBox: React.FC<ListBoxProps> = memo(({ rows, emptyText, emptyIcon, ...boxProps }) => (
  <DashboardBox value={rows.length > 0 ? rows.length : undefined} {...boxProps}>
    <RowList rows={rows} emptyText={emptyText} emptyIcon={emptyIcon} />
  </DashboardBox>
));

ListBox.displayName = 'ListBox';

export default ListBox;
