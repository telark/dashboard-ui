import React, { useCallback, useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { Application, ApplicationSnapshotSummary } from '../../models';
import { APPLICATIONS_UI } from '../../constants/texts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../store';
import {
  fetchApplicationSnapshotsThunk,
  fetchSnapshotManifestThunk,
  triggerApplicationRollbackThunk,
} from '../../store';
import {
  applicationSnapshotStableKey,
  mergeApplicationSnapshotSources,
} from '../../utils/mergeApplicationSnapshotSources';
import ApplicationSnapshotRow from '../snapshots/ApplicationSnapshotRow';
import ApplicationSnapshotManifestSlideOut from '../snapshots/ApplicationSnapshotManifestSlideOut';
import SnapshotAggregateStorageBar from '../snapshots/SnapshotAggregateStorageBar';
import { getCurrentUser } from '../../../../auth/utils';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;

export interface ManageRollbacksPanelProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  detailSnapshots: Application['snapshots'];
}

const ManageRollbacksPanel: React.FC<ManageRollbacksPanelProps> = ({
  open,
  onClose,
  applicationId,
  detailSnapshots,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snapshots, snapshotsLoading, snapshotsError, snapshotManifests } = useSelector(
    (s: RootState) => s.applications,
  );
  const [expanded, setExpanded] = useState(false);
  const [activeManifestKey, setActiveManifestKey] = useState<string | null>(null);
  const [rollbackBusyId, setRollbackBusyId] = useState<string | null>(null);
  const snapUi = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

  const mergedSnapshots = useMemo(
    () => mergeApplicationSnapshotSources(detailSnapshots, snapshots),
    [detailSnapshots, snapshots],
  );

  const manifestState = activeManifestKey ? snapshotManifests[activeManifestKey] : undefined;

  const activeRowTitle = useMemo(() => {
    if (!activeManifestKey) return '';
    const row = mergedSnapshots.find((s) => applicationSnapshotStableKey(s) === activeManifestKey);
    return row?.id ?? '';
  }, [activeManifestKey, mergedSnapshots]);

  const openManifest = useCallback(
    (summary: ApplicationSnapshotSummary) => {
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
    },
    [applicationId, dispatch],
  );

  const handleRollbackRequest = useCallback(
    (summary: ApplicationSnapshotSummary) => {
      Modal.confirm({
        title: snapUi.ROLLBACK_CONFIRM_TITLE,
        content: snapUi.ROLLBACK_CONFIRM_CONTENT,
        okText: snapUi.ROLLBACK_CONFIRM_OK,
        cancelText: APPLICATIONS_UI.CARD.ACTIONS.CANCEL,
        onOk: async () => {
          const triggeredBy = getCurrentUser()?.username?.trim();
          if (!triggeredBy) {
            message.error(snapUi.ROLLBACK_USER_REQUIRED);
            return;
          }
          const busyKey = applicationSnapshotStableKey(summary);
          setRollbackBusyId(busyKey);
          try {
            await dispatch(
              triggerApplicationRollbackThunk({
                name: applicationId,
                snapshotGeneration: summary.generation,
                triggeredBy,
              }),
            ).unwrap();
            message.success(snapUi.ROLLBACK_SUCCESS);
            void dispatch(
              fetchApplicationSnapshotsThunk({
                applicationId,
                snapshotRefs: detailSnapshots.length > 0 ? detailSnapshots : undefined,
              }),
            );
          } catch {
            message.error(snapUi.ROLLBACK_FAILED);
          } finally {
            setRollbackBusyId(null);
          }
        },
      });
    },
    [applicationId, detailSnapshots, dispatch, snapUi],
  );

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS}
        subtitle={APPLICATIONS_UI.SECTIONS.SNAPSHOTS.DESCRIPTION}
        width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
        contentOnly
        headerExtra={
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
        }
        formContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!snapshotsLoading && mergedSnapshots.length > 0 ? (
              <div style={{ marginTop: 4 }}>
                <SnapshotAggregateStorageBar snapshots={mergedSnapshots} />
              </div>
            ) : null}

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
                <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
                  {APPLICATIONS_UI.SECTIONS.SNAPSHOTS.EMPTY_DESCRIPTION}
                </div>
              )
            ) : (
              <div>
                {mergedSnapshots.map((s, idx) => (
                  <ApplicationSnapshotRow
                    key={applicationSnapshotStableKey(s)}
                    snapshot={s}
                    showMarginBottom={idx < mergedSnapshots.length - 1}
                    onViewManifest={openManifest}
                    onRollback={handleRollbackRequest}
                    rollbackLoading={rollbackBusyId === applicationSnapshotStableKey(s)}
                  />
                ))}
              </div>
            )}
          </div>
        }
      />

      <ApplicationSnapshotManifestSlideOut
        open={activeManifestKey != null}
        manifestKey={activeManifestKey}
        onClose={() => setActiveManifestKey(null)}
        title={activeRowTitle}
        manifestState={manifestState}
      />
    </>
  );
};

ManageRollbacksPanel.displayName = 'ManageRollbacksPanel';

export default ManageRollbacksPanel;
