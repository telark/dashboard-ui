import type { ExtendedAxiosError } from '../../api/client/normalize';
import { connectivityIssueFrom } from '../../api/client/health-interceptor';

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

// A thunk rejected through extractErrorMessage carries the server's text, which explains a
// refusal (e.g. a 403 on a role grant); connectivity failures keep the caller's fallback.
export const rejectionMessage = (rejection: unknown, fallback: string): string =>
  typeof rejection === 'string' && rejection && !connectivityIssueFrom(rejection)
    ? rejection
    : fallback;

export const pluralize = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;

export const truncateText = (text: string, maxLength: number = 60): string => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
