import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NO_PERMISSION_CONSTANTS } from '../../../components/shared';
import { APP_ROUTES, Endpoints } from '../../../constants';
import {
  clickButton,
  currentLocation,
  permissionsSeed,
  renderApp,
  type StoreSeed,
  mockServerError,
} from '../../../test';
import { buildApplication, buildApplicationWith } from '../../../test/factories/applications';
import { buildInsightRow, buildRuntime } from '../../../test/factories/insights';
import { buildReportStorage, buildSnapshotStorage } from '../../../test/factories/settings';
import { buildPlan } from '../../../test/factories/plans';
import { findBox } from '../../../test/helpers/dashboard';
import { mockHomeLists, seedGlobalConfig } from '../../../test/helpers/featureApi';
import { mockInsightsApi } from '../../../test/helpers/insightsApi';
import type { Application } from '../../applications/models';
import { ACTION_PERMISSIONS } from '../../auth/hooks/permissions/permissionEngine';
import { AttentionInsightsProvider, INSIGHTS_UI } from '../../insights';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../plans/protection/constants/protectionPlans';
import type { ProtectionPlan } from '../../plans/protection/models';
import { HOME_DASHBOARD_TEXTS as T } from '../constants/dashboard';
import Dashboard from './Dashboard';

const A = T.NEEDS_ATTENTION;
const APP = buildApplication({
  name: 'orders',
  displayName: 'Orders',
  health: { status: 'degraded', readyReplicas: 1, totalReplicas: 2 },
});

const renderDashboard = (seed: StoreSeed = permissionsSeed()) =>
  renderApp(
    <AttentionInsightsProvider active>
      <Dashboard />
    </AttentionInsightsProvider>,
    { seed },
  );

interface DashboardOptions {
  storage?: Parameters<typeof mockHomeLists>[2];
  insights?: Parameters<typeof mockInsightsApi>[0];
  seed?: StoreSeed;
}

const openDashboard = (
  applications: Application[] = [APP],
  plans: ProtectionPlan[] = [],
  { storage, insights, seed }: DashboardOptions = {},
) => {
  mockHomeLists(applications, plans, storage);
  mockInsightsApi(insights);
  return renderDashboard(seed);
};

const seedWithoutScope = (scope: string): StoreSeed => {
  const seed = permissionsSeed();
  const scopeIndex = { ...seed.permissions?.scopeIndex };
  delete scopeIndex[scope];
  return { ...seed, permissions: { ...seed.permissions, scopeIndex } };
};

