import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../constants';
import type { StoreSeed } from '../../../test';
import {
  clickButton,
  currentLocation,
  mockEndpoint,
  mockNetworkError,
  permissionsSeed,
  renderApp,
} from '../../../test';
import {
  buildAppInsights,
  buildInsight,
  buildInsightRow,
  buildLastRun,
  buildRuntime,
} from '../../../test/factories/insights';
import {
  mockInsightLookup,
  mockInsightsApi,
  pushInsightEvent,
} from '../../../test/helpers/insightsApi';
import { findPanel, waitForPanelClose } from '../../../test/helpers/panel';
import { INSIGHT_EVENTS, RUNTIME_BANNER_TEXT } from '../constants/insights';
import { INSIGHTS_UI as T } from '../constants/texts';
import type { AnalyzerRuntime, AppInsights, Insight, InsightRow } from '../models';
import InsightsPage from '../pages/InsightsPage';

const P = T.PANEL;
const ROUTE = '/insights';

interface PanelSetup {
  row?: InsightRow;
  insight?: Partial<Insight>;
  doc?: Partial<AppInsights>;
  others?: Insight[];
  runtime?: AnalyzerRuntime;
  seed?: StoreSeed;
}

const openInsight = ({
  row = buildInsightRow(),
  insight,
  doc,
  others = [],
  runtime,
  seed,
}: PanelSetup = {}) => {
  const card = buildInsight({ id: row.id, title: row.title, ...insight });
  const key = `${row.namespace}/${row.app}`;
  const api = mockInsightsApi({
    rows: [row],
    documents: { [key]: buildAppInsights({ insights: [card, ...others], ...doc }) },
    runtime,
  });
  const view = renderApp(<InsightsPage />, {
    route: `${ROUTE}?insight=${row.id}`,
    seed: { ...permissionsSeed(), ...seed },
  });
  return { ...api, ...view, row, card, key };
};

const openLoaded = async (setup?: PanelSetup) => {
  const opened = openInsight(setup);
  await screen.findByText(opened.card.summary);
  return opened;
};

const documentsFor = (rows: InsightRow[]) =>
  Object.fromEntries(
    rows.map((row) => [
      `${row.namespace}/${row.app}`,
      buildAppInsights({ insights: [buildInsight({ id: row.id, title: row.title })] }),
    ]),
  );

const openDisclosure = async (user: UserEvent, label: string) =>
  user.click(await screen.findByText(label));

const appEvent = (extra: object) => ({ app: 'payments/checkout', version: 2, ...extra });

