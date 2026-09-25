import { useCallback, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { getCurrentUser } from '../../../auth/utils';
import { preparePlanThunk, updatePlanThunk } from '../store';
import type { PreparePlanPayload, UpdatePlanPayload } from '../clients';
import type { ProtectionPlan } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

export const usePlanActions = () => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(
    async (payload: PreparePlanPayload): Promise<ProtectionPlan> => {
      const userId = getCurrentUser()?.id;
      if (!userId) throw new Error(PPC.LABELS.ACTIONS.CREATE_ERROR);
      setSubmitting(true);
      try {
        const created = await dispatch(preparePlanThunk({ userId, payload })).unwrap();
        message.success(PPC.LABELS.ACTIONS.CREATE_SUCCESS(created.name));
        return created;
      } catch (err) {
        const text = err instanceof Error ? err.message : PPC.LABELS.ACTIONS.CREATE_ERROR;
        message.error(text);
        throw err instanceof Error ? err : new Error(text);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  const handleUpdate = useCallback(
    async (planId: string, payload: UpdatePlanPayload): Promise<ProtectionPlan> => {
      const userId = getCurrentUser()?.id;
      if (!userId) throw new Error(PPC.LABELS.ACTIONS.UPDATE_ERROR);
      setSubmitting(true);
      try {
        const body = { ...payload };
        delete body.approvalMode;
        const updated = await dispatch(updatePlanThunk({ userId, planId, payload: body })).unwrap();
        message.success(PPC.LABELS.ACTIONS.UPDATE_SUCCESS(updated.name));
        return updated;
      } catch (err) {
        const text = err instanceof Error ? err.message : PPC.LABELS.ACTIONS.UPDATE_ERROR;
        message.error(text);
        throw err instanceof Error ? err : new Error(text);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, message],
  );

  return { submitting, handleCreate, handleUpdate };
};
