import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, App as AntdApp } from 'antd';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import ReactivatePlanModal from '../../components/shared/ReactivatePlanModal';
import ApprovalDecisionModal from '../../components/shared/ApprovalDecisionModal';
import { APP_ROUTES } from '../../../../../constants';
import { PageContainer } from '../../../../../components/shared';
import { usePlanDetails } from '../../hooks/usePlanDetails';
import {
  cancelPlanThunk,
  decidePlanThunk,
  deletePlanThunk,
  fetchProtectionPlanDetailsThunk,
  reactivatePlanThunk,
} from '../../store';
import { fetchPlanStatus } from '../../clients';
import { getCurrentUser } from '../../../../auth/utils';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { AppDispatch } from '../../../../../store';
import type { PlanApprovalDecision } from '../../models';
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
  const { message } = AntdApp.useApp();
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
  const [decisionModal, setDecisionModal] = useState<PlanApprovalDecision | null>(null);
  // Kept after close so the fading modal does not flip between approve and reject copy.
  const [lastDecision, setLastDecision] = useState<PlanApprovalDecision>('approved');
  const [deciding, setDeciding] = useState<PlanApprovalDecision | null>(null);

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
      message.success(PPC.LABELS.ACTIONS.CANCEL_SUCCESS(details.name));
      setCancelModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.CANCEL_ERROR);
    } finally {
      setCancelling(false);
    }
  }, [details, dispatch, message]);

  const handleConfirmDelete = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setDeleting(true);
    try {
      await dispatch(deletePlanThunk({ userId, planId: details.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.DELETE_SUCCESS(details.name));
      setDeleteModalOpen(false);
      navigate(APP_ROUTES.PROTECTION_PLANS);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.DELETE_ERROR);
    } finally {
      setDeleting(false);
    }
  }, [details, dispatch, message, navigate]);

  const handleConfirmReactivate = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setReactivating(true);
    try {
      const updated = await dispatch(reactivatePlanThunk({ userId, planId: details.id })).unwrap();
      message.success(PPC.LABELS.ACTIONS.REACTIVATE_SUCCESS(updated.name));
      setReactivateModalOpen(false);
    } catch (err: unknown) {
      message.error(typeof err === 'string' && err ? err : PPC.LABELS.ACTIONS.REACTIVATE_ERROR);
    } finally {
      setReactivating(false);
    }
  }, [details, dispatch, message]);

  const openDecision = useCallback((decision: PlanApprovalDecision) => {
    setLastDecision(decision);
    setDecisionModal(decision);
  }, []);

  const handleDecide = useCallback(
    async (comment: string) => {
      if (!details || !decisionModal) return;
      const userId = getCurrentUser()?.id;
      if (!userId) return;
      const approved = decisionModal === 'approved';
      setDeciding(decisionModal);
      try {
        const updated = await dispatch(
          decidePlanThunk({
            userId,
            planId: details.id,
            decision: decisionModal,
            comment: comment || undefined,
            requestedAt: details.approval?.requestedAt ?? '',
          }),
        ).unwrap();
        message.success(
          approved
            ? PPC.LABELS.ACTIONS.APPROVE_SUCCESS(updated.name)
            : PPC.LABELS.ACTIONS.REJECT_SUCCESS(updated.name),
        );
        setDecisionModal(null);
      } catch (err: unknown) {
        const fallback = approved
          ? PPC.LABELS.ACTIONS.APPROVE_ERROR
          : PPC.LABELS.ACTIONS.REJECT_ERROR;
        message.error(typeof err === 'string' && err ? err : fallback);
      } finally {
        setDeciding(null);
      }
    },
    [decisionModal, details, dispatch, message],
  );

  const handleRefreshHealth = useCallback(async () => {
    if (!details) return;
    setRefreshingHealth(true);
    try {
      await fetchPlanStatus(details.id);
      await dispatch(fetchProtectionPlanDetailsThunk(details.id));
    } catch (err: unknown) {
      // fetchPlanStatus is a direct client call, so it rejects with an Error, not a thunk string.
      message.error(err instanceof Error ? err.message : PPC.LABELS.ACTIONS.REFRESH_HEALTH_ERROR);
    } finally {
      setRefreshingHealth(false);
    }
  }, [details, dispatch, message]);

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
      <PageContainer breadcrumbs={breadcrumbItems} subtitle={PPC.LABELS.DETAIL_PAGE.SUBTITLE}>
        <div style={{ marginTop: 24 }}>
          <ProtectionPlanDetailsContent
            plan={details}
            duplicating={duplicatePanelOpen}
            editing={editPanelOpen}
            cancelling={cancelling}
            reactivating={reactivating}
            approving={deciding === 'approved'}
            rejecting={deciding === 'rejected'}
            deleting={deleting}
            refreshingHealth={refreshingHealth}
            onDuplicate={handleOpenDuplicate}
            onEdit={handleOpenEdit}
            onCancel={() => setCancelModalOpen(true)}
            onReactivate={() => setReactivateModalOpen(true)}
            onApprove={() => openDecision('approved')}
            onReject={() => openDecision('rejected')}
            onDelete={() => setDeleteModalOpen(true)}
            onRefreshHealth={handleRefreshHealth}
          />
        </div>
      </PageContainer>

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
      <ReactivatePlanModal
        open={reactivateModalOpen}
        planName={details.name}
        loading={reactivating}
        onClose={() => setReactivateModalOpen(false)}
        onConfirm={handleConfirmReactivate}
      />
      <ApprovalDecisionModal
        open={decisionModal !== null}
        decision={lastDecision}
        plan={details}
        loading={deciding !== null}
        onClose={() => setDecisionModal(null)}
        onConfirm={handleDecide}
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
