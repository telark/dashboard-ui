export const buildConfirmMessage = (
  action: string,
  resourceName: string,
  resourceType?: string,
): string => {
  const prefix = resourceType
    ? `Are you sure you want to ${action} ${resourceType} `
    : `Are you sure you want to ${action} `;
  return prefix;
};
