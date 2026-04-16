import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../../constants/pages/connectivity';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import ApplicationCardHeader from './ApplicationCardHeader';
import { APPLICATION_SECTION_LAYOUT } from '../../../constants/sectionLayout';

interface ApplicationCardProps {
  application: Application;
  onEditApplication: (application: Application) => void;
  bulkMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (name: string, checked: boolean) => void;
}

const METRICS_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 18,
  paddingTop: 10,
  marginTop: 10,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  flexWrap: 'wrap',
};

function isActivateKey(e: React.KeyboardEvent<HTMLDivElement>): boolean {
  return e.key === 'Enter' || e.key === ' ';
}

function MetricMini(props: { value: React.ReactNode; label: string }): React.ReactElement {
  const { value, label } = props;
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, lineHeight: 1.1 }}>{label}</div>
    </div>
  );
}

const ApplicationCard: React.FC<ApplicationCardProps> = memo(
  ({ application, onEditApplication, bulkMode = false, selected = false, onToggleSelect }) => {
    const navigate = useNavigate();
    const primaryNamespace =
      application.namespaces?.items?.[0]?.name ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);
    const hasDrift = Boolean(application.history?.hasDrift);

    return (
      <div
        role="button"
        tabIndex={0}
        className={bulkMode ? 'applications-bulk-select' : undefined}
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
          position: 'relative',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          borderRadius: APPLICATION_SECTION_LAYOUT.CARD_RADIUS,
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          borderLeft: hasDrift ? `4px solid ${CONNECTIVITY_CONSTANTS.COLORS.WARNING}` : undefined,
          padding: 16,
          boxSizing: 'border-box',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
        }}
      >
        <ApplicationCardHeader
          application={application}
          primaryNamespace={primaryNamespace}
          onEditApplication={onEditApplication}
          bulkMode={bulkMode}
          selected={selected}
          onToggleSelect={onToggleSelect}
        />

        <div style={METRICS_ROW_STYLE}>
          <MetricMini
            value={application.resourceCount ?? 0}
            label={APPLICATIONS_UI.CARD.LABELS.RESOURCES}
          />
          <MetricMini
            value={application.metrics?.derived?.totalIncidents ?? 0}
            label="Total incidents"
          />
          <MetricMini
            value={application.metrics?.derived?.totalRecoveries ?? 0}
            label="Total recoveries"
          />
          <MetricMini
            value={application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
            label={APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}
          />
          <MetricMini
            value={
              application.createdAt ? (
                <TimeAgo date={application.createdAt} />
              ) : (
                APPLICATIONS_UI.FALLBACKS.EMPTY
              )
            }
            label={APPLICATIONS_UI.CARD.LABELS.CREATED_AT}
          />
          <MetricMini
            value={
              application.lastUpdated ? (
                <TimeAgo date={application.lastUpdated} />
              ) : (
                APPLICATIONS_UI.FALLBACKS.EMPTY
              )
            }
            label={APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED}
          />
        </div>
      </div>
    );
  },
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
