import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { oidcGoogleCallback } from '../../clients';
import { setSessionToken } from '../../utils/session/token';
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
      .then((res) => {
        setSessionToken(res.sessionToken);
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
