import React, { memo, useMemo } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, Tooltip } from 'antd';
import { format } from 'date-fns';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { Application, ApplicationChangeLogEntry, ApplicationResourceRef } from '../../models';
import { APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import ApplicationSectionEmptyState from '../../components/display/ApplicationSectionEmptyState';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { getResourceKindVisual } from '../../utils/resourceKindVisual';
import KeyValueGrid from '../../components/details/KeyValueGrid';
import ApplicationDetailsToolbar from '../../components/layout/ApplicationDetailsToolbar';
import {
  APPLICATION_SUMMARY_COLUMN_TITLE_STYLE,
  APPLICATION_SUMMARY_SUBHEADING_STYLE,
  ColumnShell,
  getChangeLogDotColor,
  StatMiniCard,
  WorkloadBaselineRows,
} from './contentBlocks';

interface ApplicationDetailsContentProps {
  application: Application;
  syncDisabled?: boolean;
  onForceSync: () => void;
  onEdit: () => void;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  onDelete: () => void;
}

const ApplicationDetailsContent: React.FC<ApplicationDetailsContentProps> = memo(
  ({
    application,
    syncDisabled = false,
    onForceSync,
    onEdit,
    onManageSnapshots,
    onManageRollbacks,
    onDelete,
  }) => {
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
        <div
          style={{
            position: 'sticky',
            top: 60,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '8px 0',
            background: DEFAULT_COLORS.BACKGROUND_WHITE,
            borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          }}
        >
          <ApplicationDetailsToolbar
            onForceSync={onForceSync}
            syncDisabled={syncDisabled}
            onEdit={onEdit}
            onManageSnapshots={onManageSnapshots}
            onManageRollbacks={onManageRollbacks}
            onDelete={onDelete}
          />
        </div>

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
              <div style={APPLICATION_SUMMARY_COLUMN_TITLE_STYLE}>
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
                    {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                  />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {sections.ports.map((p) => (
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
                {sections.images.length === 0 ? (
                  <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 6,
                    }}
                  >
                    {sections.images.slice(0, 8).map((img) => (
                      <Tooltip key={img} title={img}>
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: '100%',
                            background: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.background,
                            color: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.color,
                            padding: '2px 10px',
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.fontSize,
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            boxSizing: 'border-box',
                          }}
                        >
                          {img}
                        </span>
                      </Tooltip>
                    ))}
                    {sections.images.length > 8 ? (
                      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                        {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 8 of{' '}
                        {sections.images.length}.
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
                    {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                  />
                ) : (
                  (() => {
                    const maxRows = 3;
                    const perRow = 3;
                    const maxSlots = maxRows * perRow;
                    const hasHidden = sections.envVarKeys.length > maxSlots;
                    const visibleKeys = hasHidden
                      ? sections.envVarKeys.slice(0, maxSlots - 1)
                      : sections.envVarKeys.slice(0, maxSlots);
                    const hiddenKeys = hasHidden ? sections.envVarKeys.slice(maxSlots - 1) : [];

                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                          alignItems: 'start',
                          gap: 6,
                          width: '100%',
                          overflowX: 'hidden',
                        }}
                      >
                        {visibleKeys.map((key) => (
                          <Tooltip key={key} title={key}>
                            <span
                              style={{
                                display: 'inline-block',
                                maxWidth: '100%',
                                background:
                                  APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.background,
                                color: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.color,
                                padding: '2px 10px',
                                borderRadius: 999,
                                fontWeight: 700,
                                fontSize: APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG.fontSize,
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                boxSizing: 'border-box',
                              }}
                            >
                              {key}
                            </span>
                          </Tooltip>
                        ))}
                        {hiddenKeys.length > 0 ? (
                          <Tooltip
                            title={
                              <div style={{ display: 'grid', rowGap: 4 }}>
                                {hiddenKeys.map((key) => (
                                  <span key={key}>{key}</span>
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
                    );
                  })()
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: DEFAULT_COLORS.SUCCESS,
                        }}
                      >
                        <IconKind
                          style={{ fontSize: 13, color: DEFAULT_COLORS.BACKGROUND_WHITE }}
                        />
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
                            padding: '6px 10px',
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
                            {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
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
                  {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 50 of{' '}
                  {sections.resources.length}.
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
              label={APPLICATIONS_UI.SECTIONS.METRICS.LAST_CHANGE}
              value={
                sections.metrics?.derived?.lastChangeDetectedAt ? (
                  <TimeAgo date={sections.metrics.derived.lastChangeDetectedAt} />
                ) : (
                  APPLICATIONS_UI.FALLBACKS.EMPTY
                )
              }
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
          {filterMetricEntries(sections.metrics?.derived?.changesByClass).length > 0 ? (
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {filterMetricEntries(sections.metrics?.derived?.changesByClass).map(
                  ([key, value]) => (
                    <RowTag
                      key={key}
                      text={`${key}: ${value}`}
                      {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                    />
                  ),
                )}
              </div>
            </div>
          ) : null}
          {filterMetricEntries(sections.metrics?.derived?.changesBySeverity).length > 0 ? (
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {filterMetricEntries(sections.metrics?.derived?.changesBySeverity).map(
                  ([key, value]) => (
                    <RowTag
                      key={key}
                      text={`${key}: ${value}`}
                      background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                      color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                      fontSize={11}
                    />
                  ),
                )}
              </div>
            </div>
          ) : null}
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.DESCRIPTION}
        >
          {!sections.metrics?.workloads?.length ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Collapse
                bordered
                expandIconPosition="end"
                style={{ background: 'transparent' }}
                items={sections.metrics.workloads.slice(0, 25).map((w) => {
                  const WM = APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS;
                  return {
                    key: `${w.namespace}:${w.resourceKind}:${w.resourceName}`,
                    label: (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 8,
                          width: '100%',
                          paddingRight: 8,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            lineHeight: 1.25,
                            minWidth: 0,
                          }}
                        >
                          {w.resourceName}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            alignItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <RowTag
                            text={w.resourceKind}
                            {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                          />
                          <RowTag
                            text={w.namespace}
                            {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                          />
                        </div>
                      </div>
                    ),
                    children: (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                          gap: 12,
                          alignItems: 'start',
                        }}
                      >
                        <ColumnShell title={WM.BASELINE}>
                          <WorkloadBaselineRows w={w} />
                        </ColumnShell>
                        <ColumnShell title={WM.USAGE}>
                          {!w.usage?.available ? (
                            <MutedText value={WM.USAGE_EMPTY} />
                          ) : (
                            <>
                              {w.usage?.timestamp ? (
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: DEFAULT_COLORS.TEXT_MUTED,
                                    marginBottom: 8,
                                  }}
                                >
                                  <TimeAgo date={w.usage.timestamp} />
                                </div>
                              ) : null}
                              <KeyValueGrid
                                compact
                                rows={[
                                  {
                                    k: 'qos',
                                    label: WM.QOS,
                                    value: w.usage?.qos || APPLICATIONS_UI.FALLBACKS.EMPTY,
                                  },
                                  {
                                    k: 'totalCpu',
                                    label: WM.TOTAL_CPU,
                                    value:
                                      w.usage?.resources?.totalCpu ||
                                      APPLICATIONS_UI.FALLBACKS.EMPTY,
                                  },
                                  {
                                    k: 'totalMemory',
                                    label: WM.TOTAL_MEMORY,
                                    value:
                                      w.usage?.resources?.totalMemory ||
                                      APPLICATIONS_UI.FALLBACKS.EMPTY,
                                  },
                                ]}
                              />
                              {w.usage?.resources?.usagePerInstance?.length ? (
                                <div style={{ marginTop: 8, display: 'grid', rowGap: 8 }}>
                                  {w.usage.resources.usagePerInstance.slice(0, 3).map((inst) => (
                                    <div
                                      key={inst.name}
                                      style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_PRIMARY }}
                                    >
                                      <div style={{ fontWeight: 700 }}>
                                        {inst.name}{' '}
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            color: DEFAULT_COLORS.TEXT_MUTED,
                                          }}
                                        >
                                          ({inst.totalCpu} {WM.CPU_ABBREV} {WM.MID_DOT}{' '}
                                          {inst.totalMemory} {WM.MEMORY_ABBREV})
                                        </span>
                                      </div>
                                      {inst.containers?.length ? (
                                        <div style={{ marginTop: 4, display: 'grid', rowGap: 3 }}>
                                          {inst.containers.slice(0, 4).map((c) => (
                                            <div
                                              key={c.name}
                                              style={{ color: DEFAULT_COLORS.TEXT_MUTED }}
                                            >
                                              {c.name}: {c.cpu} {WM.CPU_ABBREV} {WM.MID_DOT}{' '}
                                              {c.memory} {WM.MEMORY_ABBREV}
                                            </div>
                                          ))}
                                          {inst.containers.length > 4 ? (
                                            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                                              +{inst.containers.length - 4}{' '}
                                              {WM.MORE_CONTAINERS_SUFFIX}
                                            </div>
                                          ) : null}
                                        </div>
                                      ) : null}
                                    </div>
                                  ))}
                                  {w.usage.resources.usagePerInstance.length > 3 ? (
                                    <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                                      {WM.SHOWING_FIRST_INSTANCES}{' '}
                                      {w.usage.resources.usagePerInstance.length}.
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}
                            </>
                          )}
                        </ColumnShell>
                      </div>
                    ),
                  };
                })}
              />
              {sections.metrics.workloads.length > 25 ? (
                <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, paddingTop: 4 }}>
                  {APPLICATIONS_UI.SECTIONS.RESOURCES.SHOWING_FIRST} 25 of{' '}
                  {sections.metrics.workloads.length}.
                </div>
              ) : null}
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.TITLE}
          description={APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DESCRIPTION}
        >
          {sections.changeLog.length === 0 ? (
            <ApplicationSectionEmptyState
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
                                text={`${APPLICATIONS_UI.SECTIONS.CHANGE_LOG.GEN}: ${entry.generation}`}
                                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                                color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                                fontSize={11}
                              />
                              <RowTag
                                text={entry.changeClass}
                                {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                              />
                              <RowTag
                                text={`severity: ${entry.severity}`}
                                background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                                color={DEFAULT_COLORS.TEXT_SECONDARY}
                                fontSize={11}
                              />
                              {suffix ? (
                                <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
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
                                {entry.changes.slice(0, 5).map((c, idx) =>
                                  (() => {
                                    const hasOldValue =
                                      c.oldValue != null && String(c.oldValue).length > 0;
                                    const hasNewValue =
                                      c.newValue != null && String(c.newValue).length > 0;
                                    return (
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
                                        {hasOldValue ? (
                                          <span
                                            style={{
                                              color: DEFAULT_COLORS.TEXT_MUTED,
                                              textDecoration: 'line-through',
                                            }}
                                          >
                                            {String(c.oldValue)}
                                          </span>
                                        ) : null}
                                        {hasOldValue && hasNewValue ? (
                                          <span
                                            style={{
                                              margin: '0 6px',
                                              color: DEFAULT_COLORS.TEXT_MUTED,
                                            }}
                                          >
                                            {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
                                          </span>
                                        ) : null}
                                        {hasNewValue ? (
                                          <span style={{ fontWeight: 700 }}>
                                            {String(c.newValue)}
                                          </span>
                                        ) : !hasOldValue ? (
                                          <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                                            {c.description}
                                          </span>
                                        ) : null}
                                      </div>
                                    );
                                  })(),
                                )}
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

function MutedText({ value }: { value: string }) {
  return <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{value}</div>;
}

function filterMetricEntries(
  values: Record<string, number | string> | undefined | null,
): [string, number | string][] {
  return Object.entries(values || {}).filter(([key, value]) => {
    return key.trim() !== '-' && String(value).trim() !== '-';
  });
}
