import type {
  PlanReportMeta,
  PlanStatusResponse,
  PlanTemplate,
  PlanViolation,
  ProtectionPlan,
} from '../../features/plans/protection/models';
import { createFactory } from '../factory';
import { inDays } from '../helpers/session';

const CREATED_AT = '2026-01-15T10:00:00Z';
const UPDATED_AT = '2026-02-01T10:00:00Z';

/** A time range that has not started, whenever the test runs. */
export const FUTURE_RANGE = { startAt: inDays(30), endAt: inDays(31) };

export const PENDING_APPROVAL = {
  state: 'pending',
  requestedBy: 'another-user',
  requestedAt: UPDATED_AT,
} as const;

export const buildPlan = createFactory<ProtectionPlan>((sequence) => ({
  id: `plan-${sequence}`,
  name: `freeze-${sequence}`,
  description: 'Blocks risky changes',
  scope: { type: 'applications', applicationRefs: ['checkout'], namespaces: [] },
  policies: [{ templateID: 'block-delete', params: {} }],
  mode: 'enforce',
  timeMode: 'permanent',
  phase: 'active',
  health: 'healthy',
  createdAt: CREATED_AT,
  createdBy: 'user-under-test',
  lastUpdatedAt: UPDATED_AT,
  lastUpdatedBy: 'user-under-test',
  startedAt: CREATED_AT,
  participantRefs: [],
}));

export const buildPlanTemplate = createFactory<PlanTemplate>((sequence) => ({
  id: `template-${sequence}`,
  code: `T${sequence}`,
  name: `Block change ${sequence}`,
  description: 'Blocks a change',
  supportedScopes: ['applications', 'namespaces'],
  params: [],
}));

export const buildPlanReport = createFactory<PlanReportMeta>((sequence) => ({
  id: `report-${sequence}`,
  planId: 'plan-1',
  trigger: 'manual',
  generatedAt: UPDATED_AT,
  generatedBy: 'user-under-test',
  violationsTotal: sequence,
  truncated: false,
}));

export const buildPlanViolation = createFactory<PlanViolation>((sequence) => ({
  policy: 'block-delete',
  rule: `rule-${sequence}`,
  namespace: 'payments',
  resource: { kind: 'Deployment', name: `checkout-${sequence}`, namespace: 'payments' },
  result: 'fail',
  message: `Blocked change ${sequence}`,
  timestamp: UPDATED_AT,
  requestedBy: 'sre_oncall',
}));

export const buildPlanStatus = createFactory<PlanStatusResponse>((sequence) => ({
  planId: `plan-${sequence}`,
  phase: 'active',
  health: 'healthy',
  policies: [
    {
      name: `policy-${sequence}`,
      namespace: 'payments',
      present: true,
      ready: true,
      failureAction: 'Enforce',
    },
  ],
  drift: { missing: [], unexpected: [] },
}));
