import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../features/plans/protection/constants/protectionPlans';
import type { ProtectionPlan } from '../../features/plans/protection/models';
import { findDialog } from '../antd';
import { mockEmptyEndpoint, mockEndpoint, mockServerError, type EndpointRef } from '../api';
import { PENDING_APPROVAL } from '../factories/plans';

const A = PPC.LABELS.ACTIONS;
const D = PPC.LABELS.DETAIL_PAGE.ACTIONS;
const SERVER_ERROR = 'The plan is locked';
const AWAITING_DECISION: Partial<ProtectionPlan> = {
  phase: 'pending_approval',
  approvalMode: 'required',
  approval: PENDING_APPROVAL,
};

interface PlanActionCase {
  name: string;
  plan: Partial<ProtectionPlan>;
  action: string;
  confirm: string;
  endpoint: (planId: string) => EndpointRef;
  /** The route answers 204 instead of the updated plan. */
  empty?: boolean;
  body?: unknown;
  success: (plan: ProtectionPlan) => string;
  /** Typed into the decision comment before confirming. */
  comment?: string;
}

/** Cancel, reactivate, approve, reject and delete, in the shape both plan surfaces confirm them. */
const PLAN_ACTION_CASES: readonly PlanActionCase[] = [
  {
    name: 'cancel',
    plan: { phase: 'active' },
    action: A.CANCEL,
    confirm: D.CANCEL_MODAL_OK,
    endpoint: Endpoints.PROTECTION_PLANS.CANCEL,
    body: { reason: '' },
    success: (plan) => A.CANCEL_SUCCESS(plan.name),
  },
  {
    name: 'reactivate',
    plan: { phase: 'canceled', timeMode: 'permanent' },
    action: D.REACTIVATE,
    confirm: D.REACTIVATE_MODAL_OK,
    endpoint: Endpoints.PROTECTION_PLANS.REACTIVATE,
    body: {},
    success: (plan) => A.REACTIVATE_SUCCESS(plan.name),
  },
  {
    name: 'approve',
    plan: AWAITING_DECISION,
    action: D.APPROVE,
    confirm: D.APPROVE_MODAL_OK,
    endpoint: Endpoints.PROTECTION_PLANS.DECIDE,
    body: { decision: 'approved', requestedAt: PENDING_APPROVAL.requestedAt },
    success: (plan) => A.APPROVE_SUCCESS(plan.name),
  },
  {
    name: 'reject',
    plan: AWAITING_DECISION,
    action: D.REJECT,
    confirm: D.REJECT_MODAL_OK,
    endpoint: Endpoints.PROTECTION_PLANS.DECIDE,
    body: {
      decision: 'rejected',
      comment: 'Too risky',
      requestedAt: PENDING_APPROVAL.requestedAt,
    },
    comment: 'Too risky',
    success: (plan) => A.REJECT_SUCCESS(plan.name),
  },
  {
    name: 'delete',
    plan: { phase: 'canceled' },
    action: A.DELETE,
    confirm: A.DELETE_MODAL_OK,
    endpoint: Endpoints.PROTECTION_PLANS.CLEAR,
    empty: true,
    success: (plan) => A.DELETE_SUCCESS(plan.name),
  },
];

interface PlanActionSurface {
  name: string;
  build: (overrides: Partial<ProtectionPlan>) => ProtectionPlan;
  /** Renders the plan and resolves once it is on screen. */
  open: (plan: ProtectionPlan) => Promise<UserEvent>;
  choose: (user: UserEvent, plan: ProtectionPlan, testCase: PlanActionCase) => Promise<void>;
}

const confirm = async (user: UserEvent, testCase: PlanActionCase): Promise<void> => {
  const dialog = within(await findDialog());
  if (testCase.comment) {
    await user.type(dialog.getByLabelText(D.DECISION_COMMENT_LABEL), testCase.comment);
  }
  await user.click(dialog.getByRole('button', { name: testCase.confirm }));
};

/** Each action on a surface: confirming sends the request and reports it, a refusal is shown. */
export const describePlanActions = (
  surface: PlanActionSurface,
  cases: readonly PlanActionCase[] = PLAN_ACTION_CASES,
): void => {
  describe.each(cases)(`${surface.name}: $name`, (testCase) => {
    it('sends the request after confirming and says so', async () => {
      const plan = surface.build(testCase.plan);
      const request = testCase.empty
        ? mockEmptyEndpoint('discovery', testCase.endpoint(plan.id))
        : mockEndpoint('discovery', testCase.endpoint(plan.id), { data: plan });
      const user = await surface.open(plan);

      await surface.choose(user, plan, testCase);
      await confirm(user, testCase);

      await waitFor(() => expect(request.calls).toHaveLength(1));
      if (testCase.body !== undefined) expect(request.calls[0].body).toEqual(testCase.body);
      expect(await screen.findByText(testCase.success(plan))).toBeInTheDocument();
    });

    it('shows why when the server refuses', async () => {
      const plan = surface.build(testCase.plan);
      const user = await surface.open(plan);
      mockServerError('discovery', testCase.endpoint(plan.id), { message: SERVER_ERROR });

      await surface.choose(user, plan, testCase);
      await confirm(user, testCase);

      expect(await screen.findByText(SERVER_ERROR)).toBeInTheDocument();
    });
  });
};
