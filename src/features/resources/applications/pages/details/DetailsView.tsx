import React, { memo, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { APPLICATION_DETAILS_CONSTANTS } from '../../constants';
import { useApplicationDetails } from '../../hooks';
import ApplicationsDetailsEmpty from './Empty';
import ApplicationDetailsContent from './Content';
import ApplicationPageLayout from '../../components/layout/ApplicationPageLayout';
import { APPLICATIONS_UI } from '../../constants/texts';
import { APP_ROUTES } from '../../../../../constants';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../../../store';
import { fetchApplicationSnapshotsThunk } from '../../store';
import { EditApplicationPanel, ManageRollbacksPanel, ManageSnapshotsPanel } from '../../components/panels';
import { Form } from 'antd';
import { deleteApplicationThunk } from '../../store';
import { forceSyncApplication } from '../../utils/management/sync';
import ApplicationDeleteModal from '../../components/delete/ApplicationDeleteModal';

const ApplicationDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [editForm] = Form.useForm();
  const [editOpen, setEditOpen] = React.useState(false);
  const [rollbacksOpen, setRollbacksOpen] = React.useState(false);
  const [snapshotsOpen, setSnapshotsOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const { details, loading, error } = useApplicationDetails(name);
  const isSyncing = useSelector(
    (s: RootState) => (details?.name ? !!s.applications.syncing?.[details.name] : false),
  );

  useEffect(() => {
    if (!details?.name) return;
    const refs =
      details.snapshots != null && details.snapshots.length > 0 ? details.snapshots : undefined;
    void dispatch(
      fetchApplicationSnapshotsThunk({ applicationId: details.name, snapshotRefs: refs }),
    );
  }, [details?.name, details?.snapshots, dispatch]);

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

  const handleConfirmDelete = React.useCallback(async () => {
    if (!details?.name) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteApplicationThunk(details.name)).unwrap();
      setDeleteModalOpen(false);
      navigate(APP_ROUTES.APPLICATIONS);
    } catch {
      return;
    } finally {
      setDeleteLoading(false);
    }
  }, [details?.name, dispatch, navigate]);

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

  return (
    <>
      <ApplicationPageLayout
        breadcrumbItems={breadcrumbItems}
        subtitle={APPLICATIONS_UI.DETAIL_PAGE.SUBTITLE}
      >
        <div style={{ marginTop: 24 }}>
          <ApplicationDetailsContent
            application={details}
            syncDisabled={isSyncing}
            onForceSync={() => {
              forceSyncApplication(details.name).catch(() => undefined);
            }}
            onEdit={() => {
              editForm.setFieldsValue({
                name: details.name,
                displayName: details.displayName,
                description: details.description ?? '',
              });
              setEditOpen(true);
            }}
            onManageRollbacks={() => setRollbacksOpen(true)}
            onManageSnapshots={() => setSnapshotsOpen(true)}
            onDelete={() => {
              setDeleteModalOpen(true);
            }}
          />
        </div>
      </ApplicationPageLayout>

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
        detailRollbacks={details.rollbacks}
      />
      <ManageSnapshotsPanel
        open={snapshotsOpen}
        onClose={() => setSnapshotsOpen(false)}
        applicationId={details.name}
        detailSnapshots={details.snapshots}
        rollbackDisabled={isSyncing}
      />
      <ApplicationDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        applicationName={details.name}
        loading={deleteLoading}
      />
    </>
  );
});

ApplicationDetailsView.displayName = 'ApplicationDetailsView';

export default ApplicationDetailsView;
