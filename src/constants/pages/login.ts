export const LOGIN_CONSTANTS = {
  ERROR_PATTERNS: {
    USER_NOT_FOUND: ['user not found', 'failed to get user', 'status: 404'],
    NO_PASSKEYS: ['no passkeys', 'no passkey'],
  },
  MESSAGES: {
    USER_NOT_FOUND: 'User not found. Please check your username and try again.',
    NO_PASSKEYS: 'No passkeys found. Please register a passkey first.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    CLIENT_ERROR: 'Invalid request. Please check your input and try again.',
    INVALID_RESPONSE: 'Invalid response from server. Please try again.',
  },
  TIMING: {
    MESSAGE_DURATION: 4,
    CALLBACK_DELAY: 2000,
  },
  WEBAUTHN: {
    USER_VERIFICATION: 'preferred',
  },
  LOGS: {
    AUTH_ERROR: 'Authentication error:',
    INVALID_RESPONSE_STRUCTURE: 'Invalid login response structure:',
  },
} as const;

