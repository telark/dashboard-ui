import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { DeploymentUnitOutlined, LockOutlined } from '@ant-design/icons';
import {
  APP_ROUTES,
  CARD_LAYOUT,
  CARD_TEXTS,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  LIST_TOOLBAR,
  MENU_LABELS,
  TRUNCATE_STYLE,
  getCardShellStyle,
  SPACING,
  FONT_WEIGHT,
} from '../../../../../constants';
import type { Application, ApplicationCoverage, ApplicationProtection } from '../../../models';
import {
  APPLICATION_CARD,
  APPLICATION_COVERAGE_STATES,
  INCIDENT_DOT_STYLE,
  PLAN_LINK_STYLE,
} from '../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { NO_PERMISSION_CONSTANTS } from '../../../../../components/shared';
import { getApplicationProtection } from '../../../utils/coverage';
import ProtectButton from '../../protection/ProtectButton';
import ApplicationCardHeader from './ApplicationCardHeader';

interface ApplicationCardProps {
  application: Application;
  onEditApplication: (application: Application) => void;
  bulkMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (name: string, checked: boolean) => void;
  coverage?: ApplicationCoverage;
}

function isActivateKey(e: React.KeyboardEvent<HTMLDivElement>): boolean {
  return e.key === 'Enter' || e.key === ' ';
}

const { STATS, COVERAGE } = APPLICATION_CARD;

const LINE_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.SM,
  minWidth: 0,
  fontSize: CARD_LAYOUT.VALUE_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

// As tall as the Protect app button, so an unprotected card is no taller than the others.
const PLAN_ROW_STYLE: React.CSSProperties = {
  ...LINE_STYLE,
  minHeight: APPLICATION_CARD.PROTECT_BUTTON_HEIGHT_PX,
};

const META_ROW_STYLE: React.CSSProperties = { ...LINE_STYLE, justifyContent: 'space-between' };

