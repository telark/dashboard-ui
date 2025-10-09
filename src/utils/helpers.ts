import { UTILS_CONFIGS } from '../constants';

export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateGrouperName = (parsedName: string): string => {
  return `${parsedName}${UTILS_CONFIGS.NAMING.GROUPER_SUFFIX}`;
};

export const generateMaintenanceFeatureName = (parsedName: string): string => {
  const grouperName = generateGrouperName(parsedName);
  return `${grouperName}${UTILS_CONFIGS.NAMING.MAINTENANCE_FEATURE_SUFFIX}`;
};
