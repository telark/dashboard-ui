import React, { memo } from 'react';
import type { DashboardRowItem } from '../../models';
import DashboardBox, { type DashboardBoxProps } from '../box/DashboardBox';
import RowList from '../display/RowList';

interface ListBoxProps extends Omit<DashboardBoxProps, 'children'> {
  rows: DashboardRowItem[];
  emptyText: string;
}

const ListBox: React.FC<ListBoxProps> = memo(({ rows, emptyText, ...boxProps }) => (
  <DashboardBox count={rows.length} {...boxProps}>
    <RowList rows={rows} emptyText={emptyText} />
  </DashboardBox>
));

ListBox.displayName = 'ListBox';

export default ListBox;
