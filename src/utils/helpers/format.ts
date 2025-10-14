import { UTILS_CONFIGS } from '../../constants';
import { 
  CheckCircleOutlined, 
  WarningOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants/colors';
import { CARD_STATES } from '../../constants/cards';

export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getStatusStyle = (status: string) => {
  return status === CARD_STATES.STATUS.ACTIVE
    ? {
        color: DEFAULT_COLORS.SUCCESS,
        borderColor: DEFAULT_COLORS.SUCCESS,
      }
    : {
        color: DEFAULT_COLORS.DEFAULT,
        borderColor: DEFAULT_COLORS.DEFAULT,
      };
};

export const generateGrouperName = (parsedName: string): string => {
  return `${parsedName}${UTILS_CONFIGS.NAMING.GROUPER_SUFFIX}`;
};

export const generateMaintenanceFeatureName = (parsedName: string): string => {
  const grouperName = generateGrouperName(parsedName);
  return `${grouperName}${UTILS_CONFIGS.NAMING.MAINTENANCE_FEATURE_SUFFIX}`;
};

export const getDetailedStatusStyle = (status: string) => {
  // Handle various status formats and map them to consistent styling
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
