import React from 'react';
import { Table, Empty } from 'antd';
import type { DataTableProps } from '../../../interfaces/layout/table';

function DataTable<T>({
  columns,
  data,
  rowKey,
  rowHeight = 44,
  className,
  containerStyle,
  tableProps = {},
  onRowClick,
  empty,
}: Readonly<DataTableProps<T>>) {
  const filteredData = Array.isArray(data) ? data.filter((item) => item != null) : data;

  const emptyComponent = empty || (
    <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
        padding: 16,
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      <Table
        rowKey={rowKey as any}
        columns={columns as any}
        dataSource={filteredData as any}
        pagination={false}
        size="small"
        tableLayout="fixed"
        onRow={(record) => ({
          style: { height: rowHeight, cursor: onRowClick ? 'pointer' : 'default' },
          onClick: onRowClick ? () => onRowClick(record as T) : undefined,
        })}
        locale={{
          emptyText: emptyComponent,
        }}
        {...tableProps}
      />
    </div>
  );
}

export default DataTable;
