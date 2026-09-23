import type { ExtendedAxiosError } from '../../api/client/normalize';

export const CapitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// The interceptor stores the server's own message on normalized; axios's
// error.message is only "Request failed with status code N".
export const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (!(error instanceof Error)) return fallback;
  return (error as ExtendedAxiosError).normalized?.message || error.message;
};

export const truncateText = (text: string, maxLength: number = 60): string => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
