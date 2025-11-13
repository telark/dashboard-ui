import { App as AntdApp } from 'antd';
import { AxiosError } from 'axios';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';

interface ExtendedAxiosError extends AxiosError {
  normalized?: {
    status: number | null;
    message: string;
    url: string;
    method: string;
    isNotFound: boolean;
    isClient: boolean;
    isServer: boolean;
    isNetwork: boolean;
    isTimeout: boolean;
  };
}

/**
 * Extract user-friendly error message from API error
 */
export const extractErrorMessage = (error: any): string => {
  // Check if it's an AxiosError with normalized metadata (from interceptor)
  const axiosError = error as ExtendedAxiosError;
  if (axiosError.normalized?.message) {
    return String(axiosError.normalized.message);
  }

  // Check if error is already a normalized object (from Client function)
  if (error?.message && typeof error === 'object' && 'status' in error && !error.response) {
    return String(error.message);
  }

  // Check response data message
  if (error?.response?.data?.message) {
    return String(error.response.data.message);
  }

  // Check error message
  if (error?.message) {
    return String(error.message);
  }

  // Fallback to generic error
  return AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED;
};

/**
 * Check if error indicates user not found
 */
export const isUserNotFoundError = (error: any): boolean => {
  const axiosError = error as ExtendedAxiosError;
  const errorMsg = extractErrorMessage(error).toLowerCase();

  // Check normalized error first (from interceptor)
  if (axiosError.normalized) {
    if (axiosError.normalized.isNotFound === true || axiosError.normalized.status === 404) {
      return true;
    }
    // Check if it's a server error (500) but message indicates user not found
    if (axiosError.normalized.isServer && 
        (errorMsg.includes('failed to get user') || errorMsg.includes('status: 404'))) {
      return true;
    }
  }

  // Check if error is already a normalized object
  if (error?.status === 404 || error?.isNotFound === true) {
    return true;
  }

  // Check if it's a server error (500) but message indicates user not found
  if ((error?.isServer || error?.status === 500) && 
      (errorMsg.includes('failed to get user') || errorMsg.includes('status: 404'))) {
    return true;
  }

  return (
    error?.response?.status === 404 ||
    error?.status === 404 ||
    errorMsg.includes('user not found') ||
    errorMsg.includes('failed to get user') ||
    errorMsg.includes('status: 404')
  );
};

/**
 * Check if error indicates no passkeys
 */
export const isNoPasskeysError = (error: any): boolean => {
  const errorMsg = extractErrorMessage(error).toLowerCase();
  return errorMsg.includes('no passkeys') || errorMsg.includes('no passkey');
};

/**
 * Get user-friendly error message based on error type
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  const axiosError = error as ExtendedAxiosError;
  const errorMsg = extractErrorMessage(error);

  // User not found
  if (isUserNotFoundError(error)) {
    return 'User not found. Please check your username and try again.';
  }

  // No passkeys
  if (isNoPasskeysError(error)) {
    return 'No passkeys found. Please register a passkey first.';
  }

  // Check if error is already a normalized object
  if (error?.isNetwork) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error?.isTimeout) {
    return 'Request timed out. Please try again.';
  }

  if (error?.isServer) {
    // For server errors that contain user not found info, show user-friendly message
    if (errorMsg.toLowerCase().includes('failed to get user') || errorMsg.toLowerCase().includes('status: 404')) {
      return 'User not found. Please check your username and try again.';
    }
    return 'Server error. Please try again later.';
  }

  // Network errors
  if (axiosError.normalized?.isNetwork) {
    return 'Network error. Please check your connection and try again.';
  }

  // Timeout errors
  if (axiosError.normalized?.isTimeout) {
    return 'Request timed out. Please try again.';
  }

  // Server errors (500+)
  if (axiosError.normalized?.isServer) {
    // For server errors that contain user not found info, show user-friendly message
    if (errorMsg.toLowerCase().includes('failed to get user') || errorMsg.toLowerCase().includes('status: 404')) {
      return 'User not found. Please check your username and try again.';
    }
    return 'Server error. Please try again later.';
  }

  // Client errors (400-499)
  if (error?.isClient || axiosError.normalized?.isClient) {
    // Try to extract meaningful message from server response
    if (errorMsg && errorMsg !== 'Unknown error') {
      return errorMsg;
    }
    return 'Invalid request. Please check your input and try again.';
  }

  // Generic error
  return errorMsg || AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED;
};

/**
 * Handle and display authentication error
 * Uses Ant Design message.open() API for consistent message display
 */
export const handleAuthError = (
  error: any,
  messageApi: ReturnType<typeof AntdApp.useApp>['message'],
  options?: {
    onUserNotFound?: () => void;
    onNoPasskeys?: () => void;
    customMessage?: string;
  },
): void => {
  const { onUserNotFound, onNoPasskeys, customMessage } = options || {};

  // Use custom message if provided
  if (customMessage) {
    messageApi.open({
      type: 'error',
      content: customMessage,
      duration: 4,
    });
    return;
  }

  // Check for specific error types
  if (isUserNotFoundError(error)) {
    const errorMessage = getUserFriendlyErrorMessage(error);
    messageApi.open({
      type: 'error',
      content: errorMessage,
      duration: 4,
    });
    if (onUserNotFound) {
      setTimeout(() => {
        onUserNotFound();
      }, 2000);
    }
    return;
  }

  if (isNoPasskeysError(error)) {
    const errorMessage = getUserFriendlyErrorMessage(error);
    messageApi.open({
      type: 'error',
      content: errorMessage,
      duration: 4,
    });
    if (onNoPasskeys) {
      setTimeout(() => {
        onNoPasskeys();
      }, 2000);
    }
    return;
  }

  // Generic error handling
  const errorMessage = getUserFriendlyErrorMessage(error);
  messageApi.open({
    type: 'error',
    content: errorMessage,
    duration: 4,
  });
  console.error('Authentication error:', error);
};

