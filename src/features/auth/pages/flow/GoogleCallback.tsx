import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { oidcGoogleCallback } from '../../clients';
import { setSessionToken } from '../../utils/session/token';
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

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (!idToken) {
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

    completeLogin()
      .then(() => {
        navigate(APP_ROUTES.HOME, { replace: true });
        message.success(LOGIN_CONSTANTS.OIDC.CALLBACK_SUCCESS);
        void store.dispatch(fetchMyPermissionsThunk());
      })
      .catch(() => {
        message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
        navigate(APP_ROUTES.LOGIN, { replace: true });
      });
  }, [message, navigate]);

  return null;
};

export default GoogleCallback;
