import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message as antdMessage } from 'antd';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { APP_ROUTES } from '../../../../../constants';
import ApplicationPageLayout from '../../../../resources/applications/components/layout/ApplicationPageLayout';
import { usePlanDetails } from '../../hooks/usePlanDetails';
import { cancelPlanThunk, duplicatePlanThunk, fetchProtectionPlanDetailsThunk } from '../../store';
import { fetchPlanStatus } from '../../clients/protectionPlansClient';
import { getCurrentUser } from '../../../../auth/utils';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { AppDispatch } from '../../../../../store';
import ProtectionPlanDetailsEmpty from './Empty';
import ProtectionPlanDetailsContent from './Content';

const ProtectionPlanDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : undefined;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading, error, notFound } = usePlanDetails(decodedName);

  const [duplicating, setDuplicating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [refreshingHealth, setRefreshingHealth] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

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

  const handleDuplicate = useCallback(async () => {
    if (!details) return;
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setDuplicating(true);
    try {
      const created = await dispatch(duplicatePlanThunk({ userId, planId: details.id })).unwrap();
      void antdMessage.success(PPC.LABELS.ACTIONS.DUPLICATE_SUCCESS);
      const target = APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(
        ':name',
        encodeURIComponent(created.name),
      );
      navigate(target);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : PPC.LABELS.ACTIONS.DUPLICATE_ERROR;
      void antdMessage.error(text);
    } finally {
      setDuplicating(false);
    }
  }, [details, dispatch, navigate]);

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
            duplicating={duplicating}
            cancelling={cancelling}
            refreshingHealth={refreshingHealth}
            onDuplicate={handleDuplicate}
            onCancel={() => setCancelModalOpen(true)}
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
    </>
  );
});

ProtectionPlanDetailsView.displayName = 'ProtectionPlanDetailsView';

export default ProtectionPlanDetailsView;
