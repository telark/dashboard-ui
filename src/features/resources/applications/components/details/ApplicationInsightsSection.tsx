import React, { memo } from 'react';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import ApplicationSectionEmptyState from '../display/ApplicationSectionEmptyState';
import KeyValueGrid from './KeyValueGrid';
import { APPLICATIONS_UI } from '../../constants';
import { useApplicationInsights } from '../../hooks/useApplicationInsights';
import type { ApplicationInsights } from '../../models';

const INSIGHTS = APPLICATIONS_UI.SECTIONS.INSIGHTS;
const MAX_LIST_ITEMS = 10;

const labelStyle: React.CSSProperties = {
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 8,
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  lineHeight: 1.5,
};

interface Props {
  namespace: string;
  name: string;
}

const ChipRow: React.FC<{ items: string[] }> = ({ items }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {items.map((t) => (
      <RowTag
        key={t}
        text={t}
        background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
        color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
      />
    ))}
  </div>
);

const SEVERITY_COLORS: Record<string, string> = {
  critical: DEFAULT_COLORS.ERROR,
  high: DEFAULT_COLORS.DANGER,
  medium: DEFAULT_COLORS.WARNING,
  low: DEFAULT_COLORS.TEXT_MUTED,
};

const EFFICIENCY_COLORS: Record<string, string> = {
  balanced: DEFAULT_COLORS.SUCCESS,
  over: DEFAULT_COLORS.WARNING,
  under: DEFAULT_COLORS.WARNING,
  unknown: DEFAULT_COLORS.TEXT_MUTED,
};

const severityColor = (value: string): string =>
  SEVERITY_COLORS[value?.toLowerCase()] ?? DEFAULT_COLORS.TEXT_MUTED;

const efficiencyColor = (value: string): string =>
  EFFICIENCY_COLORS[value?.toLowerCase()] ?? DEFAULT_COLORS.TEXT_MUTED;

const BadgedRow: React.FC<{ badge: string; color: string; message: string }> = ({
  badge,
  color,
  message,
}) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
    <RowTag text={badge} background={DEFAULT_COLORS.CHIP_CUSTOM_BG} color={color} />
    <span style={bodyTextStyle}>{message}</span>
  </div>
);

const LabeledBlock: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <div style={labelStyle}>{label}</div>
    {children}
  </div>
);

const EnrichingState: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '28px 16px',
      textAlign: 'center',
    }}
  >
    <LoadingOutlined style={{ fontSize: 22, color: DEFAULT_COLORS.SUCCESS }} spin />
    <div style={{ fontSize: 14, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
      {INSIGHTS.ENRICHING_TITLE}
    </div>
    <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, maxWidth: 320 }}>
      {INSIGHTS.ENRICHING_DESCRIPTION}
    </div>
  </div>
);

