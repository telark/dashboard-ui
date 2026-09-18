export const CapitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback;
};

export const truncateText = (text: string, maxLength: number = 60): string => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
