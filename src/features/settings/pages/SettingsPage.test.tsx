import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../constants';
import {
  mockEmptyLists,
  mockEndpoint,
  permissionsSeed,
  renderApp,
  currentLocation,
  clickButton,
  mockServerError,
} from '../../../test';
import { signIn } from '../../../test/helpers/session';
import { mockStaticAsset } from '../../../test/helpers/staticAsset';
import { NO_PERMISSION_CONSTANTS } from '../../../components/shared/noPermission.constants';
import { SETTINGS_CONSTANTS as C } from '../constants';
import { SECURITY_SECTION_CONSTANTS as SECURITY } from '../sections/security/constants';
import { ABOUT_SECTION_CONSTANTS as ABOUT } from '../sections/about/constants';
import { APPEARANCE_SECTION_CONSTANTS as APPEARANCE } from '../sections/appearance/constants';
import { PASSKEYS_CONSTANTS } from '../../auth/constants/passkeys';
import { SettingsPage } from '..';

const renderSettings = (route: string, seed = permissionsSeed()) =>
  renderApp(<SettingsPage />, { route, seed });

const signInDarkTheme = () => {
  const account = signIn({ settings: { theme: 'dark' } });
  mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(account.id), { data: account as never });
  return account;
};

describe('settings page', () => {
  it('opens Profile from the bare settings URL', async () => {
    signInDarkTheme();
    mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);

    renderSettings(APP_ROUTES.SETTINGS);

    expect(await screen.findByText(C.SECTIONS.PROFILE.label)).toBeInTheDocument();
    await waitFor(() => expect(currentLocation()).toBe(`${APP_ROUTES.SETTINGS}/profile`));
  });

  it.each([
    ['appearance', C.SECTIONS.APPEARANCE.label],
    ['about', ABOUT.LABELS.VERSION_CARD_TITLE],
  ])('renders the %s section of the URL', async (slug, heading) => {
    signInDarkTheme();
    mockStaticAsset(ABOUT.LICENSES_LIST.JSON_URL, []);

    renderSettings(`${APP_ROUTES.SETTINGS}/${slug}`);

    expect(await screen.findByText(heading)).toBeInTheDocument();
  });

  it('shows the no-access card for a section the role cannot reach', async () => {
    renderSettings(`${APP_ROUTES.SETTINGS}/insights`, permissionsSeed('ReadOnly'));

    expect(
      await screen.findByText(NO_PERMISSION_CONSTANTS.LABELS.TITLE(C.SECTIONS.AI_INSIGHTS.label)),
    ).toBeInTheDocument();
  });

  it('opens the passkeys view from Security and breadcrumbs back', async () => {
    const account = signInDarkTheme();
    mockEmptyLists('exporter', [Endpoints.SESSIONS.GET_ALL_BY_USER(account.id)]);
    mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, {}, { status: 404 });
    mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.GET_ALL, []);
    const { user } = renderSettings(`${APP_ROUTES.SETTINGS}/security`);

    await clickButton(user, SECURITY.LABELS.PASSKEYS_MANAGE_LINK);

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.PASSKEYS));
    expect(await screen.findByText(PASSKEYS_CONSTANTS.LABELS.EMPTY.TITLE)).toBeInTheDocument();
    await user.click(await screen.findByText(SECURITY.LABELS.BREADCRUMBS.SECURITY));
    await waitFor(() => expect(currentLocation()).toBe(`${APP_ROUTES.SETTINGS}/security`));
  });

  describe('appearance', () => {
    const openAppearance = () => {
      const account = signInDarkTheme();
      const view = renderSettings(`${APP_ROUTES.SETTINGS}/appearance`);
      return { account, ...view };
    };

    it('saves the theme chosen', async () => {
      const { account, user } = openAppearance();
      const save = mockEndpoint('exporter', Endpoints.USERS.PATCH_BY_ID(account.id), {
        data: { ...account, settings: { theme: 'light' } } as never,
      });

      await user.click(await screen.findByText(APPEARANCE.LABELS.THEME_OPTIONS.light));

      await waitFor(() => expect(save.calls[0]?.body).toEqual({ settings: { theme: 'light' } }));
    });

    it('goes back to the saved theme when the save fails', async () => {
      const { account, user } = openAppearance();
      mockServerError('exporter', Endpoints.USERS.PATCH_BY_ID(account.id));

      await user.click(await screen.findByText(APPEARANCE.LABELS.THEME_OPTIONS.light));

      expect(await screen.findByText(APPEARANCE.LABELS.SAVE_ERROR)).toBeInTheDocument();
      expect(
        screen.getByRole('radio', { name: APPEARANCE.LABELS.THEME_OPTIONS.dark }),
      ).toBeChecked();
    });
  });
});
