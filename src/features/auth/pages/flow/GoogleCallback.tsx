import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { logout, oidcGoogleCallback } from '../../clients';
import { isSignedIn } from '../../utils/session/token';
import { consumeOAuthState } from '../../utils/flow/google';
import { getLoginRefusalMessage } from '../../utils/shared/errors';
import { setCurrentUser } from '../../utils/session/user';
import { getClientMetadata } from '../../utils/device/metadata';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import store from '../../../../store';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import type { User } from '../../../access-and-permissions/users/models';
import type { LoginLocationState } from '../../models';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    // The fragment carries the id_token: drop it from the address bar and history at once.
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    const idToken = params.get(LOGIN_CONSTANTS.OIDC.FRAGMENT_ID_TOKEN);
    const returnedState = params.get(LOGIN_CONSTANTS.OIDC.FRAGMENT_STATE);
    const expectedState = consumeOAuthState();

    // Never swap an existing session for one delivered by a link.
    if (isSignedIn()) {
      navigate(APP_ROUTES.HOME, { replace: true });
      return;
    }

    if (!idToken || !expectedState || returnedState !== expectedState) {
      message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
      navigate(APP_ROUTES.LOGIN, { replace: true });
      return;
    }

    const completeLogin = async (): Promise<void> => {
      const { browser, device, os, userAgent } = getClientMetadata();
      const res = await oidcGoogleCallback({ idToken, browser, device, os, userAgent });
      // The session is in auth's cookie; the stored user is what "signed in" means here.
      const wrapped = res as unknown as { data: { email: string; user?: User } };
      const user = wrapped?.data?.user;
      if (!user || !setCurrentUser(user)) {
        // Auth set the cookie already: end that session rather than leave it behind.
        logout().catch(() => undefined);
        throw new Error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
      }
    };

    // Permissions before entering the app, like the passkey login: no sidebar entry pops in.
    completeLogin()
      .then(() => store.dispatch(fetchMyPermissionsThunk()))
      .then(() => {
        navigate(APP_ROUTES.HOME, { replace: true });
        message.success(LOGIN_CONSTANTS.OIDC.CALLBACK_SUCCESS);
      })
      .catch((error: unknown) => {
        // A refused account is explained in the login card instead of the generic toast.
        const loginError = getLoginRefusalMessage(error);
        if (!loginError) message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
        const state: LoginLocationState = { loginError };
        navigate(APP_ROUTES.LOGIN, { replace: true, state });
      });
  }, [message, navigate]);

  return null;
};

export default GoogleCallback;
