import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Select, Tooltip } from 'antd';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  APP_CONFIGS,
  CONTROL_HEIGHT,
  DEFAULT_COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  HEADER_LAYOUT,
  LIST_TOOLBAR,
  MOTION,
  SIDEBAR_LAYOUT,
  SPACING,
  TIME_FORMATS,
} from '../../../../../constants';
import { LIST_PAGE } from '../../../../../constants/shared/pages';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import PlanHealthStatus from '../../components/shared/PlanHealthStatus';
import HealthSection from '../../components/details/HealthSection';
import PlanSummarySection from '../../components/details/PlanSummarySection';
import ViolationsSection, { resultLabel } from '../../components/details/ViolationsSection';
import { emptyCopy, windowNote } from '../../components/details/violationsCopy';
import { healthRows, isInForce } from '../../components/details/policyHealth';
import ReportsSection from '../../components/details/ReportsSection';
import PlanStatusBand from '../../components/layout/PlanStatusBand';
import ProtectionPlanDetailsToolbar from '../../components/layout/ProtectionPlanDetailsToolbar';
import { usePlanHealth, type UsePlanHealthResult } from '../../hooks/usePlanHealth';
import { usePlanViolations, type UsePlanViolationsResult } from '../../hooks/usePlanViolations';
import { usePlanReports, type UsePlanReportsResult } from '../../hooks/usePlanReports';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { NoPermissionCard } from '../../../../../components/shared';
import type { ViolationsResultFilter } from '../../hooks/usePlanViolations';
import type { AppDispatch, RootState } from '../../../../../store';
import { fetchProtectionPlanTemplatesThunk, selectProtectionPlanTemplates } from '../../store';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanHealth, ProtectionPlan } from '../../models';

const CARD_GAP_PX = LIST_PAGE.DETAILS_SECTIONS_STYLE.gap;

// 10 and 120ms: the refresh button's corner and hover fade sit between the RADIUS and MOTION steps.
const COMPACT_REFRESH_BUTTON_STYLE: React.CSSProperties = {
  color: DEFAULT_COLORS.ICON_SECONDARY,
  flexShrink: 0,
  width: CONTROL_HEIGHT,
  height: CONTROL_HEIGHT,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'transparent',
  transition: `background 120ms ${MOTION.EASE}, color 120ms ${MOTION.EASE}`,
};

// One line: the status gives way first. Only a row too narrow for the phase, mode and actions
// (four or five buttons on a phone) wraps, and then the actions go under, right-aligned.
const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  rowGap: SPACING.S6,
  minHeight: LIST_TOOLBAR.ROW_HEIGHT_PX,
};

// The status spaces its own items, so only this gap stands between the phase and the actions.
const ACTIONS_STYLE: React.CSSProperties = { marginLeft: SPACING.SM };

// The status's place in the row: the row wraps on the status alone, the name only takes room left.
const STATUS_GROUP_STYLE: React.CSSProperties = {
  flex: '1 1 0%',
  display: 'flex',
  alignItems: 'center',
};

// Gives way before the status, so it never grows the row: its 0 min track adds no min-content.
const NAME_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, max-content)',
  flex: '0 100000 auto',
  overflow: 'hidden',
};

const NAME_TEXT_STYLE: React.CSSProperties = {
  paddingRight: SPACING.MD,
  fontSize: FONT_SIZE.MD,
  fontWeight: FONT_WEIGHT.BOLD,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const RefreshButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <Tooltip title={label}>
    <Button
      type="text"
      shape="circle"
      icon={<ReloadOutlined />}
      onClick={onClick}
      style={COMPACT_REFRESH_BUTTON_STYLE}
      aria-label={label}
    />
  </Tooltip>
);

// The capture rule is detail: the card says what reports hold, the icon when they are taken.
const reportsCopy = (plan: ProtectionPlan): { description: string; info: string } => {
  const { SECTIONS } = PPC.LABELS.DETAIL_PAGE;
  return plan.timeMode === 'repeating'
    ? {
        description: SECTIONS.REPORTS_DESCRIPTION_SERIES,
        info: SECTIONS.REPORTS_CAPTURE_INFO_SERIES,
      }
    : { description: SECTIONS.REPORTS_DESCRIPTION, info: SECTIONS.REPORTS_CAPTURE_INFO };
};

// The card top-aligns a title badge: 6 centers the 11px icon on the title's 24px line.
const ReportsInfo: React.FC<{ info: string }> = ({ info }) => (
  <Tooltip title={info}>
    <InfoCircleOutlined
      tabIndex={0}
      aria-label={info}
      style={{ fontSize: FONT_SIZE.XS, color: DEFAULT_COLORS.TEXT_MUTED, marginTop: SPACING.S6 }}
    />
  </Tooltip>
);

interface HealthCardProps {
  plan: ProtectionPlan;
  healthState?: PlanHealth;
  checkedAt?: string;
  health: UsePlanHealthResult;
  cardRef: React.Ref<HTMLDivElement>;
}

