import DataTable from '../table/DataTable';
import { FilterSection } from '../filters';
import { Toolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';

function PageLayout<T = unknown>({ config }: { config: PageLayoutConfig<T> }) {
  const {
    title,
    filterSection,
    toolbar,
    columns,
    data,
    rowKey,
    pagination,
    rowSelection,
    onRowClick,
    containerStyle,
  } = config;

  return (
    <div
      style={{
        background: '#fff',
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 32px 32px',
        marginTop: '60px',
        width: '100%',
        boxSizing: 'border-box',
        ...containerStyle,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Title */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#0B1F33',
            margin: 0,
            padding: 0,
            fontFamily: "'Roboto Condensed', sans-serif",
          }}
        >
          {title}
        </h1>

        {/* Filters and Toolbar */}
        {(filterSection || toolbar) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
            }}
          >
            {filterSection && <FilterSection config={filterSection} />}
            {toolbar && <Toolbar config={toolbar} />}
          </div>
        )}

        {/* Table */}
        <DataTable<T>
          columns={columns}
          data={data}
          rowKey={rowKey}
          className="app-table"
          rowHeight={44}
          tableProps={{
            rowSelection: rowSelection
              ? {
                  selectedRowKeys: rowSelection.selectedRowKeys,
                  onChange: rowSelection.onChange,
                }
              : undefined,
            onRow: onRowClick
              ? (record: T) => ({
                  onClick: () => onRowClick(record),
                  style: { cursor: 'pointer' },
                })
              : undefined,
          }}
          containerStyle={{
            background: 'transparent',
            borderRadius: 0,
            boxShadow: 'none',
            padding: 0,
          }}
        />

        {/* Pagination */}
        <TablePagination config={pagination} />
      </div>
    </div>
  );
}

export default PageLayout;
