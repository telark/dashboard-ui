import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import ApplicationCardHeader from './ApplicationCardHeader';
import { APPLICATION_SECTION_LAYOUT } from '../../../constants/sectionLayout';

interface ApplicationCardProps {
  application: Application;
  onEditApplication: (application: Application) => void;
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
      <div style={{ fontSize: 14, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.1 }}>
          {value}
      </div>
      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, lineHeight: 1.1 }}>{label}</div>
    </div>
  );
}

const ApplicationCard: React.FC<ApplicationCardProps> = memo(
  ({ application, onEditApplication }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const primaryNamespace =
      application.namespaces?.items?.[0]?.name ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(detailsPath)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onKeyDown={(e) => {
          if (!isActivateKey(e)) return;
          e.preventDefault();
          navigate(detailsPath);
        }}
        style={{
          position: 'relative',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          borderRadius: APPLICATION_SECTION_LAYOUT.CARD_RADIUS,
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          padding: 16,
          boxSizing: 'border-box',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: hovered ? '0 10px 24px rgba(15, 23, 42, 0.10)' : '0 2px 10px rgba(15, 23, 42, 0.06)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'box-shadow 140ms ease, transform 140ms ease, border-color 140ms ease',
          borderColor: hovered ? DEFAULT_COLORS.BORDER_LIGHT : DEFAULT_COLORS.BORDER_LIGHT,
        }}
      >
        <ApplicationCardHeader
          application={application}
          primaryNamespace={primaryNamespace}
          onEditApplication={onEditApplication}
        />

        <div style={METRICS_ROW_STYLE}>
          <MetricMini value={application.resourceCount ?? 0} label={APPLICATIONS_UI.CARD.LABELS.RESOURCES} />
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
              application.createdAt ? <TimeAgo date={application.createdAt} /> : APPLICATIONS_UI.FALLBACKS.EMPTY
            }
            label={APPLICATIONS_UI.CARD.LABELS.CREATED_AT}
          />
          <MetricMini
            value={
              application.lastUpdated ? <TimeAgo date={application.lastUpdated} /> : APPLICATIONS_UI.FALLBACKS.EMPTY
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
