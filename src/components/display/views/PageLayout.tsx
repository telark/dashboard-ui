import { Activity, memo } from 'react';
import DataTable from '../table/DataTable';
import { FilterSection } from '../filters';
import { Toolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';

const PageLayoutComponent = <T = unknown,>({ config }: { config: PageLayoutConfig<T> }) => {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0B1F33',
              margin: 0,
              padding: 0,
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
};

const PageLayout = memo(PageLayoutComponent, (prevProps, nextProps) => {
  return (
    prevProps.config.title === nextProps.config.title &&
    prevProps.config.subtitle === nextProps.config.subtitle &&
    prevProps.config.data.length === nextProps.config.data.length &&
    prevProps.config.columns.length === nextProps.config.columns.length
  );
}) as typeof PageLayoutComponent;

export default PageLayout;