// Focusable so the status line's jump leaves keyboard focus here.
const HealthCard: React.FC<HealthCardProps> = ({
  plan,
  healthState,
  checkedAt,
  health,
  cardRef,
}) => (
  <div ref={cardRef} tabIndex={-1}>
    <SettingsCard
      title={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_TITLE}
      description={PPC.LABELS.DETAIL_PAGE.SECTIONS.HEALTH_DESCRIPTION}
      headerAction={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.MD,
            flexWrap: 'wrap',
          }}
        >
          {healthState && <PlanHealthStatus health={healthState} />}
          {checkedAt && (
            <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {PPC.LABELS.HEALTH_DETAIL.CHECKED_AT}{' '}
              <TimeAgo date={checkedAt} short formatString={TIME_FORMATS.DATE_TIME} />
            </span>
          )}
          <RefreshButton label={PPC.LABELS.HEALTH_DETAIL.REFRESH_BUTTON} onClick={health.refresh} />
        </div>
      }
    >
      <HealthSection
        plan={plan}
        status={health.status}
        loading={health.loading}
        error={health.error}
      />
    </SettingsCard>
  </div>
);

const { viewViolations, viewReports } = ACTION_PERMISSIONS.protectionPlans;

// Which decisions the list holds, in the refresh button's box so the two icons pair up.
const WindowInfo: React.FC<{ note: string }> = ({ note }) => (
  <span style={COMPACT_REFRESH_BUTTON_STYLE}>
    <Tooltip title={note}>
      <InfoCircleOutlined tabIndex={0} aria-label={note} />
    </Tooltip>
  </span>
);

interface ViolationsCardProps {
  plan: ProtectionPlan;
  canView: boolean;
  violations: UsePlanViolationsResult;
}

const ViolationsCard: React.FC<ViolationsCardProps> = ({ plan, canView, violations }) => {
  const filterOptions: Array<{ value: ViolationsResultFilter; label: string }> = [
    { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
    ...(['fail', 'pass', 'warn', 'error', 'skip'] as const).map((value) => ({
      value,
      label: resultLabel(value, plan.mode),
    })),
  ];
  return (
    <SettingsCard
      title={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_TITLE}
      description={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_DESCRIPTION}
      headerAction={
        canView ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.SM }}>
            <Select
              value={violations.resultFilter}
              onChange={(v) => violations.setResultFilter(v)}
              options={filterOptions}
              size="small"
              style={{ width: 140 }}
              placeholder={PPC.LABELS.VIOLATIONS.FILTER_PLACEHOLDER}
            />
            <WindowInfo note={windowNote(plan, violations.data)} />
            <RefreshButton label={PPC.LABELS.VIOLATIONS.REFRESH} onClick={violations.refresh} />
          </div>
        ) : undefined
      }
    >
      {canView ? (
        <ViolationsSection
          data={violations.data}
          loading={violations.loading}
          error={violations.error}
          planId={plan.id}
          mode={plan.mode}
          empty={emptyCopy(plan, violations.data)}
        />
      ) : (
        <NoPermissionCard
          featureName={PPC.LABELS.DETAIL_PAGE.SECTIONS.VIOLATIONS_TITLE}
          permission={viewViolations}
          emptyState
        />
      )}
    </SettingsCard>
  );
};

interface ReportsCardProps {
  plan: ProtectionPlan;
  reports: UsePlanReportsResult;
  users: RootState['users']['users'];
  canView: boolean;
  canDownload: boolean;
}

const ReportsCard: React.FC<ReportsCardProps> = ({
  plan,
  reports,
  users,
  canView,
  canDownload,
}) => {
  const reportsText = reportsCopy(plan);
  return (
    <SettingsCard
      title={PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_TITLE}
      titleBadge={<ReportsInfo info={reportsText.info} />}
      description={reportsText.description}
      headerAction={
        canView ? (
          <RefreshButton label={PPC.LABELS.REPORTS.REFRESH} onClick={reports.refresh} />
        ) : undefined
      }
    >
      {canView ? (
        <ReportsSection
          data={reports.reports}
          loading={reports.loading}
          error={reports.error}
          downloading={reports.downloading}
          phase={plan.phase}
          repeating={plan.timeMode === 'repeating'}
          planName={plan.name}
          users={users}
          canDownload={canDownload}
          onDownload={reports.download}
          onDeleted={reports.refresh}
        />
      ) : (
        <NoPermissionCard
          featureName={PPC.LABELS.DETAIL_PAGE.SECTIONS.REPORTS_TITLE}
          permission={viewReports}
          emptyState
        />
      )}
    </SettingsCard>
  );
};

