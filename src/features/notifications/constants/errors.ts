export const NOTIFICATIONS_ERROR_MESSAGES = {
  CLIENT: {
    FETCH_NOTIFICATIONS_FAILED: 'Failed to fetch notifications',
    MARK_NOTIFICATION_READ_FAILED: 'Failed to mark notification as read',
    MARK_ALL_NOTIFICATIONS_READ_FAILED: 'Failed to mark all notifications as read',
    CLEAR_NOTIFICATIONS_FAILED: 'Failed to clear notifications',
    DELETE_NOTIFICATION_FAILED: 'Failed to delete notification',
  },
  STORE: {
    FETCH: 'Failed to fetch notifications',
    MARK_READ: 'Failed to mark notification as read',
    MARK_ALL_READ: 'Failed to mark all notifications as read',
    CLEAR: 'Failed to clear notifications',
    DELETE: 'Failed to delete notification',
  },
} as const;
