import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DATA_VIEW_ERROR_CONSTANTS } from '../../../../components/shared';
import {
  APP_ROUTES,
  BUTTON_TEXTS,
  CARD_TEXTS,
  Endpoints,
  LIST_TOOLBAR,
} from '../../../../constants';
import {
  clickButton,
  currentLocation,
  describeListPage,
  fillFields,
  mockEmptyEndpoint,
  mockEndpoint,
  mockNetworkError,
  renderApp,
  searchList,
  setLayoutWidth,
  pickMenuItem,
  mockServerError,
} from '../../../../test';
import { buildApplication, buildApplicationWith } from '../../../../test/factories/applications';
import { buildPlan } from '../../../../test/factories/plans';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { mockApplicationsPage, seedGlobalConfig } from '../../../../test/helpers/featureApi';
import { applyFilters } from '../../../../test/helpers/filterPanel';
import { goToPage } from '../../../../test/helpers/menus';
import { APPLICATIONS_CONSTANTS, APPLICATIONS_UI, APPLICATION_CARD } from '../../constants';
import type { Application } from '../../models';
import GlobalView from './GlobalView';

const ORDERS = buildApplication({ name: 'orders', displayName: 'Orders' });
const BILLING = buildApplicationWith({
  name: 'billing',
  displayName: 'Billing',
  health: { status: 'down', readyReplicas: 0, totalReplicas: 2 },
  history: { hasDrift: true },
});

const renderList = async (applications: Application[]) => {
  mockApplicationsPage(applications);
  const view = renderApp(<GlobalView />);
  await screen.findByText(applications[0].displayName);
  return view;
};

describeListPage<Application>({
  feature: 'applications',
  page: <GlobalView />,
  build: buildApplication,
  label: (application) => application.displayName,
  mockList: mockApplicationsPage,
  failList: () => mockNetworkError('exporter', Endpoints.APPLICATIONS.GET_ALL),
  emptyTitle: APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_TITLE,
});

describe('applications list', () => {
  it('narrows the cards by search', async () => {
    const { user } = await renderList([ORDERS, BILLING]);

    await searchList(user, APPLICATIONS_UI.TOOLBAR_SEARCH_PLACEHOLDER, 'order');

    await waitFor(() => expect(screen.queryByText(BILLING.displayName)).not.toBeInTheDocument());
    expect(screen.getByText(ORDERS.displayName)).toBeInTheDocument();
  });

  it('narrows the cards by health pill', async () => {
    const { user } = await renderList([ORDERS, BILLING]);

    await clickButton(user, new RegExp(`^${APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.UNHEALTHY}`));

    await waitFor(() => expect(screen.queryByText(ORDERS.displayName)).not.toBeInTheDocument());
    expect(screen.getByText(BILLING.displayName)).toBeInTheDocument();
  });

  it('pages through more applications than fit on one page', async () => {
    const applications = Array.from({ length: 13 }, (_, index) =>
      buildApplication({ name: `app-${index}`, displayName: `App ${index}` }),
    );
    const { user } = await renderList(applications);

    expect(screen.queryByText('App 12')).not.toBeInTheDocument();
    await goToPage(user, 2);

    expect(await screen.findByText('App 12')).toBeInTheDocument();
    expect(screen.queryByText('App 0')).not.toBeInTheDocument();
  });

  it('hides applications in excluded namespaces and explains an empty result', async () => {
    const excluded = buildApplication();
    mockApplicationsPage([excluded]);
    renderApp(<GlobalView />, {
      seed: seedGlobalConfig({ excludedNamespaces: ['payments'] }),
    });

    expect(
      await screen.findByText(APPLICATIONS_CONSTANTS.MESSAGES.ALL_EXCLUDED(1)),
    ).toBeInTheDocument();
  });

  it('opens an application when its card is clicked', async () => {
    const { user } = await renderList([ORDERS]);

    await user.click(screen.getByText(ORDERS.displayName));

    expect(currentLocation()).toBe(APP_ROUTES.APPLICATION_DETAILS.replace(':name', ORDERS.name));
  });

  it('shows the plan that covers an application', async () => {
    const plan = buildPlan({
      name: 'black-friday',
      scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
    });
    mockApplicationsPage([ORDERS], [plan]);
    renderApp(<GlobalView />);

    expect(await screen.findByRole('link', { name: plan.name })).toHaveAttribute(
      'href',
      APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', plan.name),
    );
    expect(screen.queryByText(APPLICATION_CARD.COVERAGE.NO_PLAN)).not.toBeInTheDocument();
  });

  it('reports a failed reload instead of an empty list', async () => {
    mockApplicationsPage([ORDERS]);
    mockServerError('exporter', Endpoints.APPLICATIONS.GET_ALL);

    renderApp(<GlobalView />);

    expect(
      await screen.findByRole('button', { name: DATA_VIEW_ERROR_CONSTANTS.LABELS.RETRY_BUTTON }),
    ).toBeInTheDocument();
  });

  it('collapses the toolbar on a narrow screen', async () => {
    setLayoutWidth(500);
    await renderList([ORDERS, BILLING]);

    const compactFilter = await screen.findByRole('button', {
      name: new RegExp(APPLICATIONS_UI.TOOLBAR_HEALTH_FILTER),
    });
    expect(compactFilter).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: new RegExp(`^${APPLICATIONS_UI.TOOLBAR_HEALTH_OPTIONS.DEGRADED}`),
      }),
    ).not.toBeInTheDocument();
  });
});

