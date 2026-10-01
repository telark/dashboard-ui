import { DEFAULT_COLORS } from '../../../constants/shared/colors';

export const NOTIFICATIONS_POLL_INTERVAL_MS = 30000;
export const NOTIFICATIONS_CACHE_KEY = 'telark:notifications:cache';
export const NOTIFICATIONS_CACHE_MAX_ITEMS = 200;
export const NOTIFICATIONS_PANEL_WIDTH = 420;

export const NOTIFICATION_TYPES = {
  ROLLBACK_COMPLETED: 'rollback.completed',
  ROLE_CHANGED: 'role.changed',
  GROUP_MEMBERSHIP_CHANGED: 'group.membership.changed',
  PLAN_APPROVAL_REQUESTED: 'plan.approval.requested',
  PLAN_APPROVAL_DECIDED: 'plan.approval.decided',
} as const;

export const NOTIFICATION_SEVERITY_COLORS: Record<string, string> = {
  info: DEFAULT_COLORS.INFO_STRONG,
  success: DEFAULT_COLORS.SUCCESS,
  warning: DEFAULT_COLORS.WARNING,
  error: DEFAULT_COLORS.DANGER,
};

export const NOTIFICATIONS_STORE_ACTIONS = {
  FETCH: 'notifications/fetch',
  MARK_READ: 'notifications/markRead',
  MARK_ALL_READ: 'notifications/markAllRead',
  CLEAR: 'notifications/clear',
  DELETE: 'notifications/delete',
} as const;

export const NOTIFICATIONS_TEXTS = {
  TITLE: 'Notifications',
  EMPTY_TITLE: 'No notifications yet',
  EMPTY_DESCRIPTION: "You're all caught up. New activity will show up here.",
  MARK_ALL_READ: 'Mark all read',
  CLEAR_ALL: 'Clear all',
  MARK_READ: 'Mark as read',
  DELETE: 'Delete',
  UNREAD: 'Unread',
  BELL_UNREAD_NOUN: 'unread notification',
} as const;
