import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_ROUTES, CARD_TEXTS, Endpoints } from '../../../../../../constants';
import { mockEndpoint, renderApp, pickMenuItem, clickButton } from '../../../../../../test';
import { describePlanActions } from '../../../../../../test/contracts/planActions';
import { buildPlan, buildPlanReport, FUTURE_RANGE } from '../../../../../../test/factories/plans';
import { mockPlanTaxonomies } from '../../../../../../test/helpers/featureApi';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../constants/protectionPlans';
import type { ProtectionPlan } from '../../../models';
import ProtectionPlanCard from './ProtectionPlanCard';

const CARD = PPC.LABELS.CARD;

const renderCard = (plan: ProtectionPlan, onOpen = vi.fn()) => {
  mockPlanTaxonomies();
  const { user } = renderApp(<ProtectionPlanCard plan={plan} onOpen={onOpen} names={{}} />);
  return { user, onOpen };
};

describePlanActions({
  name: 'plan card',
  build: buildPlan,
  open: async (plan) => {
    const { user } = renderCard(plan);
    await screen.findByText(plan.name);
    return user;
  },
  choose: (user, plan, testCase) =>
    pickMenuItem(user, CARD_TEXTS.ACTIONS_LABEL(plan.name), testCase.action),
});

describe('protection plan card', () => {
  it('opens the plan when clicked, without reacting to the actions menu', async () => {
    const plan = buildPlan({ name: 'freeze-orders' });
    const { user, onOpen } = renderCard(plan);

    await clickButton(user, CARD_TEXTS.ACTIONS_LABEL(plan.name));
    expect(onOpen).not.toHaveBeenCalled();

    await user.click(screen.getByText(plan.name));
    expect(onOpen).toHaveBeenCalledWith(
      APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(plan.name)),
    );
  });

  it.each<[string, Partial<ProtectionPlan>, string]>([
    ['a permanent plan', { timeMode: 'permanent', phase: 'active' }, CARD.PERMANENT_RANGE],
    [
      'a time window',
      { timeMode: 'time_range', phase: 'scheduled', timeRange: FUTURE_RANGE },
      PPC.LABELS.PHASE_INFO.STARTS_IN_PREFIX,
    ],
    [
      'a rejected plan',
      {
        phase: 'canceled',
        approval: { state: 'rejected', requestedBy: 'a', requestedAt: 'b' },
      },
      PPC.LABELS.PHASE_INFO.REJECTED_LABEL,
    ],
    [
      'a series waiting for approval',
      {
        timeMode: 'repeating',
        phase: 'pending_approval',
        window: FUTURE_RANGE,
        repeat: { days: ['mon'], startTime: '08:00', endTime: '20:00', timeZone: 'UTC' },
      },
      CARD.OPENS_ONCE_APPROVED,
    ],
  ])('describes %s', async (_label, overrides, text) => {
    renderCard(buildPlan(overrides));

    expect(await screen.findByText(text, { exact: false })).toBeInTheDocument();
  });

  it('names the namespaces a plan covers', async () => {
    const plan = buildPlan({
      scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments', 'ops'] },
    });

    renderCard(plan);

    expect(await screen.findByText(CARD.NAMESPACES_COUNT(2))).toBeInTheDocument();
  });

  it('asks the server to generate a report from the menu', async () => {
    const plan = buildPlan({
      id: 'plan-r',
      name: 'freeze-orders',
      startedAt: '2026-01-15T10:00:00Z',
    });
    const generate = mockEndpoint(
      'discovery',
      Endpoints.PROTECTION_PLANS.REPORTS_GENERATE(plan.id),
      {
        data: buildPlanReport({ planId: plan.id }),
      },
    );
    const { user } = renderCard(plan);

    await pickMenuItem(user, CARD_TEXTS.ACTIONS_LABEL(plan.name), PPC.LABELS.REPORTS.GENERATE);

    await waitFor(() => expect(generate.calls).toHaveLength(1));
    expect(await screen.findByText(PPC.LABELS.REPORTS.GENERATE_SUCCESS)).toBeInTheDocument();
  });
});
