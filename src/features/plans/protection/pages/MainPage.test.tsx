import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NO_PERMISSION_CONSTANTS } from '../../../../components/shared';
import { APP_ROUTES, Endpoints } from '../../../../constants';
import {
  clickButton,
  currentLocation,
  describeListPage,
  mockEmptyEndpoint,
  mockEndpoint,
  mockNetworkError,
  permissionsSeed,
  renderApp,
  searchList,
  pickMenuItem,
} from '../../../../test';
import { buildPlan, buildPlanReport } from '../../../../test/factories/plans';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { mockPlansPage } from '../../../../test/helpers/featureApi';
import { applyFilters } from '../../../../test/helpers/filterPanel';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PLANS_PAGE_TAB_PARAM,
} from '../constants/protectionPlans';
import { CATEGORIES_CONSTANTS as CC } from '../../../access-and-permissions/categories/constants';
import { categoriesPageRoute } from '../../../access-and-permissions/categories/utils';
import { ACTION_PERMISSIONS } from '../../../auth/hooks';
import type { PlanReportMeta, ProtectionPlan } from '../models';
import MainPage from './MainPage';

const L = PPC.LABELS;
const REPORTS_ROUTE = `/?${PLANS_PAGE_TAB_PARAM}=reports`;

const renderReports = (
  plans: ProtectionPlan[],
  reports: PlanReportMeta[],
  kept: { planId: string; planName: string; reports: PlanReportMeta[] }[] = [],
) => {
  mockPlansPage(plans);
  mockEndpoint('exporter', Endpoints.REPORTS.LIST_KEPT, { data: kept });
  mockEndpoint('exporter', Endpoints.REPORTS.LIST_ALL, { data: reports });
  return renderApp(<MainPage />, { route: REPORTS_ROUTE });
};

describeListPage<ProtectionPlan>({
  feature: 'protection plans',
  page: <MainPage />,
  build: buildPlan,
  label: (plan) => plan.name,
  mockList: mockPlansPage,
  failList: () => mockNetworkError('exporter', Endpoints.PROTECTION_PLANS.LIST),
  emptyTitle: L.EMPTY.TITLE,
});

describe('protection plans list', () => {
  const ACTIVE = buildPlan({ name: 'freeze-orders', phase: 'active' });
  const CANCELED = buildPlan({ name: 'freeze-billing', phase: 'canceled' });

  const renderPlans = async (plans: ProtectionPlan[]) => {
    mockPlansPage(plans);
    const view = renderApp(<MainPage />);
    await screen.findByText(plans[0].name);
    return view;
  };

  it('narrows the cards by search', async () => {
    const { user } = await renderPlans([ACTIVE, CANCELED]);

    await searchList(user, L.TOOLBAR_SEARCH_PLACEHOLDER, 'billing');

    await waitFor(() => expect(screen.queryByText(ACTIVE.name)).not.toBeInTheDocument());
    expect(screen.getByText(CANCELED.name)).toBeInTheDocument();
  });

  it('narrows the cards by phase pill', async () => {
    const { user } = await renderPlans([ACTIVE, CANCELED]);

    await clickButton(user, new RegExp(`^${L.PHASE_LABELS.canceled}`));

    await waitFor(() => expect(screen.queryByText(ACTIVE.name)).not.toBeInTheDocument());
  });

  it('shows the no-match state when a filter hides every plan', async () => {
    const { user } = await renderPlans([ACTIVE]);

    await searchList(user, L.TOOLBAR_SEARCH_PLACEHOLDER, 'no-such-plan');

    expect(await screen.findByText(L.NO_MATCH.TITLE)).toBeInTheDocument();
  });

  it('keeps only the plans matching the filter panel', async () => {
    const [kept, dropped] = [
      buildPlan({
        name: 'freeze-namespace',
        scope: { type: 'namespaces', applicationRefs: [], namespaces: ['ops'] },
      }),
      buildPlan({ name: 'freeze-app' }),
    ];
    const { user } = await renderPlans([kept, dropped]);

    await applyFilters(user, { [L.FILTER.BY_SCOPE_TYPE]: 'namespaces' });

    await waitFor(() => expect(screen.queryByText(dropped.name)).not.toBeInTheDocument());
    expect(screen.getByText(kept.name)).toBeInTheDocument();
  });

  it('opens a plan when its card is clicked', async () => {
    const { user } = await renderPlans([ACTIVE]);

    await user.click(screen.getByText(ACTIVE.name));

    expect(currentLocation()).toBe(
      APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', ACTIVE.name),
    );
  });

  it.each([
    [L.TAXONOMY.KINDS, CC.SCOPES.PLAN_KINDS],
    [L.TAXONOMY.ENVIRONMENTS, CC.SCOPES.PLAN_ENVIRONMENTS],
    [L.TAXONOMY.TAGS, CC.SCOPES.PLAN_TAGS],
  ])('opens %s on the categories page from the organize menu', async (item, scope) => {
    const { user } = await renderPlans([ACTIVE]);

    await pickMenuItem(user, L.TAXONOMY.BUTTON, item);

    expect(currentLocation()).toBe(categoriesPageRoute(scope));
  });
});

