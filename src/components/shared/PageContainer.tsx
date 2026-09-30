import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, TRUNCATE_STYLE } from '../../constants';
import { PAGE_CONTENT_LAYOUT, PAGE_HEADER } from '../../constants/shared/pages';

export interface PageBreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface PageContainerProps {
  title?: string;
  /** Replaces the title with a trail whose last item is the current page. */
  breadcrumbs?: PageBreadcrumbItem[];
  subtitle?: string;
  gap?: number;
  children: React.ReactNode;
}

const headingStyle: React.CSSProperties = {
  fontSize: PAGE_HEADER.TITLE_FONT_SIZE_PX,
  fontWeight: PAGE_HEADER.TITLE_FONT_WEIGHT,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  margin: 0,
  padding: 0,
  lineHeight: PAGE_HEADER.LINE_HEIGHT,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: PAGE_HEADER.TITLE_GAP_PX,
};

const breadcrumbLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  fontSize: PAGE_HEADER.TITLE_FONT_SIZE_PX,
  fontWeight: PAGE_HEADER.TITLE_FONT_WEIGHT,
  fontFamily: 'inherit',
  textDecoration: 'none',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: PAGE_HEADER.SUBTITLE_FONT_SIZE_PX,
  fontWeight: 400,
  color: DEFAULT_COLORS.TEXT_MUTED,
  margin: 0,
  padding: 0,
  lineHeight: PAGE_HEADER.LINE_HEIGHT,
};

const Breadcrumbs: React.FC<{ items: PageBreadcrumbItem[] }> = ({ items }) => {
  const navigate = useNavigate();
  return (
    <>
      {items.map((item, index) => {
        const onClick = item.onClick ?? (item.to ? () => navigate(item.to as string) : undefined);
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>
                {PAGE_HEADER.BREADCRUMB_SEPARATOR}
              </span>
            )}
            {onClick ? (
              <button type="button" onClick={onClick} style={breadcrumbLinkStyle}>
                {item.label}
              </button>
            ) : (
              <span style={TRUNCATE_STYLE} title={item.label}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const PageContainer: React.FC<PageContainerProps> = memo(
  ({ title, breadcrumbs, subtitle, gap = 0, children }) => (
    <div
      style={{
        minHeight: '100vh',
        background: DEFAULT_COLORS.PAGE_BG,
        padding: PAGE_CONTENT_LAYOUT.PADDING,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={headingStyle}>
            {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : title}
          </h1>
          {subtitle ? <p style={subtitleStyle}>{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  ),
);

PageContainer.displayName = 'PageContainer';

export default PageContainer;
