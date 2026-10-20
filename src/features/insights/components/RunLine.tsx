import React from 'react';
import { DEFAULT_COLORS, EMPTY_VALUE } from '../../../constants';
import { FancySpinner } from '../../../components/animation';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { INSIGHTS_UI as T } from '../constants/texts';
import { insightErrorMessage, RUN_STARTED_BY, RUN_TRIGGER_LABELS } from '../constants/insights';
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

// What follows "Last analysis {time ago}" for a done or failed run.
const finishedRunText = (run: LastRun): string => {
  const startedBy = RUN_STARTED_BY[run.trigger];
  if (run.status === 'failed') return T.RUN_FAILED.replace('{startedBy}', startedBy);
  if (run.steps === 0) return T.RUN_RULES_ONLY;
  return T.RUN_DONE.replace('{startedBy}', startedBy)
    .replace('{model}', run.model || EMPTY_VALUE)
    .replace('{steps}', counted(T.RUN_STEPS, run.steps));
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
        <FancySpinner size={12} />
        {T.ANALYZING.replace('{trigger}', RUN_TRIGGER_LABELS[run.trigger])}
      </div>
    );
  }
  return (
    <div style={{ ...mutedStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <span>
        {T.RUN_LAST_ANALYSIS}
        {run.finishedAt ? (
          <>
            {' '}
            <TimeAgo date={run.finishedAt} />
          </>
        ) : null}
        {finishedRunText(run)}
      </span>
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
