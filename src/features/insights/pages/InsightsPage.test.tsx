import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../constants';
import type { EndpointMock, StoreSeed } from '../../../test';
import {
  clickButton,
  describeListPage,
  mockEndpoint,
  mockNetworkError,
  permissionsSeed,
  renderApp,
  searchList,
  currentLocation,
  mockServerError,
} from '../../../test';
import { buildClusterPage, buildInsightRow } from '../../../test/factories/insights';
import { seedGlobalConfig } from '../../../test/helpers/featureApi';
import { mockInsightsApi } from '../../../test/helpers/insightsApi';
import { findPanel, waitForPanelClose } from '../../../test/helpers/panel';
import { pickSelectOption } from '../../../test/antd';
import { CLUSTER_INSIGHTS } from '../constants/insights';
import { INSIGHTS_UI } from '../constants/texts';
import type { InsightRow } from '../models';
import InsightsPage from './InsightsPage';

const P = INSIGHTS_UI.PAGE;
const ROUTE = '/insights';

const renderPage = (route: string = ROUTE, seed: StoreSeed = {}) =>
  renderApp(<InsightsPage />, { route, seed: { ...permissionsSeed(), ...seed } });

const tabLabel = (label: string, count: number): string =>
  P.TABS.COUNT.replace('{label}', label).replace('{count}', String(count));

const lastParam = (mock: EndpointMock<unknown>, name: string): string | null =>
  mock.calls[mock.calls.length - 1].url.searchParams.get(name);

const selectRowAndAcknowledge = async (user: UserEvent) => {
  await clickButton(user, P.SELECT);
  const [, rowCheckbox] = await screen.findAllByRole('checkbox');
  await user.click(rowCheckbox);
  await clickButton(user, P.BULK_ACKNOWLEDGE);
};

describeListPage<InsightRow>({
  feature: 'insights',
  page: <InsightsPage />,
  build: buildInsightRow,
  label: (row) => row.title,
  mockList: (rows) => void mockInsightsApi({ rows }),
  failList: () => mockNetworkError('discovery', Endpoints.INSIGHTS.LIST),
  emptyTitle: P.ALL_CLEAR_INCIDENTS,
});

