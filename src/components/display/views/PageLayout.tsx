import { Activity } from 'react';
import DataTable from '../table/DataTable';
import { FilterSection } from '../filters';
import { Toolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';

function PageLayout<T = unknown>({ config }: { config: PageLayoutConfig<T> }) {
  const {
    title,
    subtitle,
    filterSection,
    toolbar,
    columns,
    data,
    rowKey,
    pagination,
    rowSelection,
    onRowClick,
    containerStyle,
    rowHeight = 44,
  } = config;

  return (
    <div
      style={{
        background: '#fff',
        minHeight: '100vh',
        padding: '100px 48px 48px',
        marginTop: '60px',
        width: '100%',
        boxSizing: 'border-box',
        ...containerStyle,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Title and Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
          <Activity mode={subtitle ? 'visible' : 'hidden'}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: '#64748b',
                margin: 0,
                marginTop: 0,
                padding: 0,
                lineHeight: 1.2,
                fontFamily: "'Roboto Condensed', sans-serif",
              }}
            >
              {subtitle}
            </p>
          </Activity>
        </div>

        {/* Filters and Toolbar */}
        <Activity mode={filterSection || toolbar ? 'visible' : 'hidden'}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 16,
            }}
          >
            <Activity mode={filterSection ? 'visible' : 'hidden'}>
              <FilterSection config={filterSection!} />
            </Activity>
            <Activity mode={toolbar ? 'visible' : 'hidden'}>
              <Toolbar config={toolbar!} />
            </Activity>
          </div>
        </Activity>

        {/* Table */}
        <DataTable<T>
          columns={columns}
          data={data}
          rowKey={rowKey}
          className="app-table"
          rowHeight={rowHeight}
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
