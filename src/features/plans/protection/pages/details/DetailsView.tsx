import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { APP_ROUTES } from '../../../../../constants';
import ApplicationPageLayout from '../../../../resources/applications/components/layout/ApplicationPageLayout';
import { usePlanDetails } from '../../hooks/usePlanDetails';
import {
  cancelPlanThunk,
  deletePlanThunk,
  fetchProtectionPlanDetailsThunk,
  reactivatePlanThunk,
} from '../../store';
import { fetchPlanStatus } from '../../clients';
import { getCurrentUser } from '../../../../auth/utils';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { AppDispatch } from '../../../../../store';
import DuplicatePlanPanel from '../../components/panels/DuplicatePlanPanel';
import EditPlanPanel from '../../components/panels/EditPlanPanel';
import type { FormValues } from '../../components/create';
import ProtectionPlanDetailsEmpty from './Empty';
import ProtectionPlanDetailsContent from './Content';

const ProtectionPlanDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : undefined;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error, notFound } = usePlanDetails(decodedName);
  const [editForm] = Form.useForm<FormValues>();

  const [duplicatePanelOpen, setDuplicatePanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshingHealth, setRefreshingHealth] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: PPC.LABELS.BREADCRUMBS.ROOT,
        onClick: () => navigate(APP_ROUTES.PROTECTION_PLANS),
      },
      { label: details?.name || decodedName || '' },
    ],
    [details?.name, decodedName, navigate],
  );

  const handleOpenDuplicate = useCallback(() => {
    setDuplicatePanelOpen(true);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setEditPanelOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditPanelOpen(false);
    editForm.resetFields();
  }, [editForm]);

  const handleConfirmCancel = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setCancelling(true);
    try {
      await dispatch(cancelPlanThunk({ userId, planId: details.id })).unwrap();
      setCancelModalOpen(false);
    } finally {
      setCancelling(false);
    }
  }, [details, dispatch]);

  const handleConfirmDelete = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setDeleting(true);
    try {
      await dispatch(deletePlanThunk({ userId, planId: details.id })).unwrap();
      setDeleteModalOpen(false);
      navigate(APP_ROUTES.PROTECTION_PLANS);
    } finally {
      setDeleting(false);
    }
  }, [details, dispatch, navigate]);

  const handleConfirmReactivate = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setReactivating(true);
    try {
      const updated = await dispatch(
        reactivatePlanThunk({ userId, planId: details.id }),
      ).unwrap();
      message.success(PPC.LABELS.ACTIONS.REACTIVATE_SUCCESS(updated.name));
      setReactivateModalOpen(false);
    } catch (err) {
      const text = err instanceof Error ? err.message : PPC.LABELS.ACTIONS.REACTIVATE_ERROR;
      message.error(text);
    } finally {
      setReactivating(false);
    }
  }, [details, dispatch]);

  const handleRefreshHealth = useCallback(async () => {
    if (!details) return;
    setRefreshingHealth(true);
    try {
      await fetchPlanStatus(details.id);
      await dispatch(fetchProtectionPlanDetailsThunk(details.id));
    } finally {
      setRefreshingHealth(false);
    }
  }, [details, dispatch]);

  if (loading && !details) {
    return <LoadingDetailsView />;
  }
  if (error && !details) {
    return <ErrorView error={error} errorMessagePrefix={PPC.LABELS.DETAIL_PAGE.LOADING_ERROR} />;
  }
  if (notFound || !details) {
    return <ProtectionPlanDetailsEmpty />;
  }

  return (
    <>
      <ApplicationPageLayout
        breadcrumbItems={breadcrumbItems}
        subtitle={PPC.LABELS.DETAIL_PAGE.SUBTITLE}
      >
        <div style={{ marginTop: 24 }}>
          <ProtectionPlanDetailsContent
            plan={details}
            duplicating={duplicatePanelOpen}
            editing={editPanelOpen}
            cancelling={cancelling}
            reactivating={reactivating}
            deleting={deleting}
            refreshingHealth={refreshingHealth}
            onDuplicate={handleOpenDuplicate}
            onEdit={handleOpenEdit}
            onCancel={() => setCancelModalOpen(true)}
            onReactivate={() => setReactivateModalOpen(true)}
            onDelete={() => setDeleteModalOpen(true)}
            onRefreshHealth={handleRefreshHealth}
          />
        </div>
      </ApplicationPageLayout>

      <ActionConfirmModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL_MODAL_TITLE}
        action="cancel"
        resourceName={details.name}
        resourceType="protection plan"
        confirmText={PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL_MODAL_OK}
        loading={cancelling}
        getContainer={() => document.body}
      />
      <ActionConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={PPC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={details.name}
        resourceType="protection plan"
        confirmText={PPC.LABELS.ACTIONS.DELETE_MODAL_OK}
        loading={deleting}
        getContainer={() => document.body}
      />
      <ActionConfirmModal
        open={reactivateModalOpen}
        onClose={() => setReactivateModalOpen(false)}
        onConfirm={handleConfirmReactivate}
        title={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_TITLE}
        action="reactivate"
        resourceName={details.name}
        resourceType="protection plan"
        confirmText={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_OK}
        loading={reactivating}
        danger={false}
        icon={<PlayCircleOutlined />}
        customMessage={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_BODY}
        getContainer={() => document.body}
      />
      <DuplicatePlanPanel
        key={`duplicate-${details.id}`}
        open={duplicatePanelOpen}
        onClose={() => setDuplicatePanelOpen(false)}
        plan={details}
      />
      {editPanelOpen && (
        <EditPlanPanel
          key={`edit-${details.id}`}
          open={editPanelOpen}
          onClose={handleCloseEdit}
          plan={details}
          form={editForm}
        />
      )}
    </>
  );
});

ProtectionPlanDetailsView.displayName = 'ProtectionPlanDetailsView';

export default ProtectionPlanDetailsView;
