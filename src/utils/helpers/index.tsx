export const CapitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateGrouperName = (parsedName: string): string => {
    return `${parsedName}-grouper`;
};
  
export const generateMaintenanceFeatureName = (parsedName: string): string => {
    const grouperName = generateGrouperName(parsedName);
    return `${grouperName}-maintenance-feat`;
};