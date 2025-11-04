import { Table } from 'antd';
import type { DataTableProps } from '../../../../interfaces/table';

function DataTable<T>({
  columns,
  data,
  rowKey,
  rowHeight = 44,
  className,
  containerStyle,
  tableProps = {},
  onRowClick,
}: DataTableProps<T>) {
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
        dataSource={data as any}
        pagination={false}
        size="small"
        tableLayout="fixed"
        onRow={(record) => ({
          style: { height: rowHeight, cursor: onRowClick ? 'pointer' : 'default' },
          onClick: onRowClick ? () => onRowClick(record as T) : undefined,
        })}
        {...tableProps}
      />
    </div>
  );
}

export default DataTable;
