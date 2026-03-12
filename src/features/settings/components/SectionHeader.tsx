import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';

export interface SectionHeaderBreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: SectionHeaderBreadcrumbItem[];
}

const SECTION_HEADER_STYLES = {
  wrapper: {
    marginBottom: 32,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: 0,
  },
  title: {
    margin: 0,
    padding: 0,
    fontSize: 28,
    fontWeight: 700,
    color: DEFAULT_COLORS.TEXT_PRIMARY,
    lineHeight: 1.2,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  description: {
    margin: 0,
    marginTop: 0,
    padding: 0,
    fontSize: 14,
    fontWeight: 400,
    color: DEFAULT_COLORS.TEXT_MUTED,
    lineHeight: 1.2,
  },
  breadcrumbSeparator: { color: '#64748b' },
  breadcrumbButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: '#64748b',
    fontSize: 28,
    fontWeight: 700,
    fontFamily: 'inherit',
    textDecoration: 'none',
  },
  breadcrumbCurrent: { color: DEFAULT_COLORS.TEXT_PRIMARY },
} as const;

const SectionHeader: React.FC<SectionHeaderProps> = memo(
  ({ title, description, breadcrumbItems }) => {
    const hasBreadcrumb = breadcrumbItems != null && breadcrumbItems.length > 0;

    return (
      <div style={SECTION_HEADER_STYLES.wrapper}>
        <h1
          style={{
            ...SECTION_HEADER_STYLES.title,
            ...(hasBreadcrumb ? {} : { display: 'block' }),
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
