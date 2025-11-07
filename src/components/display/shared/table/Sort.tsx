import React from 'react';
import { BiSort } from 'react-icons/bi';
import type { SortHeaderProps } from '../../../../interfaces/table';
import { TABLE_DEFAULTS } from './constants';

const SortHeader: React.FC<SortHeaderProps> = ({
  label,
  align = 'center',
  leftIcon,
  sortable = true,
  isActive = false,
  onSort,
  activeColor = TABLE_DEFAULTS.SORT_ACTIVE,
  inactiveColor = TABLE_DEFAULTS.SORT_INACTIVE,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: TABLE_DEFAULTS.HEADER_ICON_GAP,
        width: '100%',
      }}
    >
      {leftIcon ? (
        <span
          style={{ display: 'inline-flex', alignItems: 'center', color: TABLE_DEFAULTS.ICON_MUTED }}
        >
          {leftIcon}
        </span>
      ) : null}
      <span>{label}</span>
      {sortable ? (
        <BiSort
          onClick={onSort}
          style={{
            cursor: 'pointer',
            color: isActive ? activeColor : inactiveColor,
            fontSize: TABLE_DEFAULTS.SORT_ICON_SIZE,
          }}
        />
      ) : null}
    </div>
  );
};

export default SortHeader;
