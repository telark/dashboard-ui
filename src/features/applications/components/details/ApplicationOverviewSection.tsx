import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS, getPillSurface } from '../../../../constants';
import SettingsCard from '../../../settings/components/SettingsCard';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
import KeyValueGrid from './KeyValueGrid';
import MutedText from './MutedText';
import { APPLICATIONS_UI, APPLICATION_CONDITION_TYPES } from '../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import {
  APPLICATION_SUMMARY_COLUMN_TITLE_STYLE,
  APPLICATION_SUMMARY_SUBHEADING_STYLE,
  ColumnShell,
} from '../../pages/details/contentBlocks';
import type { Application } from '../../models';

const MAX_IMAGES = 8;

const chipStyle: React.CSSProperties = {
  display: 'inline-block',
  maxWidth: '100%',
  ...getPillSurface(),
  color: DEFAULT_COLORS.PILL_TEXT,
  padding: '2px 10px',
  borderRadius: 999,
  fontWeight: 700,
  fontSize: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.fontSize,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  boxSizing: 'border-box',
};

function buildPrimaryRows(application: Application) {
  const created = application.createdAt ? (
    <TimeAgo date={application.createdAt} />
  ) : (
    APPLICATIONS_UI.FALLBACKS.EMPTY
  );
  const updated = application.lastUpdated ? (
    <TimeAgo date={application.lastUpdated} />
  ) : (
    APPLICATIONS_UI.FALLBACKS.EMPTY
  );
  const namespaceItems = application.namespaces?.items ?? [];
  const deployedIn =
    namespaceItems.length === 0
      ? APPLICATIONS_UI.FALLBACKS.EMPTY
      : namespaceItems.map((n) => n.name).join(', ');
  const published = application.conditions?.find(
    (c) => c.type === APPLICATION_CONDITION_TYPES.PUBLISHED,
  );

  return [
    {
      k: 'health',
      label: APPLICATIONS_UI.CARD.LABELS.HEALTH,
      value: application.health?.status || APPLICATIONS_UI.FALLBACKS.UNKNOWN,
    },
    {
      k: 'replicas',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.REPLICAS,
      value: `${application.health?.readyReplicas ?? 0}/${application.health?.totalReplicas ?? 0}`,
    },
    {
      k: 'managedBy',
      label: APPLICATIONS_UI.CARD.LABELS.MANAGED_BY,
      value: application.managed?.by || APPLICATIONS_UI.FALLBACKS.EMPTY,
    },
    { k: 'deployedIn', label: APPLICATIONS_UI.SECTIONS.OVERVIEW.DEPLOYED_IN, value: deployedIn },
    { k: 'createdAt', label: APPLICATIONS_UI.CARD.LABELS.CREATED_AT, value: created },
    { k: 'lastUpdated', label: APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED, value: updated },
    ...(published
      ? [
          {
            k: 'published',
            label: APPLICATIONS_UI.CARD.LABELS.PUBLISHED,
            value: published.reason
              ? `${published.status} (${published.reason})`
              : published.status,
          },
        ]
      : []),
    ...(application.description
      ? [
          {
            k: 'description',
            label: APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL,
            value: application.description,
          },
        ]
      : []),
  ];
}

function buildHistoryRows(application: Application) {
  return [
    {
      k: 'managedChart',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.MANAGED_CHART,
      value: application.managed?.chart || APPLICATIONS_UI.FALLBACKS.EMPTY,
    },
    {
      k: 'managedVersion',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.MANAGED_VERSION,
      value: application.managed?.version || APPLICATIONS_UI.FALLBACKS.EMPTY,
    },
    {
      k: 'historyGeneration',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.HISTORY_GENERATION,
      value: application.history?.generation ?? 0,
    },
    {
      k: 'historyDrift',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.HAS_DRIFT,
      value: application.history?.hasDrift ? 'Yes' : 'No',
    },
    {
      k: 'lastModifiedBy',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.LAST_MODIFIED_BY,
      value: application.history?.lastModifiedBy || APPLICATIONS_UI.FALLBACKS.EMPTY,
    },
    {
      k: 'lastModifiedAt',
      label: APPLICATIONS_UI.SECTIONS.OVERVIEW.LAST_MODIFIED_AT,
      value: application.history?.lastModifiedAt ? (
        <TimeAgo date={application.history.lastModifiedAt} />
      ) : (
        APPLICATIONS_UI.FALLBACKS.EMPTY
      ),
    },
  ];
}

