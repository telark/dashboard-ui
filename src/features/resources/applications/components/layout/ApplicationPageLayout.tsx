import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../../../constants/shared/pages';

export interface ApplicationBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

const BREADCRUMB_LINK_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  fontSize: 28,
  fontWeight: 700,
  fontFamily: 'inherit',
  textDecoration: 'none',
};

interface ApplicationPageLayoutProps {
  breadcrumbItems: ApplicationBreadcrumbItem[];
  subtitle: string;
  children: React.ReactNode;
}

const ApplicationPageLayout: React.FC<ApplicationPageLayoutProps> = memo(
  ({ breadcrumbItems, subtitle, children }) => {
    const titleContent = (
      <>
        {breadcrumbItems.map((b, index) => (
          <React.Fragment key={`${b.label}-${index}`}>
            {index > 0 && <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}> / </span>}
            {b.onClick ? (
              <button type="button" onClick={b.onClick} style={BREADCRUMB_LINK_STYLE}>
                {b.label}
              </button>
            ) : (
              <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              {titleContent}
            </h1>
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                margin: 0,
                marginTop: 0,
                padding: 0,
                lineHeight: 1.2,
              }}
            >
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    );
  },
);

ApplicationPageLayout.displayName = 'ApplicationPageLayout';

export default ApplicationPageLayout;
