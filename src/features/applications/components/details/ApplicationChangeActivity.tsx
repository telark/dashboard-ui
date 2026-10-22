import React, { memo } from 'react';
import { DEFAULT_COLORS, TIME_FORMATS } from '../../../../constants';
import { ColumnShell } from '../../pages/details/contentBlocks';
import MutedText from './MutedText';
import { formatDateTime } from '../../../../utils/shared/time';
import KeyValueGrid, { type KeyValueGridRow } from './KeyValueGrid';
import DateAndAge from './DateAndAge';
import LabelWithInfo from './LabelWithInfo';
import { APPLICATIONS_UI, INCIDENT_DOT_STYLE } from '../../constants';
import type { Application, ApplicationMetricsDerived } from '../../models';

const M = APPLICATIONS_UI.SECTIONS.METRICS;

const formatVelocity = (value: number): string => M.PER_DAY(value.toFixed(1));

const titleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

// Drops placeholder "-" keys/values the backend emits for absent buckets, then names each bucket.
function formatBreakdown(values: Record<string, number | string> | undefined | null): string {
  return Object.entries(values || {})
    .filter(([key, value]) => key.trim() !== '-' && String(value).trim() !== '-')
    .map(([key, value]) => `${titleCase(key)} ${value}`)
    .join(M.BREAKDOWN_SEPARATOR);
}

// Label and value rows, like the summary's other columns.
function buildChangeRows(derived: ApplicationMetricsDerived): KeyValueGridRow[] {
  const bySeverity = formatBreakdown(derived.changesBySeverity);
  return [
    { k: 'total', label: M.TOTAL_CHANGES, value: derived.totalChanges },
    { k: 'snapshots', label: M.SNAPSHOT_COUNT, value: derived.snapshotCount },
    {
      k: 'distinct',
      label: <LabelWithInfo label={M.DISTINCT_CHANGES} info={M.DISTINCT_CHANGES_TOOLTIP} />,
      value: derived.uniqueFingerprints,
    },
    {
      k: 'velocity',
      label: <LabelWithInfo label={M.CHANGE_VELOCITY} info={M.CHANGE_VELOCITY_TOOLTIP} />,
      value: formatVelocity(derived.changeVelocityPerDay),
    },
    ...(derived.lastChangeDetectedAt
      ? [
          {
            k: 'last',
            label: M.LAST_CHANGE,
            value: <DateAndAge date={derived.lastChangeDetectedAt} />,
          },
        ]
      : []),
    ...(bySeverity ? [{ k: 'severity', label: M.CHANGES_BY_SEVERITY, value: bySeverity }] : []),
  ];
}

function buildReliabilityRows(derived: ApplicationMetricsDerived): KeyValueGridRow[] {
  const incidents = derived.totalIncidents ?? 0;
  return [
    {
      k: 'incidents',
      label: M.TOTAL_INCIDENTS,
      // The one loud number: an incident is the app going down.
      value:
        incidents > 0 ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
            <span aria-hidden style={INCIDENT_DOT_STYLE} />
            {incidents}
          </span>
        ) : (
          incidents
        ),
    },
    { k: 'recoveries', label: M.TOTAL_RECOVERIES, value: derived.totalRecoveries ?? 0 },
  ];
}

const EMPTY_DERIVED: ApplicationMetricsDerived = {
  totalChanges: 0,
  changesByClass: {},
  changesBySeverity: {},
  totalIncidents: 0,
  totalRecoveries: 0,
  snapshotCount: 0,
  changeVelocityPerDay: 0,
  uniqueFingerprints: 0,
};

// The summary's third column: Change activity, then Reliability under it.
const ApplicationChangeActivity: React.FC<{ application: Application; stacked: boolean }> = memo(
  ({ application, stacked }) => {
    const derived = application.metrics?.derived ?? EMPTY_DERIVED;
    const since = derived.firstChangeDetectedAt
      ? M.SINCE_FIRST_CHANGE(formatDateTime(derived.firstChangeDetectedAt, TIME_FORMATS.SHORT))
      : undefined;

    return (
      <>
        <ColumnShell title={M.TITLE} aside={since ? <MutedText value={since} /> : undefined}>
          <KeyValueGrid compact={!stacked} plainLabels rows={buildChangeRows(derived)} />
        </ColumnShell>
        <ColumnShell title={M.GROUP_RELIABILITY}>
          <KeyValueGrid compact={!stacked} plainLabels rows={buildReliabilityRows(derived)} />
        </ColumnShell>
      </>
    );
  },
);

ApplicationChangeActivity.displayName = 'ApplicationChangeActivity';

export default ApplicationChangeActivity;
