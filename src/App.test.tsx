import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { act } from 'react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
// The settings route is lazy: importing it here keeps its chunk out of every test's wait.
import './features/settings';
import { ACCOUNT_SUSPENDED_EVENT, APP_ROUTES, Endpoints, EXPORTER_API } from './constants';
import { STORAGE_KEYS } from './constants/store/store';
import { AUTH_CONSTANTS } from './features/auth/constants/messages';
import { LOGIN_CONSTANTS } from './features/auth/constants/login';
import { REGISTER_CONSTANTS } from './features/auth/constants/register';
import {
  clickButton,
  mockEmptyEndpoint,
  mockEmptyLists,
  mockEndpoint,
  permissionsSeed,
  resetStore,
  store,
} from './test';
import { buildClusterPage } from './test/factories/insights';
import { mockAuthConfig, mockMyPermissions } from './test/helpers/authApi';
import { mockEventStream } from './test/helpers/eventStream';
import { inDays, signIn } from './test/helpers/session';
import { mockStaticAsset } from './test/helpers/staticAsset';
import { SETTINGS_CONSTANTS } from './features/settings/constants';
import { ABOUT_SECTION_CONSTANTS } from './features/settings/sections/about/constants';

const mockShellReads = () => {
  mockMyPermissions();
  mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, { data: {} });
  mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, {
    status: 200,
    data: { expiresTimestamp: inDays(1) },
  });
  mockStaticAsset(ABOUT_SECTION_CONSTANTS.LICENSES_LIST.JSON_URL, []);
  mockEndpoint('discovery', Endpoints.INSIGHTS.LIST, { data: buildClusterPage([]) as never });
  mockEmptyLists('exporter', [Endpoints.NOTIFICATIONS.LIST]);
  mockEventStream(`${EXPORTER_API.BASE_URL}/${Endpoints.NOTIFICATIONS.EVENTS.path}`);
};

const renderShell = (path: string) => {
  window.history.pushState({}, '', path);
  resetStore(permissionsSeed());
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  return { user: userEvent.setup() };
};

const openAboutSignedIn = () => {
  signIn();
  mockShellReads();
  return renderShell(`${APP_ROUTES.SETTINGS}/about`);
};

const signOutFrom = async (
  user: UserEvent,
  modal: { TITLE: string; BUTTON_TEXT: string },
): Promise<void> => {
  await screen.findByText(modal.TITLE);
  await clickButton(user, modal.BUTTON_TEXT);
};

describe('app shell', () => {
  afterEach(() => window.history.pushState({}, '', '/'));

  it('sends a visitor who is not signed in to the login page', async () => {
    mockAuthConfig();

    renderShell('/roles');

    expect(await screen.findByText(LOGIN_CONSTANTS.UI.TITLE)).toBeInTheDocument();
    expect(window.location.pathname).toBe(APP_ROUTES.LOGIN);
  });

  it('keeps the register page open to visitors', async () => {
    mockAuthConfig();

    renderShell(APP_ROUTES.REGISTER);

    expect(await screen.findByText(REGISTER_CONSTANTS.UI.TITLE)).toBeInTheDocument();
  });

  it('shows the app frame around a page for a signed-in user', async () => {
    openAboutSignedIn();

    expect(
      await screen.findByText(ABOUT_SECTION_CONSTANTS.LABELS.VERSION_CARD_TITLE),
    ).toBeInTheDocument();
    expect(await screen.findByText(SETTINGS_CONSTANTS.SECTIONS.TIMEZONE.label)).toBeInTheDocument();
  });

  it('offers to sign in again when the session expired', async () => {
    mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);
    const { user } = openAboutSignedIn();
    mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, {}, { status: 401 });

    await signOutFrom(user, AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL);

    await waitFor(() => expect(window.location.pathname).toBe(APP_ROUTES.LOGIN));
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
  });

  it('stops a suspended account at a sign-out screen', async () => {
    mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);
    const { user } = openAboutSignedIn();
    await screen.findByText(ABOUT_SECTION_CONSTANTS.LABELS.VERSION_CARD_TITLE);
    act(() => {
      globalThis.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
    });

    await signOutFrom(user, AUTH_CONSTANTS.SESSION.SUSPENDED.MODAL);

    await waitFor(() => expect(window.location.pathname).toBe(APP_ROUTES.LOGIN));
  });
});
