import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints, HEADER_LAYOUT, type PageTheme } from '../../../constants';
import {
  clickButton,
  mockEndpoint,
  mockHeldEndpoint,
  mockServerError,
  permissionsSeed,
  pickSelectOption,
  renderApp,
} from '../../../test';
import { signIn } from '../../../test/helpers/session';
import { getCurrentUser } from '../../../features/auth/utils/session/user';
import { SettingsPage } from '../../../features/settings';
import { APPEARANCE_SECTION_CONSTANTS as APPEARANCE } from '../../../features/settings/sections/appearance/constants';
import { TIMEZONE_SECTION_CONSTANTS as TZ } from '../../../features/settings/sections/timezone/constants';
import { THEME_TEXTS, useAppliedTheme, type ThemePreference } from '../../../features/theme';
import ThemeToggleButton from './ThemeToggleButton';

const { THEME_TOGGLE_LABELS: LABELS } = HEADER_LAYOUT;
const { THEME_OPTIONS: OPTIONS } = APPEARANCE.LABELS;
// The stored copy lacks what the server holds, so a save that keeps it read the record fresh.
const SERVER_SETTINGS = { timezone: 'Europe/Paris', region: 'FR' };
// A preference, the theme a click switches to, and that theme's icon.
const FLIPS: [ThemePreference, PageTheme, string][] = [
  ['dark', 'light', 'sun'],
  ['system', 'light', 'sun'],
  ['light', 'dark', 'moon'],
];
const OTHER: Record<PageTheme, PageTheme> = { dark: 'light', light: 'dark' };

// The app root's hook, as in App.tsx: the page follows the stored user.
const FollowStoredUser = () => {
  useAppliedTheme();
  return null;
};

interface SetupOptions {
  // Without one, only the switch renders, on a page that never refreshes the stored user.
  section?: string;
  holdUser?: boolean;
  serverTheme?: ThemePreference;
}

const setup = (theme: ThemePreference, options: SetupOptions = {}) => {
  const { section, holdUser = false, serverTheme = theme } = options;
  const account = signIn({ settings: { theme } });
  const withTheme = (saved: ThemePreference, settings = SERVER_SETTINGS) =>
    ({ data: { ...account, settings: { ...settings, theme: saved } } }) as never;
  const getUser = Endpoints.USERS.GET_BY_ID(account.id);
  const fetchUser = mockHeldEndpoint('exporter', getUser, withTheme(serverTheme));
  if (!holdUser) fetchUser.release();
  const view = renderApp(
    <>
      <FollowStoredUser />
      <ThemeToggleButton />
      {section ? <SettingsPage /> : null}
    </>,
    {
      route: section ? `${APP_ROUTES.SETTINGS}/${section}` : APP_ROUTES.HOME,
      seed: { ...permissionsSeed(), theme: { preference: theme } },
    },
  );
  const patch = Endpoints.USERS.PATCH_BY_ID(account.id);
  return { ...view, getUser, patch, withTheme, releaseUser: fetchUser.release };
};

const findSwitch = (next: PageTheme) => screen.findByRole('button', { name: LABELS[next] });

// Switches a dark page to light, holds that save, then switches back to dark.
const flipTwiceWhileHeld = async (olderStatus = 200) => {
  const view = setup('dark');
  const older = mockHeldEndpoint('exporter', view.patch, view.withTheme('light'), {
    status: olderStatus,
  });
  await view.user.click(await findSwitch('light'));
  await waitFor(() => expect(older.calls).toHaveLength(1));
  await view.user.click(await findSwitch('dark'));
  return { ...view, older };
};

