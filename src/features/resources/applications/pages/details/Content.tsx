import React, { memo, useMemo, useState } from 'react';
import { CameraOutlined, HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { format } from 'date-fns';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type {
  Application,
  ApplicationChangeLogEntry,
  ApplicationResourceRef,
  ApplicationSnapshotSummary,
} from '../../models';
import { APPLICATION_DETAILS_CONSTANTS, APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import ApplicationSectionEmptyState from '../../components/display/ApplicationSectionEmptyState';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../store';
import { fetchSnapshotManifestThunk } from '../../store';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { getResourceKindVisual } from '../../utils/resourceKindVisual';
import ApplicationSnapshotManifestSlideOut from '../../components/snapshots/ApplicationSnapshotManifestSlideOut';
import ApplicationSnapshotRow from '../../components/snapshots/ApplicationSnapshotRow';
import SnapshotAggregateStorageBar from '../../components/snapshots/SnapshotAggregateStorageBar';
import {
  applicationSnapshotStableKey,
  mergeApplicationSnapshotSources,
} from '../../utils/mergeApplicationSnapshotSources';

interface ApplicationDetailsContentProps {
  application: Application;
}

/** Matches Runtime sub-labels (ports, images, …) inside Application summary. */
const APPLICATION_SUMMARY_SUBHEADING_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontWeight: 700,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

/** Same chip treatment as metrics RowTags when count is zero (e.g. Total incidents). */
const RUNTIME_VALUE_CHIP_ROW_TAG = {
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
  fontSize: 11,
} as const;

function WorkloadResourceMetricChip(props: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconBackground: string;
  iconColor: string;
  value: string;
}): React.ReactElement {
  const { Icon, iconBackground, iconColor, value } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: iconBackground,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={14} color={iconColor} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
        {value}
      </span>
    </div>
  );
}

function getChangeLogDotColor(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes('critical')) return DEFAULT_COLORS.DANGER;
  if (s.includes('high')) return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  return DEFAULT_COLORS.TEXT_MUTED;
}

function ColumnShell(props: { title: string; children: React.ReactNode }): React.ReactElement {
  const { title, children } = props;
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: APPLICATION_SECTION_LAYOUT.COLUMN_HEADER_FONT_SIZE,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}

