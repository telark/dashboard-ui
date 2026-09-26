import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { oidcGoogleCallback } from '../../clients';
import { hasSessionToken, setSessionToken } from '../../utils/session/token';
import { consumeOAuthState } from '../../utils/flow/google';
import { setCurrentUser } from '../../utils/session/user';
import { getClientMetadata } from '../../utils/device/metadata';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import store from '../../../../store';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import type { User } from '../../../access-and-permissions/users/models';

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
    if (hasSessionToken()) {
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
      const wrapped = res as unknown as {
        data: { sessionToken: string; email: string; user?: User };
      };
      const token = wrapped?.data?.sessionToken;
      if (!token) {
        throw new Error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
      }
      setSessionToken(token);
      if (wrapped.data.user) {
        setCurrentUser(wrapped.data.user);
      }
    };

    // Permissions before entering the app, like the passkey login: no sidebar entry pops in.
    completeLogin()
      .then(() => store.dispatch(fetchMyPermissionsThunk()))
      .then(() => {
        navigate(APP_ROUTES.HOME, { replace: true });
        message.success(LOGIN_CONSTANTS.OIDC.CALLBACK_SUCCESS);
      })
      .catch(() => {
        message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
        navigate(APP_ROUTES.LOGIN, { replace: true });
      });
  }, [message, navigate]);

  return null;
};

export default GoogleCallback;
