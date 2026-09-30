import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { DEFAULT_COLORS, LIST_TOOLBAR, TOOLBAR_ITEM_GAP, getPillSurface } from '../../../constants';
import { LIST_PAGE, PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import type {
  FilterChip,
  ListToolbarProps,
  ListToolbarSelection,
} from '../../../interfaces/layout/toolbar';
import { useElementWidth } from '../../../hooks/layout';
import { FilterButton } from '../buttons';
import Toolbar from './Toolbar';

const metaStyle: React.CSSProperties = {
  fontSize: LIST_TOOLBAR.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
  lineHeight: 1,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  height: '100%',
};

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: LIST_TOOLBAR.CHIP_GAP_PX,
  padding: LIST_TOOLBAR.CHIP_PADDING,
  borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
  ...getPillSurface(),
  fontSize: LIST_TOOLBAR.CHIP_FONT_SIZE_PX,
  fontWeight: LIST_TOOLBAR.CHIP_FONT_WEIGHT,
  flexShrink: 0,
};

const FilterChips: React.FC<{
  chips: FilterChip[];
  overflowCount: number;
  onRemove?: (key: string, value: string) => void;
}> = ({ chips, overflowCount, onRemove }) => (
  <>
    {chips.map((chip) => (
      <span key={`${chip.key}:${chip.value}`} style={chipStyle}>
        {chip.label}
        <button
          type="button"
          aria-label={LIST_TOOLBAR.REMOVE_CHIP_LABEL}
          onClick={() => onRemove?.(chip.key, chip.value)}
          style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex' }}
        >
          <CloseOutlined />
        </button>
      </span>
    ))}
    {overflowCount > 0 ? (
      <span style={chipStyle}>
        +{overflowCount} {LIST_TOOLBAR.OVERFLOW_SUFFIX}
      </span>
    ) : null}
  </>
);

const SelectionSummary: React.FC<{ selection: ListToolbarSelection }> = ({ selection }) => {
  const selectedLabel = `${selection.selectedCount} ${LIST_TOOLBAR.SELECTED_SUFFIX}`;
  const { onToggleSelectAllPage } = selection;
  return (
    <span style={{ ...metaStyle, paddingLeft: LIST_TOOLBAR.SELECTION_PADDING_LEFT_PX }}>
      {onToggleSelectAllPage ? (
        <Checkbox
          checked={selection.allPageSelected}
          onChange={(e) => onToggleSelectAllPage(e.target.checked)}
          style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: LIST_TOOLBAR.META_FONT_SIZE_PX }}
        >
          {selection.label} · {selectedLabel}
        </Checkbox>
      ) : (
        selectedLabel
      )}
    </span>
  );
};

const ListToolbar: React.FC<ListToolbarProps> = ({
  totalCount,
  countSuffix,
  compactWidth,
  filterChips = [],
  overflowChipsCount = 0,
  onRemoveFilterChip,
  filterNote,
  hasActiveFilters = false,
  onClearAllFilters,
  onOpenFilters,
  bulkMode = false,
  selection,
  bulkActions,
  quickFilter,
  toolbars,
}) => {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  // Bulk mode adds the select-all cluster and its actions, so it runs out of room
  // far earlier than the default toolbar.
  const threshold = bulkMode ? compactWidth.BULK : compactWidth.DEFAULT;
  const isCompact = width > 0 && width < threshold;
  const isQuickFilterCompact = width > 0 && width < (compactWidth.QUICK_FILTER ?? threshold);
  const count =
    totalCount === undefined ? null : (
      <span style={metaStyle}>
        {totalCount} {totalCount === 1 ? countSuffix.one : countSuffix.other}
      </span>
    );
  const clearAllConfig =
    hasActiveFilters && onClearAllFilters
      ? {
          buttons: [
            {
              key: 'clearAll',
              label: LIST_TOOLBAR.CLEAR_ALL_LABEL,
              icon: <CloseOutlined />,
              variant: 'default' as const,
              onClick: onClearAllFilters,
            },
          ],
        }
      : undefined;

  return (
    // Sticks under the app header so the controls stay reachable while the list scrolls.
    <div
      style={{
        position: 'sticky',
        top: PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX,
        zIndex: LIST_PAGE.TOOLBAR_Z_INDEX,
        background: DEFAULT_COLORS.PAGE_BG,
        padding: LIST_PAGE.TOOLBAR_PADDING,
      }}
    >
      <div
        ref={ref}
        className={LIST_TOOLBAR.BULK_SELECT_CLASS}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: LIST_TOOLBAR.ROW_HEIGHT_PX,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: LIST_TOOLBAR.CLUSTER_GAP_PX,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            minWidth: 0,
            height: '100%',
          }}
        >
          {bulkMode && selection && selection.pageCount > 0 ? (
            <SelectionSummary selection={selection} />
          ) : null}
          {bulkMode ? <Toolbar config={bulkActions} compact={isCompact} /> : null}
          {bulkMode ? count : null}
          <FilterChips
            chips={filterChips}
            overflowCount={overflowChipsCount}
            onRemove={onRemoveFilterChip}
          />
          {filterNote ? <span style={metaStyle}>{filterNote}</span> : null}
          <Toolbar config={clearAllConfig} compact={isCompact} />
        </div>
        {/* Fills the rest of the row, so the count appearing grows it inward: its start never moves. */}
        <div
          style={{
            display: 'flex',
            flex: '1 0 auto',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: TOOLBAR_ITEM_GAP,
            height: '100%',
          }}
        >
          {bulkMode ? null : count}
          {quickFilter?.(isQuickFilterCompact)}
          {onOpenFilters ? <FilterButton onClick={onOpenFilters} compact={isCompact} /> : null}
          {toolbars.map((config, index) => (
            <Toolbar key={config.buttons[0]?.key ?? index} config={config} compact={isCompact} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListToolbar;
