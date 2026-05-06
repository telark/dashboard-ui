import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CameraOutlined, DiffOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import type { AppDispatch, RootState } from '../../../../../store';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants/texts';
import type { Application, ApplicationSnapshotSummary } from '../../models';
import { applicationSnapshotStableKey } from '../../utils/mergeApplicationSnapshotSources';
import { mergeApplicationSnapshotSources } from '../../utils/mergeApplicationSnapshotSources';
import ApplicationSectionEmptyState from '../display/ApplicationSectionEmptyState';
import ApplicationSnapshotRow from '../snapshots/ApplicationSnapshotRow';
import ApplicationSnapshotManifestSlideOut from '../snapshots/ApplicationSnapshotManifestSlideOut';
import SnapshotCompareView from '../snapshots/SnapshotCompareView';
import { fetchSnapshotManifestThunk, fetchApplicationSnapshotsThunk } from '../../store';
import { selectPermissionsState } from '../../../../auth/store/selectors/permissionsSelectors';
import { triggerApplicationRollbackThunk } from '../../store';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;

export interface ManageSnapshotsPanelProps {
  open: boolean;
  onClose: () => void;
  applicationName: string;
  detailSnapshots: Application['snapshots'];
  rollbackDisabled?: boolean;
}

const ManageSnapshotsPanel: React.FC<ManageSnapshotsPanelProps> = ({
  open,
  onClose,
  applicationName,
  detailSnapshots,
  rollbackDisabled = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { snapshots, snapshotsLoading, snapshotsError, snapshotManifests } = useSelector(
    (s: RootState) => s.applications,
  );
  const { userID } = useSelector(selectPermissionsState);

  const [expanded, setExpanded] = useState(false);
  const [activeManifestKey, setActiveManifestKey] = useState<string | null>(null);
  const [rollbackBusyId, setRollbackBusyId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareKeys, setCompareKeys] = useState<string[]>([]);
  const [compareViewOpen, setCompareViewOpen] = useState(false);
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
          snapshotId: summary.id,
          namespace: summary.namespace,
          generation: summary.generation,
        }),
      );
    },
    [dispatch],
  );

  const selectedCompareSnapshots = useMemo(() => {
    if (compareKeys.length !== 2) return null;
    const a = mergedSnapshots.find((s) => applicationSnapshotStableKey(s) === compareKeys[0]);
    const b = mergedSnapshots.find((s) => applicationSnapshotStableKey(s) === compareKeys[1]);
    if (!a || !b) return null;
    return [a, b] as const;
  }, [compareKeys, mergedSnapshots]);

  const comparePair = useMemo(() => {
    if (!selectedCompareSnapshots) return null;
    const [a, b] = selectedCompareSnapshots;
    return a.generation <= b.generation ? ([a, b] as const) : ([b, a] as const);
  }, [selectedCompareSnapshots]);

  const handleCompareClick = useCallback(() => {
    if (!compareMode) {
      setCompareMode(true);
      setCompareKeys([]);
      setCompareViewOpen(false);
      return;
    }
    if (!compareViewOpen && compareKeys.length === 2 && comparePair) {
      const [older, newer] = comparePair;
      void dispatch(
        fetchSnapshotManifestThunk({
          manifestKey: applicationSnapshotStableKey(older),
          snapshotId: older.id,
          namespace: older.namespace,
          generation: older.generation,
        }),
      );
      void dispatch(
        fetchSnapshotManifestThunk({
          manifestKey: applicationSnapshotStableKey(newer),
          snapshotId: newer.id,
          namespace: newer.namespace,
          generation: newer.generation,
        }),
      );
      setCompareViewOpen(true);
      return;
    }
    setCompareMode(false);
    setCompareKeys([]);
    setCompareViewOpen(false);
  }, [compareKeys.length, compareMode, comparePair, compareViewOpen, dispatch]);

  const handleBackFromCompare = useCallback(() => {
    setCompareViewOpen(false);
    setCompareMode(false);
    setCompareKeys([]);
  }, []);

  const handleToggleCompareRow = useCallback(
    (summary: ApplicationSnapshotSummary, checked: boolean) => {
      const key = applicationSnapshotStableKey(summary);
      setCompareKeys((prev) => {
        const set = new Set(prev);
        if (checked) {
          if (set.size >= 2) return Array.from(set);
          set.add(key);
        } else {
          set.delete(key);
        }
        return Array.from(set);
      });
    },
    [],
  );

  const handleRollbackRequest = useCallback(
    (summary: ApplicationSnapshotSummary) => {
      Modal.confirm({
        title: snapUi.ROLLBACK_CONFIRM_TITLE,
        content: snapUi.ROLLBACK_CONFIRM_CONTENT,
        okText: snapUi.ROLLBACK_CONFIRM_OK,
        cancelText: APPLICATIONS_UI.CARD.ACTIONS.CANCEL,
        onOk: async () => {
          const triggeredBy = userID;
          if (!triggeredBy) {
            message.error(snapUi.ROLLBACK_USER_REQUIRED);
            return;
          }
          const busyKey = applicationSnapshotStableKey(summary);
          setRollbackBusyId(busyKey);
          try {
            await dispatch(
              triggerApplicationRollbackThunk({
                name: applicationName,
                snapshotGeneration: summary.generation,
                triggeredBy,
              }),
            ).unwrap();
            message.success(snapUi.ROLLBACK_SUCCESS);
            void dispatch(
              fetchApplicationSnapshotsThunk({
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
    [applicationName, detailSnapshots, dispatch, snapUi],
  );

  const compareButtonDisabled = compareMode && compareKeys.length === 1;
  const headerToolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [];
    if (compareViewOpen) {
      buttons.push({
        key: 'snapshots',
        label: 'Snapshots',
        icon: <CameraOutlined />,
        variant: 'default',
        onClick: handleBackFromCompare,
      });
    }
    buttons.push({
      key: 'compare',
      label: 'Compare',
      icon: <DiffOutlined />,
      variant: 'default',
      onClick: handleCompareClick,
      disabled: compareButtonDisabled,
    });
    return { buttons };
  }, [compareButtonDisabled, compareViewOpen, handleBackFromCompare, handleCompareClick]);

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      contentOnly
      headerExtra={
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Toolbar config={headerToolbarConfig} />
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
        </div>
      }
      formContent={
        <>
          {compareViewOpen && comparePair ? (
            <SnapshotCompareView
              left={comparePair[0]}
              right={comparePair[1]}
              leftState={snapshotManifests[applicationSnapshotStableKey(comparePair[0])]}
              rightState={snapshotManifests[applicationSnapshotStableKey(comparePair[1])]}
              onBack={handleBackFromCompare}
            />
          ) : snapshotsLoading ? (
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
                title={snapUi.EMPTY_TITLE}
                description={snapUi.EMPTY_DESCRIPTION}
              />
            )
          ) : (
            <div className={compareMode ? 'applications-bulk-select' : undefined}>
              {mergedSnapshots.map((s, idx) => (
                <ApplicationSnapshotRow
                  key={applicationSnapshotStableKey(s)}
                  snapshot={s}
                  showMarginBottom={idx < mergedSnapshots.length - 1}
                  onViewManifest={openManifest}
                  onRollback={handleRollbackRequest}
                  rollbackLoading={rollbackBusyId === applicationSnapshotStableKey(s)}
                  rollbackDisabled={rollbackDisabled}
                  compareMode={compareMode}
                  compareChecked={compareKeys.includes(applicationSnapshotStableKey(s))}
                  compareDisabled={
                    compareMode &&
                    compareKeys.length >= 2 &&
                    !compareKeys.includes(applicationSnapshotStableKey(s))
                  }
                  onToggleCompare={handleToggleCompareRow}
                />
              ))}
            </div>
          )}

          <ApplicationSnapshotManifestSlideOut
            open={activeManifestKey != null}
            manifestKey={activeManifestKey}
            onClose={() => setActiveManifestKey(null)}
            title={activeRowTitle}
            manifestState={manifestState}
          />
        </>
      }
    />
  );
};

ManageSnapshotsPanel.displayName = 'ManageSnapshotsPanel';

export default ManageSnapshotsPanel;