describe('protection plans reports tab', () => {
  it('lists the generated reports', async () => {
    const plan = buildPlan({ id: 'plan-1', name: 'freeze-orders' });

    renderReports([plan], [buildPlanReport({ planId: plan.id })]);

    expect(await screen.findByRole('link', { name: plan.name })).toBeInTheDocument();
    expect(screen.getByText(L.REPORTS.TRIGGER_LABELS.manual)).toBeInTheDocument();
  });

  it('asks before deleting a report', async () => {
    const report = buildPlanReport({ planId: 'plan-1' });
    const remove = mockEmptyEndpoint('exporter', Endpoints.REPORTS.PLANS.DELETE('plan-1'));
    const { user } = renderReports([buildPlan({ id: 'plan-1' })], [report]);
    await screen.findByText(L.REPORTS.TRIGGER_LABELS.manual);

    await clickButton(user, new RegExp(L.REPORTS.DELETE));
    await clickInDialog(user, L.REPORTS.DELETE_MODAL_OK);

    await waitFor(() => expect(remove.calls).toHaveLength(1));
    expect(remove.calls[0].url.searchParams.get('report')).toBe(report.id);
  });

  it('filters the reports by plan name', async () => {
    const [kept, dropped] = [
      buildPlan({ id: 'plan-1', name: 'freeze-orders' }),
      buildPlan({ id: 'plan-2', name: 'freeze-billing' }),
    ];
    const { user } = renderReports(
      [kept, dropped],
      [buildPlanReport({ planId: kept.id }), buildPlanReport({ planId: dropped.id })],
    );
    await screen.findByRole('link', { name: dropped.name });

    await searchList(user, L.REPORTS_TAB.SEARCH_PLACEHOLDER, 'orders');

    await waitFor(() =>
      expect(screen.queryByRole('link', { name: dropped.name })).not.toBeInTheDocument(),
    );
  });

  it('shows the empty state when there are no reports', async () => {
    renderReports([buildPlan()], []);

    expect(await screen.findByText(L.REPORTS_TAB.EMPTY_TITLE)).toBeInTheDocument();
  });

  it('names a report whose plan was deleted but kept', async () => {
    const report = buildPlanReport({ planId: 'gone' });

    renderReports(
      [buildPlan()],
      [],
      [{ planId: 'gone', planName: 'old-freeze', reports: [report] }],
    );

    expect(await screen.findByText(L.REPORTS_TAB.KEPT_PLAN('old-freeze'))).toBeInTheDocument();
  });

  it('shows a permission card to users who may not view reports', async () => {
    mockPlansPage([]);

    renderApp(<MainPage />, {
      route: REPORTS_ROUTE,
      seed: permissionsSeed('ReadOnly', [ACTION_PERMISSIONS.protectionPlans.viewReports.deny]),
    });

    expect(
      await screen.findByText(NO_PERMISSION_CONSTANTS.LABELS.TITLE(L.TABS.REPORTS)),
    ).toBeInTheDocument();
  });
});