const RuntimeColumn: React.FC<{ application: Application }> = ({ application }) => {
  const ports = application.ports || [];
  const images = application.images || [];
  const envVarKeys = application.envVarKeys || [];

  const maxSlots = APPLICATION_SECTION_LAYOUT.ENV_CHIP_MAX_VISIBLE;
  const hasHidden = envVarKeys.length > maxSlots;
  const visibleKeys = hasHidden ? envVarKeys.slice(0, maxSlots - 1) : envVarKeys.slice(0, maxSlots);
  const hiddenKeys = hasHidden ? envVarKeys.slice(maxSlots - 1) : [];

  return (
    <ColumnShell title={APPLICATIONS_UI.SECTIONS.OVERVIEW.COLUMN_RUNTIME}>
      <div style={{ marginBottom: 8 }}>
        <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
          {APPLICATIONS_UI.SECTIONS.RUNTIME.PORTS}
        </div>
        {ports.length === 0 ? (
          <RowTag
            text={APPLICATIONS_UI.FALLBACKS.EMPTY}
            {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
          />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ports.map((p) => (
              <RowTag
                key={p}
                text={String(p)}
                {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
          {APPLICATIONS_UI.SECTIONS.RUNTIME.IMAGES}
        </div>
        {images.length === 0 ? (
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}
          >
            {images.slice(0, MAX_IMAGES).map((img) => (
              <Tooltip key={img} title={img}>
                <span style={chipStyle}>{img}</span>
              </Tooltip>
            ))}
            {images.length > MAX_IMAGES ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} {MAX_IMAGES} of {images.length}.
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div>
        <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
          {APPLICATIONS_UI.SECTIONS.RUNTIME.ENV_VAR_KEYS}
        </div>
        {envVarKeys.length === 0 ? (
          <RowTag
            text={APPLICATIONS_UI.FALLBACKS.EMPTY}
            {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: APPLICATION_SECTION_LAYOUT.ENV_CHIP_GAP_PX,
              minWidth: 0,
            }}
          >
            {visibleKeys.map((key) => (
              <Tooltip key={key} title={key}>
                <span
                  style={{
                    ...chipStyle,
                    maxWidth: APPLICATION_SECTION_LAYOUT.ENV_CHIP_MAX_WIDTH_PX,
                  }}
                >
                  {key}
                </span>
              </Tooltip>
            ))}
            {hiddenKeys.length > 0 ? (
              <Tooltip
                styles={{ root: { maxWidth: APPLICATION_SECTION_LAYOUT.ENV_TOOLTIP_MAX_WIDTH_PX } }}
                title={
                  <div
                    style={{
                      display: 'grid',
                      rowGap: APPLICATION_SECTION_LAYOUT.ENV_TOOLTIP_ROW_GAP_PX,
                    }}
                  >
                    {hiddenKeys.map((key) => (
                      <span
                        key={key}
                        style={{
                          fontSize: APPLICATION_SECTION_LAYOUT.ENV_TOOLTIP_FONT_SIZE_PX,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                }
              >
                <span>
                  <RowTag
                    text={`+${hiddenKeys.length}`}
                    {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                  />
                </span>
              </Tooltip>
            ) : null}
          </div>
        )}
      </div>
    </ColumnShell>
  );
};

const ApplicationOverviewSection: React.FC<{ application: Application }> = memo(
  ({ application }) => (
    <SettingsCard
      collapsible
      title={APPLICATIONS_UI.SECTIONS.OVERVIEW.TITLE}
      description={APPLICATIONS_UI.SECTIONS.OVERVIEW.COMBINED_SUBTITLE}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: 12,
          alignItems: 'start',
        }}
      >
        <ColumnShell title={APPLICATIONS_UI.SECTIONS.OVERVIEW.COLUMN_PRIMARY}>
          <KeyValueGrid compact rows={buildPrimaryRows(application)} />
          <div
            style={{ height: 1, background: DEFAULT_COLORS.BORDER_ELEVATED, margin: '12px 0' }}
          />
          <div style={APPLICATION_SUMMARY_COLUMN_TITLE_STYLE}>
            {APPLICATIONS_UI.SECTIONS.OVERVIEW.GROUP_HISTORY_META}
          </div>
          <KeyValueGrid compact rows={buildHistoryRows(application)} />
          {application.health?.reason ? (
            <div
              style={{
                marginTop: 12,
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {application.health.reason}
            </div>
          ) : null}
        </ColumnShell>
        <RuntimeColumn application={application} />
      </div>
    </SettingsCard>
  ),
);

ApplicationOverviewSection.displayName = 'ApplicationOverviewSection';

export default ApplicationOverviewSection;
