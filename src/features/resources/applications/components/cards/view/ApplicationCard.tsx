import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../../constants';
import type { Application } from '../../../models';
import { APPLICATIONS_UI } from '../../../constants';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import FieldLabel from '../../../../../protection-plans/components/shared/FieldLabel';
import ApplicationCardHeader from './ApplicationCardHeader';
import RowTag from '../../../../../../components/display/table/RowTag';
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
  columnGap: 12,
  rowGap: 8,
  paddingTop: 10,
  borderTop: `2px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  marginTop: 10,
};

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
    const namespacePreview = useMemo(() => {
      const items = application.namespaces?.items || [];
      if (items.length === 0) return APPLICATIONS_UI.FALLBACKS.EMPTY;
      return items
        .slice(0, 3)
        .map((n) => n.name)
        .join(', ');
    }, [application.namespaces?.items]);

    const primaryNamespace =
      application.namespaces?.items?.[0]?.name ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
    const workloadCount = application.metrics?.workloads?.length ?? application.resourceCount ?? 0;

    const portCount = application.ports?.length ?? 0;
    const imageCount = application.images?.length ?? 0;
    const envCount = application.envVarKeys?.length ?? 0;

    return (
      <div
        style={{
          position: 'relative',
          background: DEFAULT_COLORS.BACKGROUND_WHITE,
          borderRadius: APPLICATION_SECTION_LAYOUT.CARD_RADIUS,
          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          padding: APPLICATION_SECTION_LAYOUT.CARD_PADDING,
          boxSizing: 'border-box',
        }}
      >
        <ApplicationCardHeader application={application} onEditApplication={onEditApplication} />

        <div style={GRID_STYLE}>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAME}>
            {application.name}
          </CompactFieldBlock>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAMESPACES}>
            {application.namespaces?.total ?? 0}
          </CompactFieldBlock>
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.RUNTIME}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <RowTag
                text={`${portCount} ${APPLICATIONS_UI.CARD.LABELS.RUNTIME_CHIPS.PORTS}`}
                background={DEFAULT_COLORS.CHIP_BLUE_BG}
                color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                fontSize={11}
              />
              <RowTag
                text={`${imageCount} ${APPLICATIONS_UI.CARD.LABELS.RUNTIME_CHIPS.IMAGES}`}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                fontSize={11}
              />
              <RowTag
                text={`${envCount} ${APPLICATIONS_UI.CARD.LABELS.RUNTIME_CHIPS.ENV_KEYS}`}
                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                fontSize={11}
              />
            </div>
          </CompactFieldBlock>

          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.NAMESPACE}>
            {namespacePreview}
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
          <CompactFieldBlock label={APPLICATIONS_UI.CARD.LABELS.WORKLOADS}>
            {workloadCount}
          </CompactFieldBlock>
        </div>

        <div
          style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
            {APPLICATIONS_UI.CARD.LABELS.FOOTER_NAMESPACE}
          </span>
          <RowTag
            text={primaryNamespace}
            background={DEFAULT_COLORS.CHIP_BLUE_BG}
            color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
            fontSize={11}
          />
          <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
            {APPLICATIONS_UI.CARD.LABELS.FOOTER_MANAGED}
            {': '}
            <span style={{ fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
              {application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY}
            </span>
          </span>
        </div>
      </div>
    );
  },
);

ApplicationCard.displayName = 'ApplicationCard';

export default ApplicationCard;
