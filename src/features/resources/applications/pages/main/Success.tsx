import React, { memo, useMemo } from 'react';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';
import type { Application } from '../../models';
import type { AppDispatch, RootState } from '../../../../../store';
import { useAppearance } from '../../../../settings/sections/appearance';
import { ApplicationCard, ApplicationsHeader, ApplicationsToolbar } from '../../components';
import { setLayoutMode } from '../../store/slices/applicationsSlice';

interface ApplicationsSuccessProps {
  applications: Application[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onEditApplication: (application: Application) => void;
  onOpenFilters: () => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const ApplicationsSuccess: React.FC<ApplicationsSuccessProps> = memo(
  ({ applications, searchValue, onSearchChange, onEditApplication, onOpenFilters, pagination }) => {
    const dispatch: AppDispatch = useDispatch();
    const layoutMode = useSelector((s: RootState) => s.applications.layoutMode);
    const { contentGap } = useAppearance();
    const hasApps = applications.length > 0;

    const content = useMemo(() => {
      if (!hasApps) return null;
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layoutMode === 'double' ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            gap: 16,
            alignItems: 'stretch',
          }}
        >
          {applications.map((application) => (
            <ApplicationCard
              key={application.name}
              application={application}
              onEditApplication={onEditApplication}
            />
          ))}
        </div>
      );
    }, [applications, hasApps, layoutMode, onEditApplication]);

    return (
      <div
        style={{
          minHeight: '100vh',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          padding: PAGE_CONTENT_LAYOUT.PADDING,
          marginTop: 0,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: contentGap }}>
          <ApplicationsHeader />

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
            <div style={{ minHeight: '60px' }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                minHeight: '60px',
              }}
            >
              <ApplicationsToolbar
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onOpenFilters={onOpenFilters}
                layoutMode={layoutMode}
                onLayoutModeChange={(mode) => dispatch(setLayoutMode(mode))}
              />
            </div>
          </div>

          {content}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              className="applications-pagination"
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={pagination.onPageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
        <style>{`
          .applications-pagination .ant-pagination-item-active {
            border-color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item-active a {
            color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item:hover,
          .applications-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
          .applications-pagination .ant-pagination-next:hover .ant-pagination-item-link {
            border-color: ${DEFAULT_COLORS.SUCCESS};
            color: ${DEFAULT_COLORS.SUCCESS};
          }
          .applications-pagination .ant-pagination-item:hover a,
          .applications-pagination .ant-pagination-prev:hover .ant-pagination-item-link,
          .applications-pagination .ant-pagination-next:hover .ant-pagination-item-link {
            color: ${DEFAULT_COLORS.SUCCESS};
          }
        `}</style>
      </div>
    );
  },
);

ApplicationsSuccess.displayName = 'ApplicationsSuccess';

export default ApplicationsSuccess;
