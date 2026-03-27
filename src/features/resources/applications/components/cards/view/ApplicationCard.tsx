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

const ApplicationCard: React.FC<ApplicationCardProps> = memo(({ application }) => {
  const navigate = useNavigate();

  const healthColor = useMemo(() => {
    const status = (application.health?.status || '').toLowerCase();
    if (status === 'healthy') return DEFAULT_COLORS.SUCCESS;
    if (status === 'degraded') return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
    if (status === 'down') return DEFAULT_COLORS.ERROR;
    return DEFAULT_COLORS.TEXT_MUTED;
  }, [application.health?.status]);

  const topKinds = useMemo(() => {
    const entries = Object.entries(application.resourceSummary || {}).filter(([, count]) => Number(count) > 0);
    return entries
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 3)
      .map(([kind, count]) => ({ kind, count: Number(count) }));
  }, [application.resourceSummary]);

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
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 12,
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
                text={`${application.managed.chart}${application.managed.version ? `@${application.managed.version}` : ''}`}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
              />
            ) : null}
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: healthColor,
            color: '#ffffff',
          }}
        >
          {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          columnGap: 16,
          rowGap: 10,
          fontSize: 13,
          paddingTop: 8,
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.HEALTH}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 600 }}>
              {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
            </div>
          </div>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.NAMESPACES}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{application.namespaces?.total ?? 0}</div>
          </div>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.RESOURCES}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{application.resourceCount ?? 0}</div>
          </div>
          {topKinds.length ? (
            <div>
              <FieldLabel>Top kinds</FieldLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {topKinds.map((k) => (
                  <RowTag
                    key={k.kind}
                    text={`${k.kind} ${k.count}`}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
            </div>
          </div>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {application.lastUpdated ? (
                <TimeAgo date={application.lastUpdated} />
              ) : (
                APPLICATIONS_UI.FALLBACKS.EMPTY
              )}
            </div>
          </div>
          <div>
            <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.CREATED_AT}</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {application.createdAt ? <TimeAgo date={application.createdAt} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
            </div>
          </div>
          {application.crStatus ? (
            <div>
              <FieldLabel>{APPLICATIONS_UI.CARD.LABELS.CR_STATUS}</FieldLabel>
              <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{application.crStatus}</div>
            </div>
          ) : null}
          <div>
            <FieldLabel>Runtime</FieldLabel>
            <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 12 }}>
              {application.ports?.length || 0} ports · {application.images?.length || 0} images ·{' '}
              {application.envVarKeys?.length || 0} env keys
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;