interface ProtectionPlanDetailsContentProps {
  plan: ProtectionPlan;
  duplicating: boolean;
  editing: boolean;
  canceling: boolean;
  reactivating: boolean;
  approving: boolean;
  rejecting: boolean;
  deleting: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

const ProtectionPlanDetailsContent: React.FC<ProtectionPlanDetailsContentProps> = memo(
  ({
    plan,
    duplicating,
    editing,
    canceling,
    reactivating,
    approving,
    rejecting,
    deleting,
    onDuplicate,
    onEdit,
    onCancel,
    onReactivate,
    onApprove,
    onReject,
    onDelete,
  }) => {
    const revision = `${plan.phase}:${plan.lastUpdatedAt ?? ''}`;
    const health = usePlanHealth(plan.id, revision);
    const canViewViolations = usePermission(
      viewViolations.scope,
      viewViolations.level,
      viewViolations.deny,
    );
    const canViewReports = usePermission(viewReports.scope, viewReports.level, viewReports.deny);
    const canDownloadReport = usePermission(
      ACTION_PERMISSIONS.protectionPlans.downloadReport.scope,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.level,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.deny,
    );
    const violations = usePlanViolations(plan.id, canViewViolations);
    const reports = usePlanReports(plan.id, revision, canViewReports);
    const { generate: generateReport } = reports;
    const handleGenerateReport = useCallback(() => {
      void generateReport();
    }, [generateReport]);
    const dispatch: AppDispatch = useDispatch();
    const templates = useSelector(selectProtectionPlanTemplates);
    // Template codes map rendered policy names to operation labels in Health and the decisions.
    useEffect(() => {
      if (templates.length === 0) void dispatch(fetchProtectionPlanTemplatesThunk());
    }, [templates.length, dispatch]);

    const notInForce =
      plan.phase === 'active'
        ? healthRows(plan, health.status).filter((row) => !isInForce(row, plan.mode)).length
        : 0;
    const healthState = health.status?.health ?? plan.health;
    const barRef = useRef<HTMLDivElement>(null);
    const healthRef = useRef<HTMLDivElement>(null);
    // The pane scrolls, not the window, and the bar, stuck at the pane's top, would cover the card.
    const scrollToHealth = useCallback(() => {
      const pane = document.getElementById(APP_CONFIGS.LAYOUT.CONTENT_ID);
      const target = healthRef.current;
      if (!pane || !target) return;
      const stuckBarBottom = pane.getBoundingClientRect().top + (barRef.current?.offsetHeight ?? 0);
      pane.scrollBy({
        top: target.getBoundingClientRect().top - stuckBarBottom - CARD_GAP_PX,
        behavior: globalThis.matchMedia(SIDEBAR_LAYOUT.REDUCED_MOTION_QUERY).matches
          ? 'auto'
          : 'smooth',
      });
      target.focus({ preventScroll: true });
    }, []);
    const users = useSelector((s: RootState) => s.users.users);
    const nameSentinelRef = useRef<HTMLDivElement>(null);
    const [nameVisible, setNameVisible] = useState(false);
    useEffect(() => {
      const sentinel = nameSentinelRef.current;
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        ([entry]) => setNameVisible(!entry.isIntersecting),
        {
          rootMargin: `-${HEADER_LAYOUT.HEIGHT_PX + LIST_PAGE.DETAILS_NAME_REVEAL_OFFSET_PX}px 0px 0px 0px`,
        },
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    }, []);

    return (
      <div>
        <div ref={nameSentinelRef} />
        <div ref={barRef} style={LIST_PAGE.DETAILS_STICKY_ROW_STYLE}>
          <div style={ROW_STYLE}>
            <div style={STATUS_GROUP_STYLE}>
              <AnimatePresence initial={false}>
                {nameVisible ? (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                      duration: LIST_PAGE.DETAILS_NAME_REVEAL_DURATION_S,
                      ease: 'easeOut',
                    }}
                    style={NAME_STYLE}
                  >
                    <span title={plan.name} style={NAME_TEXT_STYLE}>
                      {plan.name}
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <PlanStatusBand
                plan={plan}
                health={healthState}
                notInForce={notInForce}
                onJumpToHealth={scrollToHealth}
              />
            </div>
            <div style={ACTIONS_STYLE}>
              <ProtectionPlanDetailsToolbar
                plan={plan}
                duplicating={duplicating}
                editing={editing}
                canceling={canceling}
                reactivating={reactivating}
                approving={approving}
                rejecting={rejecting}
                deleting={deleting}
                onDuplicate={onDuplicate}
                onEdit={onEdit}
                onCancel={onCancel}
                onReactivate={onReactivate}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                generatingReport={reports.generating}
                onGenerateReport={handleGenerateReport}
              />
            </div>
          </div>
        </div>

        <div style={LIST_PAGE.DETAILS_SECTIONS_STYLE}>
          <PlanSummarySection
            plan={plan}
            health={healthState}
            notInForce={notInForce}
            onJumpToHealth={scrollToHealth}
          />

          {plan.phase === 'active' && (
            <HealthCard
              plan={plan}
              healthState={healthState}
              checkedAt={health.checkedAt ?? plan.healthCheckedAt}
              health={health}
              cardRef={healthRef}
            />
          )}
          <ViolationsCard plan={plan} canView={canViewViolations} violations={violations} />
          <ReportsCard
            plan={plan}
            reports={reports}
            users={users}
            canView={canViewReports}
            canDownload={canDownloadReport}
          />
        </div>
      </div>
    );
  },
);

ProtectionPlanDetailsContent.displayName = 'ProtectionPlanDetailsContent';

export default ProtectionPlanDetailsContent;
