import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import { CONNECTIVITY_CONSTANTS } from '../../../../../../constants/pages/connectivity';
import FieldLabel from '../../../../../protection-plans/components/shared/FieldLabel';
import RowTag from '../../../../../../components/display/table/RowTag';

interface ApplicationCardProps {
  application: Application;
}

const GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.5fr)',
  columnGap: 24,
  rowGap: 12,
  fontSize: 13,
  paddingTop: 10,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
};

const COLUMN_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minWidth: 0,
};

function FieldBlock(props: {
  label: string;
  children: React.ReactNode;
  valueWeight?: number;
}): React.ReactElement {
  const { label, children, valueWeight = 400 } = props;
  return (
    <div style={{ minWidth: 0 }}>
      <FieldLabel>{label}</FieldLabel>
      <div
        style={{
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          fontWeight: valueWeight,
          lineHeight: 1.35,
          marginTop: 2,
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const ApplicationCard: React.FC<ApplicationCardProps> = memo(({ application }) => {
  const navigate = useNavigate();

  const healthBackground = useMemo(() => {
    const status = (application.health?.status || '').toLowerCase();
    if (status === 'healthy') return DEFAULT_COLORS.SUCCESS;
    if (status === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
    if (status === 'down') return DEFAULT_COLORS.DANGER;
    return DEFAULT_COLORS.TEXT_MUTED;
  }, [application.health?.status]);

  const runtimeSummary = `${application.ports?.length || 0} ports · ${application.images?.length || 0} images · ${
    application.envVarKeys?.length || 0
  } env keys`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name));
        }
      }}
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 10,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 12,
        cursor: 'pointer',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: application.insights?.category || application.insights?.role || application.managed?.chart ? 12 : 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
            }}
          >
            {application.displayName || application.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.2,
              fontFamily: "'Roboto Condensed', sans-serif",
              wordBreak: 'break-word',
            }}
          >
            {application.name}
          </p>
          {application.insights?.category || application.insights?.role || application.managed?.chart ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {application.insights?.category ? (
                <RowTag
                  text={application.insights.category}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                />
              ) : null}
              {application.insights?.role ? (
                <RowTag
                  text={application.insights.role}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                />
              ) : null}
              {application.managed?.chart ? (
                <RowTag
                  text={`${application.managed.chart}${
                    application.managed.version ? `@${application.managed.version}` : ''
                  }`}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <span
          style={{
            flexShrink: 0,
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: healthBackground,
            color: '#ffffff',
          }}
        >
          {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
        </span>
      </div>

      <div style={GRID_STYLE}>
        <div style={COLUMN_STYLE}>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.HEALTH} valueWeight={600}>
            {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAMESPACES}>{application.namespaces?.total ?? 0}</FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.RESOURCES}>{application.resourceCount ?? 0}</FieldBlock>
        </div>
        <div style={COLUMN_STYLE}>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}>
            {application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED}>
            {application.lastUpdated ? <TimeAgo date={application.lastUpdated} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.CREATED_AT}>
            {application.createdAt ? <TimeAgo date={application.createdAt} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          {application.crStatus ? (
            <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.CR_STATUS}>{application.crStatus}</FieldBlock>
          ) : null}
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.RUNTIME}>
            <span style={{ fontSize: 13 }}>{runtimeSummary}</span>
          </FieldBlock>
        </div>
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
