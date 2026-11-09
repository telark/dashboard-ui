import { act, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  APP_ROUTES,
  Endpoints,
  HEADER_CONSTANTS,
  SIDEBAR_USER_MENU,
} from '../../../../../constants';
import { STORAGE_KEYS } from '../../../../../constants/store/store';
import {
  currentLocation,
  mockEmptyEndpoint,
  mockEndpoint,
  renderApp,
  clickButton,
} from '../../../../../test';
import { buildUser } from '../../../../../test/factories/users';
import { signIn } from '../../../../../test/helpers/session';
import { CURRENT_USER_UPDATED_EVENT } from '../../../../auth/utils';
import UserAvatarDropdown from './UserAvatarDropdown';

const { TEXTS } = HEADER_CONSTANTS.USER.MENU;

const renderSidebarMenu = () => {
  const user = signIn({ username: 'release_lead' });
  mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(user.id), { data: user });
  return renderApp(<UserAvatarDropdown variant="sidebar" />);
};

describe('user avatar menu', () => {
  it('renders nothing without a signed-in user', () => {
    renderApp(<UserAvatarDropdown />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the signed-in user and follows updates', async () => {
    renderSidebarMenu();

    expect(await screen.findByText('release_lead')).toBeInTheDocument();

    act(() => {
      globalThis.dispatchEvent(
        new CustomEvent(CURRENT_USER_UPDATED_EVENT, {
          detail: buildUser({ username: 'sre_oncall' }),
        }),
      );
    });

    expect(await screen.findByText('sre_oncall')).toBeInTheDocument();
  });

  it.each([
    [TEXTS.PROFILE, 'profile'],
    [TEXTS.SECURITY, 'security'],
    [TEXTS.MY_PERMISSIONS, 'permissions'],
  ])('opens %s from the menu', async (label, slug) => {
    const { user } = renderSidebarMenu();

    await clickButton(user, SIDEBAR_USER_MENU.ARIA_LABEL);
    await user.click(await screen.findByRole('menuitem', { name: new RegExp(label) }));

    await waitFor(() => expect(currentLocation()).toBe(`${APP_ROUTES.SETTINGS}/${slug}`));
  });

  it('signs out from the menu', async () => {
    mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);
    const { user } = renderSidebarMenu();

    await clickButton(user, SIDEBAR_USER_MENU.ARIA_LABEL);
    await user.click(await screen.findByRole('menuitem', { name: new RegExp(TEXTS.LOGOUT) }));

    await waitFor(() => expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull());
  });
});