describe('insights list', () => {
  it.each([
    ['the analyzer is off', { enabled: false }, P.ANALYZER_OFF_TITLE],
    ['automatic analysis is off', { enabled: true, autoAnalyze: false }, P.MANUAL_ANALYSIS_TITLE],
    ['everything is on', { enabled: true, autoAnalyze: true }, P.ALL_CLEAR_TITLE],
  ])('explains the empty list when %s', async (_name, ai, title) => {
    mockInsightsApi();

    renderPage(ROUTE, seedGlobalConfig({ ai }));

    expect(await screen.findByText(title)).toBeInTheDocument();
  });

  it('shows the open counts of both categories in the tabs', async () => {
    mockInsightsApi({
      page: buildClusterPage([], {
        counts: {
          bySeverity: {},
          byCategory: { incident: 3, recommendation: 7 },
          byState: {},
        },
      }),
    });

    renderPage();

    expect(await screen.findByText(tabLabel(P.TABS.INCIDENTS, 3))).toBeInTheDocument();
    expect(screen.getByText(tabLabel(P.TABS.RECOMMENDATIONS, 7))).toBeInTheDocument();
  });

  it('loads the other category when switching tabs and remembers the tab in the URL', async () => {
    const { list } = mockInsightsApi({ rows: [buildInsightRow()] });
    const { user } = renderPage();

    await user.click(await screen.findByText(tabLabel(P.TABS.RECOMMENDATIONS, 0)));

    await waitFor(() => expect(lastParam(list, 'category')).toBe('recommendation'));
    await waitFor(() => expect(currentLocation()).toBe(`${ROUTE}?tab=recommendations`));
  });

  it('asks the server for one severity when a pill is selected', async () => {
    const { list } = mockInsightsApi({ rows: [buildInsightRow({ severity: 'warning' })] });
    const { user } = renderPage();

    await clickButton(user, /^Warning/);

    await waitFor(() => expect(lastParam(list, 'severity')).toBe('warning'));
    expect(screen.getByRole('button', { name: /^Warning/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sends the search to the server after a pause in typing', async () => {
    const { list } = mockInsightsApi({ rows: [buildInsightRow()] });
    const { user } = renderPage();
    await screen.findByRole('button', { name: /^Critical/ });

    await searchList(user, P.SEARCH_PLACEHOLDER, 'checkout');

    await waitFor(() => expect(lastParam(list, 'q')).toBe('checkout'));
  });

  it('reads every page of a long list and tells when it was capped', async () => {
    const row = buildInsightRow();
    const { list } = mockInsightsApi({ page: buildClusterPage([row], { total: 250 }) });

    renderPage();

    const shown = P.CAPPED.replace('{shown}', '1').replace('{total}', '250');
    expect(await screen.findByText(shown)).toBeInTheDocument();
    expect(list.calls.map((call) => call.url.searchParams.get('page'))).toEqual(
      expect.arrayContaining(['1', '2', '3']),
    );
  });

  it.each([
    ['app', (row: InsightRow) => row.app],
    ['namespace', (row: InsightRow) => row.namespace],
    ['category', () => 'Crash loop'],
  ])('groups rows by %s, as remembered from the last visit', async (groupBy, header) => {
    localStorage.setItem(CLUSTER_INSIGHTS.GROUP_BY_STORAGE_KEY, groupBy);
    const row = buildInsightRow();
    mockInsightsApi({ rows: [row] });

    renderPage();

    await screen.findByText(row.title);
    expect(screen.getByText(P.GROUP_TOTAL.one.replace('{count}', '1'))).toBeInTheDocument();
    expect(screen.getAllByText(header(row)).length).toBeGreaterThan(0);
  });

  it('groups through the toolbar, collapses a group and remembers the choice', async () => {
    const row = buildInsightRow();
    mockInsightsApi({ rows: [row] });
    const { user } = renderPage();

    await clickButton(user, new RegExp(P.GROUP_BY));
    await user.click(await screen.findByRole('menuitem', { name: P.GROUP.NAMESPACE }));
    const header = await screen.findByText(P.GROUP_TOTAL.one.replace('{count}', '1'));
    await user.click(header);

    await waitFor(() => expect(screen.queryByText(row.title)).not.toBeInTheDocument());
    expect(localStorage.getItem(CLUSTER_INSIGHTS.GROUP_BY_STORAGE_KEY)).toBe('namespace');
  });

  it('filters through the panel and resets back to all', async () => {
    const { list } = mockInsightsApi({ rows: [buildInsightRow()] });
    const { user } = renderPage();
    await clickButton(user, 'Filter');

    const panel = await findPanel();
    const [severity] = await within(panel).findAllByRole('combobox');
    await pickSelectOption(user, severity, INSIGHTS_UI.SEVERITY.INFO);
    await waitFor(() => expect(lastParam(list, 'severity')).toBe('info'));
    await clickButton(user, BUTTON_TEXTS.RESET);
    await waitFor(() => expect(lastParam(list, 'severity')).toBeNull());
    await clickButton(user, BUTTON_TEXTS.APPLY);

    await waitForPanelClose();
  });

  it('narrows the list to the application in the URL, and clears it from the chip', async () => {
    const row = buildInsightRow();
    const key = `${row.namespace}/${row.app}`;
    const { list } = mockInsightsApi({ rows: [row] });
    const { user } = renderPage(`${ROUTE}?${CLUSTER_INSIGHTS.APP_PARAM}=${key}`);

    expect(await screen.findByText(`${P.APP_CHIP}: ${key}`)).toBeInTheDocument();
    expect(await screen.findByText(INSIGHTS_UI.NOT_REVIEWED_YET)).toBeInTheDocument();
    expect(lastParam(list, 'app')).toBe(key);

    await clickButton(user, /remove/i);

    await waitFor(() => expect(currentLocation()).toBe(ROUTE));
  });

  it('acknowledges the selected rows in bulk and reports the result', async () => {
    const row = buildInsightRow();
    mockInsightsApi({ rows: [row] });
    const triage = mockEndpoint(
      'analyzer',
      Endpoints.INSIGHTS.TRIAGE(row.namespace, row.app, row.id),
      { data: {} },
    );
    const { user } = renderPage();

    await selectRowAndAcknowledge(user);

    expect(await screen.findByText(P.BULK_DONE.replace('{done}', '1'))).toBeInTheDocument();
    expect(triage.calls[0].body).toEqual({ action: 'acknowledge' });
  });

  it('reports a bulk action that fails', async () => {
    const row = buildInsightRow();
    mockInsightsApi({ rows: [row] });
    mockServerError('analyzer', Endpoints.INSIGHTS.TRIAGE(row.namespace, row.app, row.id));
    const { user } = renderPage();

    await selectRowAndAcknowledge(user);

    const summary = [
      P.BULK_DONE.replace('{done}', '0'),
      P.BULK_FAILED.replace('{failed}', '1'),
    ].join(' · ');
    expect(await screen.findByText(summary)).toBeInTheDocument();
  });

  it('disables bulk selection without the Owner level', async () => {
    mockInsightsApi({ rows: [buildInsightRow()] });

    renderPage(ROUTE, permissionsSeed('ReadOnly'));

    expect(await screen.findByRole('button', { name: P.SELECT })).toBeDisabled();
  });

  it('refreshes on demand', async () => {
    const { list } = mockInsightsApi({ rows: [buildInsightRow()] });
    const { user } = renderPage();
    await screen.findByRole('button', { name: /^Critical/ });
    const callsBefore = list.calls.length;

    await clickButton(user, P.REFRESH);

    await waitFor(() => expect(list.calls.length).toBeGreaterThan(callsBefore));
  });

  it('sorts by a column header', async () => {
    const low = buildInsightRow({ title: 'Lower priority', severity: 'info' });
    const high = buildInsightRow({ title: 'Higher priority', severity: 'critical' });
    mockInsightsApi({ rows: [low, high] });
    const { user } = renderPage();
    await screen.findByText(low.title);
    const titles = () =>
      within(screen.getByRole('table'))
        .getAllByRole('row')
        .map((tableRow) => tableRow.textContent ?? '');
    expect(titles()[1]).toContain(high.title);

    const column = screen.getByRole('columnheader', { name: new RegExp(P.COLUMNS.SEVERITY) });
    await user.click(within(column).getByText(P.COLUMNS.SEVERITY));

    await waitFor(() => expect(titles()[1]).toContain(low.title));
  });
});
