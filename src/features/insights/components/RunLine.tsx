import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import RowTag from '../../../components/display/table/RowTag';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { INSIGHTS_UI as T } from '../constants/texts';
import { insightErrorMessage, RUN_STATUS_LABELS, RUN_TRIGGER_LABELS } from '../constants/insights';
import type { CountLabel } from '../../../interfaces/layout/toolbar';
import type { LastRun } from '../models';

const counted = (label: CountLabel, count: number): string =>
  (count === 1 ? label.one : label.other).replace('{count}', String(count));

const DARK = {
  muted: DEFAULT_COLORS.TEXT_MUTED,
};
const LIGHT = {
  muted: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};

// A document written only by setup reviews has no run yet. `light` is for the panel surface.
const RunLine: React.FC<{ run: LastRun | null; light?: boolean }> = ({ run, light = false }) => {
  const palette = light ? LIGHT : DARK;
  const mutedStyle: React.CSSProperties = { fontSize: 12, color: palette.muted };
  if (!run) return <div style={mutedStyle}>{T.NOT_ANALYZED_YET}</div>;
  if (run.status === 'queued') return <div style={mutedStyle}>{T.QUEUED}</div>;
  if (run.status === 'running') {
    return (
      <div style={{ ...mutedStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
        <LoadingOutlined spin style={{ color: DEFAULT_COLORS.SUCCESS }} />
        {T.ANALYZING.replace('{trigger}', RUN_TRIGGER_LABELS[run.trigger])}
      </div>
    );
  }
  return (
    <div style={{ ...mutedStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <RowTag text={RUN_TRIGGER_LABELS[run.trigger]} />
      <span>
        {(run.status === 'done' && run.steps === 0 ? T.RUN_LINE_RULES_ONLY : T.RUN_LINE)
          .replace('{status}', RUN_STATUS_LABELS[run.status])
          .replace('{model}', run.model || T.EMPTY_VALUE)
          .replace('{steps}', counted(T.RUN_STEPS, run.steps))
          .replace('{toolCalls}', counted(T.RUN_TOOL_CALLS, run.toolCalls))
          .replace('{reads}', counted(T.RUN_READS, run.toolCalls))}
      </span>
      {run.finishedAt ? <TimeAgo date={run.finishedAt} /> : null}
      {run.status === 'failed' ? (
        <span style={{ color: DEFAULT_COLORS.DANGER }}>{insightErrorMessage(run.error)}</span>
      ) : null}
    </div>
  );
};

// TimeAgo reads "5 minutes ago"; the gap stands in for the space a flex row drops.
export const SetupReviewLine: React.FC<{ at?: string; style?: React.CSSProperties }> = ({
  at,
  style,
}) => (
  <span style={{ ...style, display: 'inline-flex', gap: 4 }}>
    {at ? (
      <>
        {T.SETUP_REVIEWED}
        <TimeAgo date={at} />
      </>
    ) : (
      T.NOT_REVIEWED_YET
    )}
  </span>
);

export default RunLine;
