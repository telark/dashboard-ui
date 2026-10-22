import { Table, Empty } from 'antd';
import { DEFAULT_COLORS, SPACING } from '../../../constants';
import type { DataTableProps } from '../../../interfaces/layout/table';

function DataTable<T>({
  columns,
  data,
  rowKey,
  className,
  containerStyle,
  tableProps = {},
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
        // Off scale, kept exact: borderRadius 16 (LG to PILL).
        background: DEFAULT_COLORS.PAGE_BG,
        borderRadius: 16,
        padding: SPACING.LG,
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        size="small"
        locale={{
          emptyText: emptyComponent,
        }}
        {...tableProps}
      />
    </div>
  );
}

export default DataTable;
