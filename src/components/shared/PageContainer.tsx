import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_COLORS,
  HEADER_LAYOUT,
  TRUNCATE_STYLE,
  UNSTYLED_BUTTON,
  FONT_WEIGHT,
  SPACING,
} from '../../constants';
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
  margin: SPACING.NONE,
  padding: SPACING.NONE,
  lineHeight: PAGE_HEADER.LINE_HEIGHT,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: PAGE_HEADER.TITLE_GAP_PX,
};

const breadcrumbLinkStyle: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: PAGE_HEADER.TITLE_FONT_SIZE_PX,
  fontWeight: PAGE_HEADER.TITLE_FONT_WEIGHT,
  fontFamily: 'inherit',
  textDecoration: 'none',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: PAGE_HEADER.SUBTITLE_FONT_SIZE_PX,
  fontWeight: FONT_WEIGHT.REGULAR,
  color: DEFAULT_COLORS.TEXT_MUTED,
  margin: SPACING.NONE,
  padding: SPACING.NONE,
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
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
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
        minHeight: HEADER_LAYOUT.MIN_HEIGHT,
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