describe('insight details panel', () => {
  it('shows what happened, why, and what to do about it', async () => {
    const { card } = openInsight();

    expect(await screen.findByText(card.summary)).toBeInTheDocument();
    expect(screen.getByText(T.WHY)).toBeInTheDocument();
    expect(screen.getByText(T.WHAT_TO_DO)).toBeInTheDocument();
  });

  it('opens from a table row and updates the URL', async () => {
    const row = buildInsightRow();
    mockInsightsApi({ rows: [row], documents: documentsFor([row]) });
    const { user } = renderApp(<InsightsPage />, { route: ROUTE });

    await user.click(await screen.findByText(row.title));

    expect(await screen.findByText(P.TITLE_INCIDENT)).toBeInTheDocument();
    await waitFor(() => expect(currentLocation()).toBe(`${ROUTE}?insight=${row.id}`));
  });

  it('lists the details and evidence in its disclosure', async () => {
    const { user, card } = await openLoaded({
      insight: { params: { message: 'Back-off restarting', restarts: '7' } },
    });

    await openDisclosure(user, T.DETAILS);

    expect(await screen.findByText('Back-off restarting')).toBeInTheDocument();
    expect(screen.getByText(card.evidence[0].ref)).toBeInTheDocument();
    expect(screen.getByText(T.CONFIDENCE)).toBeInTheDocument();
  });

  it('says so when the analyzer no longer has the insight', async () => {
    const row = buildInsightRow();
    openInsight({ row, doc: { insights: [] } });

    expect(await screen.findByText(`${row.title}: ${P.NOT_FOUND}`)).toBeInTheDocument();
  });

  it('says so when the insight could not be read', async () => {
    const row = buildInsightRow();
    openInsight({ row });
    mockNetworkError('discovery', Endpoints.INSIGHTS.GET_APPLICATIONS);

    expect(await screen.findByText(P.LOAD_FAILED)).toBeInTheDocument();
  });

  it.each([
    ['incident', { category: 'incident' as const }, [T.ACKNOWLEDGE]],
    ['recommendation', { category: 'recommendation' as const }, [T.ACKNOWLEDGE, T.DISMISS]],
    [
      'triaged insight',
      { triage: { state: 'acknowledged' as const, by: 'sre_oncall', at: '2026-01-15T12:00:00Z' } },
      [T.REOPEN],
    ],
    ['resolved insight', { status: 'resolved' as const }, []],
  ])('offers the triage actions a %s allows', async (_name, insight, actions) => {
    await openLoaded({ insight });

    for (const action of actions) {
      expect(await screen.findByRole('button', { name: action })).toBeInTheDocument();
    }
    expect(
      screen.queryAllByRole('button', {
        name: new RegExp(`^(${T.ACKNOWLEDGE}|${T.DISMISS}|${T.REOPEN})$`),
      }).length,
    ).toBe(actions.length);
  });

  it('sends a triage and reads the insight again', async () => {
    const { user, documents, row } = await openLoaded();
    const triage = mockEndpoint(
      'analyzer',
      Endpoints.INSIGHTS.TRIAGE(row.namespace, row.app, row.id),
      { data: {} },
    );
    const readsBefore = documents.calls.length;

    await clickButton(user, T.ACKNOWLEDGE);

    await waitFor(() => expect(triage.calls[0].body).toEqual({ action: 'acknowledge' }));
    await waitFor(() => expect(documents.calls.length).toBeGreaterThan(readsBefore));
  });

  it('explains a triage the analyzer refused', async () => {
    const { user, row } = await openLoaded();
    mockEndpoint(
      'analyzer',
      Endpoints.INSIGHTS.TRIAGE(row.namespace, row.app, row.id),
      { data: { code: 'invalid_triage' } },
      { status: 409 },
    );

    await clickButton(user, T.ACKNOWLEDGE);

    expect(await screen.findByText(T.ERRORS.INVALID_TRIAGE)).toBeInTheDocument();
  });

  it('hides triage and Analyze from a read-only user', async () => {
    const { user } = await openLoaded({ seed: permissionsSeed('ReadOnly') });

    await openDisclosure(user, P.ANALYSIS);

    expect(await screen.findByText(T.RUN_LAST_ANALYSIS, { exact: false })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: T.ANALYZE_BUTTON })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: T.ACKNOWLEDGE })).not.toBeInTheDocument();
  });

  it.each([
    ['queued', { status: 'queued' as const, queuedAt: new Date().toISOString() }, T.QUEUED],
    [
      'running',
      {
        status: 'running' as const,
        startedAt: new Date().toISOString(),
        trigger: 'incident' as const,
      },
      T.ANALYZING.replace('{trigger}', T.TRIGGER.INCIDENT),
    ],
    [
      'failed',
      { status: 'failed' as const, error: 'model_timeout', trigger: 'manual' as const },
      T.ERRORS.MODEL_TIMEOUT,
    ],
    ['rules-only', { status: 'done' as const, steps: 0 }, T.RUN_RULES_ONLY.trim()],
    [
      'done',
      { status: 'done' as const, steps: 1, trigger: 'recovery' as const },
      'started by a recovery',
    ],
  ])('reports a %s analysis run', async (_name, run, text) => {
    const { user } = await openLoaded({ doc: { lastRun: buildLastRun(run) } });

    await openDisclosure(user, P.ANALYSIS);

    expect(await screen.findByText(text, { exact: false })).toBeInTheDocument();
  });

  it('starts an analysis and reads the insight again', async () => {
    const { user, documents, row } = await openLoaded();
    const analyze = mockEndpoint('analyzer', Endpoints.INSIGHTS.ANALYZE(row.namespace, row.app), {
      data: { runId: 'run', status: 'queued' },
    });
    const readsBefore = documents.calls.length;

    await openDisclosure(user, P.ANALYSIS);
    await clickButton(user, T.ANALYZE_BUTTON);

    await waitFor(() => expect(analyze.calls).toHaveLength(1));
    await waitFor(() => expect(documents.calls.length).toBeGreaterThan(readsBefore));
  });

  it('explains an analysis the analyzer refused', async () => {
    const { user, row } = await openLoaded();
    mockEndpoint(
      'analyzer',
      Endpoints.INSIGHTS.ANALYZE(row.namespace, row.app),
      { data: { code: 'cooldown_active' } },
      { status: 429 },
    );

    await openDisclosure(user, P.ANALYSIS);
    await clickButton(user, T.ANALYZE_BUTTON);

    expect(await screen.findByText(T.ERRORS.COOLDOWN_ACTIVE)).toBeInTheDocument();
  });

  it.each([
    ['rules-only', buildRuntime({ state: 'absent', mode: 'fast' }), T.RUNTIME_BANNER_RULES_ONLY],
    ['pulling', buildRuntime({ state: 'pulling', mode: 'deep' }), RUNTIME_BANNER_TEXT.pulling],
    ['absent', buildRuntime({ state: 'absent', mode: 'deep' }), RUNTIME_BANNER_TEXT.absent],
  ])('warns when the runtime is %s', async (_name, runtime, banner) => {
    const { user } = await openLoaded({ runtime });

    await openDisclosure(user, P.ANALYSIS);

    expect(await screen.findByText(banner)).toBeInTheDocument();
  });

  it('disables Analyze when a deep runtime is not ready', async () => {
    const { user } = await openLoaded({
      runtime: buildRuntime({ state: 'absent', mode: 'deep' }),
    });

    await openDisclosure(user, P.ANALYSIS);

    expect(await screen.findByRole('button', { name: T.ANALYZE_BUTTON })).toBeDisabled();
  });

  it('jumps to another finding of the same application', async () => {
    const other = buildInsight({ title: 'Out of memory on worker', status: 'resolved' });
    const { user } = await openLoaded({ others: [other] });

    await openDisclosure(user, P.OTHER_FINDINGS.replace('{count}', '1'));
    await user.click(await screen.findByText(other.title));

    await waitFor(() => expect(currentLocation()).toBe(`${ROUTE}?insight=${other.id}`));
  });

  it('copies a setting a step asks for', async () => {
    const insight = {
      category: 'recommendation' as const,
      kind: 'security' as const,
      reason: 'security.privilege_escalation_allowed',
    };
    const { user } = await openLoaded({ insight });
    const setting = 'securityContext.allowPrivilegeEscalation: false';

    await clickButton(user, `${P.COPY} ${setting}`);

    expect(await screen.findByText(P.COPIED)).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe(setting);
  });

  it('closes on Escape and steps through rows with the keyboard', async () => {
    const [first, second] = [
      buildInsightRow({ title: 'First row' }),
      buildInsightRow({ title: 'Second row' }),
    ];
    mockInsightsApi({ rows: [first, second], documents: documentsFor([first, second]) });
    const { user } = renderApp(<InsightsPage />, { route: `${ROUTE}?insight=${first.id}` });
    await screen.findByText(P.POSITION.replace('{index}', '1').replace('{total}', '2'));

    await user.keyboard('j');
    await screen.findByText(P.POSITION.replace('{index}', '2').replace('{total}', '2'));
    await user.keyboard('{Escape}');

    await waitForPanelClose();
    await waitFor(() => expect(currentLocation()).toBe(ROUTE));
  });

  it('keeps the panel wide or narrow on request', async () => {
    const { user } = await openLoaded();
    const panel = within(await findPanel());

    await user.click(panel.getByRole('button', { name: /expand/i }));

    expect(await panel.findByRole('button', { name: /collapse/i })).toBeInTheDocument();
  });

  it('shows the error of a failed run pushed by the stream', async () => {
    const { user, stream } = await openLoaded();
    await openDisclosure(user, P.ANALYSIS);

    await pushInsightEvent(
      stream,
      INSIGHT_EVENTS.ANALYSIS_FAILED,
      appEvent({ runId: 'run', error: 'queue_full' }),
    );

    expect(await screen.findByText(T.ERRORS.QUEUE_FULL)).toBeInTheDocument();
  });

  it('reads the insight again when the stream announces a change', async () => {
    const { stream, documents, card } = await openLoaded();
    const readsBefore = documents.calls.length;

    await pushInsightEvent(
      stream,
      INSIGHT_EVENTS.INSIGHT_UPDATED,
      appEvent({ id: card.id, status: 'updated' }),
    );

    await waitFor(() => expect(documents.calls.length).toBeGreaterThan(readsBefore));
  });

  it('follows the model runtime through the stream', async () => {
    const { user, stream } = await openLoaded({ runtime: buildRuntime({ mode: 'deep' }) });
    await openDisclosure(user, P.ANALYSIS);

    await pushInsightEvent(
      stream,
      INSIGHT_EVENTS.RUNTIME_CHANGED,
      buildRuntime({ state: 'model_missing', mode: 'deep' }),
    );

    expect(await screen.findByText(RUNTIME_BANNER_TEXT.model_missing)).toBeInTheDocument();
  });
});

describe('cold links to an insight', () => {
  const coldLink = (found?: InsightRow) => {
    mockInsightsApi();
    mockInsightLookup(found);
    return renderApp(<InsightsPage />, { route: `${ROUTE}?insight=wanted` });
  };

  it('drops the link when the insight no longer exists', async () => {
    coldLink();

    await waitFor(() => expect(currentLocation()).toBe(ROUTE));
  });

  it('switches to the tab the insight belongs to', async () => {
    coldLink(buildInsightRow({ id: 'wanted', category: 'recommendation' }));

    await waitFor(() => expect(currentLocation()).toContain('tab=recommendations'));
  });
});
