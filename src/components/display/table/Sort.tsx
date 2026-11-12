import React from 'react';
import { BiSort } from 'react-icons/bi';
import type { SortHeaderProps } from '../../../interfaces/layout/table';
import { UNSTYLED_BUTTON } from '../../../constants';
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
  const iconColor = isActive ? activeColor : inactiveColor;
  const layout: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : 'flex-start',
    gap: TABLE_DEFAULTS.HEADER_ICON_GAP,
    width: '100%',
    userSelect: 'none',
  };
  const content = (
    <>
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
          style={{
            pointerEvents: 'none',
            color: iconColor,
            fontSize: TABLE_DEFAULTS.SORT_ICON_SIZE,
          }}
        />
      ) : null}
    </>
  );

  if (!sortable || !onSort) return <div style={layout}>{content}</div>;

  // A native button, so the sort is reachable by keyboard.
  return (
    <button
      type="button"
      style={{ ...UNSTYLED_BUTTON, font: 'inherit', color: 'inherit', ...layout }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSort();
      }}
    >
      {content}
    </button>
  );
};

export default SortHeader;
