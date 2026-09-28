import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { SHARED_PAGE_CONSTANTS } from '../../../../constants/shared/pages';

interface ApplicationSectionEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description: string;
}

const ApplicationSectionEmptyState: React.FC<ApplicationSectionEmptyStateProps> = memo(
  ({ icon, title, description }) => (
    <div
      style={{
        ...SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER,
        minHeight: 96,
        padding: '14px 12px',
      }}
    >
      {icon ? <div style={SHARED_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON}>{icon}</div> : null}
      {title ? (
        <h4
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 15,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {title}
        </h4>
      ) : null}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: DEFAULT_COLORS.TEXT_MUTED,
          maxWidth: SHARED_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  ),
);

ApplicationSectionEmptyState.displayName = 'ApplicationSectionEmptyState';

export default ApplicationSectionEmptyState;
