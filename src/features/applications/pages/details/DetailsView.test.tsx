import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, BUTTON_TEXTS, Endpoints, MENU_LABELS } from '../../../../constants';
import {
  clickButton,
  currentLocation,
  fillFields,
  mockEmptyEndpoint,
  mockEndpoint,
  permissionsSeed,
  pickMenuItem,
  mockServerError,
} from '../../../../test';
import { buildApplication, buildChangeLogEntry } from '../../../../test/factories/applications';
import { detailsPage } from '../../../../test/helpers/detailsPage';
import { mockApplicationDetails } from '../../../../test/helpers/featureApi';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { CLUSTER_INSIGHTS, insightsAppKey } from '../../../insights';
import { APPLICATION_DETAILS_CONSTANTS, APPLICATIONS_UI } from '../../constants';
import type { Application } from '../../models';
import DetailsView from './DetailsView';

const UI = APPLICATIONS_UI;
const { renderDetails, openDetails } = detailsPage<Application>({
  page: <DetailsView />,
  path: APP_ROUTES.APPLICATION_DETAILS,
  mockRecord: mockApplicationDetails,
  loadedText: UI.SECTIONS.OVERVIEW.TITLE,
});

describe('application details', () => {
  const application = buildApplication();

  it('offers a retry when the application cannot be loaded', async () => {
    mockApplicationDetails(application);
    mockServerError('exporter', Endpoints.APPLICATIONS.GET_DETAILS(application.name));

    renderDetails(application);

    expect(
      await screen.findByText(APPLICATION_DETAILS_CONSTANTS.MESSAGES.ERROR),
    ).toBeInTheDocument();
  });

  it('shows the summary of the application', async () => {
    const degraded = buildApplication({
      displayName: 'Orders',
      health: { status: 'degraded', readyReplicas: 1, totalReplicas: 3 },
    });

    await openDetails(degraded);

    expect(screen.getByText(UI.SECTIONS.OVERVIEW.REPLICAS_READY(1, 3))).toBeInTheDocument();
    expect(screen.getAllByText(degraded.managed.chart as string).length).toBeGreaterThan(0);
  });

  it('force syncs the application', async () => {
    const { user } = await openDetails(application);
    const sync = mockEndpoint('discovery', Endpoints.SYNC.APPLICATION(application.name), {
      data: { jobId: 'job' },
    });

    await clickButton(user, UI.CARD.ACTIONS.FORCE_SYNC);

    await waitFor(() => expect(sync.calls).toHaveLength(1));
  });

  it('reports a failed force sync', async () => {
    const { user } = await openDetails(application);
    mockEndpoint(
      'discovery',
      Endpoints.SYNC.APPLICATION(application.name),
      { message: 'Sync queue is full' },
      { status: 503 },
    );

    await clickButton(user, UI.CARD.ACTIONS.FORCE_SYNC);

    expect(await screen.findByText('Sync queue is full')).toBeInTheDocument();
  });

  it('saves edited metadata', async () => {
    const { user } = await openDetails(application);
    const update = mockEndpoint<{ spec: unknown }>(
      'exporter',
      Endpoints.APPLICATIONS.UPDATE(application.name),
      { data: application },
    );

    await clickButton(user, UI.CARD.ACTIONS.EDIT);
    await fillFields(user, { [UI.EDIT_PAGE.DESCRIPTION_LABEL]: 'Takes orders' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    await waitFor(() => expect(update.calls).toHaveLength(1));
    expect(update.calls[0].body).toEqual({ spec: { description: 'Takes orders' } });
  });

  it('resets the application after confirming and returns to the list', async () => {
    const { user } = await openDetails(application);
    const reset = mockEmptyEndpoint('discovery', Endpoints.APPLICATIONS.RESET(application.name));

    await pickMenuItem(user, UI.SECTIONS.DETAILS_TOOLBAR.MORE_LABEL, UI.CARD.ACTIONS.RESET);
    await clickInDialog(user, UI.CARD.ACTIONS.RESET);

    await waitFor(() => expect(reset.calls).toHaveLength(1));
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.APPLICATIONS));
  });

  it('jumps to the insights of the application', async () => {
    const { user } = await openDetails(application);

    await clickButton(user, MENU_LABELS.INSIGHTS);

    expect(currentLocation()).toBe(
      `${APP_ROUTES.INSIGHTS}?${CLUSTER_INSIGHTS.APP_PARAM}=${insightsAppKey('payments', application.name)}`,
    );
  });

  it('disables actions the viewer may not take', async () => {
    await openDetails(application, permissionsSeed('ReadOnly'));

    expect(
      screen.getByRole('button', { name: new RegExp(UI.CARD.ACTIONS.FORCE_SYNC) }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: new RegExp(UI.CARD.ACTIONS.EDIT) })).toBeDisabled();
  });
});

describe('application change history', () => {
  const entry = buildChangeLogEntry({ generation: 7, severity: 'high' });
  const application = buildApplication({
    history: {
      generation: 7,
      hasDrift: true,
      changeLog: [entry],
    },
  });

  it('lists each detected change', async () => {
    await openDetails(application);

    expect(await screen.findByText(`severity: ${entry.severity}`)).toBeInTheDocument();
  });

  it('opens the full change in a panel', async () => {
    const { user } = await openDetails(application);

    await clickButton(user, UI.SECTIONS.CHANGE_LOG.OPEN_CHANGE);

    expect(await screen.findByText(UI.SECTIONS.CHANGE_LOG.CHANGES_LABEL)).toBeInTheDocument();
    expect(screen.getByText(UI.SECTIONS.CHANGE_LOG.PANEL_TITLE)).toBeInTheDocument();
  });
});
