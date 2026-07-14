import React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { APPLICATIONS_UI } from '../../constants';
import KeyValueGrid from '../../components/details/KeyValueGrid';
import type { ApplicationWorkloadUsage } from '../../models';

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

const WORKLOAD_METRICS_BASELINE_LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontWeight: 600,
};

export function WorkloadBaselineRows(props: { w: ApplicationWorkloadUsage }): React.ReactElement {
  const { w } = props;
  const WM = APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS;
  const cpuReq = w.baseline?.requests?.cpu ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
  const memReq = w.baseline?.requests?.memory ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
  const cpuLim = w.baseline?.limits?.cpu ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
  const memLim = w.baseline?.limits?.memory ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
  const resourcePair = (cpu: string, mem: string): React.ReactElement => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: 12,
        rowGap: 4,
      }}
    >
      <span>
        <span style={{ fontSize: 13, fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          {cpu}
        </span>{' '}
        <span style={WORKLOAD_METRICS_BASELINE_LABEL_STYLE}>{WM.RESOURCE_CPU_LABEL}</span>
      </span>
      <span>
        <span style={{ fontSize: 13, fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          {mem}
        </span>{' '}
        <span style={WORKLOAD_METRICS_BASELINE_LABEL_STYLE}>{WM.RESOURCE_MEMORY_LABEL}</span>
      </span>
    </div>
  );
  return (
    <KeyValueGrid
      compact
      rows={[
        {
          k: 'replicas',
          label: WM.REPLICAS,
          value: (
            <span style={{ fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {String(w.baseline?.replicas ?? 0)}
            </span>
          ),
        },
        { k: 'requests', label: WM.REQUESTS, value: resourcePair(cpuReq, memReq) },
        { k: 'limits', label: WM.LIMITS, value: resourcePair(cpuLim, memLim) },
      ]}
    />
  );
}

export function getChangeLogDotColor(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes('critical')) return DEFAULT_COLORS.DANGER;
  if (s.includes('high')) return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  return DEFAULT_COLORS.TEXT_MUTED;
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

export function StatMiniCard(props: { label: string; value: React.ReactNode }): React.ReactElement {
  const { label, value } = props;
  return (
    <div
      style={{
        minWidth: APPLICATION_SECTION_LAYOUT.STAT_MIN_WIDTH_PX,
        flex: '1 1 120px',
        border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
        borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
        padding: 10,
        background: DEFAULT_COLORS.SURFACE_ELEVATED,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: DEFAULT_COLORS.TEXT_MUTED,
          fontWeight: 600,
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </div>
    </div>
  );
}
