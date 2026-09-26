import { createAsyncThunk } from '@reduxjs/toolkit';
import logger, { logErrorOnce } from '../../../../../logging';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import {
  fetchProtectionPlans,
  fetchProtectionPlanById,
  fetchProtectionPlanTemplates,
  preparePlan,
  cancelPlan,
  decidePlan,
  deletePlan,
  duplicatePlan,
  reactivatePlan,
  updatePlan,
  type PreparePlanPayload,
  type UpdatePlanPayload,
} from '../../clients';
import type { PlanApprovalDecision, ProtectionPlan, PlanTemplate } from '../../models';

export const fetchProtectionPlansThunk = createAsyncThunk<ProtectionPlan[]>(
  STORE_ACTIONS.PROTECTION_PLANS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProtectionPlans();
    } catch (error: unknown) {
      logErrorOnce(
        'protectionPlans/fetchAll',
        STORE_MESSAGES.ERROR_FETCHING_PROTECTION_PLANS,
        error,
      );
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PROTECTION_PLANS));
    }
  },
);

export const fetchProtectionPlanDetailsThunk = createAsyncThunk<ProtectionPlan, string>(
  STORE_ACTIONS.PROTECTION_PLANS.FETCH_DETAILS,
  async (planId, { rejectWithValue }) => {
    try {
      return await fetchProtectionPlanById(planId);
    } catch (error: unknown) {
      logErrorOnce(
        `protectionPlans/fetchDetails:${planId}`,
        STORE_MESSAGES.ERROR_FETCHING_PROTECTION_PLAN_DETAILS,
        error,
      );
      return rejectWithValue(
        extractErrorMessage(error, STORE_ERRORS.FETCH_PROTECTION_PLAN_DETAILS),
      );
    }
  },
);

export const fetchProtectionPlanTemplatesThunk = createAsyncThunk<PlanTemplate[]>(
  STORE_ACTIONS.PROTECTION_PLANS.FETCH_TEMPLATES,
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProtectionPlanTemplates();
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_PROTECTION_PLAN_TEMPLATES, error);
      return rejectWithValue(
        extractErrorMessage(error, STORE_ERRORS.FETCH_PROTECTION_PLAN_TEMPLATES),
      );
    }
  },
);

export interface PreparePlanArgs {
  payload: PreparePlanPayload;
}

export const preparePlanThunk = createAsyncThunk<ProtectionPlan, PreparePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.PREPARE,
  async ({ payload }, { rejectWithValue }) => {
    try {
      return await preparePlan(payload);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_PREPARING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.PREPARE_PROTECTION_PLAN));
    }
  },
);

export interface CancelPlanArgs {
  planId: string;
  reason?: string;
}

export const cancelPlanThunk = createAsyncThunk<ProtectionPlan, CancelPlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.CANCEL,
  async ({ planId, reason }, { rejectWithValue }) => {
    try {
      return await cancelPlan(planId, reason);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_CANCELLING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CANCEL_PROTECTION_PLAN));
    }
  },
);

export interface DecidePlanArgs {
  planId: string;
  decision: PlanApprovalDecision;
  comment?: string;
  requestedAt: string;
}

export const decidePlanThunk = createAsyncThunk<ProtectionPlan, DecidePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.DECIDE,
  async ({ planId, decision, comment, requestedAt }, { rejectWithValue }) => {
    try {
      return await decidePlan(planId, { decision, comment, requestedAt });
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DECIDING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DECIDE_PROTECTION_PLAN));
    }
  },
);

export interface DeletePlanArgs {
  planId: string;
}

export const deletePlanThunk = createAsyncThunk<string, DeletePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.DELETE,
  async ({ planId }, { rejectWithValue }) => {
    try {
      await deletePlan(planId);
      return planId;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_PROTECTION_PLAN));
    }
  },
);

export interface DuplicatePlanArgs {
  planId: string;
  overrides?: {
    name?: string;
    timeMode?: string;
    timeRange?: { startAt: string; endAt: string };
    environmentID?: string;
    tagIDs?: string[];
  };
}

export const duplicatePlanThunk = createAsyncThunk<ProtectionPlan, DuplicatePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.DUPLICATE,
  async ({ planId, overrides }, { rejectWithValue }) => {
    try {
      return await duplicatePlan(planId, overrides);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DUPLICATING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DUPLICATE_PROTECTION_PLAN));
    }
  },
);

export interface ReactivatePlanArgs {
  planId: string;
}

export interface UpdatePlanArgs {
  planId: string;
  payload: UpdatePlanPayload;
}

export const updatePlanThunk = createAsyncThunk<ProtectionPlan, UpdatePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.UPDATE,
  async ({ planId, payload }, { rejectWithValue }) => {
    try {
      return await updatePlan(planId, payload);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_UPDATING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.UPDATE_PROTECTION_PLAN));
    }
  },
);

export const reactivatePlanThunk = createAsyncThunk<ProtectionPlan, ReactivatePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.REACTIVATE,
  async ({ planId }, { rejectWithValue }) => {
    try {
      return await reactivatePlan(planId);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_REACTIVATING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.REACTIVATE_PROTECTION_PLAN));
    }
  },
);
