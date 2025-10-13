import { UTILS_CONFIGS } from '../constants';
import { DEFAULT_COLORS } from '../constants/colors';
import { CARD_STATES } from '../constants/cards';

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
