import React, { memo, useMemo } from 'react';
import { Tag } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { Application } from '../../models';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationDetailsContentProps {
  application: Application;
}

const ApplicationDetailsContent: React.FC<ApplicationDetailsContentProps> = memo(({ application }) => {
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
        { k: 'resources', label: APPLICATIONS_UI.CARD.LABELS.RESOURCES, value: application.resourceCount ?? 0 },
        { k: 'namespaces', label: APPLICATIONS_UI.CARD.LABELS.NAMESPACES, value: application.namespaces?.total ?? 0 },
        { k: 'createdAt', label: APPLICATIONS_UI.CARD.LABELS.CREATED_AT, value: created },
        { k: 'lastUpdated', label: APPLICATIONS_UI.CARD.LABELS.LAST_UPDATED, value: updated },
        ...(application.crStatus ? [{ k: 'crStatus', label: APPLICATIONS_UI.CARD.LABELS.CR_STATUS, value: application.crStatus }] : []),
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.OVERVIEW.TITLE}
        description={APPLICATIONS_UI.SECTIONS.OVERVIEW.DESCRIPTION}
      >
        <KeyValueGrid rows={sections.overviewRows} />
        {application.health?.reason ? (
          <div style={{ marginTop: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 13, lineHeight: 1.5 }}>
            {application.health.reason}
          </div>
        ) : null}
      </SettingsCard>

      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.TITLE}
        description={APPLICATIONS_UI.SECTIONS.RESOURCE_SUMMARY.DESCRIPTION}
      >
        <KeyValueGrid
          rows={[
            { k: 'Deployment', label: 'Deployment', value: sections.resourceSummary?.Deployment ?? 0 },
            { k: 'StatefulSet', label: 'StatefulSet', value: sections.resourceSummary?.StatefulSet ?? 0 },
            { k: 'DaemonSet', label: 'DaemonSet', value: sections.resourceSummary?.DaemonSet ?? 0 },
            { k: 'Job', label: 'Job', value: sections.resourceSummary?.Job ?? 0 },
            { k: 'CronJob', label: 'CronJob', value: sections.resourceSummary?.CronJob ?? 0 },
            { k: 'Service', label: 'Service', value: sections.resourceSummary?.Service ?? 0 },
            { k: 'Ingress', label: 'Ingress', value: sections.resourceSummary?.Ingress ?? 0 },
            { k: 'NetworkPolicy', label: 'NetworkPolicy', value: sections.resourceSummary?.NetworkPolicy ?? 0 },
            { k: 'ServiceAccount', label: 'ServiceAccount', value: sections.resourceSummary?.ServiceAccount ?? 0 },
            { k: 'ConfigMap', label: 'ConfigMap', value: sections.resourceSummary?.ConfigMap ?? 0 },
            { k: 'Secret', label: 'Secret', value: sections.resourceSummary?.Secret ?? 0 },
            {
              k: 'PersistentVolumeClaim',
              label: 'PersistentVolumeClaim',
              value: sections.resourceSummary?.PersistentVolumeClaim ?? 0,
            },
            {
              k: 'HorizontalPodAutoscaler',
              label: 'HorizontalPodAutoscaler',
              value: sections.resourceSummary?.HorizontalPodAutoscaler ?? 0,
            },
            {
              k: 'VerticalPodAutoscaler',
              label: 'VerticalPodAutoscaler',
              value: sections.resourceSummary?.VerticalPodAutoscaler ?? 0,
            },
          ]}
        />
      </SettingsCard>

      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.NAMESPACES.TITLE}
        description={APPLICATIONS_UI.SECTIONS.NAMESPACES.DESCRIPTION}
      >
        {sections.namespaces.length === 0 ? (
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sections.namespaces.map((ns) => (
              <Tag key={ns.name} color="blue">
                {ns.name} ({ns.resourceCount})
              </Tag>
            ))}
          </div>
        )}
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
              <div key={`${r.namespace}:${r.kind}:${r.name}`} style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{r.namespace}</span> · {r.kind} · {r.name}
              </div>
            ))}
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
              ]}
            />
            {sections.insights.techStack?.length ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sections.insights.techStack.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            ) : null}

            {sections.insights.dependencies?.length ? (
              <div>
                <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  Dependencies
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {sections.insights.dependencies.map((d) => (
                    <Tag key={d}>{d}</Tag>
                  ))}
                </div>
              </div>
            ) : null}

            {sections.insights.risks?.length ? (
              <div>
                <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  Risks
                </div>
                <div style={{ display: 'grid', rowGap: 6 }}>
                  {sections.insights.risks.slice(0, 10).map((r) => (
                    <div key={r} style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.5 }}>
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {sections.insights.suggestions?.length ? (
              <div>
                <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  Suggestions
                </div>
                <div style={{ display: 'grid', rowGap: 6 }}>
                  {sections.insights.suggestions.slice(0, 10).map((s) => (
                    <div key={s} style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_PRIMARY, lineHeight: 1.5 }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {sections.insights.relatedApps?.length ? (
              <div>
                <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                  Related apps
                </div>
                <div style={{ display: 'grid', rowGap: 8 }}>
                  {sections.insights.relatedApps.slice(0, 10).map((a) => (
                    <div
                      key={`${a.name}:${a.reason}`}
                      style={{ border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`, borderRadius: 10, padding: 10 }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                        {a.name}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED, lineHeight: 1.5 }}>
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
      </SettingsCard>

      <SettingsCard title="Workload metrics" description="Per-workload baseline and usage (when available).">
        {!sections.metrics?.workloads?.length ? (
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <div style={{ display: 'grid', rowGap: 10 }}>
            {sections.metrics.workloads.slice(0, 25).map((w) => (
              <div
                key={`${w.namespace}:${w.resourceKind}:${w.resourceName}`}
                style={{
                  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                      {w.resourceName}
                    </div>
                    <div style={{ marginTop: 2, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                      {w.namespace} · {w.resourceKind}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                    {w.usage?.timestamp ? <TimeAgo date={w.usage.timestamp} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      Baseline
                    </div>
                    <KeyValueGrid
                      rows={[
                        { k: 'fingerprint', label: 'Fingerprint', value: w.baseline?.fingerprint || APPLICATIONS_UI.FALLBACKS.EMPTY },
                        { k: 'replicas', label: 'Replicas', value: w.baseline?.replicas ?? 0 },
                        {
                          k: 'requests',
                          label: 'Requests',
                          value: `${w.baseline?.requests?.cpu ?? '—'} CPU · ${w.baseline?.requests?.memory ?? '—'} Mem`,
                        },
                        {
                          k: 'limits',
                          label: 'Limits',
                          value: `${w.baseline?.limits?.cpu ?? '—'} CPU · ${w.baseline?.limits?.memory ?? '—'} Mem`,
                        },
                      ]}
                    />
                  </div>

                  <div>
                    <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      Usage
                    </div>
                    {!w.usage?.available ? (
                      <MutedText value="Not available." />
                    ) : (
                      <>
                        <KeyValueGrid
                          rows={[
                            { k: 'qos', label: 'QoS', value: w.usage?.qos || APPLICATIONS_UI.FALLBACKS.EMPTY },
                            {
                              k: 'totalCpu',
                              label: 'Total CPU',
                              value: w.usage?.resources?.totalCpu || APPLICATIONS_UI.FALLBACKS.EMPTY,
                            },
                            {
                              k: 'totalMemory',
                              label: 'Total memory',
                              value: w.usage?.resources?.totalMemory || APPLICATIONS_UI.FALLBACKS.EMPTY,
                            },
                          ]}
                        />

                        {w.usage?.resources?.usagePerInstance?.length ? (
                          <div style={{ marginTop: 8, display: 'grid', rowGap: 8 }}>
                            {w.usage.resources.usagePerInstance.slice(0, 3).map((i) => (
                              <div key={i.name} style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                                <div style={{ fontWeight: 700 }}>
                                  {i.name}{' '}
                                  <span style={{ fontWeight: 500, color: DEFAULT_COLORS.TEXT_MUTED }}>
                                    ({i.totalCpu} CPU · {i.totalMemory} Mem)
                                  </span>
                                </div>
                                {i.containers?.length ? (
                                  <div style={{ marginTop: 4, display: 'grid', rowGap: 3 }}>
                                    {i.containers.slice(0, 4).map((c) => (
                                      <div key={c.name} style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
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
                              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                                Showing first 3 instances of {w.usage.resources.usagePerInstance.length}.
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sections.metrics.workloads.length > 25 ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                Showing first 25 of {sections.metrics.workloads.length}.
              </div>
            ) : null}
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.RUNTIME.TITLE}
        description={APPLICATIONS_UI.SECTIONS.RUNTIME.DESCRIPTION}
      >
        <KeyValueGrid
          rows={[
            {
              k: 'ports',
              label: APPLICATIONS_UI.SECTIONS.RUNTIME.PORTS,
              value: sections.ports.length ? sections.ports.join(', ') : APPLICATIONS_UI.FALLBACKS.EMPTY,
            },
            {
              k: 'images',
              label: APPLICATIONS_UI.SECTIONS.RUNTIME.IMAGES,
              value: sections.images.length ? sections.images.length : APPLICATIONS_UI.FALLBACKS.EMPTY,
            },
            {
              k: 'env',
              label: APPLICATIONS_UI.SECTIONS.RUNTIME.ENV_VAR_KEYS,
              value: sections.envVarKeys.length ? sections.envVarKeys.length : APPLICATIONS_UI.FALLBACKS.EMPTY,
            },
          ]}
        />
      </SettingsCard>

      <SettingsCard
        title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.TITLE}
        description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
      >
        {sections.snapshots.length === 0 ? (
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <div style={{ display: 'grid', rowGap: 10 }}>
            {sections.snapshots.slice(0, 20).map((s) => (
              <div
                key={s.id}
                style={{ border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`, borderRadius: 10, padding: 10 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                    {s.namespace} · {s.changeClass} · {s.severity}
                  </div>
                  <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                    <TimeAgo date={s.takenAt} />
                  </div>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, wordBreak: 'break-word' }}>
                  {s.path}
                </div>
              </div>
            ))}
            {sections.snapshots.length > 20 ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {APPLICATIONS_UI.SECTIONS.SNAPSHOTS.SHOWING_FIRST} 20 of {sections.snapshots.length}.
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
          <MutedText value={APPLICATIONS_UI.FALLBACKS.EMPTY} />
        ) : (
          <div style={{ display: 'grid', rowGap: 10 }}>
            {sections.changeLog.slice(0, 20).map((entry) => (
              <div
                key={`${entry.generation}:${entry.fingerprint}`}
                style={{
                  border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontWeight: 700, color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 13 }}>
                    {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.GEN} {entry.generation} · {entry.changeClass} · {entry.severity}
                  </div>
                  <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                    <TimeAgo date={entry.detectedAt} />
                  </div>
                </div>
                {entry.changes?.length ? (
                  <div style={{ marginTop: 8, display: 'grid', rowGap: 6 }}>
                    {entry.changes.slice(0, 5).map((c, idx) => (
                      <div key={`${entry.fingerprint}:${idx}`} style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                        <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{c.changeType}</span> · {c.field} — {c.description}
                      </div>
                    ))}
                    {entry.changes.length > 5 ? (
                      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                        {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} 5 of {entry.changes.length} changes.
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
            {sections.changeLog.length > 20 ? (
              <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.SHOWING_FIRST} 20 of {sections.changeLog.length} entries.
              </div>
            ) : null}
          </div>
        )}
      </SettingsCard>
    </div>
  );
});

ApplicationDetailsContent.displayName = 'ApplicationDetailsContent';

export default ApplicationDetailsContent;

function MutedText({ value }: { value: string }) {
  return <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{value}</div>;
}

function KeyValueGrid({ rows }: { rows: Array<{ k: string; label: string; value: React.ReactNode }> }) {
  return (
    <div style={{ display: 'grid', rowGap: 10 }}>
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12 }}>
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, fontWeight: 700 }}>{r.label}</div>
          <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 13, minWidth: 0 }}>{r.value}</div>
        </div>
      ))}
    </div>
  );
}

