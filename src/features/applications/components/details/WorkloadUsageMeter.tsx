import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS, EMPTY_VALUE } from '../../../../constants';
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
  /** Raw strings, shown when parsing failed so nothing is silently dropped. */
  rawUsed: string;
}

const meterColor = (used: number, limit: number | null): string => {
  if (limit == null || limit <= 0) return DEFAULT_COLORS.SUCCESS;
  const ratio = used / limit;
  if (ratio >= 1) return DEFAULT_COLORS.DANGER;
  if (ratio >= M.WARN_RATIO) return DEFAULT_COLORS.WARNING;
  return DEFAULT_COLORS.SUCCESS;
};

/**
 * Meter scale: the track runs to the limit when there is one, otherwise to the
 * request. Usage beyond the scale is clamped, and the fill color flags it.
 */
const WorkloadUsageMeter: React.FC<WorkloadUsageMeterProps> = memo(
  ({ label, used, request, limit, format, rawUsed }) => {
    const scale = limit ?? request;
    const hasMeter = used != null && scale != null && scale > 0;
    const fillPercent = hasMeter ? Math.min((used / scale) * FULL_PERCENT, FULL_PERCENT) : 0;
    const limitPercent = limit != null && scale === limit ? FULL_PERCENT : null;
    const baselineLabel = limit != null ? WM.OF_LIMIT : WM.OF_REQUEST;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: M.METER_GAP_PX, minWidth: 0 }}>
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

        <div
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: M.METER_HEIGHT_PX,
            borderRadius: M.METER_RADIUS_PX,
            background: DEFAULT_COLORS.SURFACE_ELEVATED_HOVER,
            overflow: 'hidden',
          }}
        >
          {hasMeter ? (
            <div
              style={{
                width: `${fillPercent}%`,
                height: '100%',
                borderRadius: M.METER_RADIUS_PX,
                background: meterColor(used, limit),
                transition: 'width 200ms ease',
              }}
            />
          ) : null}
          {limitPercent != null ? (
            <Tooltip title={WM.LIMIT_TICK_TOOLTIP}>
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: M.LIMIT_TICK_WIDTH_PX,
                  background: DEFAULT_COLORS.BORDER_HOVER,
                }}
              />
            </Tooltip>
          ) : null}
        </div>

        <span
          style={{
            flexShrink: 0,
            fontSize: M.METER_VALUE_FONT_SIZE_PX,
            color: DEFAULT_COLORS.TEXT_MUTED,
            whiteSpace: 'nowrap',
          }}
        >
          {hasMeter
            ? `${format(used)} / ${format(scale)} ${baselineLabel}`
            : `${rawUsed || EMPTY_VALUE} ${WM.NO_BASELINE}`}
        </span>
      </div>
    );
  },
);

WorkloadUsageMeter.displayName = 'WorkloadUsageMeter';

export default WorkloadUsageMeter;
