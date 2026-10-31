import React from 'react';
import { Typography } from 'antd';
import { FIELD_ERROR } from '../../../constants';

interface FieldErrorProps {
  message?: React.ReactNode;
  warning?: boolean;
}

// The line antd renders under a Form.Item (App.tsx form config), for a message outside one. Typography,
// not a div: it reads the nearest theme's text color, so the auth card and panels keep theirs.
const FieldError: React.FC<FieldErrorProps> = ({ message, warning = false }) =>
  message ? (
    <Typography.Text
      role={warning ? 'status' : 'alert'}
      className={warning ? FIELD_ERROR.WARNING_CLASS : FIELD_ERROR.CLASS}
      style={{ ...FIELD_ERROR.STYLE, display: 'block' }}
    >
      {message}
    </Typography.Text>
  ) : null;

export default FieldError;
