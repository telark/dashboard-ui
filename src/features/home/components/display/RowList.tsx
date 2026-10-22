import React from 'react';
import { HOME_DASHBOARD_LAYOUT as L } from '../../constants/dashboard';
import type { DashboardRowItem } from '../../models';
import BoxEmpty from './BoxEmpty';
import DashboardRow from './DashboardRow';

interface RowListProps {
  rows: DashboardRowItem[];
  emptyText: string;
  emptyIcon?: React.ComponentType;
  inline?: boolean;
}

const RowList: React.FC<RowListProps> = ({ rows, emptyText, emptyIcon, inline }) => {
  if (rows.length === 0) return <BoxEmpty icon={emptyIcon}>{emptyText}</BoxEmpty>;
  return (
    <div>
      {rows.slice(0, L.LIST_LIMIT).map(({ key, ...row }) => (
        <DashboardRow key={key} inline={inline} {...row} />
      ))}
    </div>
  );
};

export default RowList;
