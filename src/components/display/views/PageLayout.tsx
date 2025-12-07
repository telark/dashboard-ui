import { Activity, memo } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../table/DataTable';
import { FilterSection } from '../filters';
import { Toolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';

const PageLayoutComponent = <T = unknown,>({ config }: { config: PageLayoutConfig<T> }) => {
  const navigate = useNavigate();
  const {
    title,
    subtitle,
    breadcrumbs,
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
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <>
                {breadcrumbs.map((b, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span style={{ color: '#64748b' }}>/</span>}
                    {b.onClick || b.to ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (b.onClick) {
                            b.onClick();
                          } else if (b.to) {
                            navigate(b.to);
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          color: '#64748b',
                          fontSize: 28,
                          fontWeight: 700,
                          fontFamily: 'inherit',
                          textDecoration: 'none',
                        }}
                      >
                        {b.label}
                      </button>
                    ) : (
                      <span>{b.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              title
            )}
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px auto',
            alignItems: 'flex-end',
            gap: 16,
            minHeight: '60px',
            width: '100%',
          }}
        >
          {/* FILTER COLUMN - Always rendered */}
          <div
            style={{
              minHeight: '60px',
              visibility: filterSection ? 'visible' : 'hidden',
              pointerEvents: filterSection ? 'auto' : 'none',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {filterSection ? <FilterSection config={filterSection} /> : null}
          </div>

          {/* TOOLBAR - Always same position */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              minHeight: '60px',
            }}
          >
            {toolbar ? <Toolbar config={toolbar} /> : null}
          </div>
        </div>

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
