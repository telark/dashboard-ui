import React from 'react';
import { Select, Pagination } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import type { TablePaginationConfig } from '../../../interfaces/layout/table';
import { PAGINATION_DEFAULTS } from './constants';

interface TablePaginationProps {
  config: TablePaginationConfig;
}

const mutedText: React.CSSProperties = { color: DEFAULT_COLORS.TEXT_MUTED, whiteSpace: 'nowrap' };

const rangeLabel = ({ currentPage, pageSize, total }: TablePaginationConfig): string => {
  const first = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, total);
  return `${first}${PAGINATION_DEFAULTS.RANGE_SEPARATOR}${last} ${PAGINATION_DEFAULTS.RANGE_OF} ${total}`;
};

const TablePagination: React.FC<TablePaginationProps> = ({ config }) => {
  const {
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions,
    showRowsLabel = PAGINATION_DEFAULTS.SHOW_ROWS_LABEL,
    simple = false,
  } = config;
  const showSizeSelect = Boolean(onPageSizeChange && pageSizeOptions?.length);

  return (
    // Wraps on a phone: the pager drops under the size select instead of running off the edge.
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: showSizeSelect ? 'space-between' : 'flex-end',
        alignItems: 'center',
        gap: PAGINATION_DEFAULTS.SIZE_GAP_PX,
      }}
    >
      {showSizeSelect ? (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: PAGINATION_DEFAULTS.SIZE_GAP_PX }}
        >
          <span style={mutedText}>{showRowsLabel}</span>
          <Select
            value={pageSize.toString()}
            onChange={(value) => onPageSizeChange?.(Number(value))}
            style={{ width: PAGINATION_DEFAULTS.SIZE_SELECT_WIDTH_PX }}
            options={pageSizeOptions?.map((size) => ({
              value: size.toString(),
              label: size.toString(),
            }))}
          />
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <span style={{ ...mutedText, marginRight: PAGINATION_DEFAULTS.RANGE_GAP_PX }}>
          {rangeLabel(config)}
        </span>
        <Pagination
          className={PAGINATION_DEFAULTS.CLASS_NAME}
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
          simple={simple}
        />
      </div>
    </div>
  );
};

export default TablePagination;