describe('applications list filters', () => {
  it.each([
    [APPLICATIONS_UI.FILTER.BY_STATUS, 'down'],
    [APPLICATIONS_UI.FILTER.BY_HAS_DRIFT, APPLICATIONS_UI.FILTER.OPTION_YES],
  ])('keeps only the matches of %s, and clears the filter', async (label, option) => {
    const { user } = await renderList([ORDERS, BILLING]);

    await applyFilters(user, { [label]: option });

    await waitFor(() => expect(screen.queryByText(ORDERS.displayName)).not.toBeInTheDocument());
    await clickButton(user, LIST_TOOLBAR.REMOVE_CHIP_LABEL);
    expect(await screen.findByText(ORDERS.displayName)).toBeInTheDocument();
  });

  it('says when no application matches the filters and offers to clear them', async () => {
    const { user } = await renderList([ORDERS]);

    await applyFilters(user, { [APPLICATIONS_UI.FILTER.BY_MANAGED_BY]: 'Helm' });
    await searchList(user, APPLICATIONS_UI.TOOLBAR_SEARCH_PLACEHOLDER, 'nothing');

    expect(await screen.findByText(APPLICATIONS_UI.NO_MATCH_TITLE)).toBeInTheDocument();
    await clickButton(user, APPLICATIONS_UI.CLEAR_ALL_FILTERS);
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: APPLICATIONS_UI.CLEAR_ALL_FILTERS }),
      ).not.toBeInTheDocument(),
    );
  });
});

describe('applications list actions', () => {
  const application = ORDERS;
  const cardActions = CARD_TEXTS.ACTIONS_LABEL(application.displayName);

  it('saves a new display name from the card menu', async () => {
    const save = mockEndpoint<{ spec: unknown }>(
      'exporter',
      Endpoints.APPLICATIONS.UPDATE(application.name),
      { data: { ...application, displayName: 'Orders v2' } },
    );
    const { user } = await renderList([application]);

    await pickMenuItem(user, cardActions, APPLICATIONS_UI.CARD.ACTIONS.EDIT);
    await fillFields(user, { [APPLICATIONS_UI.EDIT_PAGE.DISPLAY_NAME_LABEL]: 'Orders v2' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    await waitFor(() => expect(save.calls).toHaveLength(1));
    expect(save.calls[0].body).toEqual({ spec: { displayName: 'Orders v2' } });
  });

  it('asks for confirmation, then resets an application', async () => {
    const reset = mockEmptyEndpoint('discovery', Endpoints.APPLICATIONS.RESET(application.name));
    const { user } = await renderList([application]);

    await pickMenuItem(user, cardActions, APPLICATIONS_UI.CARD.ACTIONS.RESET);
    await clickInDialog(user, APPLICATIONS_UI.CARD.ACTIONS.RESET);

    await waitFor(() => expect(reset.calls).toHaveLength(1));
  });

  it('force syncs an application from the card menu', async () => {
    const sync = mockEndpoint('discovery', Endpoints.SYNC.APPLICATION(application.name), {
      data: { jobId: 'job-1' },
    });
    const { user } = await renderList([application]);

    await pickMenuItem(user, cardActions, APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC);

    await waitFor(() => expect(sync.calls).toHaveLength(1));
  });
});

describe('applications bulk mode', () => {
  const applications = [ORDERS, BILLING];

  const enterBulkAndSelectAll = async () => {
    const view = await renderList(applications);
    await pickMenuItem(
      view.user,
      APPLICATIONS_UI.TOOLBAR_MORE_LABEL,
      APPLICATIONS_UI.TOOLBAR_BULK_SELECT,
    );
    await view.user.click(
      await screen.findByRole('checkbox', { name: new RegExp(APPLICATIONS_UI.TOOLBAR_SELECT_ALL) }),
    );
    return view;
  };

  it('resets every selected application after confirming', async () => {
    const resets = applications.map((app) =>
      mockEmptyEndpoint('discovery', Endpoints.APPLICATIONS.RESET(app.name)),
    );
    const { user } = await enterBulkAndSelectAll();

    await clickButton(user, APPLICATIONS_UI.TOOLBAR_BULK_RESET);
    await clickInDialog(user, APPLICATIONS_UI.CARD.ACTIONS.RESET);

    await waitFor(() => resets.forEach((reset) => expect(reset.calls).toHaveLength(1)));
  });

  it('force syncs every selected application', async () => {
    const syncs = applications.map((app) =>
      mockEndpoint('discovery', Endpoints.SYNC.APPLICATION(app.name), { data: {} }),
    );
    const { user } = await enterBulkAndSelectAll();

    await clickButton(user, APPLICATIONS_UI.TOOLBAR_BULK_FORCE_SYNC);

    await waitFor(() => syncs.forEach((sync) => expect(sync.calls).toHaveLength(1)));
  });
});
