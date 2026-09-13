import React, { memo } from 'react';
import { LIST_PAGE } from '../../../constants/shared/pages';
import DataTable from '../table/DataTable';
import { ListToolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';
import { DataViewError, PageContainer } from '../../shared';
import { FancySpinner } from '../../animation';
import { useDataViewState } from '../../../hooks/layout/useDataViewState';

const PageLayoutComponent = <T = unknown,>({ config }: { config: PageLayoutConfig<T> }) => {
  const {
    title,
    subtitle,
    breadcrumbs,
    listToolbar,
    columns,
    data,
    rowKey,
    pagination,
    rowSelection,
    onRowClick,
    rowHeight,
    empty,
    loading = false,
    error = null,
    onRetry,
  } = config;
  const dataState = useDataViewState({
    loading,
    error,
    hasData: Array.isArray(data) && data.length > 0,
  });
  const isReady = dataState.phase === 'empty' || dataState.phase === 'ready';

  return (
    <PageContainer
      title={title}
      breadcrumbs={breadcrumbs}
      subtitle={subtitle}
      gap={LIST_PAGE.CONTENT_GAP_PX}
    >
      <ListToolbar {...listToolbar} />
      <div style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>
        {dataState.phase === 'error' ? (
          <DataViewError
            variant="table"
            message={dataState.errorMessage}
            onRetry={onRetry ?? (() => undefined)}
          />
        ) : null}
        {dataState.phase === 'loading' ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: LIST_PAGE.LOADING_MIN_HEIGHT_PX,
            }}
          >
            <FancySpinner size={40} showLabel />
          </div>
        ) : null}
        {isReady ? (
          <DataTable<T>
            columns={columns}
            data={data}
            rowKey={rowKey}
            className="app-table"
            rowHeight={rowHeight}
            empty={empty}
            tableProps={{
              // Columns keep their widths and the table scrolls sideways once the
              // page is narrower than they are, instead of clipping the last ones.
              scroll: { x: 'max-content' },
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
            containerStyle={{ background: 'transparent', borderRadius: 0, padding: 0 }}
          />
        ) : null}
      </div>
      {isReady ? <TablePagination config={pagination} /> : null}
    </PageContainer>
  );
};

const PageLayout = memo(PageLayoutComponent) as <T = unknown>(props: {
  config: PageLayoutConfig<T>;
}) => React.ReactElement;

export default PageLayout;
