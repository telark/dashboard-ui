import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../../settings/components/SettingsCard';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import RowTag from '../../../../components/display/table/RowTag';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { StatMiniCard } from '../../pages/details/contentBlocks';
import type { Application } from '../../models';

const groupLabelStyle: React.CSSProperties = {
  color: DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 8,
};

// Drops placeholder "-" keys/values the backend emits for absent buckets, so the
// class/severity chip rows show only real counts.
function filterMetricEntries(
  values: Record<string, number | string> | undefined | null,
): [string, number | string][] {
  return Object.entries(values || {}).filter(
    ([key, value]) => key.trim() !== '-' && String(value).trim() !== '-',
  );
}

const ApplicationMetricsSection: React.FC<{ application: Application }> = memo(
  ({ application }) => {
    const derived = application.metrics?.derived;
    const changesByClass = filterMetricEntries(derived?.changesByClass);
    const changesBySeverity = filterMetricEntries(derived?.changesBySeverity);

    return (
      <SettingsCard
        collapsible
        title={APPLICATIONS_UI.SECTIONS.METRICS.TITLE}
        description={APPLICATIONS_UI.SECTIONS.METRICS.DESCRIPTION}
        headerAction={
          derived?.lastChangeDetectedAt ? (
            <span
              style={{
                fontSize: 12,
                color: DEFAULT_COLORS.TEXT_MUTED,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {APPLICATIONS_UI.SECTIONS.METRICS.LAST_CHANGE}{' '}
              <TimeAgo date={derived.lastChangeDetectedAt} />
            </span>
          ) : undefined
        }
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_CHANGES}
            value={derived?.totalChanges ?? 0}
          />
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.SNAPSHOT_COUNT}
            value={derived?.snapshotCount ?? 0}
          />
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.UNIQUE_FINGERPRINTS}
            value={derived?.uniqueFingerprints ?? 0}
          />
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.CHANGE_VELOCITY}
            value={derived?.changeVelocityPerDay ?? 0}
          />
          {/* Incidents/recoveries join the same tile grid as the other headline
            stats rather than sitting apart as chips; the accent stripe is the
            only thing that marks them as carrying a state. */}
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_INCIDENTS}
            value={derived?.totalIncidents ?? 0}
            accent={
              (derived?.totalIncidents ?? 0) > 0 ? CONNECTIVITY_CONSTANTS.COLORS.WARNING : undefined
            }
          />
          <StatMiniCard
            label={APPLICATIONS_UI.SECTIONS.METRICS.TOTAL_RECOVERIES}
            value={derived?.totalRecoveries ?? 0}
          />
        </div>

        {changesByClass.length > 0 ? (
          <div>
            <div style={groupLabelStyle}>{APPLICATIONS_UI.SECTIONS.METRICS.CHANGES_BY_CLASS}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {changesByClass.map(([key, value]) => (
                <RowTag
                  key={key}
                  text={`${key}: ${value}`}
                  {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                />
              ))}
            </div>
          </div>
        ) : null}

        {changesBySeverity.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <div style={groupLabelStyle}>
              {APPLICATIONS_UI.SECTIONS.METRICS.CHANGES_BY_SEVERITY}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {changesBySeverity.map(([key, value]) => (
                <RowTag key={key} text={`${key}: ${value}`} fontSize={11} />
              ))}
            </div>
          </div>
        ) : null}
      </SettingsCard>
    );
  },
);

ApplicationMetricsSection.displayName = 'ApplicationMetricsSection';

export default ApplicationMetricsSection;
