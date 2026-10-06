import React from 'react';
import { DEFAULT_COLORS, SECTION_LAYOUT } from '../../../../constants';
import { APPLICATION_CHANGE_CLASS } from '../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';

export const APPLICATION_SUMMARY_SUBHEADING_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontWeight: 700,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

export const APPLICATION_SUMMARY_COLUMN_TITLE_STYLE: React.CSSProperties = {
  fontSize: APPLICATION_SECTION_LAYOUT.COLUMN_HEADER_FONT_SIZE,
  fontWeight: 700,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  marginBottom: 8,
};

export function getChangeLogDotColor(changeClass: string): string {
  if (changeClass.toLowerCase() === APPLICATION_CHANGE_CLASS.ROLLBACK) {
    return DEFAULT_COLORS.DANGER;
  }
  return DEFAULT_COLORS.SUCCESS;
}

export function ColumnShell(props: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  const { title, children } = props;
  return (
    <div style={{ minWidth: 0 }}>
      <div style={APPLICATION_SUMMARY_COLUMN_TITLE_STYLE}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

export function StatMiniCard(props: {
  label: string;
  value: React.ReactNode;
  /** Left accent stripe for metrics that carry a state (e.g. incidents, recoveries). */
  accent?: string;
}): React.ReactElement {
  const { label, value, accent } = props;
  return (
    <div
      style={{
        minWidth: APPLICATION_SECTION_LAYOUT.STAT_MIN_WIDTH_PX,
        flex: '1 1 108px',
        border: SECTION_LAYOUT.SUBTLE_DIVIDER,
        borderLeft: accent ? `3px solid ${accent}` : SECTION_LAYOUT.SUBTLE_DIVIDER,
        borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
        padding: '6px 10px',
        background: DEFAULT_COLORS.SURFACE_ELEVATED,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.15,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: DEFAULT_COLORS.TEXT_MUTED,
          fontWeight: 600,
          marginTop: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </div>
    </div>
  );
}
