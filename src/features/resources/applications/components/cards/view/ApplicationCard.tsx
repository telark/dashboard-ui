import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import FieldLabel from '../../../../../protection-plans/components/shared/FieldLabel';
import ApplicationCardHeader from './ApplicationCardHeader';

interface ApplicationCardProps {
  application: Application;
}

const GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.5fr)',
  columnGap: 24,
  rowGap: 8,
  fontSize: 13,
  paddingTop: 10,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
};

const COLUMN_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
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
  const runtimeSummary = `${application.ports?.length || 0} ports · ${application.images?.length || 0} images · ${
    application.envVarKeys?.length || 0
  } env keys`;

  const namespacePreview = useMemo(() => {
    const items = application.namespaces?.items || [];
    if (items.length === 0) return APPLICATIONS_UI.FALLBACKS.EMPTY;
    return items
      .slice(0, 3)
      .map((n) => n.name)
      .join(', ');
  }, [application.namespaces?.items]);

  const workloadCount = application.metrics?.workloads?.length ?? application.resourceCount ?? 0;

  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 10,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      <ApplicationCardHeader application={application} />
      <div style={GRID_STYLE}>
        <div style={COLUMN_STYLE}>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAME} valueWeight={600}>
            {application.name}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAMESPACE}>{namespacePreview}</FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.STATUS} valueWeight={600}>
            {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.CREATED_AT}>
            {application.createdAt ? <TimeAgo date={application.createdAt} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.WORKLOADS}>{workloadCount}</FieldBlock>
        </div>
        <div style={COLUMN_STYLE}>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAMESPACES}>{application.namespaces?.total ?? 0}</FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.RESOURCES}>{application.resourceCount ?? 0}</FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}>
            {application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED}>
            {application.lastUpdated ? <TimeAgo date={application.lastUpdated} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
          </FieldBlock>
          <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.RUNTIME}>
            <span style={{ fontSize: 13 }}>{runtimeSummary}</span>
          </FieldBlock>
          {application.crStatus ? (
            <FieldBlock label={APPLICATIONS_UI.CARD.LABELS.CR_STATUS}>{application.crStatus}</FieldBlock>
          ) : null}
        </div>
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
