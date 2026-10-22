import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS, EMPTY_VALUE, MOTION, SPACING } from '../../../../constants';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_WORKLOAD_METRICS } from '../../constants/sectionLayout';

const M = APPLICATION_WORKLOAD_METRICS;
const WM = APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS;
const FULL_PERCENT = 100;

export interface WorkloadUsageMeterProps {
  label: string;
  /** Parsed values; null means the raw quantity could not be understood. */
  used: number | null;
  request: number | null;
  limit: number | null;
  format: (value: number) => string;
  /** Usage and scale in one unit ("29.7 MiB / 32 MiB"). */
  formatPair: (used: number, scale: number) => string;
  /** Raw strings, shown when parsing failed so nothing is silently dropped. */
  rawUsed: string;
}

// Only a limit can be hit, so usage against a request alone stays neutral.
const usageColor = (ratio: number, hasLimit: boolean): string | null => {
  if (!hasLimit || ratio < M.WARN_RATIO) return null;
  return ratio > M.DANGER_RATIO ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.WARNING;
};

const RequestMarker: React.FC<{ percent: number; request: string }> = ({ percent, request }) => (
  <Tooltip title={WM.REQUEST_MARKER(request)}>
    <span
      tabIndex={0}
      aria-label={WM.REQUEST_MARKER(request)}
      style={{
        position: 'absolute',
        top: -4,
        bottom: -4,
        left: `calc(${percent}% - ${M.REQUEST_MARKER_HIT_PX / 2}px)`,
        width: M.REQUEST_MARKER_HIT_PX,
        display: 'flex',
        justifyContent: 'center',
        cursor: 'help',
      }}
    >
      <span
        style={{
          width: M.REQUEST_MARKER_WIDTH_PX,
          height: '100%',
          background: DEFAULT_COLORS.TEXT_SECONDARY,
        }}
      />
    </span>
  </Tooltip>
);

const WorkloadUsageMeter: React.FC<WorkloadUsageMeterProps> = memo(
  ({ label, used, request, limit, format, formatPair, rawUsed }) => {
    const scale = limit ?? request;
    const hasMeter = used != null && scale != null && scale > 0;
    const ratio = hasMeter ? used / scale : 0;
    const color = usageColor(ratio, limit != null);
    const requestPercent =
      limit != null && request != null && request < limit ? (request / limit) * FULL_PERCENT : null;
    const shareTooltip =
      limit != null
        ? WM.OF_LIMIT_TOOLTIP(format(limit))
        : WM.OF_REQUEST_TOOLTIP(format(scale ?? 0));

    const labelEl = (
      <span
        style={{
          width: M.METER_LABEL_WIDTH_PX,
          flexShrink: 0,
          fontSize: M.LABEL_FONT_SIZE_PX,
          color: DEFAULT_COLORS.TEXT_MUTED,
        }}
      >
        {label}
      </span>
    );

    // Too narrow for the value beside the bar, it wraps under the bar's end instead of overflowing.
    return hasMeter ? (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: M.METER_GAP_PX,
          rowGap: SPACING.XXS,
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        <div
          // A grid, not flex: the row's fit-content reads its tracks, where it ignores a flex-basis.
          style={{
            display: 'grid',
            gridTemplateColumns: `${M.METER_LABEL_WIDTH_PX}px minmax(${M.METER_MIN_WIDTH_PX}px, ${M.METER_MAX_WIDTH_PX}px)`,
            alignItems: 'center',
            columnGap: M.METER_GAP_PX,
          }}
        >
          {labelEl}
          <div
            style={{
              position: 'relative',
              height: M.METER_HEIGHT_PX,
              borderRadius: M.METER_RADIUS_PX,
              background: DEFAULT_COLORS.SURFACE_ELEVATED_HOVER,
            }}
          >
            <div
              style={{
                width: `${Math.min(ratio * FULL_PERCENT, FULL_PERCENT)}%`,
                height: '100%',
                borderRadius: M.METER_RADIUS_PX,
                background: color ?? DEFAULT_COLORS.NEUTRAL,
                transition: `width ${MOTION.BASE_MS}ms ${MOTION.EASE}`,
              }}
            />
            {requestPercent != null && request != null ? (
              <RequestMarker percent={requestPercent} request={format(request)} />
            ) : null}
          </div>
        </div>
        <Tooltip title={shareTooltip}>
          <span
            tabIndex={0}
            style={{
              flexShrink: 0,
              marginLeft: 'auto',
              fontSize: M.METER_VALUE_FONT_SIZE_PX,
              color: DEFAULT_COLORS.TEXT_SECONDARY,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPair(used, scale)} {WM.MID_DOT} {Math.round(ratio * FULL_PERCENT)}%
          </span>
        </Tooltip>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: M.METER_GAP_PX, minWidth: 0 }}>
        {labelEl}
        <span
          style={{
            fontSize: M.METER_VALUE_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
            whiteSpace: 'nowrap',
          }}
        >
          {rawUsed || EMPTY_VALUE} {WM.MID_DOT} {WM.NO_BASELINE}
        </span>
      </div>
    );
  },
);

WorkloadUsageMeter.displayName = 'WorkloadUsageMeter';

export default WorkloadUsageMeter;
