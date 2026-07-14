import React, { memo, useMemo, useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import SettingsCard from '../../../../settings/components/SettingsCard';
import { APPLICATIONS_UI } from '../../constants';
import ApplicationSectionEmptyState from '../../components/display/ApplicationSectionEmptyState';
import ApplicationSnapshotManifestSlideOut from '../../components/snapshots/ApplicationSnapshotManifestSlideOut';
import ApplicationSnapshotRow from '../../components/snapshots/ApplicationSnapshotRow';
import SnapshotAggregateStorageBar from '../../components/snapshots/SnapshotAggregateStorageBar';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';
import { applicationSnapshotStableKey } from '../../utils/mergeApplicationSnapshotSources';

export interface ApplicationSnapshotsProps {
  snapshots: ApplicationSnapshotSummary[];
  loading: boolean;
  error: string | null;
  snapshotManifests: Record<string, SnapshotManifestState>;
  onViewManifest: (summary: ApplicationSnapshotSummary) => void;
}

const ApplicationSnapshots: React.FC<ApplicationSnapshotsProps> = memo(
  ({ snapshots, loading, error, snapshotManifests, onViewManifest }) => {
    const [activeManifestKey, setActiveManifestKey] = useState<string | null>(null);

    const manifestState = activeManifestKey ? snapshotManifests[activeManifestKey] : undefined;

    const activeRowTitle = useMemo(() => {
      if (!activeManifestKey) return '';
      const row = snapshots.find((s) => applicationSnapshotStableKey(s) === activeManifestKey);
      return row?.id ?? '';
    }, [activeManifestKey, snapshots]);

    const openManifest = (summary: ApplicationSnapshotSummary) => {
      setActiveManifestKey(applicationSnapshotStableKey(summary));
      onViewManifest(summary);
    };

    return (
      <>
        <SettingsCard
          title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.TITLE}
          description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
          headerAction={
            !loading && snapshots.length > 0 ? (
              <SnapshotAggregateStorageBar snapshots={snapshots} />
            ) : null
          }
        >
          {loading ? (
            <div style={{ display: 'grid', rowGap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 44,
                    borderRadius: 8,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
                    background: DEFAULT_COLORS.SURFACE_ELEVATED_HOVER,
                  }}
                />
              ))}
            </div>
          ) : error ? (
            <div style={{ fontSize: 13, color: DEFAULT_COLORS.DANGER }}>{error}</div>
          ) : snapshots.length === 0 ? (
            <ApplicationSectionEmptyState
              icon={<CameraOutlined style={{ fontSize: 24 }} />}
              title={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_TITLE}
              description={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_DESCRIPTION}
            />
          ) : (
            <div>
              {snapshots.map((s, idx) => (
                <ApplicationSnapshotRow
                  key={applicationSnapshotStableKey(s)}
                  snapshot={s}
                  showMarginBottom={idx < snapshots.length - 1}
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
  },
);

ApplicationSnapshots.displayName = 'ApplicationSnapshots';

export default ApplicationSnapshots;