const FOOTER_STYLE: React.CSSProperties = {
  ...TRUNCATE_STYLE,
  fontSize: CARD_LAYOUT.META_FONT_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

// The header badge: null while the plans load, none at all when the viewer can't read them.
const headerProtection = (
  coverage?: ApplicationCoverage,
): ApplicationProtection | null | undefined => {
  if (!coverage || coverage.noAccess) return undefined;
  return coverage.known ? getApplicationProtection(coverage) : null;
};

const MORE_PLANS_STYLE: React.CSSProperties = {
  flexShrink: 0,
  textDecoration: 'underline dotted',
  textUnderlineOffset: 2,
};

// The plans behind the header badge: the strongest one, linked, the rest behind "+N more plans".
// An app no plan covers says so here, with the Protect app button.
const PlanLine: React.FC<{ application: Application; coverage: ApplicationCoverage }> = ({
  application,
  coverage,
}) => {
  if (coverage.noAccess) {
    return (
      <div
        style={PLAN_ROW_STYLE}
        title={NO_PERMISSION_CONSTANTS.LABELS.DESCRIPTION(MENU_LABELS.PROTECTION_PLANS)}
      >
        <LockOutlined aria-hidden />
        <span style={TRUNCATE_STYLE}>{COVERAGE.NO_ACCESS}</span>
      </div>
    );
  }
  // Holds the line's place while the plans load, so the card doesn't grow when they land.
  if (!coverage.known) return <div style={PLAN_ROW_STYLE}>{EMPTY_VALUE}</div>;

  const [first, ...rest] = APPLICATION_COVERAGE_STATES.flatMap((state) =>
    coverage[state].map((name) => ({ name, state })),
  );
  if (!first) {
    return (
      // Wraps on a narrow card, so the sentence stays whole and the button drops under it.
      <div style={{ ...PLAN_ROW_STYLE, flexWrap: 'wrap', rowGap: SPACING.XS }}>
        <span>{COVERAGE.NO_PLAN}</span>
        <ProtectButton application={application} />
      </div>
    );
  }
  const others = rest.map((plan) => COVERAGE.CHIP(plan.name, plan.state)).join(', ');
  const planPath = APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(
    ':name',
    encodeURIComponent(first.name),
  );

  return (
    <div style={PLAN_ROW_STYLE}>
      <span style={{ flexShrink: 0 }}>{COVERAGE.PLAN_LABEL}</span>
      <Link
        to={planPath}
        title={first.name}
        style={PLAN_LINK_STYLE}
        // The card opens its app on click and Enter: the link's own go to the plan.
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {first.name}
      </Link>
      {first.state === 'upcoming' && (
        <span style={{ flexShrink: 0 }}>{COVERAGE.NOT_STARTED_AFTER_NAME}</span>
      )}
      {rest.length > 0 && (
        <Tooltip title={others}>
          <span
            tabIndex={0}
            aria-label={COVERAGE.MORE_PLANS_LABEL(others)}
            style={MORE_PLANS_STYLE}
          >
            {COVERAGE.MORE_PLANS(rest.length)}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

const isKnownManager = (by?: string): by is string =>
  Boolean(by) && by?.toLowerCase() !== APPLICATION_CARD.MANAGED_BY_UNKNOWN;

const MetricsLine: React.FC<{ application: Application }> = ({ application }) => {
  const derived = application.metrics?.derived;
  const incidents = derived?.totalIncidents ?? 0;
  const managedBy = application.managed?.by;
  return (
    <div style={META_ROW_STYLE}>
      <span style={{ minWidth: 0 }}>
        {STATS.COUNT(application.resourceCount ?? 0, STATS.RESOURCES)}
        {STATS.SEPARATOR}
        {incidents > 0 ? (
          <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: FONT_WEIGHT.SEMIBOLD }}>
            <span aria-hidden style={INCIDENT_DOT_STYLE} />
            {STATS.COUNT(incidents, STATS.INCIDENTS)}
          </span>
        ) : (
          STATS.COUNT(incidents, STATS.INCIDENTS)
        )}
        {STATS.SEPARATOR}
        {STATS.COUNT(derived?.totalRecoveries ?? 0, STATS.RECOVERIES)}
      </span>
      {isKnownManager(managedBy) && (
        <span
          title={APPLICATION_CARD.MANAGED_BY_TITLE(managedBy)}
          style={{ ...TRUNCATE_STYLE, flexShrink: 0, display: 'inline-flex', gap: SPACING.XS }}
        >
          <DeploymentUnitOutlined aria-hidden />
          {managedBy}
        </span>
      )}
    </div>
  );
};

const ApplicationCard: React.FC<ApplicationCardProps> = memo(
  ({
    application,
    onEditApplication,
    bulkMode = false,
    selected = false,
    onToggleSelect,
    coverage,
  }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const { createdAt, lastUpdated } = application;
    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);
    const protection = headerProtection(coverage);

    return (
      <div
        role="button"
        tabIndex={0}
        className={bulkMode ? LIST_TOOLBAR.BULK_SELECT_CLASS : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (bulkMode) {
            onToggleSelect?.(application.name, !selected);
            return;
          }
          navigate(detailsPath);
        }}
        onKeyDown={(e) => {
          if (!isActivateKey(e)) return;
          e.preventDefault();
          if (bulkMode) {
            onToggleSelect?.(application.name, !selected);
            return;
          }
          navigate(detailsPath);
        }}
        style={{
          ...getCardShellStyle(hovered),
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: CARD_LAYOUT.BLOCK_GAP_PX,
        }}
      >
        <ApplicationCardHeader
          application={application}
          onEditApplication={onEditApplication}
          bulkMode={bulkMode}
          selected={selected}
          onToggleSelect={onToggleSelect}
          protection={protection}
        />

        {coverage && <PlanLine application={application} coverage={coverage} />}

        {/* Grid rows stretch every card to one height: the auto margin keeps this group at the bottom. */}
        <div
          style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: SPACING.XS }}
        >
          <MetricsLine application={application} />
          <span style={FOOTER_STYLE}>
            {CARD_TEXTS.UPDATED_PREFIX}{' '}
            {lastUpdated ? (
              <TimeAgo
                date={lastUpdated}
                short
                exactRows={[
                  { label: CARD_TEXTS.UPDATED_PREFIX, date: lastUpdated },
                  ...(createdAt ? [{ label: CARD_TEXTS.CREATED_PREFIX, date: createdAt }] : []),
                ]}
              />
            ) : (
              EMPTY_VALUE
            )}
          </span>
        </div>
      </div>
    );
  },
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
