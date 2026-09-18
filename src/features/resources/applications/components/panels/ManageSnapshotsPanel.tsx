import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatabaseOutlined, DiffOutlined } from '@ant-design/icons';
import { App as AntdApp } from 'antd';
import type { AppDispatch, RootState } from '../../../../../store';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS, LIST_TOOLBAR } from '../../../../../constants';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants/texts';
import { MIN_SNAPSHOTS_FOR_COMPARE } from '../../constants/sectionLayout';
import { ROLLBACK_UNDO_WINDOW_SECONDS } from '../../constants/applications';
import type { Application, ApplicationSnapshotSummary } from '../../models';
import { applicationSnapshotStableKey } from '../../utils/mergeApplicationSnapshotSources';
import { mergeApplicationSnapshotSources } from '../../utils/mergeApplicationSnapshotSources';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import EmptyState from '../../../../../components/display/views/EmptyState';
import ApplicationSnapshotRow from '../snapshots/ApplicationSnapshotRow';
import type { RollbackDisabledReason } from '../snapshots/ApplicationSnapshotRow';
import SnapshotManifestView from '../snapshots/SnapshotManifestView';
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
  rollbackDisabledReason?: RollbackDisabledReason;
  onAfterRollback?: () => void;
}

const ManageSnapshotsPanel: React.FC<ManageSnapshotsPanelProps> = ({
  open,
  onClose,
  applicationName,
  detailSnapshots,
  rollbackDisabled = false,
  rollbackDisabledReason = null,
  onAfterRollback,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const { snapshots, snapshotsLoading, snapshotsError, snapshotManifests } = useSelector(
    (s: RootState) => s.applications,
  );
  const { userID } = useSelector(selectPermissionsState);

  const [expanded, setExpanded] = useState(false);
  const [activeManifestKey, setActiveManifestKey] = useState<string | null>(null);
  const [rollbackBusyId, setRollbackBusyId] = useState<string | null>(null);
  const [rollbackTarget, setRollbackTarget] = useState<ApplicationSnapshotSummary | null>(null);
  const [armedRollback, setArmedRollback] = useState<{
    target: ApplicationSnapshotSummary;
    secondsLeft: number;
  } | null>(null);
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

  // Uses the shared ActionConfirmModal rather than antd's modal.confirm, so the
  // rollback prompt matches every other confirm in the app.
  const handleRollbackRequest = useCallback((summary: ApplicationSnapshotSummary) => {
    setRollbackTarget(summary);
  }, []);

  const fireRollback = useCallback(
    async (target: ApplicationSnapshotSummary) => {
      if (!userID) return;
      setRollbackBusyId(applicationSnapshotStableKey(target));
      try {
        await dispatch(
          triggerApplicationRollbackThunk({
            name: applicationName,
            snapshotGeneration: target.generation,
            triggeredBy: userID,
          }),
        ).unwrap();
        message.success(snapUi.ROLLBACK_SUCCESS);
        void dispatch(
          fetchApplicationSnapshotsThunk({
            snapshotRefs: detailSnapshots.length > 0 ? detailSnapshots : undefined,
          }),
        );
        onAfterRollback?.();
      } catch {
        message.error(snapUi.ROLLBACK_FAILED);
      } finally {
        setRollbackBusyId(null);
      }
    },
    [applicationName, detailSnapshots, dispatch, message, onAfterRollback, snapUi, userID],
  );

  // Confirming only arms a countdown: the engine picks a rollback up within
  // ~200ms of the request and cannot abort it after that, so the undo window
  // has to live here, before anything is sent.
  const handleRollbackConfirm = useCallback(() => {
    if (!rollbackTarget) return;
    if (!userID) {
      message.error(snapUi.ROLLBACK_USER_REQUIRED);
      return;
    }
    setArmedRollback({ target: rollbackTarget, secondsLeft: ROLLBACK_UNDO_WINDOW_SECONDS });
  }, [message, rollbackTarget, snapUi, userID]);

  const cancelArmedRollback = useCallback(() => setArmedRollback(null), []);

  useEffect(() => {
    if (!armedRollback) return undefined;
    const id = window.setTimeout(() => {
      if (armedRollback.secondsLeft > 1) {
        setArmedRollback({ ...armedRollback, secondsLeft: armedRollback.secondsLeft - 1 });
        return;
      }
      setArmedRollback(null);
      void fireRollback(armedRollback.target);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [armedRollback, fireRollback]);

  const rollbackModalTarget = armedRollback?.target ?? rollbackTarget;

  const manifestViewOpen = activeManifestKey != null;
  const canCompare = mergedSnapshots.length >= MIN_SNAPSHOTS_FOR_COMPARE;
  const compareButtonDisabled = compareMode && compareKeys.length === 1;
  const headerToolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [];
    // The manifest reader replaces the list in place, so it needs a way back.
    if (manifestViewOpen) {
      buttons.push({
        key: 'backToSnapshots',
        label: snapUi.MANIFEST_BACK,
        icon: <DatabaseOutlined />,
        variant: 'ghost',
        onClick: () => setActiveManifestKey(null),
      });
      return { buttons };
    }
    // The compare view replaces the list, so only the way back applies here:
    // comparing again from inside a comparison has nothing to act on.
    if (compareViewOpen) {
      buttons.push({
        key: 'snapshots',
        label: snapUi.MANIFEST_BACK,
        icon: <DatabaseOutlined />,
        variant: 'ghost',
        onClick: handleBackFromCompare,
      });
      return { buttons };
    }
    // Nothing to compare against with a single snapshot, so the action is hidden
    // rather than shown disabled with no way to satisfy it.
    if (canCompare) {
      buttons.push({
        key: 'compare',
        label: 'Compare',
        icon: <DiffOutlined />,
        variant: 'default',
        onClick: handleCompareClick,
        disabled: compareButtonDisabled,
      });
    }
    return { buttons };
  }, [
    canCompare,
    compareButtonDisabled,
    compareViewOpen,
    handleBackFromCompare,
    handleCompareClick,
    manifestViewOpen,
    snapUi,
  ]);

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
          {manifestViewOpen ? (
            <SnapshotManifestView title={activeRowTitle} manifestState={manifestState} />
          ) : compareViewOpen && comparePair ? (
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
                    border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
                    background: DEFAULT_COLORS.SURFACE_HOVER,
                  }}
                />
              ))}
            </div>
          ) : mergedSnapshots.length === 0 ? (
            snapshotsError ? (
              <div style={{ fontSize: 13, color: DEFAULT_COLORS.DANGER }}>{snapshotsError}</div>
            ) : (
              <EmptyState title={snapUi.EMPTY_TITLE} description={snapUi.EMPTY_DESCRIPTION} />
            )
          ) : (
            <div className={compareMode ? LIST_TOOLBAR.BULK_SELECT_CLASS : undefined}>
              {mergedSnapshots.map((s, idx) => (
                <ApplicationSnapshotRow
                  key={applicationSnapshotStableKey(s)}
                  snapshot={s}
                  showMarginBottom={idx < mergedSnapshots.length - 1}
                  onViewManifest={openManifest}
                  onRollback={handleRollbackRequest}
                  rollbackLoading={rollbackBusyId === applicationSnapshotStableKey(s)}
                  rollbackDisabled={rollbackDisabled}
                  rollbackDisabledReason={rollbackDisabledReason}
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

          {/* Same modal, two phases: confirm, then a countdown whose primary
              button is Undo. The confirm handler closes via the onClose it
              captured at click time, which is the phase-one one, so arming
              survives that close. */}
          <ActionConfirmModal
            open={rollbackModalTarget != null}
            onClose={armedRollback ? cancelArmedRollback : () => setRollbackTarget(null)}
            onConfirm={armedRollback ? cancelArmedRollback : handleRollbackConfirm}
            title={snapUi.ROLLBACK_CONFIRM_TITLE}
            action={snapUi.ROLLBACK}
            resourceName={
              rollbackModalTarget ? `${snapUi.GENERATION} ${rollbackModalTarget.generation}` : ''
            }
            confirmText={
              armedRollback
                ? `${snapUi.ROLLBACK_UNDO} (${armedRollback.secondsLeft}s)`
                : snapUi.ROLLBACK_CONFIRM_OK
            }
            cancelText={APPLICATIONS_UI.CARD.ACTIONS.CANCEL}
            customMessage={
              armedRollback ? snapUi.ROLLBACK_COUNTDOWN_CONTENT : snapUi.ROLLBACK_CONFIRM_CONTENT
            }
            danger={armedRollback == null}
            loading={rollbackBusyId != null}
            getContainer={() => document.body}
            // Centre it over the page rather than under the open panel.
            offsetRight={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
          />
        </>
      }
    />
  );
};

ManageSnapshotsPanel.displayName = 'ManageSnapshotsPanel';

export default ManageSnapshotsPanel;