describe('theme toggle button', () => {
  it.each(FLIPS)('offers the other theme on a %s page', async (theme, next, icon) => {
    setup(theme);

    const button = await findSwitch(next);

    expect(within(button).getByRole('img', { name: icon })).toBeInTheDocument();
  });

  it.each(FLIPS)('saves %s as %s and keeps the other settings', async (theme, next) => {
    const { user, patch, withTheme } = setup(theme);
    const save = mockEndpoint('exporter', patch, withTheme(next));

    await user.click(await findSwitch(next));

    await waitFor(() => expect(getCurrentUser()?.settings?.theme).toBe(next));
    expect(save.calls.map(({ body }) => body)).toEqual([
      { settings: { ...SERVER_SETTINGS, theme: next } },
    ]);
    expect(screen.getByRole('button', { name: LABELS[OTHER[next]] })).toBeInTheDocument();
  });

  it('shows the new theme on the Settings card', async () => {
    const { user, patch, withTheme } = setup('system', { section: 'appearance' });
    mockEndpoint('exporter', patch, withTheme('light'));

    await user.click(await findSwitch('light'));

    expect(screen.getByRole('radio', { name: OPTIONS.light })).toBeChecked();
    await waitFor(() => expect(getCurrentUser()?.settings?.theme).toBe('light'));
  });

  it('shows a theme chosen on another device when Appearance opens', async () => {
    setup('dark', { section: 'appearance', serverTheme: 'light' });

    expect(await findSwitch('dark')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: OPTIONS.light })).toBeChecked();
  });

  it('goes back to the saved theme when the save fails', async () => {
    const { user, patch } = setup('dark', { section: 'appearance' });
    mockServerError('exporter', patch);

    await user.click(await findSwitch('light'));

    expect(await screen.findByText(THEME_TEXTS.SAVE_ERROR)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: OPTIONS.dark })).toBeChecked();
    expect(screen.getByRole('button', { name: LABELS.light })).toBeInTheDocument();
  });

  it('sends a quick second choice once the first is saved, from what the server holds', async () => {
    const { older, getUser, patch, withTheme } = await flipTwiceWhileHeld();
    const later = { timezone: 'Asia/Tokyo', region: 'JP' };
    mockEndpoint('exporter', getUser, withTheme('light', later));
    const newer = mockEndpoint('exporter', patch, withTheme('dark', later));

    older.release();

    await waitFor(() => expect(getCurrentUser()?.settings).toEqual({ ...later, theme: 'dark' }));
    expect(newer.calls.map(({ body }) => body)).toEqual([
      { settings: { ...later, theme: 'dark' } },
    ]);
  });

  it('rolls back to the first choice when the second save fails', async () => {
    const { older, patch } = await flipTwiceWhileHeld();
    mockServerError('exporter', patch);

    older.release();

    expect(await screen.findByText(THEME_TEXTS.SAVE_ERROR)).toBeInTheDocument();
    // The server kept the first choice, so the page and the stored user show it.
    expect(screen.getByRole('button', { name: LABELS.dark })).toBeInTheDocument();
    expect(getCurrentUser()?.settings?.theme).toBe('light');
  });

  it('skips a choice overtaken while it waits and ignores an older failure', async () => {
    const { user, older, patch, withTheme } = await flipTwiceWhileHeld(500);
    await user.click(await findSwitch('light'));
    const newer = mockEndpoint('exporter', patch, withTheme('light'));

    older.release();

    await waitFor(() => expect(getCurrentUser()?.settings?.theme).toBe('light'));
    expect(newer.calls).toHaveLength(1);
    expect(screen.getByRole('button', { name: LABELS.dark })).toBeInTheDocument();
    expect(screen.queryByText(THEME_TEXTS.SAVE_ERROR)).not.toBeInTheDocument();
  });

  it('keeps the choice while another page stores the user mid-save', async () => {
    const { user, patch, withTheme, releaseUser } = setup('dark', {
      section: 'timezone',
      holdUser: true,
    });
    const save = mockHeldEndpoint('exporter', patch, withTheme('light'));
    await user.click(await findSwitch('light'));

    releaseUser();

    // The Time zone page's fetch stores a record that still holds the old theme.
    await waitFor(() =>
      expect(getCurrentUser()?.settings?.timezone).toBe(SERVER_SETTINGS.timezone),
    );
    expect(screen.getByRole('button', { name: LABELS.dark })).toBeInTheDocument();
    save.release();
    await waitFor(() => expect(getCurrentUser()?.settings?.theme).toBe('light'));
  });

  it('keeps a theme flipped on the Time zone page in its next save', async () => {
    const { user, patch, withTheme } = setup('dark', { section: 'timezone' });
    const save = mockEndpoint('exporter', patch, withTheme('light'));
    const [timezone] = await screen.findAllByRole('combobox');
    await user.click(screen.getByRole('button', { name: LABELS.light }));
    await waitFor(() => expect(getCurrentUser()?.settings?.theme).toBe('light'));

    await pickSelectOption(user, timezone, /^Asia\/Tokyo/, 'Asia/Tokyo');
    await clickButton(user, TZ.LABELS.SAVE_BUTTON);

    await waitFor(() =>
      expect(save.calls[1]?.body).toEqual({
        settings: { ...SERVER_SETTINGS, timezone: 'Asia/Tokyo', theme: 'light' },
      }),
    );
  });
});
