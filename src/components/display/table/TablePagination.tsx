import React from 'react';
import { Select, Pagination } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import type { TablePaginationConfig } from '../../../interfaces/layout/table';

interface TablePaginationProps {
  config: TablePaginationConfig;
}

const TablePagination: React.FC<TablePaginationProps> = ({ config }) => {
  const {
    currentPage,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions,
    showRowsLabel = 'Show rows',
  } = config;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            color: '#64748b',
            fontSize: 14,
            fontFamily: "'Roboto Condensed', sans-serif",
          }}
        >
          {showRowsLabel}
        </span>
        <Select
          value={pageSize.toString()}
          onChange={(value) => {
            onPageSizeChange(Number(value));
          }}
          style={{ width: 80 }}
          options={pageSizeOptions.map((size) => ({
            value: size.toString(),
            label: size.toString(),
          }))}
        />
      </div>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper={false}
        showTotal={(total, range) => (
          <span
            style={{
              color: '#64748b',
              fontSize: 14,
              fontFamily: "'Roboto Condensed', sans-serif",
              marginRight: 16,
            }}
          >
            {`${range[0]}-${range[1]} of ${total}`}
          </span>
        )}
        itemRender={(page, type, originalElement) => {
          if (type === 'page' && page === currentPage) {
            return (
              <span
                style={{
                  display: 'inline-block',
                  minWidth: 32,
                  height: 32,
                  lineHeight: '32px',
                  textAlign: 'center',
                  background: DEFAULT_COLORS.SUCCESS,
                  color: '#fff',
                  borderRadius: 4,
                  fontWeight: 500,
                }}
              >
                {page}
              </span>
            );
          }
          return originalElement;
        }}
      />
    </div>
  );
};

export default TablePagination;
