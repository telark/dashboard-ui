import React from 'react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../../../constants';
import { HOME_DASHBOARD_TEXTS as T } from '../../constants/dashboard';

const ViewAllLink: React.FC<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();
  return (
    <Typography.Link
      onClick={() => navigate(to)}
      style={{ color: DEFAULT_COLORS.SUCCESS, flexShrink: 0 }}
    >
      {T.VIEW_ALL}
    </Typography.Link>
  );
};

export default ViewAllLink;
