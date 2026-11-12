import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../../../constants';
import {
  clickButton,
  mockEndpoint,
  mockPendingEndpoint,
  mockServerError,
  permissionsSeed,
  pickMenuItem,
  pickSelectOption,
} from '../../../../../test';
import { describePlanActions } from '../../../../../test/contracts/planActions';
import {
  buildPlan,
  buildPlanReport,
  buildPlanStatus,
  buildPlanViolation,
  FUTURE_RANGE,
  PENDING_APPROVAL,
} from '../../../../../test/factories/plans';
import { detailsPage } from '../../../../../test/helpers/detailsPage';
import { mockPlanDetails } from '../../../../../test/helpers/featureApi';
import { signIn } from '../../../../../test/helpers/session';
import {
  DATA_VIEW_ERROR_CONSTANTS,
  NO_PERMISSION_CONSTANTS,
} from '../../../../../components/shared';
import { ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanRepeat, ProtectionPlan } from '../../models';
import { formatRepeatRule } from '../../utils/repeatRule';
import DetailsView from './DetailsView';

const L = PPC.LABELS;

const { renderDetails, openDetails } = detailsPage<ProtectionPlan>({
  page: <DetailsView />,
  path: APP_ROUTES.PROTECTION_PLAN_DETAILS,
  mockRecord: mockPlanDetails,
  loadedText: L.DETAIL_PAGE.SECTIONS.REPORTS_TITLE,
});

describePlanActions({
  name: 'plan details',
  build: buildPlan,
  open: async (plan) => (await openDetails(plan)).user,
  choose: async (user, _plan, testCase) => {
    const inOverflow = testCase.action === L.ACTIONS.CANCEL || testCase.action === L.ACTIONS.DELETE;
    if (inOverflow) await pickMenuItem(user, L.DETAIL_PAGE.ACTIONS.MORE_LABEL, testCase.action);
    else await clickButton(user, testCase.action);
  },
});

describe('plan details states', () => {
  const plan = buildPlan({ name: 'freeze-orders' });

  it('says so when the plan is gone', async () => {
    mockPlanDetails(buildPlan({ name: 'another-plan' }));

    renderDetails(plan);

    expect(await screen.findByText(L.DETAIL_PAGE.NOT_FOUND)).toBeInTheDocument();
  });

  it('shows the error page when a listed plan fails to load, then recovers on retry', async () => {
    mockPlanDetails(plan);
    mockServerError('exporter', Endpoints.PROTECTION_PLANS.GET_BY_ID(plan.id));

    const { user } = renderDetails(plan);

    expect(await screen.findByText(L.DETAIL_PAGE.LOADING_ERROR)).toBeInTheDocument();
    mockPlanDetails(plan);
    await clickButton(user, DATA_VIEW_ERROR_CONSTANTS.LABELS.RETRY_BUTTON);

    expect(await screen.findByText(L.DETAIL_PAGE.SECTIONS.REPORTS_TITLE)).toBeInTheDocument();
    expect(screen.queryByText(L.DETAIL_PAGE.LOADING_ERROR)).not.toBeInTheDocument();
  });

  it('keeps the error page up while another attempt is in flight', async () => {
    mockPlanDetails(plan);
    mockServerError('exporter', Endpoints.PROTECTION_PLANS.GET_BY_ID(plan.id));
    const { user } = renderDetails(plan);
    await screen.findByText(L.DETAIL_PAGE.LOADING_ERROR);
    const retry = mockPendingEndpoint('exporter', Endpoints.PROTECTION_PLANS.GET_BY_ID(plan.id));

    await clickButton(user, DATA_VIEW_ERROR_CONSTANTS.LABELS.RETRY_BUTTON);

    await waitFor(() => expect(retry.calls).toHaveLength(1));
    expect(screen.getByText(L.DETAIL_PAGE.LOADING_ERROR)).toBeInTheDocument();
  });

  it('hides sections the viewer may not read', async () => {
    mockPlanDetails(plan);

    renderDetails(
      plan,
      permissionsSeed('Owner', [
        ACTION_PERMISSIONS.protectionPlans.viewReports.deny,
        ACTION_PERMISSIONS.protectionPlans.viewViolations.deny,
      ]),
    );

    expect(await screen.findAllByText(NO_PERMISSION_CONSTANTS.LABELS.EMPTY_TITLE)).toHaveLength(2);
  });
});

const SERIES: PlanRepeat = {
  days: ['mon'],
  startTime: '08:00',
  endTime: '20:00',
  timeZone: 'UTC',
};

