import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../../logging';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import {
  fetchProtectionPlans,
  fetchProtectionPlanTemplates,
  preparePlan,
  cancelPlan,
  deletePlan,
  duplicatePlan,
} from '../../clients/protectionPlansClient';
import type { ProtectionPlan, PlanTemplate } from '../../models';

export const fetchProtectionPlansThunk = createAsyncThunk<ProtectionPlan[]>(
  STORE_ACTIONS.PROTECTION_PLANS.FETCH,
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProtectionPlans();
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_PROTECTION_PLANS, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_PROTECTION_PLANS));
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
  userId: string;
  payload: {
    name: string;
    description?: string;
    severity?: string;
    priority?: number;
    scope: { type: string; applicationIds: string[]; namespaces: string[] };
    policies: { templateID: string; params: Record<string, string[]> }[];
    mode: string;
    timeMode: string;
    timeRange?: { startAt: string; endAt: string };
    participantsIDs?: string[];
  };
}

export const preparePlanThunk = createAsyncThunk<ProtectionPlan, PreparePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.PREPARE,
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      return await preparePlan(userId, payload);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_PREPARING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.PREPARE_PROTECTION_PLAN));
    }
  },
);

export interface CancelPlanArgs {
  userId: string;
  planId: string;
  reason?: string;
}

export const cancelPlanThunk = createAsyncThunk<ProtectionPlan, CancelPlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.CANCEL,
  async ({ userId, planId, reason }, { rejectWithValue }) => {
    try {
      return await cancelPlan(userId, planId, reason);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_CANCELLING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.CANCEL_PROTECTION_PLAN));
    }
  },
);

export interface DeletePlanArgs {
  userId: string;
  planId: string;
}

export const deletePlanThunk = createAsyncThunk<string, DeletePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.DELETE,
  async ({ userId, planId }, { rejectWithValue }) => {
    try {
      await deletePlan(userId, planId);
      return planId;
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DELETING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DELETE_PROTECTION_PLAN));
    }
  },
);

export interface DuplicatePlanArgs {
  userId: string;
  planId: string;
  overrides?: { name?: string; timeMode?: string };
}

export const duplicatePlanThunk = createAsyncThunk<ProtectionPlan, DuplicatePlanArgs>(
  STORE_ACTIONS.PROTECTION_PLANS.DUPLICATE,
  async ({ userId, planId, overrides }, { rejectWithValue }) => {
    try {
      return await duplicatePlan(userId, planId, overrides);
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_DUPLICATING_PROTECTION_PLAN, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.DUPLICATE_PROTECTION_PLAN));
    }
  },
);
