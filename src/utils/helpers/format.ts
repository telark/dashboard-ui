import { UTILS_CONFIGS } from '../../constants';
import { DEFAULT_COLORS } from '../../constants/shared/colors';
import { CARD_STATES } from '../../constants/layout/cards';

export const CapitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback;
};

export const truncateText = (text: string, maxLength: number = 60): string => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
