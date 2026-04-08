import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import FieldLabel from '../../../../../protection-plans/components/shared/FieldLabel';
import ApplicationCardHeader from './ApplicationCardHeader';
import { APPLICATION_SECTION_LAYOUT } from '../../../constants/sectionLayout';

interface ApplicationCardProps {
  application: Application;
  onEditApplication: (application: Application) => void;
}

const FIELD_LABEL_WRAP: React.CSSProperties = {
  fontSize: APPLICATION_SECTION_LAYOUT.FIELD_LABEL_FONT_SIZE,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  columnGap: 10,
  rowGap: 6,
  paddingTop: 8,
  borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  marginTop: 8,
};

function isActivateKey(e: React.KeyboardEvent<HTMLDivElement>): boolean {
  return e.key === 'Enter' || e.key === ' ';
}

function CompactFieldBlock(props: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  const { label, children } = props;
  return (
    <div style={{ minWidth: 0 }}>
      <div style={FIELD_LABEL_WRAP}>
        <FieldLabel>{label}</FieldLabel>
      </div>
      <div
        style={{
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          fontWeight: 700,
          fontSize: APPLICATION_SECTION_LAYOUT.FIELD_VALUE_FONT_SIZE,
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

const ApplicationCard: React.FC<ApplicationCardProps> = memo(
  ({ application, onEditApplication }) => {
    const navigate = useNavigate();

    const primaryNamespace =
      application.namespaces?.items?.[0]?.name ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
    const detailsPath = APP_ROUTES.APPLICATION_DETAILS.replace(':name', application.name);

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(detailsPath)}
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
          padding: APPLICATION_SECTION_LAYOUT.CARD_PADDING,
          boxSizing: 'border-box',
          cursor: 'pointer',
        }}
      >
        <ApplicationCardHeader
          application={application}
          primaryNamespace={primaryNamespace}
          onEditApplication={onEditApplication}
        />

        <div style={GRID_STYLE}>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAME}>
            {application.name}
          </CompactFieldBlock>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.RESOURCES}>
            {application.resourceCount ?? 0}
          </CompactFieldBlock>
          {application.crStatus ? (
            <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.CR_STATUS}>
              {application.crStatus}
            </CompactFieldBlock>
          ) : (
            <div style={{ minWidth: 0 }} aria-hidden />
          )}

          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.STATUS}>
            {application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN}
          </CompactFieldBlock>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.MANAGED_BY}>
            {application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
          </CompactFieldBlock>
          <div style={{ minWidth: 0 }} aria-hidden />

          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.CREATED_AT}>
            {application.createdAt ? (
              <TimeAgo date={application.createdAt} />
            ) : (
              APPLICATIONS_UI.FALLBACKS.EMPTY
            )}
          </CompactFieldBlock>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED}>
            {application.lastUpdated ? (
              <TimeAgo date={application.lastUpdated} />
            ) : (
              APPLICATIONS_UI.FALLBACKS.EMPTY
            )}
          </CompactFieldBlock>
          <div style={{ minWidth: 0 }} aria-hidden />
        </div>
      </div>
    );
  },
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
