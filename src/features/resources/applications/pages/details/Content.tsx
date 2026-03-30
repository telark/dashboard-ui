import React, { memo, useMemo, useState } from 'react';
import {
  CameraOutlined,
  CopyOutlined,
  EyeOutlined,
  HistoryOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { Application } from '../../models';
import { APPLICATIONS_UI } from '../../constants';
import RowTag from '../../../../../components/display/table/RowTag';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import ApplicationSectionEmptyState from '../../components/display/ApplicationSectionEmptyState';
import TabButton from '../../../../../components/display/buttons/TabButton';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../store';
import { fetchSnapshotManifestThunk } from '../../store';
import yaml from 'js-yaml';

interface ApplicationDetailsContentProps {
  application: Application;
}

const RESOURCE_SUMMARY_KEY_ORDER: (keyof Application['resourceSummary'])[] = [
  'Deployment',
  'StatefulSet',
  'DaemonSet',
  'Job',
  'CronJob',
  'Service',
  'Ingress',
  'NetworkPolicy',
  'ServiceAccount',
  'ConfigMap',
  'Secret',
  'PersistentVolumeClaim',
  'HorizontalPodAutoscaler',
  'VerticalPodAutoscaler',
];

function getChangeLogDotColor(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes('critical')) return DEFAULT_COLORS.DANGER;
  if (s.includes('high')) return CONNECTIVITY_CONSTANTS.COLORS.WARNING;
  return DEFAULT_COLORS.TEXT_MUTED;
}

const OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 10,
};

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

      return {
        overviewRows: [
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
            k: 'resources',
            label: APPLICATIONS_UI.CARD.LABELS.RESOURCES,
            value: application.resourceCount ?? 0,
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
        insights: application.insights,
        namespaces: application.namespaces?.items || [],
        resources: application.resources || [],
        resourceSummary: application.resourceSummary,
        images: application.images || [],
        ports: application.ports || [],
        envVarKeys: application.envVarKeys || [],
        snapshots: application.snapshots || [],
        metrics: application.metrics,
        changeLog: application.history?.changeLog || [],
      };
    }, [application]);

    const resourceSummaryRows = useMemo(() => {
      const rs = application.resourceSummary;
      if (!rs) return [];
      return RESOURCE_SUMMARY_KEY_ORDER.filter((k) => (rs[k] ?? 0) >= 1).map((k) => ({
        k: String(k),
        label: String(k),
        value: rs[k] as number,
      }));
    }, [application.resourceSummary]);

    const overviewResourcesRuntimeTitle = `${APPLICATIONS_UI.SECTIONS.OVERVIEW.TITLE} / ${APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.TITLE} / ${APPLICATIONS_UI.SECTIONS.RUNTIME.TITLE}`;
    const overviewResourcesRuntimeDescription = `${APPLICATIONS_UI.SECTIONS.OVERVIEW.DESCRIPTION} ${APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.DESCRIPTION} ${APPLICATIONS_UI.SECTIONS.RUNTIME.DESCRIPTION}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SettingsCard
          title={overviewResourcesRuntimeTitle}
          description={overviewResourcesRuntimeDescription}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>
                {APPLICATIONS_UI.SECTIONS.OVERVIEW.TITLE}
              </div>
              <KeyValueGrid compact rows={sections.overviewRows} />
              <div style={{ marginTop: 10 }}>
                <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>
                  {APPLICATIONS_UI.SECTIONS.NAMESPACES.TITLE}
                </div>
                {sections.namespaces.length === 0 ? (
                  <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {sections.namespaces.map((ns) => (
                      <RowTag
                        key={ns.name}
                        text={`${ns.name} (${ns.resourceCount})`}
                        background={DEFAULT_COLORS.CHIP_BLUE_BG}
                        color={DEFAULT_COLORS.CHIP_BLUE_TEXT}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12 }}>
                <KeyValueGrid
                  compact
                  rows={[
                    {
                      k: 'managedChart',
                      label: 'Managed chart',
                      value: application.managed?.chart || APPLICATIONS_UI.FALLBACKS.EMPTY,
                    },
                    {
                      k: 'managedVersion',
                      label: 'Managed version',
                      value: application.managed?.version || APPLICATIONS_UI.FALLBACKS.EMPTY,
                    },
                    {
                      k: 'historyGeneration',
                      label: 'History generation',
                      value: application.history?.generation ?? 0,
                    },
                    {
                      k: 'historyDrift',
                      label: 'Has drift',
                      value: application.history?.hasDrift ? 'Yes' : 'No',
                    },
                    {
                      k: 'lastModifiedBy',
                      label: 'Last modified by',
                      value: application.history?.lastModifiedBy || APPLICATIONS_UI.FALLBACKS.EMPTY,
                    },
                    {
                      k: 'lastModifiedAt',
                      label: 'Last modified at',
                      value: application.history?.lastModifiedAt ? (
                        <TimeAgo date={application.history.lastModifiedAt} />
                      ) : (
                        APPLICATIONS_UI.FALLBACKS.EMPTY
                      ),
                    },
                  ]}
                />
              </div>
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
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>
                {APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.TITLE}
              </div>
              {resourceSummaryRows.length === 0 ? (
                <MutedText value={APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.EMPTY} />
              ) : (
                <KeyValueGrid
                  compact
                  rows={resourceSummaryRows.map((r) => ({
                    k: r.k,
                    label: r.label,
                    value: r.value,
                  }))}
                />
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={OVERVIEW_RESOURCE_COLUMN_LABEL_STYLE}>
                {APPLICATIONS_UI.SECTIONS.RUNTIME.TITLE}
              </div>
              <KeyValueGrid
                compact
                rows={[
                  {
                    k: 'ports',
                    label: APPLICATIONS_UI.SECTIONS.RUNTIME.PORTS,
                    value: sections.ports.length
                      ? sections.ports.join(', ')
                      : APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                  {
                    k: 'images',
                    label: APPLICATIONS_UI.SECTIONS.RUNTIME.IMAGES,
                    value: sections.images.length
                      ? sections.images.length
                      : APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                  {
                    k: 'env',
                    label: APPLICATIONS_UI.SECTIONS.RUNTIME.ENV_VAR_KEYS,
                    value: sections.envVarKeys.length
                      ? sections.envVarKeys.length
                      : APPLICATIONS_UI.FALLBACKS.EMPTY,
                  },
                ]}
              />
              <div style={{ marginTop: 12, display: 'grid', rowGap: 10 }}>
                <div>
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.RUNTIME.IMAGES}
                  </div>
                  {sections.images.length === 0 ? (
                    <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
                  ) : (
                    <div style={{ display: 'grid', rowGap: 5 }}>
                      {sections.images.slice(0, 8).map((img) => (
                        <div
                          key={img}
                          style={{
                            fontSize: 12,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            wordBreak: 'break-word',
                          }}
                        >
                          {img}
                        </div>
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
                  <div
                    style={{
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {APPLICATIONS_UI.SECTIONS.RUNTIME.ENV_VAR_KEYS}
                  </div>
                  {sections.envVarKeys.length === 0 ? (
                    <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {sections.envVarKeys.slice(0, 20).map((key) => (
                        <RowTag
                          key={key}
                          text={key}
                          background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                          color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                        />
                      ))}
                      {sections.envVarKeys.length > 20 ? (
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                          +{sections.envVarKeys.length - 20} more
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.RESOURCES.TITLE}
          description={APPLICATIONS_UI.SECTIONS.RESOURCES.DESCRIPTION}
        >
          {sections.resources.length === 0 ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
          ) : (
            <div style={{ display: 'grid', rowGap: 8 }}>
              {sections.resources.slice(0, 50).map((r) => (
                <div
                  key={`${r.namespace}:${r.kind}:${r.name}`}
                  style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY }}
                >
                  <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{r.namespace}</span> · {r.kind}{' '}
                  · {r.name}
                </div>
              ))}
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
        >
          {!sections.insights || !sections.insights.enriched ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.NOT_ENRICHED} />
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
                    label: 'Prompt version',
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
                    Dependencies
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
                    Risks
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
                    Suggestions
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
                    Related apps
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
          <KeyValueGrid
            compact
            rows={[
              {
                k: 'totalChanges',
                label: APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_CHANGES,
                value: sections.metrics?.derived?.totalChanges ?? 0,
              },
              {
                k: 'snapshotCount',
                label: APPLICATIONS_UI.SECTIONS.METRICS.SNAPSHOT_COUNT,
                value: sections.metrics?.derived?.snapshotCount ?? 0,
              },
              {
                k: 'uniqueFingerprints',
                label: APPLICATIONS_UI.SECTIONS.METRICS.UNIQUE_FINGERPRINTS,
                value: sections.metrics?.derived?.uniqueFingerprints ?? 0,
              },
              {
                k: 'changeVelocity',
                label: APPLICATIONS_UI.SECTIONS.METRICS.CHANGE_VELOCITY,
                value: sections.metrics?.derived?.changeVelocityPerDay ?? 0,
              },
              {
                k: 'firstChange',
                label: APPLICATIONS_UI.SECTIONS.METRICS.FIRST_CHANGE,
                value: sections.metrics?.derived?.firstChangeDetectedAt ? (
                  <TimeAgo date={sections.metrics.derived.firstChangeDetectedAt} />
                ) : (
                  APPLICATIONS_UI.FALLBACKS.EMPTY
                ),
              },
              {
                k: 'lastChange',
                label: APPLICATIONS_UI.SECTIONS.METRICS.LAST_CHANGE,
                value: sections.metrics?.derived?.lastChangeDetectedAt ? (
                  <TimeAgo date={sections.metrics.derived.lastChangeDetectedAt} />
                ) : (
                  APPLICATIONS_UI.FALLBACKS.EMPTY
                ),
              },
              {
                k: 'totalIncidents',
                label: APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_INCIDENTS,
                value: sections.metrics?.derived?.totalIncidents ?? 0,
              },
              {
                k: 'totalRecoveries',
                label: APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_RECOVERIES,
                value: sections.metrics?.derived?.totalRecoveries ?? 0,
              },
            ]}
          />
          <div style={{ marginTop: 12, display: 'grid', rowGap: 12 }}>
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
                      background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                      color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                    />
                  ))}
                </div>
              )}
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
                {APPLICATIONS_UI.SECTIONS.METRICS.CHANGES_BY_SEVERITY}
              </div>
              {Object.keys(sections.metrics?.derived?.changesBySeverity || {}).length === 0 ? (
                <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(sections.metrics.derived.changesBySeverity).map(
                    ([key, value]) => (
                      <RowTag
                        key={key}
                        text={`${key}: ${value}`}
                        background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                        color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.DESCRIPTION}
        >
          {!sections.metrics?.workloads?.length ? (
            <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
          ) : (
            <div>
              {sections.metrics.workloads.slice(0, 25).map((w, wIdx) => {
                const showDivider = wIdx < Math.min(sections.metrics.workloads.length, 25) - 1;
                return (
                  <div
                    key={`${w.namespace}:${w.resourceKind}:${w.resourceName}`}
                    style={{
                      paddingTop: wIdx === 0 ? 0 : 10,
                      paddingBottom: 10,
                      borderBottom: showDivider
                        ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`
                        : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          marginTop: 5,
                          flexShrink: 0,
                          background: DEFAULT_COLORS.TEXT_MUTED,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            lineHeight: 1.4,
                          }}
                        >
                          {w.resourceName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: DEFAULT_COLORS.TEXT_MUTED,
                            marginTop: 2,
                            lineHeight: 1.35,
                          }}
                        >
                          {w.namespace} · {w.resourceKind}
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                            gap: 16,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontSize: 12,
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.BASELINE}
                            </div>
                            <KeyValueGrid
                              compact
                              rows={[
                                {
                                  k: 'fingerprint',
                                  label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.FINGERPRINT,
                                  value: w.baseline?.fingerprint || APPLICATIONS_UI.FALLBACKS.EMPTY,
                                },
                                {
                                  k: 'replicas',
                                  label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.REPLICAS,
                                  value: w.baseline?.replicas ?? 0,
                                },
                                {
                                  k: 'requests',
                                  label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.REQUESTS,
                                  value: `${w.baseline?.requests?.cpu ?? '—'} CPU · ${w.baseline?.requests?.memory ?? '—'} Mem`,
                                },
                                {
                                  k: 'limits',
                                  label: APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.LIMITS,
                                  value: `${w.baseline?.limits?.cpu ?? '—'} CPU · ${w.baseline?.limits?.memory ?? '—'} Mem`,
                                },
                              ]}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                color: DEFAULT_COLORS.TEXT_MUTED,
                                fontSize: 12,
                                fontWeight: 700,
                                marginBottom: 6,
                              }}
                            >
                              {APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.USAGE}
                            </div>
                            {!w.usage?.available ? (
                              <MutedText
                                value={APPLICATIONS_UI.SECTIONS.WORKLOAD_METRICS.NOT_AVAILABLE}
                              />
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
                      <div
                        style={{
                          fontSize: 12,
                          color: DEFAULT_COLORS.TEXT_MUTED,
                          flexShrink: 0,
                          textAlign: 'right',
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

        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
        >
          <SnapshotsSection />
        </SettingsCard>

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
              {sections.changeLog.slice(0, 20).map((entry, entryIndex) => {
                const dotColor = getChangeLogDotColor(entry.severity);
                const suffixParts: string[] = [];
                if (entry.isIncident) suffixParts.push('Incident');
                if (entry.isRecovery) suffixParts.push('Recovery');
                if (entry.isLastOne) suffixParts.push('Latest');
                const suffix = suffixParts.length > 0 ? ` · ${suffixParts.join(' · ')}` : '';
                const showDivider = entryIndex < Math.min(sections.changeLog.length, 20) - 1;

                return (
                  <div
                    key={`${entry.generation}:${entry.fingerprint}`}
                    style={{
                      paddingTop: entryIndex === 0 ? 0 : 10,
                      paddingBottom: 10,
                      borderBottom: showDivider
                        ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`
                        : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
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
                            fontSize: 13,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            lineHeight: 1.4,
                          }}
                        >
                          {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.GEN} {entry.generation} ·{' '}
                          {entry.changeClass} · {entry.severity}
                          {suffix}
                        </div>
                        {(entry.changedBy || entry.fingerprint) && (
                          <div
                            style={{
                              fontSize: 12,
                              color: DEFAULT_COLORS.TEXT_MUTED,
                              marginTop: 4,
                              lineHeight: 1.35,
                            }}
                          >
                            {entry.changedBy ? <span>By {entry.changedBy}</span> : null}
                            {entry.changedBy && entry.fingerprint ? <span> · </span> : null}
                            {entry.fingerprint ? <span>{entry.fingerprint}</span> : null}
                          </div>
                        )}
                        {entry.changes?.length ? (
                          <div style={{ marginTop: 6 }}>
                            {entry.changes.slice(0, 5).map((c, idx) => (
                              <div
                                key={`${entry.fingerprint}:${idx}`}
                                style={{
                                  fontSize: 12,
                                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                                  lineHeight: 1.45,
                                  marginTop: idx === 0 ? 0 : 4,
                                }}
                              >
                                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                                  {c.changeType}
                                </span>{' '}
                                · {c.field}: {c.description}
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

function SnapshotsSection(): React.ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const { snapshots, snapshotsLoading, snapshotsError, snapshotManifests } = useSelector(
    (s: RootState) => s.applications,
  );
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'json' | 'yaml'>('json');

  const manifestState = activeSnapshotId ? snapshotManifests[activeSnapshotId] : undefined;

  const jsonText = (() => {
    if (!manifestState?.data) return '';
    try {
      return JSON.stringify(manifestState.data, null, 2);
    } catch {
      return String(manifestState.data);
    }
  })();

  const yamlText = (() => {
    if (!manifestState?.data) return '';
    try {
      return yaml.dump(manifestState.data, { noRefs: true });
    } catch {
      return '';
    }
  })();

  const handleCopy = async () => {
    const text = activeTab === 'json' ? jsonText : yamlText;
    if (!text) return;
    await navigator.clipboard.writeText(text);
  };

  const openManifest = (snapshotId: string) => {
    setActiveSnapshotId(snapshotId);
    setActiveTab('json');
    void dispatch(fetchSnapshotManifestThunk({ snapshotId }));
  };

  return (
    <>
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
      ) : snapshotsError ? (
        <div style={{ fontSize: 13, color: DEFAULT_COLORS.DANGER }}>{snapshotsError}</div>
      ) : snapshots.length === 0 ? (
        <ApplicationSectionEmptyState
          icon={<CameraOutlined style={{ fontSize: 24 }} />}
          title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_TITLE}
          description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_DESCRIPTION}
        />
      ) : (
        <div>
          {snapshots.map((s, idx) => {
            const showDivider = idx < snapshots.length - 1;
            const truncatedId = s.id.length > 24 ? `${s.id.slice(0, 10)}…${s.id.slice(-10)}` : s.id;
            return (
              <div
                key={s.id}
                style={{
                  paddingTop: idx === 0 ? 0 : 10,
                  paddingBottom: 10,
                  borderBottom: showDivider ? `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}` : 'none',
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      marginTop: 5,
                      flexShrink: 0,
                      background: DEFAULT_COLORS.TEXT_MUTED,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.4 }}
                    >
                      <span
                        style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700 }}
                      >
                        ID
                      </span>{' '}
                      <Tooltip title={s.id}>
                        <span style={{ fontWeight: 700 }}>{truncatedId}</span>
                      </Tooltip>
                      <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> · </span>
                      <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Size</span>{' '}
                      <span style={{ fontWeight: 600 }}>{s.size}</span>
                      <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> · </span>
                      <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Consumed</span>{' '}
                      <span style={{ fontWeight: 600 }}>{s.consumed}</span>
                    </div>
                    {(s.pvcTotal || s.pvcAvailable) && (
                      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, marginTop: 4 }}>
                        {s.pvcAvailable ? `Available ${s.pvcAvailable}` : null}
                        {s.pvcAvailable && s.pvcTotal ? ' · ' : null}
                        {s.pvcTotal ? `Total ${s.pvcTotal}` : null}
                      </div>
                    )}
                  </div>
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => openManifest(s.id)}
                  >
                    View Manifest
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={activeSnapshotId != null}
        title="Manifest"
        footer={null}
        onCancel={() => setActiveSnapshotId(null)}
        width={760}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <TabButton
            label="JSON"
            active={activeTab === 'json'}
            onClick={() => setActiveTab('json')}
          />
          <TabButton
            label="YAML"
            active={activeTab === 'yaml'}
            onClick={() => setActiveTab('yaml')}
          />
        </div>
        <div
          style={{
            border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
            borderRadius: 10,
            background: DEFAULT_COLORS.BACKGROUND_LIGHT,
            padding: 12,
            position: 'relative',
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => void handleCopy()}
            style={{ position: 'absolute', top: 8, right: 8 }}
            disabled={!activeSnapshotId || !(activeTab === 'json' ? jsonText : yamlText)}
          >
            Copy
          </Button>
          {!activeSnapshotId ? null : manifestState?.loading ? (
            <div
              style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 13, display: 'flex', gap: 8 }}
            >
              <LoadingOutlined /> Loading…
            </div>
          ) : manifestState?.error ? (
            <div style={{ color: DEFAULT_COLORS.DANGER, fontSize: 13 }}>{manifestState.error}</div>
          ) : (
            <pre
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.5,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                paddingTop: 28,
              }}
            >
              {activeTab === 'json' ? jsonText : yamlText}
            </pre>
          )}
        </div>
      </Modal>
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
