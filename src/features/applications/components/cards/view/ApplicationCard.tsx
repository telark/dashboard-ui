import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import {
  APP_ROUTES,
  CARD_FOOTER_STYLE,
  CARD_STATS_GRID_STYLE,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  LIST_TOOLBAR,
  MENU_LABELS,
  TRUNCATE_STYLE,
  getCardShellStyle,
} from '../../../../../constants';
import type {
  Application,
  ApplicationCoverage,
  ApplicationCoverageState,
  ApplicationProtection,
} from '../../../models';
import { APPLICATION_CARD, APPLICATION_COVERAGE_STATES, APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { CardChipSection, StatCell } from '../../../../../components/display/card';
import { NO_PERMISSION_CONSTANTS } from '../../../../../components/shared';
import type { CardChipItem } from '../../../../../interfaces/layout/card';
import { getApplicationProtection } from '../../../utils/coverage';
import { PROTECTION_ICONS } from '../../protection/ProtectionBadge';
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

// The state is in the chip's text, so every chip is neutral: color stays with the badge and health.
const coverageChip = (name: string, state: ApplicationCoverageState): CardChipItem => ({
  key: name,
  label: APPLICATION_CARD.COVERAGE.CHIP(name, state),
  icon: PROTECTION_ICONS[state],
  accent: DEFAULT_COLORS.NEUTRAL,
});

const NO_ACCESS_CHIP: CardChipItem = {
  key: APPLICATION_CARD.COVERAGE.NO_ACCESS,
  label: APPLICATION_CARD.COVERAGE.NO_ACCESS,
  icon: <LockOutlined />,
  accent: DEFAULT_COLORS.TEXT_MUTED,
  title: NO_PERMISSION_CONSTANTS.LABELS.DESCRIPTION(MENU_LABELS.PROTECTION_PLANS),
};

// The header badge: null while the plans load, none at all when the viewer can't read them.
const headerProtection = (
  coverage?: ApplicationCoverage,
): ApplicationProtection | null | undefined => {
  if (!coverage || coverage.noAccess) return undefined;
  return coverage.known ? getApplicationProtection(coverage) : null;
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
        }}
      >
        <div style={{ flex: 1 }}>
          <ApplicationCardHeader
            application={application}
            onEditApplication={onEditApplication}
            bulkMode={bulkMode}
            selected={selected}
            onToggleSelect={onToggleSelect}
            protection={headerProtection(coverage)}
          />

          <div style={CARD_STATS_GRID_STYLE}>
            <StatCell
              label={APPLICATIONS_UI.CARD.LABELS.RESOURCES}
              value={application.resourceCount ?? 0}
            />
            <StatCell
              label={APPLICATION_CARD.STATS.INCIDENTS}
              value={application.metrics?.derived?.totalIncidents ?? 0}
            />
            <StatCell
              label={APPLICATION_CARD.STATS.RECOVERIES}
              value={application.metrics?.derived?.totalRecoveries ?? 0}
            />
            <StatCell
              label={APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}
              value={application.managed?.by || EMPTY_VALUE}
            />
          </div>

          {coverage && (
            <CardChipSection
              label={APPLICATION_CARD.COVERAGE.LABEL}
              emptyText={
                coverage.known ? (
                  <>
                    {APPLICATION_CARD.COVERAGE.NONE} <ProtectButton application={application} />
                  </>
                ) : (
                  EMPTY_VALUE
                )
              }
              items={
                coverage.noAccess
                  ? [NO_ACCESS_CHIP]
                  : APPLICATION_COVERAGE_STATES.flatMap((state) =>
                      coverage[state].map((name) => coverageChip(name, state)),
                    )
              }
            />
          )}
        </div>

        <div style={CARD_FOOTER_STYLE}>
          <span style={TRUNCATE_STYLE}>
            {APPLICATION_CARD.CREATED_PREFIX}{' '}
            {createdAt ? <TimeAgo date={createdAt} /> : EMPTY_VALUE}
          </span>
          <span style={TRUNCATE_STYLE}>
            {APPLICATION_CARD.UPDATED_PREFIX}{' '}
            {lastUpdated ? <TimeAgo date={lastUpdated} /> : EMPTY_VALUE}
          </span>
        </div>
      </div>
    );
  },
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
