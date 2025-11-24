export const USER_ERROR_MESSAGES = {
  CLIENT: {
    FETCH_USERS_FAILED: '[APIClient] Failed to fetch users:',
    FETCH_USER_DETAILS_FAILED: '[APIClient] Failed to fetch user details for',
  },
  LOGS: {
    GET_CURRENT_USER_ERROR: 'Failed to get current user:',
    SET_CURRENT_USER_SUCCESS: 'User stored in sessionStorage:',
    SET_CURRENT_USER_ERROR: 'Failed to set current user:',
    REMOVE_CURRENT_USER_ERROR: 'Failed to remove current user:',
    FETCH_USER_DETAILS_ERROR: 'Failed to fetch user details:',
  },
} as const;

