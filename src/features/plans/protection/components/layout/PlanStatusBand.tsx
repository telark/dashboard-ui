import React from 'react';
import { Tag, Tooltip } from 'antd';
import { EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  FONT_SIZE,
  SPACING,
  STATUS_COLORS,
  TAG_CLASS,
  TIME_FORMATS,
  TOOLBAR_CONTROL,
  getPillColor,
} from '../../../../../constants';
import { useMediaQuery } from '../../../../../hooks/layout';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import TimeRemaining from '../../../../../components/display/time/TimeRemaining';
import { formatDateTime, getTimeZone } from '../../../../../utils/shared/time';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanHealth, PlanMode, PlanTimeRange, ProtectionPlan } from '../../models';
import { liveWindow, planPhaseLabel } from '../../utils/phaseRules';
import PlanHealthStatus from '../shared/PlanHealthStatus';

const { CARD, PHASE_INFO } = PPC.LABELS;

// Audit only watches, Enforce guards: the same shapes as an application's protection badge.
const MODE_ICONS: Record<PlanMode, React.ReactNode> = {
  audit: <EyeOutlined />,
  enforce: <SafetyCertificateOutlined />,
};

// Grows into the row and wraps inside it, the time first: only a row too narrow for the phase,
// mode and actions sends the actions under. Its full width comes before the sticky name's.
const STATUS_STYLE: React.CSSProperties = {
  flex: '1 1 auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: SPACING.MD,
  rowGap: SPACING.S6,
  fontSize: FONT_SIZE.MD,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
};

const LEAD_STYLE: React.CSSProperties = {
  flex: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.S6,
};

// A time range's declared window, or the one a running series is in or waits for.
const scheduleWindow = (plan: ProtectionPlan): PlanTimeRange | undefined =>
  plan.timeMode === 'time_range' ? plan.timeRange : liveWindow(plan);

// When the plan starts, ends, waits or ended: the phase's one moment that matters now.
const timingText = (plan: ProtectionPlan): React.ReactNode => {
  const schedule = scheduleWindow(plan);
  if (plan.phase === 'scheduled' && schedule) {
    return (
      <>
        <TimeRemaining
          date={schedule.startAt}
          prefix={PHASE_INFO.STARTS_IN_PREFIX}
          endedPrefix={PHASE_INFO.STARTED_PREFIX}
        />
        {CARD.META_SEPARATOR}
        <TimeRemaining date={schedule.endAt} prefix={PHASE_INFO.ENDS_IN_PREFIX} />
      </>
    );
  }
  if (plan.phase === 'pending_approval' && plan.approval) {
    return (
      <>
        {PHASE_INFO.AWAITING_APPROVAL_PREFIX} <TimeAgo date={plan.approval.requestedAt} short />
      </>
    );
  }
  if (plan.phase === 'active' && schedule?.endAt) {
    return (
      <>
        <TimeRemaining date={schedule.endAt} prefix={PHASE_INFO.ENDS_IN_PREFIX} />
        {CARD.META_SEPARATOR}
        {PHASE_INFO.IN_TIME_ZONE(
          formatDateTime(schedule.endAt, TIME_FORMATS.SHORT_DATE_TIME),
          getTimeZone(),
        )}
      </>
    );
  }
  if (plan.phase === 'active' && plan.timeMode === 'permanent') return CARD.PERMANENT_RANGE;
  if (plan.phase === 'terminated' && plan.terminatedAt) {
    return (
      <>
        {PHASE_INFO.TERMINATED_PREFIX} <TimeAgo date={plan.terminatedAt} short />
      </>
    );
  }
  return null;
};

interface PlanStatusBandProps {
  plan: ProtectionPlan;
  health?: PlanHealth;
  notInForce: number;
  onJumpToHealth: () => void;
}

// The status, always on in the sticky row: phase and mode, then the health and the moment.
const PlanStatusBand: React.FC<PlanStatusBandProps> = ({
  plan,
  health,
  notInForce,
  onJumpToHealth,
}) => {
  // Where the toolbar beside it drops its labels, the mode keeps its icon and says it on hover.
  const compact = useMediaQuery(TOOLBAR_CONTROL.COMPACT_QUERY);
  const phaseAccent = STATUS_COLORS.PLAN_PHASE[plan.phase] ?? STATUS_COLORS.PLAN_PHASE.draft;
  const modeLabel = PPC.LABELS.MODE_LABELS[plan.mode];
  const timing = timingText(plan);
  return (
    <span style={STATUS_STYLE}>
      <span style={LEAD_STYLE}>
        <Tag color={getPillColor(phaseAccent)}>{planPhaseLabel(plan)}</Tag>
        <Tooltip title={compact ? modeLabel : undefined}>
          <Tag
            className={`${TAG_CLASS.ICON} ${TAG_CLASS.OUTLINE}`}
            style={{ color: DEFAULT_COLORS.TEXT_SECONDARY }}
            role={compact ? 'img' : undefined}
            aria-label={compact ? modeLabel : undefined}
          >
            {MODE_ICONS[plan.mode]}
            {!compact && <span>{modeLabel}</span>}
          </Tag>
        </Tooltip>
      </span>
      {plan.phase === 'active' && health && (
        <PlanHealthStatus health={health} notInForce={notInForce} onJump={onJumpToHealth} />
      )}
      {timing && <span>{timing}</span>}
    </span>
  );
};

export default PlanStatusBand;
