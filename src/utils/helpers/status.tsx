import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants/colors';
import { CARD_STATES } from '../../constants/cards';

export const getDetailedStatusStyle = (status: string) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === 'available' || normalizedStatus === 'active') {
    return {
      color: DEFAULT_COLORS.SUCCESS,
      borderColor: DEFAULT_COLORS.SUCCESS,
      icon: <CheckCircleOutlined />,
    };
  } else if (normalizedStatus === 'running') {
    return {
      color: '#1890ff',
      borderColor: '#1890ff',
      icon: <WarningOutlined />,
    };
  } else {
    return {
      color: DEFAULT_COLORS.DEFAULT,
      borderColor: DEFAULT_COLORS.DEFAULT,
      icon: <CloseCircleOutlined />,
    };
  }
};

export const normalizeStatus = (status: string): string => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === 'available' || normalizedStatus === 'active') {
    return CARD_STATES.STATUS.ACTIVE;
  }

  return CARD_STATES.STATUS.INACTIVE;
};