describe('home dashboard', () => {
  it('waits for the permissions before showing anything', () => {
    openDashboard([], [], {
      seed: { permissions: { ...permissionsSeed().permissions, ready: false } },
    });

    expect(screen.queryByRole('heading', { name: T.TITLE })).not.toBeInTheDocument();
  });

  it('counts applications and plans by state', async () => {
    const running = buildPlan({ name: 'freeze-a', phase: 'active' });
    const failed = buildPlan({ name: 'freeze-b', phase: 'failed' });

    openDashboard([APP], [running, failed]);

    const applications = within(await findBox(T.APPLICATIONS.TITLE));
    expect(await applications.findByText(T.APPLICATIONS.DEGRADED)).toHaveTextContent(
      `1${T.APPLICATIONS.DEGRADED}`,
    );
    const plans = within(await findBox(T.PLANS.TITLE));
    expect(await plans.findByText(T.PLANS.FAILED)).toHaveTextContent(`1${T.PLANS.FAILED}`);
  });

  it('lists plans that need attention, failed first, and opens one', async () => {
    const failed = buildPlan({ name: 'freeze-failed', phase: 'failed' });
    const degraded = buildPlan({ name: 'freeze-degraded', phase: 'active', health: 'degraded' });
    const { user } = openDashboard([APP], [degraded, failed]);
    const box = within(await findBox(T.PLANS_ATTENTION.TITLE));
    const rows = await box.findAllByText(/^freeze-/);
    expect(rows.map((row) => row.textContent)).toEqual([failed.name, degraded.name]);

    await user.click(rows[0]);

    expect(currentLocation()).toBe(
      APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', failed.name),
    );
  });

  it('shows the recent changes of the applications', async () => {
    const changed = buildApplicationWith({
      name: 'billing',
      displayName: 'Billing',
      derived: { totalChanges: 2, totalIncidents: 1 },
    });

    openDashboard([changed]);

    const box = within(await findBox(T.RECENT_CHANGES.TITLE));
    expect(await box.findByText('Billing')).toBeInTheDocument();
    expect(
      box.getByText(
        `2 ${T.RECENT_CHANGES.CHANGES}${T.META_SEPARATOR}1 ${T.RECENT_CHANGES.INCIDENT}`,
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it('shows the open incidents that need attention', async () => {
    const row = buildInsightRow({ title: 'Crash loop on orders', severity: 'critical' });

    openDashboard([APP], [], { insights: { rows: [row] } });

    const box = within(await findBox(A.TITLE));
    expect(await box.findByText(A.CRITICAL_OPEN(1))).toBeInTheDocument();
    expect(box.getByText(row.title)).toBeInTheDocument();
  });

  it('reads the cluster version and its distribution', async () => {
    openDashboard([APP], [], {
      seed: seedGlobalConfig({ cluster: { version: 'v1.29.2-eks-5e0fdde' } }),
    });

    const box = within(await findBox(T.CLUSTER.TITLE));
    expect(box.getByText('v1.29.2 EKS')).toBeInTheDocument();
    expect(box.getByText('v1.29.2-eks-5e0fdde')).toBeInTheDocument();
  });

  it('draws the storage usage of snapshots and reports', async () => {
    openDashboard([APP], [], {
      storage: { snapshots: buildSnapshotStorage(), reports: buildReportStorage() },
    });

    const box = within(await findBox(T.STORAGE.TITLE));
    expect(await box.findByText('25.0%')).toBeInTheDocument();
    expect(
      box.getByText(`250 / 1000 ${T.STORAGE.MB}${T.META_SEPARATOR}${T.STORAGE.SNAPSHOT_COUNT(12)}`),
    ).toBeInTheDocument();
    expect(
      box.getByText(`50 / 500 ${T.STORAGE.MB}${T.META_SEPARATOR}${T.STORAGE.REPORT_COUNT(3)}`),
    ).toBeInTheDocument();
  });

  it('says a storage read failed while keeping the other meter', async () => {
    mockHomeLists([APP], [], { reports: buildReportStorage() });
    mockServerError('exporter', Endpoints.SNAPSHOTS.GET_INFOS);
    mockInsightsApi();

    renderDashboard();

    const box = within(await findBox(T.STORAGE.TITLE));
    expect(await box.findByText(T.LOAD_FAILED)).toBeInTheDocument();
    expect(box.getByText('10.0%')).toBeInTheDocument();
  });

  it('marks a box as failed when its list cannot be read', async () => {
    mockHomeLists([], [buildPlan()]);
    mockServerError('exporter', Endpoints.APPLICATIONS.GET_ALL);
    mockInsightsApi();

    renderDashboard();

    const box = within(await findBox(T.APPLICATIONS.TITLE));
    expect(await box.findByText(T.LOAD_FAILED)).toBeInTheDocument();
  });

  it('leads with Get started until a first plan exists', async () => {
    const { user } = openDashboard();

    expect(await screen.findByRole('heading', { name: T.GET_STARTED.TITLE })).toBeInTheDocument();
    expect(screen.getByText(T.GET_STARTED.DISCOVER.FOUND(1))).toBeInTheDocument();

    await clickButton(user, PPC.LABELS.CREATE_BUTTON);
    expect(currentLocation()).toBe(APP_ROUTES.PROTECTION_PLANS);
  });

  it('says when every discovered application is excluded', async () => {
    openDashboard([buildApplication()], [], {
      seed: seedGlobalConfig({ excludedNamespaces: ['payments'] }),
    });

    expect(await screen.findByText(T.GET_STARTED.DISCOVER.ALL_EXCLUDED(1))).toBeInTheDocument();
  });

  it('hides Get started once a plan exists', async () => {
    openDashboard([APP], [buildPlan()]);

    await within(await findBox(T.PLANS.TITLE)).findByText(T.PLANS.FAILED);
    await within(await findBox(T.APPLICATIONS.TITLE)).findByText(T.APPLICATIONS.DEGRADED);
    expect(screen.queryByRole('heading', { name: T.GET_STARTED.TITLE })).not.toBeInTheDocument();
  });

  it.each<[string, DashboardOptions, string]>([
    [
      'automatic analysis on',
      { seed: seedGlobalConfig({ ai: { autoAnalyze: true } }) },
      A.ALL_CLEAR,
    ],
    [
      'automatic analysis off',
      { seed: seedGlobalConfig({ ai: { autoAnalyze: false } }) },
      INSIGHTS_UI.PAGE.MANUAL_ANALYSIS_TITLE,
    ],
    [
      'the analyzer turned off',
      { insights: { runtime: buildRuntime({ enabled: false }) } },
      INSIGHTS_UI.PAGE.ANALYZER_OFF_TITLE,
    ],
  ])('with %s, Needs attention says so when nothing is open', async (_label, options, text) => {
    openDashboard([APP], [buildPlan()], options);

    const box = within(await findBox(A.TITLE));
    expect(await box.findByText(text, { exact: false })).toBeInTheDocument();
  });

  it.each([
    [T.APPLICATIONS.TITLE, seedWithoutScope(ACTION_PERMISSIONS.applications.view.scope)],
    [T.PLANS.TITLE, permissionsSeed('Owner', [ACTION_PERMISSIONS.protectionPlans.view.deny])],
    [
      T.STORAGE.TITLE,
      permissionsSeed('Owner', [
        ACTION_PERMISSIONS.applications.viewSnapshots.deny,
        ACTION_PERMISSIONS.protectionPlans.viewReports.deny,
      ]),
    ],
    [A.TITLE, seedWithoutScope(ACTION_PERMISSIONS.insights.view.scope)],
  ])('shows the %s box locked to viewers without access', async (title, seed) => {
    openDashboard([APP], [buildPlan()], { seed });

    const box = within(await findBox(title));
    expect(await box.findByText(NO_PERMISSION_CONSTANTS.LABELS.EMPTY_TITLE)).toBeInTheDocument();
  });

  it('keeps the box when a single storage read is denied', async () => {
    openDashboard([APP], [buildPlan()], {
      storage: { reports: buildReportStorage() },
      seed: permissionsSeed('Owner', [ACTION_PERMISSIONS.applications.viewSnapshots.deny]),
    });

    const box = within(await findBox(T.STORAGE.TITLE));
    expect(await box.findByText(T.STORAGE.NO_ACCESS)).toBeInTheDocument();
  });
});
