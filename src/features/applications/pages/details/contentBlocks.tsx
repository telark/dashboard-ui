import React from 'react';
import { DEFAULT_COLORS, STATUS_COLORS, FONT_WEIGHT, SPACING } from '../../../../constants';
import type { ApplicationChangeLogEntry } from '../../models';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';

export const APPLICATION_SUMMARY_COLUMN_TITLE_STYLE: React.CSSProperties = {
  fontSize: APPLICATION_SECTION_LAYOUT.COLUMN_HEADER_FONT_SIZE,
  fontWeight: FONT_WEIGHT.BOLD,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  marginBottom: SPACING.SM,
};

// The flags, not the class: a rollback is a recovery, and a health drop inside
// another change is an incident.
export function getChangeLogDotColor(
  entry: Pick<ApplicationChangeLogEntry, 'isIncident' | 'isRecovery'>,
): string {
  if (entry.isIncident) return STATUS_COLORS.APPLICATION_CHANGE.incident;
  if (entry.isRecovery) return STATUS_COLORS.APPLICATION_CHANGE.recovery;
  return STATUS_COLORS.APPLICATION_CHANGE.other;
}

export function ColumnShell(props: {
  title: string;
  // Shown on the title's line, at the opposite side.
  aside?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const { title, aside, children } = props;
  return (
    <div style={{ minWidth: 0 }}>
      {aside ? (
        <div
          style={{
            ...APPLICATION_SUMMARY_COLUMN_TITLE_STYLE,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            columnGap: SPACING.MD,
          }}
        >
          <span>{title}</span>
          {aside}
        </div>
      ) : (
        <div style={APPLICATION_SUMMARY_COLUMN_TITLE_STYLE}>{title}</div>
      )}
      <div>{children}</div>
    </div>
  );
}
