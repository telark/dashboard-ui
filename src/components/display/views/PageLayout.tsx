import { Activity, memo } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import { useAppearance } from '../../../features/settings/sections/appearance';
import DataTable from '../table/DataTable';
import { FilterSection } from '../filters';
import { Toolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';
import { DataViewError } from '../../shared';
import { FancySpinner } from '../../animation';
import { useDataViewState } from '../../../hooks/layout/useDataViewState';

const PageLayoutComponent = <T = unknown,>({ config }: { config: PageLayoutConfig<T> }) => {
  const navigate = useNavigate();
  const { rowHeight: densityRowHeight, contentGap } = useAppearance();
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
    rowHeight: configRowHeight,
    empty,
    loading = false,
    error = null,
    onRetry,
  } = config;
  const rowHeight = configRowHeight ?? densityRowHeight;
  const dataState = useDataViewState({
    loading,
    error,
    hasData: Array.isArray(data) && data.length > 0,
  });

  return (
    <div
      style={{
        background: '#fff',
        minHeight: '100vh',
        padding: PAGE_CONTENT_LAYOUT.PADDING,
        marginTop: `${PAGE_CONTENT_LAYOUT.HEADER_OFFSET_PX}px`,
        width: '100%',
        boxSizing: 'border-box',
        ...containerStyle,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap }}>
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
            gridTemplateColumns: '1fr auto',
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {dataState.phase === 'error' && (
            <DataViewError
              variant="table"
              message={dataState.errorMessage}
              onRetry={onRetry ?? (() => undefined)}
            />
          )}
          {dataState.phase === 'loading' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 220,
              }}
            >
              <FancySpinner size={40} showLabel />
            </div>
          )}
          {(dataState.phase === 'empty' || dataState.phase === 'ready') && (
            <>
              <DataTable<T>
                columns={columns}
                data={data}
                rowKey={rowKey}
                className="app-table"
                rowHeight={rowHeight}
                empty={empty}
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
              <TablePagination config={pagination} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PageLayout = memo(PageLayoutComponent) as <T = unknown>(props: {
  config: PageLayoutConfig<T>;
}) => React.ReactElement;

export default PageLayout;
