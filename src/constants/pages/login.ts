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
    CREDENTIAL_TYPE: 'public-key',
    ATTESTATION: 'none',
    ERROR_NAMES: {
      NOT_ALLOWED: 'NotAllowedError',
      INVALID_STATE: 'InvalidStateError',
      NOT_SUPPORTED: 'NotSupportedError',
      CONSTRAINT: 'ConstraintError',
    },
    MESSAGES: {
      NOT_SUPPORTED: 'WebAuthn is not supported in this browser',
      USER_CANCELLED_AUTH: 'User cancelled authentication',
      USER_CANCELLED_REGISTRATION: 'User cancelled registration',
      NO_CREDENTIAL_FOUND: 'User cancelled authentication or no credential found',
      REGISTRATION_CANCELLED: 'User cancelled registration or credential creation failed',
      OPERATION_NOT_ALLOWED: 'The operation is not allowed',
      NOT_SUPPORTED_ERROR: 'WebAuthn is not supported',
      AUTHENTICATION_FAILED: 'Authentication failed',
      REGISTRATION_FAILED: 'Registration failed',
      UNSUPPORTED_RESPONSE_TYPE: 'Unsupported credential response type',
      CONSTRAINT_VALIDATION_FAILED: 'Constraint validation failed',
    },
  },
  SESSION: {
    SET_FAILED: 'Failed to save session token',
    REMOVE_FAILED: 'Failed to remove session token',
    QUOTA_EXCEEDED: 'Storage quota exceeded. Please free up space and try again.',
  },
  LOGS: {
    AUTH_ERROR: 'Authentication error:',
    INVALID_RESPONSE_STRUCTURE: 'Invalid login response structure:',
    SESSION_GET_ERROR: 'Failed to get session token:',
    SESSION_SET_ERROR: 'Failed to set session token:',
    SESSION_REMOVE_ERROR: 'Failed to remove session token:',
  },
} as const;