describe('plan details summary', () => {
  it.each<[string, Partial<ProtectionPlan>, string]>([
    [
      'the start of a scheduled window',
      { phase: 'scheduled', timeMode: 'time_range', timeRange: FUTURE_RANGE },
      L.PHASE_INFO.STARTS_IN_PREFIX,
    ],
    [
      'the end of a running window',
      { phase: 'active', timeMode: 'time_range', timeRange: FUTURE_RANGE },
      L.PHASE_INFO.ENDS_IN_PREFIX,
    ],
    [
      'that a permanent plan never ends',
      { phase: 'active', timeMode: 'permanent' },
      L.CARD.PERMANENT_RANGE,
    ],
    [
      'when approval was requested',
      { phase: 'pending_approval', approval: PENDING_APPROVAL },
      L.PHASE_INFO.AWAITING_APPROVAL_PREFIX,
    ],
    [
      'the rejection and its comment',
      {
        phase: 'canceled',
        approval: {
          ...PENDING_APPROVAL,
          state: 'rejected',
          decidedAt: '2026-02-02T10:00:00Z',
          comment: 'Too risky',
        },
      },
      'Too risky',
    ],
    [
      'the reason an ended plan failed',
      { phase: 'failed', reason: 'Webhook timed out' },
      'Webhook timed out',
    ],
    [
      'the excluded kinds of a scope',
      {
        scope: {
          type: 'namespaces',
          applicationRefs: [],
          namespaces: ['payments'],
          exclusions: { kinds: ['Secret'], resources: [] },
        },
      },
      L.DETAIL_PAGE.FIELDS.EXCLUDED_KINDS,
    ],
    [
      'the repeat rule of a series',
      { timeMode: 'repeating', repeat: SERIES },
      formatRepeatRule(SERIES),
    ],
  ])('shows %s', async (_label, overrides, text) => {
    await openDetails(buildPlan(overrides));

    expect(await screen.findByText(text, { exact: false })).toBeInTheDocument();
  });
});

describe('plan details sections', () => {
  const plan = buildPlan({ name: 'freeze-orders' });

  it('lists the policies the cluster should hold, and what is missing', async () => {
    mockPlanDetails(plan);
    mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.STATUS(plan.id), {
      data: buildPlanStatus({
        planId: plan.id,
        policies: [
          {
            name: 'p-block-delete',
            namespace: 'payments',
            present: false,
            ready: false,
            failureAction: 'Enforce',
          },
        ],
        drift: { missing: ['p-block-delete'], unexpected: ['p-extra'] },
      }),
    });

    renderDetails(plan);

    expect(await screen.findByText(L.HEALTH_DETAIL.PILL_NOT_IN_CLUSTER)).toBeInTheDocument();
    expect(
      screen.getByText(L.HEALTH_DETAIL.NOT_IN_FORCE(1, 1), { exact: false }),
    ).toBeInTheDocument();
  });

  it('asks the server again when the health check is refreshed', async () => {
    mockPlanDetails(plan);
    const status = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.STATUS(plan.id), {
      data: buildPlanStatus({ planId: plan.id }),
    });
    const { user } = renderDetails(plan);
    await waitFor(() => expect(status.calls).toHaveLength(1));

    await clickButton(user, L.HEALTH_DETAIL.REFRESH_BUTTON);

    await waitFor(() => expect(status.calls).toHaveLength(2));
  });

  it('shows the admission decisions and filters them by result', async () => {
    const violation = buildPlanViolation({ message: 'Blocked a delete' });
    mockPlanDetails(plan);
    const list = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.VIOLATIONS(plan.id), {
      data: { planId: plan.id, total: 1, retentionWindow: '30d', violations: [violation] },
    });

    const { user } = renderDetails(plan);

    expect(await screen.findByText(violation.message)).toBeInTheDocument();
    await pickSelectOption(user, screen.getByRole('combobox'), L.VIOLATION_RESULT_LABELS.pass);
    await waitFor(() => expect(list.calls.at(-1)?.url.searchParams.get('result')).toBe('pass'));
  });

  describe('reports', () => {
    const planWithReports = buildPlan({
      id: 'plan-reports',
      name: 'freeze-orders',
      phase: 'active',
    });
    const report = buildPlanReport({ id: 'report-a', planId: planWithReports.id, trigger: 'end' });

    const downloadReport = async (status = 200) => {
      mockPlanDetails(planWithReports);
      mockEndpoint('exporter', Endpoints.REPORTS.PLANS.LIST(planWithReports.id), {
        data: [report],
      });
      const download = mockEndpoint(
        'exporter',
        Endpoints.REPORTS.PLANS.DOWNLOAD(planWithReports.id),
        {},
        { status },
      );
      const { user } = renderDetails(planWithReports);
      await screen.findByText(L.REPORTS.TRIGGER_LABELS.end);

      await clickButton(user, new RegExp(L.REPORTS_TAB.DOWNLOAD));
      await user.click(await screen.findByRole('menuitem', { name: /json/i }));
      return download;
    };

    it('generates a report and lists it', async () => {
      signIn({ id: 'user-under-test' });
      mockPlanDetails(planWithReports);
      const generate = mockEndpoint(
        'discovery',
        Endpoints.PROTECTION_PLANS.REPORTS_GENERATE(planWithReports.id),
        { data: report },
      );
      const { user } = renderDetails(planWithReports);
      await screen.findByText(L.REPORTS.EMPTY_ACTIVE);
      mockEndpoint('exporter', Endpoints.REPORTS.PLANS.LIST(planWithReports.id), {
        data: [report],
      });

      await clickButton(user, L.REPORTS.GENERATE);

      await waitFor(() => expect(generate.calls).toHaveLength(1));
      expect(await screen.findByText(L.REPORTS.GENERATE_SUCCESS)).toBeInTheDocument();
      expect(await screen.findByText(L.REPORTS.TRIGGER_LABELS.end)).toBeInTheDocument();
    });

    it('downloads a report in the chosen format', async () => {
      const download = await downloadReport();

      await waitFor(() => expect(download.calls).toHaveLength(1));
      expect(download.calls[0].url.searchParams.get('format')).toBe('json');
    });

    it('says the file is gone when a download answers not found', async () => {
      await downloadReport(404);

      expect(await screen.findByText(L.REPORTS.DOWNLOAD_MISSING)).toBeInTheDocument();
    });
  });
});
