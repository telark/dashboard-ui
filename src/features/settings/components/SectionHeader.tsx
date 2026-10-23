import React, { memo } from 'react';
import { Tag } from 'antd';
import {
  DEFAULT_COLORS,
  getPillColor,
  UNSTYLED_BUTTON,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  SPACING,
} from '../../../constants';

export interface SectionHeaderBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  breadcrumbItems?: SectionHeaderBreadcrumbItem[];
}

const SECTION_HEADER_STYLES = {
  wrapper: {
    marginBottom: SPACING.XXXL,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: SPACING.NONE,
  },
  title: {
    margin: SPACING.NONE,
    padding: SPACING.NONE,
    fontSize: FONT_SIZE.H1,
    fontWeight: FONT_WEIGHT.BOLD,
    color: DEFAULT_COLORS.TEXT_PRIMARY,
    lineHeight: LINE_HEIGHT.TIGHT,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: SPACING.SM,
  },
  description: {
    margin: SPACING.NONE,
    marginTop: SPACING.NONE,
    padding: SPACING.NONE,
    fontSize: FONT_SIZE.BASE,
    fontWeight: FONT_WEIGHT.REGULAR,
    color: DEFAULT_COLORS.TEXT_MUTED,
    lineHeight: LINE_HEIGHT.TIGHT,
  },
  breadcrumbSeparator: { color: DEFAULT_COLORS.TEXT_MUTED },
  breadcrumbButton: {
    ...UNSTYLED_BUTTON,
    color: DEFAULT_COLORS.TEXT_MUTED,
    fontSize: FONT_SIZE.H1,
    fontWeight: FONT_WEIGHT.BOLD,
    fontFamily: 'inherit',
    textDecoration: 'none',
  },
  breadcrumbCurrent: { color: DEFAULT_COLORS.TEXT_PRIMARY },
} as const;

const SectionHeader: React.FC<SectionHeaderProps> = memo(
  ({ title, description, badge, breadcrumbItems }) => {
    const hasBreadcrumb = breadcrumbItems != null && breadcrumbItems.length > 0;

    return (
      <div style={SECTION_HEADER_STYLES.wrapper}>
        <h1
          style={{
            ...SECTION_HEADER_STYLES.title,
            ...(hasBreadcrumb || badge != null ? {} : { display: 'block' }),
          }}
        >
          {hasBreadcrumb && breadcrumbItems
            ? breadcrumbItems.map((b, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span style={SECTION_HEADER_STYLES.breadcrumbSeparator}> / </span>}
                  {b.onClick ? (
                    <button
                      type="button"
                      onClick={b.onClick}
                      style={SECTION_HEADER_STYLES.breadcrumbButton}
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span style={SECTION_HEADER_STYLES.breadcrumbCurrent}>{b.label}</span>
                  )}
                </React.Fragment>
              ))
            : title}
          {badge != null && <Tag color={getPillColor(DEFAULT_COLORS.WARNING)}>{badge}</Tag>}
        </h1>
        {description != null && description.length > 0 && (
          <p style={SECTION_HEADER_STYLES.description}>{description}</p>
        )}
      </div>
    );
  },
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
