import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import {
  APP_ROUTES,
  CARD_FOOTER_STYLE,
  CARD_STATS_GRID_STYLE,
  DEFAULT_COLORS,
  EMPTY_VALUE,
  LIST_TOOLBAR,
  MENU_LABELS,
  STATUS_COLORS,
  TRUNCATE_STYLE,
  getCardShellStyle,
} from '../../../../../constants';
import type { Application, ApplicationCoverage, ApplicationCoverageState } from '../../../models';
import { APPLICATION_CARD, APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { CardChipSection, StatCell } from '../../../../../components/display/card';
import { NO_PERMISSION_CONSTANTS } from '../../../../../components/shared';
import type { CardChipItem } from '../../../../../interfaces/layout/card';
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

const COVERAGE_ICON: Record<ApplicationCoverageState, React.ReactNode> = {
  active: <SafetyCertificateOutlined />,
  upcoming: <ClockCircleOutlined />,
};

const coverageChip = (name: string, state: ApplicationCoverageState): CardChipItem => ({
  key: name,
  label: name,
  icon: COVERAGE_ICON[state],
  accent: STATUS_COLORS.APPLICATION_COVERAGE[state],
  title: APPLICATION_CARD.COVERAGE.CHIP_TITLE(name, state),
});

const NO_ACCESS_CHIP: CardChipItem = {
  key: APPLICATION_CARD.COVERAGE.NO_ACCESS,
  label: APPLICATION_CARD.COVERAGE.NO_ACCESS,
  icon: <LockOutlined />,
  accent: DEFAULT_COLORS.TEXT_MUTED,
  title: NO_PERMISSION_CONSTANTS.LABELS.DESCRIPTION(MENU_LABELS.PROTECTION_PLANS),
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
              emptyText={coverage.known ? APPLICATION_CARD.COVERAGE.NONE : EMPTY_VALUE}
              items={
                coverage.noAccess
                  ? [NO_ACCESS_CHIP]
                  : [
                      ...coverage.active.map((name) => coverageChip(name, 'active')),
                      ...coverage.upcoming.map((name) => coverageChip(name, 'upcoming')),
                    ]
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
