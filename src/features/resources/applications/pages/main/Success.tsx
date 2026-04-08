import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';
import type { Application } from '../../models';
import { useAppearance } from '../../../../settings/sections/appearance';
import { ApplicationCard, ApplicationsHeader, ApplicationsToolbar } from '../../components';

interface ApplicationsSuccessProps {
  applications: Application[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onEditApplication: (application: Application) => void;
  onOpenFilters: () => void;
}

const ApplicationsSuccess: React.FC<ApplicationsSuccessProps> = memo(
  ({ applications, searchValue, onSearchChange, onEditApplication, onOpenFilters }) => {
    const { contentGap } = useAppearance();
    const hasApps = applications.length > 0;

    const content = useMemo(() => {
      if (!hasApps) return null;
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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
    }, [applications, hasApps, onEditApplication]);

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
              />
            </div>
          </div>

          {content}
        </div>
      </div>
    );
  },
);

ApplicationsSuccess.displayName = 'ApplicationsSuccess';

export default ApplicationsSuccess;
