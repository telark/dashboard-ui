import React, { memo } from 'react';
import { HEADER_LAYOUT } from '../../../constants';
import { LIST_PAGE } from '../../../constants/shared/pages';
import DataTable from '../table/DataTable';
import { ListToolbar } from '../toolbar';
import { TablePagination } from '../table';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';
import { DataViewError, PageContainer } from '../../shared';
import { FancySpinner } from '../../animation';
import { useDataViewState } from '../../../hooks/layout/useDataViewState';
import FullPageLoader from './FullPageLoader';

const PageLayoutComponent = <T = unknown,>({ config }: { config: PageLayoutConfig<T> }) => {
  const {
    title,
    subtitle,
    breadcrumbs,
    tabs,
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
    fullPageLoading = false,
    error = null,
    onRetry,
  } = config;
  const dataState = useDataViewState({
    loading,
    error,
    hasData: Array.isArray(data) && data.length > 0,
  });
  const isReady = dataState.phase === 'empty' || dataState.phase === 'ready';

  if (fullPageLoading && dataState.phase === 'loading') {
    return <FullPageLoader minHeight={HEADER_LAYOUT.MIN_HEIGHT} />;
  }

  return (
    <PageContainer
      title={title}
      breadcrumbs={breadcrumbs}
      subtitle={subtitle}
      gap={LIST_PAGE.CONTENT_GAP_PX}
    >
      {/* Kept without tabs too, so the toolbar sits at the same height on every list page. */}
      {tabs ?? <div aria-hidden style={{ height: LIST_PAGE.SUBHEADER_ROW_HEIGHT_PX }} />}
      <ListToolbar {...listToolbar} />
      <div style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>
        {dataState.phase === 'error' ? (
          <DataViewError
            variant="table"
            message={dataState.errorMessage}
            onRetry={onRetry ?? (() => undefined)}
            connectivity={dataState.connectivity}
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
                    getCheckboxProps: rowSelection.getCheckboxProps,
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
