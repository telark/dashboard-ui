import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingDetailsView from '../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../components/display/views/ErrorView';
import { APPLICATION_DETAILS_CONSTANTS, SYNC_STATUS_VALUE } from '../../constants';
import { useApplicationDetails } from '../../hooks';
import ApplicationsDetailsEmpty from './Empty';
import ApplicationDetailsContent from './Content';
import { PageContainer } from '../../../../components/shared';
import { APPLICATIONS_UI } from '../../constants/texts';
import { APP_ROUTES } from '../../../../constants';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../store';
import { fetchApplicationSnapshotsThunk } from '../../store';
import {
  EditApplicationPanel,
  ManageRollbacksPanel,
  ManageSnapshotsPanel,
} from '../../components/panels';
import { App as AntdApp, Form } from 'antd';
import { resetApplicationThunk } from '../../store';
import { forceSyncApplication } from '../../utils/management/sync';
import { hasActiveRollback } from '../../utils/rollbacks';
import ApplicationResetModal from '../../components/reset/ApplicationResetModal';
import { CLUSTER_INSIGHTS, insightsAppKey } from '../../../insights';
import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';

const { viewSnapshotManifest } = ACTION_PERMISSIONS.applications;

const ApplicationDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [editForm] = Form.useForm();
  const [editOpen, setEditOpen] = React.useState(false);
  const [rollbacksOpen, setRollbacksOpen] = React.useState(false);
  const [snapshotsOpen, setSnapshotsOpen] = React.useState(false);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const { details, loading, error, refresh } = useApplicationDetails(name);
  const syncingFlag = useSelector((s: RootState) =>
    details?.name ? !!s.applications.syncing?.[details.name] : false,
  );
  const syncStatus = useSelector((s: RootState) =>
    details?.name ? s.applications.syncStatus?.[details.name] : undefined,
  );
  const isSyncing = syncingFlag || syncStatus === SYNC_STATUS_VALUE.SYNCING;
  const activeRollback = hasActiveRollback(details?.rollbacks);
  const rollbackDisabled = isSyncing || activeRollback;
  const rollbackDisabledReason: 'sync' | 'activeRollback' | null = isSyncing
    ? 'sync'
    : activeRollback
      ? 'activeRollback'
      : null;

  const canReadSnapshotFiles = usePermission(
    viewSnapshotManifest.scope,
    viewSnapshotManifest.level,
    viewSnapshotManifest.deny,
  );
  const latestSnapshots = useRef(details?.snapshots);
  latestSnapshots.current = details?.snapshots;
  const snapshotsKey = (details?.snapshots ?? []).map((s) => s.path).join('|');
  useEffect(() => {
    if (!details?.name) return;
    const snaps = latestSnapshots.current;
    const refs = snaps != null && snaps.length > 0 ? snaps : undefined;
    void dispatch(
      fetchApplicationSnapshotsThunk({ snapshotRefs: refs, canReadFiles: canReadSnapshotFiles }),
    );
  }, [details?.name, snapshotsKey, canReadSnapshotFiles, dispatch]);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: APPLICATIONS_UI.BREADCRUMBS.ROOT,
        onClick: () => navigate(APP_ROUTES.APPLICATIONS),
      },
      { label: details?.displayName || details?.name || name || '' },
    ],
    [details?.displayName, details?.name, name, navigate],
  );

  const handleConfirmReset = React.useCallback(async () => {
    if (!details?.name) return;
    setResetLoading(true);
    try {
      await dispatch(resetApplicationThunk(details.name)).unwrap();
      setResetModalOpen(false);
      navigate(APP_ROUTES.APPLICATIONS);
    } catch (err) {
      message.error(typeof err === 'string' ? err : APPLICATIONS_UI.CARD.ACTIONS.RESET_FAILED);
    } finally {
      setResetLoading(false);
    }
  }, [details?.name, dispatch, message, navigate]);

  if (loading) {
    return <LoadingDetailsView />;
  }

  if (error) {
    return (
      <ErrorView error={error} errorMessagePrefix={APPLICATION_DETAILS_CONSTANTS.MESSAGES.ERROR} />
    );
  }

  if (!details) {
    return <ApplicationsDetailsEmpty />;
  }

  // The analyzer keys an app's insights document by its first namespace.
  const insightsNamespace = details.namespaces?.items?.[0]?.name;

  return (
    <>
      <PageContainer breadcrumbs={breadcrumbItems} subtitle={APPLICATIONS_UI.DETAIL_PAGE.SUBTITLE}>
        <div style={{ marginTop: 24 }}>
          <ApplicationDetailsContent
            application={details}
            syncDisabled={isSyncing}
            onForceSync={() => {
              void forceSyncApplication(details.name).then((err) => {
                if (err) message.error(err);
              });
            }}
            onEdit={() => {
              editForm.setFieldsValue({
                name: details.name,
                displayName: details.displayName,
                description: details.description ?? '',
              });
              setEditOpen(true);
            }}
            onManageRollbacks={() => {
              setSnapshotsOpen(false);
              setRollbacksOpen(true);
            }}
            onManageSnapshots={() => {
              setRollbacksOpen(false);
              setSnapshotsOpen(true);
            }}
            onOpenInsights={
              insightsNamespace
                ? () =>
                    navigate(
                      `${APP_ROUTES.INSIGHTS}?${CLUSTER_INSIGHTS.APP_PARAM}=${insightsAppKey(insightsNamespace, details.name)}`,
                    )
                : undefined
            }
            onReset={() => {
              setResetModalOpen(true);
            }}
          />
        </div>
      </PageContainer>

      <EditApplicationPanel
        open={editOpen}
        onClose={() => {
          editForm.resetFields();
          setEditOpen(false);
        }}
        application={details}
        form={editForm}
      />
      <ManageRollbacksPanel
        open={rollbacksOpen}
        onClose={() => setRollbacksOpen(false)}
        applicationName={details.name}
        detailRollbacks={details.rollbacks}
        onAfterAbort={refresh}
      />
      <ManageSnapshotsPanel
        open={snapshotsOpen}
        onClose={() => setSnapshotsOpen(false)}
        applicationName={details.name}
        detailSnapshots={details.snapshots}
        rollbackDisabled={rollbackDisabled}
        rollbackDisabledReason={rollbackDisabledReason}
        onAfterRollback={refresh}
      />
      <ApplicationResetModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        applicationNames={[details.name]}
        loading={resetLoading}
      />
    </>
  );
});

ApplicationDetailsView.displayName = 'ApplicationDetailsView';

export default ApplicationDetailsView;
