import React from 'react';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../constants';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';

export const LoginFooter: React.FC = () => {
  return (
    <div
      style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#999',
      }}
    >
      {LOGIN_CONSTANTS.UI.FOOTER_TEXT}{' '}
      <a
        href={APP_ROUTES.REGISTER}
        style={{
          color: DEFAULT_COLORS.SUCCESS,
          textDecoration: 'none',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = 'underline';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        {LOGIN_CONSTANTS.UI.FOOTER_LINK}
      </a>
    </div>
  );
};

