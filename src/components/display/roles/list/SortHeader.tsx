import React from 'react';
import { BiSort } from 'react-icons/bi';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';

interface SortHeaderProps {
  label: string;
  align?: 'left' | 'center';
  leftIcon?: React.ReactNode;
  sortable?: boolean;
  isActive?: boolean;
  onSort?: () => void;
}

const SortHeader: React.FC<SortHeaderProps> = ({
  label,
  align = 'center',
  leftIcon,
  sortable = true,
  isActive = false,
  onSort,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 6,
        width: '100%',
      }}
    >
      {leftIcon ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', color: RPC.COLORS.TEXT_MUTED }}>{leftIcon}</span>
      ) : null}
      <span>{label}</span>
      {sortable ? (
        <BiSort
          onClick={onSort}
          style={{ cursor: 'pointer', color: isActive ? RPC.COLORS.SORT_ACTIVE : RPC.COLORS.SORT_MUTED, fontSize: RPC.SIZES.HEADER_ICON }}
        />
      ) : null}
    </div>
  );
};

export default SortHeader;


