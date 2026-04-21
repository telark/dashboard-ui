import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { oidcGoogleCallback } from '../../clients';
import { setSessionToken } from '../../utils/session/token';
import { setCurrentUser } from '../../utils/session/user';
import { validateSession } from '../../utils/session/validation';
import { fetchUserById } from '../../../access-and-permissions/users/clients/fetch';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';

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

    oidcGoogleCallback(idToken)
      .then(async (res) => {
        const wrapped = res as unknown as { data: { sessionToken: string; email: string } };
        const token = wrapped?.data?.sessionToken;
        if (!token) {
          message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
          navigate(APP_ROUTES.LOGIN, { replace: true });
          return;
        }
        setSessionToken(token);

        try {
          const validation = await validateSession();
          if (validation.isValid && validation.sessionDetails?.userId) {
            const userResponse = await fetchUserById(validation.sessionDetails.userId, true);
            if (userResponse?.data) {
              setCurrentUser(userResponse.data);
            }
          }
        } catch {
          // non-fatal — avatar self-heals in UserAvatarDropdown
        }

        message.success(LOGIN_CONSTANTS.OIDC.CALLBACK_SUCCESS);
        navigate(APP_ROUTES.HOME, { replace: true });
      })
      .catch(() => {
        message.error(LOGIN_CONSTANTS.OIDC.CALLBACK_ERROR);
        navigate(APP_ROUTES.LOGIN, { replace: true });
      });
  }, [message, navigate]);

  return null;
};

export default GoogleCallback;