function StatMiniCard(props: { label: string; value: React.ReactNode }): React.ReactElement {
  const { label, value } = props;
  return (
    <div
      style={{
        minWidth: APPLICATION_SECTION_LAYOUT.STAT_MIN_WIDTH_PX,
        flex: '1 1 120px',
        border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
        borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
        padding: 10,
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: DEFAULT_COLORS.TEXT_MUTED,
          fontWeight: 600,
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </div>
    </div>
  );
}

const ApplicationDetailsContent: React.FC<ApplicationDetailsContentProps> = memo(
  ({ application }) => {
    const sections = useMemo(() => {
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
      const deployedInDisplay =
        namespaceItems.length === 0
          ? APPLICATIONS_UI.FALLBACKS.EMPTY
          : namespaceItems.map((n) => n.name).join(', ');

      return {
        overviewGroup1Rows: [
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
          {
            k: 'deployedIn',
            label: APPLICATIONS_UI.SECTIONS.OVERVIEW.DEPLOYED_IN,
            value: deployedInDisplay,
          },
          { k: 'createdAt', label: APPLICATIONS_UI.CARD.LABELS.CREATED_AT, value: created },
          { k: 'lastUpdated', label: APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED, value: updated },
          ...(application.crStatus
            ? [
                {
                  k: 'crStatus',
                  label: APPLICATIONS_UI.CARD.LABELS.CR_STATUS,
                  value: application.crStatus,
                },
              ]
            : []),
        ],
        overviewGroup2Rows: [
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
        ],
        insights: application.insights,
        resources: application.resources || [],
        images: application.images || [],
        ports: application.ports || [],
        envVarKeys: application.envVarKeys || [],
        snapshots: application.snapshots || [],
        metrics: application.metrics,
        changeLog: application.history?.changeLog || [],
      };
    }, [application]);

    const resourcesByKind = useMemo(() => {
      const list = application.resources || [];
      const shown = list.slice(0, 50);
      const map = new Map<string, ApplicationResourceRef[]>();
      for (const r of shown) {
        const g = map.get(r.kind) ?? [];
        g.push(r);
        map.set(r.kind, g);
      }
      return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [application.resources]);

    const changeLogGrouped = useMemo(() => {
      const entries = application.history?.changeLog || [];
      const lim = entries.slice(0, 20);
      const groups: { dayKey: string; entries: ApplicationChangeLogEntry[] }[] = [];
      for (const e of lim) {
        const dayKey = format(new Date(e.detectedAt), 'yyyy-MM-dd');
        const last = groups[groups.length - 1];
        if (!last || last.dayKey !== dayKey) {
          groups.push({ dayKey, entries: [e] });
        } else {
          last.entries.push(e);
        }
      }
      return groups;
    }, [application.history?.changeLog]);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: APPLICATION_SECTION_LAYOUT.STACK_GAP_PX,
        }}
      >
        <SettingsCard
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
              <KeyValueGrid compact rows={sections.overviewGroup1Rows} />
              <div
                style={{
                  height: 1,
                  background: DEFAULT_COLORS.BORDER_LIGHT,
                  margin: '12px 0',
                }}
              />
              <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
                {APPLICATIONS_UI.SECTIONS.OVERVIEW.GROUP_HISTORY_META}
              </div>
              <KeyValueGrid compact rows={sections.overviewGroup2Rows} />
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
            <ColumnShell title={APPLICATIONS_UI.SECTIONS.OVERVIEW.COLUMN_RUNTIME}>
              <div style={{ marginBottom: 8 }}>
                <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
                  {APPLICATIONS_UI.SECTIONS.RUNTIME.PORTS}
                </div>
                {sections.ports.length === 0 ? (
                  <RowTag
                    text={APPLICATIONS_UI.FALLBACKS.EMPTY}
                    {...RUNTIME_VALUE_CHIP_ROW_TAG}
                  />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {sections.ports.map((p) => (
                      <RowTag key={p} text={String(p)} {...RUNTIME_VALUE_CHIP_ROW_TAG} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
                  {APPLICATIONS_UI.SECTIONS.RUNTIME.IMAGES}
                </div>
                {sections.images.length === 0 ? (
                  <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
                ) : (
                  <div style={{ display: 'grid', rowGap: 6 }}>
                    {sections.images.slice(0, 8).map((img) => (
                      <code
                        key={img}
                        style={{
                          fontSize: 11,
                          fontFamily: 'monospace',
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                          borderRadius: 6,
                          padding: '4px 8px',
                          wordBreak: 'break-all',
                        }}
                      >
                        {img}
                      </code>
                    ))}
                    {sections.images.length > 8 ? (
                      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                        {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 8 of {sections.images.length}.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div>
                <div style={APPLICATION_SUMMARY_SUBHEADING_STYLE}>
                  {APPLICATIONS_UI.SECTIONS.RUNTIME.ENV_VAR_KEYS}
                </div>
                {sections.envVarKeys.length === 0 ? (
                  <RowTag
                    text={APPLICATIONS_UI.FALLBACKS.EMPTY}
                    {...RUNTIME_VALUE_CHIP_ROW_TAG}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      maxHeight: APPLICATION_SECTION_LAYOUT.TAG_CLOUD_MAX_HEIGHT_PX,
                      overflowY: 'auto',
                    }}
                  >
                    {sections.envVarKeys.map((key) => (
                      <RowTag key={key} text={key} {...RUNTIME_VALUE_CHIP_ROW_TAG} />
                    ))}
                  </div>
                )}
              </div>
            </ColumnShell>
          </div>
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.RESOURCES.TITLE}
          description={APPLICATIONS_UI.SECTIONS.RESOURCES.DESCRIPTION}
        >
          {sections.resources.length === 0 ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resourcesByKind.map(([kind, rows]) => {
                const visual = getResourceKindVisual(kind);
                const IconKind = visual.Icon;
                return (
                  <div key={kind}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: DEFAULT_COLORS.SUCCESS,
                        }}
                      >
                        <IconKind style={{ fontSize: 13, color: DEFAULT_COLORS.BACKGROUND_WHITE }} />
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                        }}
                      >
                        {kind}
                      </span>
                    </div>
                    <div style={{ display: 'grid', rowGap: 4 }}>
                      {rows.map((r) => (
                        <div
                          key={`${r.namespace}:${r.kind}:${r.name}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 8,
                            padding: '8px 10px',
                            borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
                            border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                            background: DEFAULT_COLORS.BACKGROUND_WHITE,
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_HOVER;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = DEFAULT_COLORS.BACKGROUND_WHITE;
                          }}
                        >
                          <RowTag
                            text={r.namespace}
                            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                            fontSize={11}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: DEFAULT_COLORS.TEXT_PRIMARY,
                              wordBreak: 'break-word',
                            }}
                          >
                            {r.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {sections.resources.length > 50 ? (
                <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                  {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 50 of {sections.resources.length}.
                </div>
              ) : null}
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.INSIGHTS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.INSIGHTS.DESCRIPTION}
          headerAction={
            <Tooltip title={APPLICATIONS_UI.SECTIONS.INSIGHTS.ENRICHMENT_HINT}>
              <InfoCircleOutlined
                style={{ fontSize: 16, color: DEFAULT_COLORS.ICON_SECONDARY, cursor: 'help' }}
              />
            </Tooltip>
          }
        >
          {!sections.insights || !sections.insights.enriched ? (
            <ApplicationSectionEmptyState
              icon={<InfoCircleOutlined style={{ fontSize: 24 }} />}
              title={APPLICATIONS_UI.SECTIONS.INSIGHTS.EMPTY_TITLE}
              description={APPLICATIONS_UI.SECTIONS.INSIGHTS.EMPTY_DESCRIPTION}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sections.insights.summary ? (
                <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.6 }}>
                  {sections.insights.summary}
                </div>
              ) : null}
              <KeyValueGrid
                rows={[
                  {
                    k: 'confidence',
                    label: APPLICATIONS_UI.SECTIONS.INSIGHTS.CONFIDENCE,
                    value: sections.insights.confidence || APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                  {
                    k: 'category',
                    label: APPLICATIONS_UI.SECTIONS.INSIGHTS.CATEGORY,
                    value: sections.insights.category || APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                  {
                    k: 'role',
                    label: APPLICATIONS_UI.SECTIONS.INSIGHTS.ROLE,
                    value: sections.insights.role || APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                  {
                    k: 'enrichedAt',
                    label: APPLICATIONS_UI.SECTIONS.INSIGHTS.ENRICHED_AT,
                    value: sections.insights.enrichedAt ? (
                      <TimeAgo date={sections.insights.enrichedAt} />
                    ) : (
                      APPLICATIONS_UI.FALLBACKS.EMPTY
                    ),
                  },
                  {
                    k: 'promptVersion',
                    label: APPLICATIONS_UI.SECTIONS.INSIGHTS.PROMPT_VERSION,
                    value: sections.insights.promptVersion || APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                ]}
              />
              {sections.insights.techStack?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sections.insights.techStack.map((t) => (
                    <RowTag
                      key={t}
                      text={t}
                      background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                      color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                    />
                  ))}
                </div>
              ) : null}

              {sections.insights.dependencies?.length ? (
                <div>
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.INSIGHTS.DEPENDENCIES}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {sections.insights.dependencies.map((d) => (
                      <RowTag
                        key={d}
                        text={d}
                        background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                        color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {sections.insights.risks?.length ? (
                <div>
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.INSIGHTS.RISKS}
                  </div>
                  <div style={{ display: 'grid', rowGap: 6 }}>
                    {sections.insights.risks.slice(0, 10).map((r) => (
                      <div
                        key={r}
                        style={{
                          fontSize: 13,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          lineHeight: 1.5,
                        }}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {sections.insights.suggestions?.length ? (
                <div>
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.INSIGHTS.SUGGESTIONS}
                  </div>
                  <div style={{ display: 'grid', rowGap: 6 }}>
                    {sections.insights.suggestions.slice(0, 10).map((s) => (
                      <div
                        key={s}
                        style={{
                          fontSize: 13,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          lineHeight: 1.5,
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {sections.insights.relatedApps?.length ? (
                <div>
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.INSIGHTS.RELATED_APPS}
                  </div>
                  <div style={{ display: 'grid', rowGap: 8 }}>
                    {sections.insights.relatedApps.slice(0, 10).map((a) => (
                      <div
                        key={`${a.name}:${a.reason}`}
                        style={{
                          border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                          }}
                        >
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
                </div>
              ) : null}
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.METRICS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.METRICS.DESCRIPTION}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <StatMiniCard
              label={APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_CHANGES}
              value={sections.metrics?.derived?.totalChanges ?? 0}
            />
            <StatMiniCard
              label={APPLICATIONS_UI.SECTIONS.METRICS.SNAPSHOT_COUNT}
              value={sections.metrics?.derived?.snapshotCount ?? 0}
            />
            <StatMiniCard
              label={APPLICATIONS_UI.SECTIONS.METRICS.UNIQUE_FINGERPRINTS}
              value={sections.metrics?.derived?.uniqueFingerprints ?? 0}
            />
            <StatMiniCard
              label={APPLICATIONS_UI.SECTIONS.METRICS.CHANGE_VELOCITY}
              value={sections.metrics?.derived?.changeVelocityPerDay ?? 0}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <RowTag
              text={`${APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_INCIDENTS}: ${sections.metrics?.derived?.totalIncidents ?? 0}`}
              background={
                (sections.metrics?.derived?.totalIncidents ?? 0) > 0
                  ? CONNECTIVITY_CONSTANTS.COLORS.WARNING
                  : DEFAULT_COLORS.CHIP_CUSTOM_BG
              }
              color={
                (sections.metrics?.derived?.totalIncidents ?? 0) > 0
                  ? DEFAULT_COLORS.BACKGROUND_WHITE
                  : DEFAULT_COLORS.CHIP_CUSTOM_TEXT
              }
              fontSize={11}
            />
            <RowTag
              text={`${APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_RECOVERIES}: ${sections.metrics?.derived?.totalRecoveries ?? 0}`}
              background={
                (sections.metrics?.derived?.totalRecoveries ?? 0) > 0
                  ? DEFAULT_COLORS.SUCCESS
                  : DEFAULT_COLORS.CHIP_CUSTOM_BG
              }
              color={
                (sections.metrics?.derived?.totalRecoveries ?? 0) > 0
                  ? DEFAULT_COLORS.BACKGROUND_WHITE
                  : DEFAULT_COLORS.CHIP_CUSTOM_TEXT
              }
              fontSize={11}
            />
          </div>
          <div
            style={{
              border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
              borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
              padding: 10,
              background: DEFAULT_COLORS.BACKGROUND_LIGHT,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                marginBottom: 8,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.METRICS.TIMELINE}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
                  {APPLICATIONS_UI.SECTIONS.METRICS.FIRST_CHANGE}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                  {sections.metrics?.derived?.firstChangeDetectedAt ? (
                    <TimeAgo date={sections.metrics.derived.firstChangeDetectedAt} />
                  ) : (
                    APPLICATIONS_UI.FALLBACKS.EMPTY
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 600 }}>
                  {APPLICATIONS_UI.SECTIONS.METRICS.LAST_CHANGE}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                  {sections.metrics?.derived?.lastChangeDetectedAt ? (
                    <TimeAgo date={sections.metrics.derived.lastChangeDetectedAt} />
                  ) : (
                    APPLICATIONS_UI.FALLBACKS.EMPTY
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.METRICS.CHANGES_BY_CLASS}
            </div>
            {Object.keys(sections.metrics?.derived?.changesByClass || {}).length === 0 ? (
              <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(sections.metrics.derived.changesByClass).map(([key, value]) => (
                  <RowTag
                    key={key}
                    text={`${key}: ${value}`}
                    background={DEFAULT_COLORS.CHIP_BLUE_BG}
                    color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                    fontSize={11}
                  />
                ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.METRICS.CHANGES_BY_SEVERITY}
            </div>
            {Object.keys(sections.metrics?.derived?.changesBySeverity || {}).length === 0 ? (
              <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(sections.metrics.derived.changesBySeverity).map(([key, value]) => (
                  <RowTag
                    key={key}
                    text={`${key}: ${value}`}
                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                    color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                    fontSize={11}
                  />
                ))}
              </div>
            )}
          </div>
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.DESCRIPTION}
        >
          {!sections.metrics?.workloads?.length ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.metrics.workloads.slice(0, 25).map((w) => {
                const kindVisual = getResourceKindVisual(w.resourceKind);
                const KindIcon = kindVisual.Icon;
                const cpuReq = w.baseline?.requests?.cpu ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
                const memReq = w.baseline?.requests?.memory ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
                const cpuLim = w.baseline?.limits?.cpu ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
                const memLim = w.baseline?.limits?.memory ?? APPLICATIONS_UI.FALLBACKS.EMPTY;
                const fp = w.baseline?.fingerprint || APPLICATIONS_UI.FALLBACKS.EMPTY;
                return (
                  <div
                    key={`${w.namespace}:${w.resourceKind}:${w.resourceName}`}
                    style={{
                      border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                      borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
                      padding: 12,
                      background: DEFAULT_COLORS.BACKGROUND_WHITE,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            lineHeight: 1.25,
                          }}
                        >
                          {w.resourceName}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            marginTop: 8,
                            alignItems: 'center',
                          }}
                        >
                          <KindIcon style={{ fontSize: 14, color: kindVisual.color }} aria-hidden />
                          <RowTag
                            text={w.namespace}
                            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                            color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                            fontSize={11}
                          />
                          <RowTag
                            text={w.resourceKind}
                            background={kindVisual.background}
                            color={kindVisual.color}
                            fontSize={11}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: DEFAULT_COLORS.TEXT_MUTED,
                          flexShrink: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        {w.usage?.timestamp ? (
                          <TimeAgo date={w.usage.timestamp} />
                        ) : (
                          APPLICATIONS_UI.FALLBACKS.EMPTY
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                        gap: 12,
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: DEFAULT_COLORS.TEXT_MUTED,
                            fontSize: 11,
                            fontWeight: 700,
                            marginBottom: 8,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.BASELINE}
                        </div>
                        <div style={{ display: 'grid', rowGap: 10 }}>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontWeight: 600,
                                marginBottom: 4,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.FINGERPRINT}
                            </div>
                            <code
                              style={{
                                display: 'inline-block',
                                fontSize: 12,
                                fontFamily: 'monospace',
                                color: DEFAULT_COLORS.TEXT_PRIMARY,
                                background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                                border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                                borderRadius: 6,
                                padding: '4px 8px',
                                wordBreak: 'break-all',
                              }}
                            >
                              {fp}
                            </code>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontWeight: 600,
                                marginBottom: 4,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.REPLICAS}
                            </div>
                            <RowTag
                              text={String(w.baseline?.replicas ?? 0)}
                              background={DEFAULT_COLORS.CHIP_BLUE_BG}
                              color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                              fontSize={11}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontWeight: 600,
                                marginBottom: 4,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.REQUESTS}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              <WorkloadResourceMetricChip
                                Icon={Icons.Cpu}
                                iconBackground={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS.CPU_ICON_BG
                                }
                                iconColor={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS.CPU_ICON_COLOR
                                }
                                value={cpuReq}
                              />
                              <WorkloadResourceMetricChip
                                Icon={Icons.Memory}
                                iconBackground={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS
                                    .MEMORY_ICON_BG
                                }
                                iconColor={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS
                                    .MEMORY_ICON_COLOR
                                }
                                value={memReq}
                              />
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontWeight: 600,
                                marginBottom: 4,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.LIMITS}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              <WorkloadResourceMetricChip
                                Icon={Icons.Cpu}
                                iconBackground={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS.CPU_ICON_BG
                                }
                                iconColor={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS.CPU_ICON_COLOR
                                }
                                value={cpuLim}
                              />
                              <WorkloadResourceMetricChip
                                Icon={Icons.Memory}
                                iconBackground={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS
                                    .MEMORY_ICON_BG
                                }
                                iconColor={
                                  APPLICATION_DETAILS_CONSTANTS.WORKLOAD_RESOURCE_METRICS
                                    .MEMORY_ICON_COLOR
                                }
                                value={memLim}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: DEFAULT_COLORS.TEXT_MUTED,
                            fontSize: 11,
                            fontWeight: 700,
                            marginBottom: 8,
                            textTransform: 'uppercase',
                            letterSpacing: '0.03em',
                          }}
                        >
                          {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.USAGE}
                        </div>
                        {!w.usage?.available ? (
                          <Tooltip title={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.USAGE_EMPTY}>
                            <div
                              style={{
                                border: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                                borderRadius: 6,
                                padding: '12px 10px',
                                background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                                textAlign: 'center',
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontSize: 13,
                                cursor: 'help',
                              }}
                            >
                              {APPLICATIONS_UI.FALLBACKS.EMPTY}
                            </div>
                          </Tooltip>
                        ) : (
                              <>
                                <KeyValueGrid
                                  compact
                                  rows={[
                                    {
                                      k: 'qos',
                                      label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.QOS,
                                      value: w.usage?.qos || APPLICATIONS_UI.FALLBACKS.EMPTY,
                                    },
                                    {
                                      k: 'totalCpu',
                                      label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TOTAL_CPU,
                                      value:
                                        w.usage?.resources?.totalCpu ||
                                        APPLICATIONS_UI.FALLBACKS.EMPTY,
                                    },
                                    {
                                      k: 'totalMemory',
                                      label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TOTAL_MEMORY,
                                      value:
                                        w.usage?.resources?.totalMemory ||
                                        APPLICATIONS_UI.FALLBACKS.EMPTY,
                                    },
                                  ]}
                                />
                                {w.usage?.resources?.usagePerInstance?.length ? (
                                  <div style={{ marginTop: 8, display: 'grid', rowGap: 8 }}>
                                    {w.usage.resources.usagePerInstance.slice(0, 3).map((i) => (
                                      <div
                                        key={i.name}
                                        style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_PRIMARY }}
                                      >
                                        <div style={{ fontWeight: 700 }}>
                                          {i.name}{' '}
                                          <span
                                            style={{
                                              fontWeight: 500,
                                              color: DEFAULT_COLORS.TEXT_MUTED,
                                            }}
                                          >
                                            ({i.totalCpu} CPU · {i.totalMemory} Mem)
                                          </span>
                                        </div>
                                        {i.containers?.length ? (
                                          <div style={{ marginTop: 4, display: 'grid', rowGap: 3 }}>
                                            {i.containers.slice(0, 4).map((c) => (
                                              <div
                                                key={c.name}
                                                style={{ color: DEFAULT_COLORS.TEXT_MUTED }}
                                              >
                                                {c.name}: {c.cpu} CPU · {c.memory} Mem
                                              </div>
                                            ))}
                                            {i.containers.length > 4 ? (
                                              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                                                +{i.containers.length - 4} more containers
                                              </div>
                                            ) : null}
                                          </div>
                                        ) : null}
                                      </div>
                                    ))}
                                    {w.usage.resources.usagePerInstance.length > 3 ? (
                                      <div
                                        style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}
                                      >
                                        {
                                          APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS
                                            .SHOWING_FIRST_INSTANCES
                                        }{' '}
                                        {w.usage.resources.usagePerInstance.length}.
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </>
                            )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {sections.metrics.workloads.length > 25 ? (
                <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, paddingTop: 4 }}>
                  {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 25 of{' '}
                  {sections.metrics.workloads.length}.
                </div>
              ) : null}
            </div>
          )}
        </SettingsCard>

        <SnapshotsSection applicationId={application.name} detailSnapshots={application.snapshots} />

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.TITLE}
          description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DESCRIPTION}
        >
          {sections.changeLog.length === 0 ? (
            <ApplicationSectionEmptyState
              icon={<HistoryOutlined style={{ fontSize: 24 }} />}
              title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.EMPTY_TITLE}
              description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.EMPTY_DESCRIPTION}
            />
          ) : (
            <div>
              {changeLogGrouped.map((group, groupIdx) => (
                <div key={group.dayKey}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginTop: groupIdx === 0 ? 0 : 12,
                      marginBottom: 8,
                      paddingBottom: 6,
                      borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                    }}
                  >
                    {format(new Date(`${group.dayKey}T12:00:00`), 'MMMM d, yyyy')}
                  </div>
                  {group.entries.map((entry) => {
                    const dotColor = getChangeLogDotColor(entry.severity);
                    const suffixParts: string[] = [];
                    if (entry.isIncident) suffixParts.push('Incident');
                    if (entry.isRecovery) suffixParts.push('Recovery');
                    if (entry.isLastOne) suffixParts.push('Latest');
                    const suffix = suffixParts.length > 0 ? ` · ${suffixParts.join(' · ')}` : '';

                    return (
                      <div
                        key={`${entry.generation}:${entry.fingerprint}`}
                        style={{
                          padding: '10px 0',
                          borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              marginTop: 5,
                              flexShrink: 0,
                              background: dotColor,
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <RowTag
                                text={`${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.GEN} ${entry.generation}`}
                                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                                fontSize={11}
                              />
                              <RowTag
                                text={entry.changeClass}
                                background={DEFAULT_COLORS.CHIP_BLUE_BG}
                                color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                                fontSize={11}
                              />
                              <RowTag
                                text={entry.severity}
                                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                                color={DEFAULT_COLORS.TEXT_SECONDARY}
                                fontSize={11}
                              />
                              {suffix ? (
                                <span
                                  style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}
                                >
                                  {suffix.trim()}
                                </span>
                              ) : null}
                            </div>
                            {(entry.changedBy || entry.fingerprint) && (
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 6,
                                  marginTop: 6,
                                  alignItems: 'center',
                                }}
                              >
                                {entry.changedBy ? (
                                  <RowTag
                                    text={`${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.BY_PREFIX} ${entry.changedBy}`}
                                    background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                                    color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                                    fontSize={11}
                                  />
                                ) : null}
                                {entry.fingerprint ? (
                                  <code
                                    style={{
                                      fontSize: 11,
                                      fontFamily: 'monospace',
                                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                                      background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                                      border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                                      borderRadius: 6,
                                      padding: '2px 6px',
                                    }}
                                  >
                                    {entry.fingerprint}
                                  </code>
                                ) : null}
                              </div>
                            )}
                            {entry.changes?.length ? (
                              <div style={{ marginTop: 8 }}>
                                {entry.changes.slice(0, 5).map((c, idx) => (
                                  <div
                                    key={`${entry.fingerprint}:${idx}`}
                                    style={{
                                      fontSize: 12,
                                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                                      lineHeight: 1.5,
                                      marginTop: idx === 0 ? 0 : 6,
                                    }}
                                  >
                                    <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                                      {c.changeType}
                                    </span>{' '}
                                    <span style={{ fontWeight: 700 }}>{c.field}</span>
                                    {': '}
                                    {c.oldValue != null && String(c.oldValue).length > 0 ? (
                                      <span
                                        style={{
                                          color: DEFAULT_COLORS.TEXT_MUTED,
                                          textDecoration: 'line-through',
                                        }}
                                      >
                                        {String(c.oldValue)}
                                      </span>
                                    ) : null}
                                    {c.oldValue != null &&
                                    String(c.oldValue).length > 0 &&
                                    c.newValue != null &&
                                    String(c.newValue).length > 0 ? (
                                      <span style={{ margin: '0 6px', color: DEFAULT_COLORS.TEXT_MUTED }}>
                                        {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
                                      </span>
                                    ) : null}
                                    {c.newValue != null && String(c.newValue).length > 0 ? (
                                      <span style={{ fontWeight: 700 }}>{String(c.newValue)}</span>
                                    ) : (
                                      <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                                        {c.description}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {entry.changes.length > 5 ? (
                                  <div
                                    style={{
                                      fontSize: 12,
                                      color: DEFAULT_COLORS.TEXT_MUTED,
                                      marginTop: 4,
                                    }}
                                  >
                                    {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} 5 of{' '}
                                    {entry.changes.length} changes.
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: DEFAULT_COLORS.TEXT_MUTED,
                              flexShrink: 0,
                              textAlign: 'right',
                              lineHeight: 1.35,
                            }}
                          >
                            <TimeAgo date={entry.detectedAt} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              {sections.changeLog.length > 20 ? (
                <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, paddingTop: 4 }}>
                  {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} 20 of{' '}
                  {sections.changeLog.length} entries.
                </div>
              ) : null}
            </div>
          )}
        </SettingsCard>
      </div>
    );
  },
);

ApplicationDetailsContent.displayName = 'ApplicationDetailsContent';

export default ApplicationDetailsContent;

function SnapshotsSection(props: {
  applicationId: string;
  detailSnapshots: Application['snapshots'];
}): React.ReactElement {
  const { applicationId, detailSnapshots } = props;
  const dispatch: AppDispatch = useDispatch();
  const { snapshots, snapshotsLoading, snapshotsError, snapshotManifests } = useSelector(
    (s: RootState) => s.applications,
  );
  const [activeManifestKey, setActiveManifestKey] = useState<string | null>(null);

  const mergedSnapshots = useMemo(
    () => mergeApplicationSnapshotSources(detailSnapshots, snapshots),
    [detailSnapshots, snapshots],
  );

  const manifestState = activeManifestKey ? snapshotManifests[activeManifestKey] : undefined;

  const activeRowTitle = useMemo(() => {
    if (!activeManifestKey) return '';
    const row = mergedSnapshots.find(
      (s) => applicationSnapshotStableKey(s) === activeManifestKey,
    );
    return row?.id ?? '';
  }, [activeManifestKey, mergedSnapshots]);

  const openManifest = (summary: ApplicationSnapshotSummary) => {
    const manifestKey = applicationSnapshotStableKey(summary);
    setActiveManifestKey(manifestKey);
    void dispatch(
      fetchSnapshotManifestThunk({
        manifestKey,
        applicationId,
        namespace: summary.namespace,
        generation: summary.generation,
      }),
    );
  };

  return (
    <>
      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.TITLE}
        description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
        headerAction={
          !snapshotsLoading && mergedSnapshots.length > 0 ? (
            <SnapshotAggregateStorageBar snapshots={mergedSnapshots} />
          ) : null
        }
      >
        {snapshotsLoading ? (
          <div style={{ display: 'grid', rowGap: 10 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 44,
                  borderRadius: 8,
                  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                  background: DEFAULT_COLORS.BACKGROUND_LIGHT,
                }}
              />
            ))}
          </div>
        ) : mergedSnapshots.length === 0 ? (
          snapshotsError ? (
            <div style={{ fontSize: 13, color: DEFAULT_COLORS.DANGER }}>{snapshotsError}</div>
          ) : (
            <ApplicationSectionEmptyState
              icon={<CameraOutlined style={{ fontSize: 24 }} />}
              title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_TITLE}
              description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_DESCRIPTION}
            />
          )
        ) : (
          <div>
            {mergedSnapshots.map((s, idx) => (
              <ApplicationSnapshotRow
                key={applicationSnapshotStableKey(s)}
                snapshot={s}
                showMarginBottom={idx < mergedSnapshots.length - 1}
                onViewManifest={openManifest}
              />
            ))}
          </div>
        )}
      </SettingsCard>

      <ApplicationSnapshotManifestSlideOut
        open={activeManifestKey != null}
        manifestKey={activeManifestKey}
        onClose={() => setActiveManifestKey(null)}
        title={activeRowTitle}
        manifestState={manifestState}
      />
    </>
  );
}

function MutedText({ value }: { value: string }) {
  return <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{value}</div>;
}

function KeyValueGrid({
  rows,
  compact = false,
}: {
  rows: Array<{ k: string; label: string; value: React.ReactNode }>;
  compact?: boolean;
}) {
  const rowGap = compact ? 6 : 10;
  const labelWidth = compact ? 'minmax(0, 140px)' : '180px';
  return (
    <div style={{ display: 'grid', rowGap }}>
      {rows.map((r) => (
        <div
          key={r.k}
          style={{ display: 'grid', gridTemplateColumns: `${labelWidth} minmax(0, 1fr)`, gap: 12 }}
        >
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700 }}>
            {r.label}
          </div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 13, minWidth: 0 }}>
            {r.value}
          </div>
        </div>
      ))}
    </div>
  );
}
