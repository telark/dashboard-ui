import React from 'react';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import type { DashboardRowItem } from '../../models';
import DashboardRow from './DashboardRow';

interface RowListProps {
  rows: DashboardRowItem[];
  emptyText: string;
}

const RowList: React.FC<RowListProps> = ({ rows, emptyText }) => {
  if (rows.length === 0) return <div style={S.MUTED_TEXT}>{emptyText}</div>;
  return (
    <div>
      {rows.slice(0, L.LIST_LIMIT).map(({ key, ...row }) => (
        <DashboardRow key={key} {...row} />
      ))}
    </div>
  );
};

export default RowList;