const InsightsBody: React.FC<{ insights: ApplicationInsights }> = ({ insights }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {insights.summary ? (
      <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
        {insights.summary}
      </div>
    ) : null}

    <KeyValueGrid
      rows={[
        {
          k: 'confidence',
          label: INSIGHTS.CONFIDENCE,
          value: insights.confidence || APPLICATIONS_UI.FALLBACKS.EMPTY,
        },
        {
          k: 'category',
          label: INSIGHTS.CATEGORY,
          value: insights.category || APPLICATIONS_UI.FALLBACKS.EMPTY,
        },
        {
          k: 'role',
          label: INSIGHTS.ROLE,
          value: insights.role || APPLICATIONS_UI.FALLBACKS.EMPTY,
        },
        {
          k: 'enrichedAt',
          label: INSIGHTS.ENRICHED_AT,
          value: insights.enrichedAt ? (
            <TimeAgo date={insights.enrichedAt} />
          ) : (
            APPLICATIONS_UI.FALLBACKS.EMPTY
          ),
        },
        {
          k: 'promptVersion',
          label: INSIGHTS.PROMPT_VERSION,
          value: insights.promptVersion || APPLICATIONS_UI.FALLBACKS.EMPTY,
        },
      ]}
    />

    {insights.criticality?.level ? (
      <LabeledBlock label={INSIGHTS.CRITICALITY}>
        <BadgedRow
          badge={insights.criticality.level}
          color={severityColor(insights.criticality.level)}
          message={insights.criticality.reason}
        />
      </LabeledBlock>
    ) : null}

    {insights.resourceEfficiency?.status ? (
      <LabeledBlock label={INSIGHTS.RESOURCE_EFFICIENCY}>
        <BadgedRow
          badge={insights.resourceEfficiency.status}
          color={efficiencyColor(insights.resourceEfficiency.status)}
          message={insights.resourceEfficiency.note}
        />
      </LabeledBlock>
    ) : null}

    {insights.techStack?.length ? (
      <LabeledBlock label={INSIGHTS.TECH_STACK}>
        <ChipRow items={insights.techStack} />
      </LabeledBlock>
    ) : null}

    {insights.tags?.length ? (
      <LabeledBlock label={INSIGHTS.TAGS}>
        <ChipRow items={insights.tags} />
      </LabeledBlock>
    ) : null}

    {insights.dependencies?.length ? (
      <LabeledBlock label={INSIGHTS.DEPENDENCIES}>
        <ChipRow items={insights.dependencies} />
      </LabeledBlock>
    ) : null}

    {insights.risks?.length ? (
      <LabeledBlock label={INSIGHTS.RISKS}>
        <div style={{ display: 'grid', rowGap: 6 }}>
          {insights.risks.slice(0, MAX_LIST_ITEMS).map((r) => (
            <BadgedRow
              key={r.message}
              badge={r.severity}
              color={severityColor(r.severity)}
              message={r.message}
            />
          ))}
        </div>
      </LabeledBlock>
    ) : null}

    {insights.suggestions?.length ? (
      <LabeledBlock label={INSIGHTS.SUGGESTIONS}>
        <div style={{ display: 'grid', rowGap: 6 }}>
          {insights.suggestions.slice(0, MAX_LIST_ITEMS).map((s) => (
            <BadgedRow
              key={s.message}
              badge={s.priority}
              color={severityColor(s.priority)}
              message={s.message}
            />
          ))}
        </div>
      </LabeledBlock>
    ) : null}

    {insights.relatedApps?.length ? (
      <LabeledBlock label={INSIGHTS.RELATED_APPS}>
        <div style={{ display: 'grid', rowGap: 8 }}>
          {insights.relatedApps.slice(0, MAX_LIST_ITEMS).map((a) => (
            <div
              key={`${a.name}:${a.reason}`}
              style={{
                border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                {a.name}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  lineHeight: 1.5,
                }}
              >
                {a.reason}
              </div>
            </div>
          ))}
        </div>
      </LabeledBlock>
    ) : null}
  </div>
);

// Insights are fetched here, not read off the application record: they are
// produced out of band and this section polls for them on the configured
// interval, so an app that is still being analyzed shows a live "enriching"
// state and fills in on its own.
const ApplicationInsightsSection: React.FC<Props> = memo(({ namespace, name }) => {
  const { insights, isPending, isLoading } = useApplicationInsights(namespace, name);

  const renderContent = () => {
    if (insights?.enriched) {
      return <InsightsBody insights={insights} />;
    }
    if (isPending || isLoading) {
      return <EnrichingState />;
    }
    return <ApplicationSectionEmptyState description={INSIGHTS.EMPTY_DESCRIPTION} />;
  };

  return (
    <SettingsCard
      collapsible
      title={INSIGHTS.TITLE}
      description={INSIGHTS.DESCRIPTION}
      headerAction={
        <Tooltip title={INSIGHTS.ENRICHMENT_HINT}>
          <InfoCircleOutlined
            style={{ fontSize: 16, color: DEFAULT_COLORS.ICON_SECONDARY, cursor: 'help' }}
          />
        </Tooltip>
      }
    >
      {renderContent()}
    </SettingsCard>
  );
});

ApplicationInsightsSection.displayName = 'ApplicationInsightsSection';

export default ApplicationInsightsSection;
