import logger from '../../../logging';
import { NOTIFICATIONS_CACHE_KEY, NOTIFICATIONS_CACHE_MAX_ITEMS } from '../constants';
import type { Notification, NotificationsCache } from '../models';

export const readNotificationsCache = (): NotificationsCache | null => {
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<NotificationsCache> | null;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return {
      items: parsed.items as Notification[],
      unreadCount: typeof parsed.unreadCount === 'number' ? parsed.unreadCount : 0,
      fetchedAt: typeof parsed.fetchedAt === 'number' ? parsed.fetchedAt : 0,
    };
  } catch (error) {
    logger.error('Failed to read notifications cache', error);
    return null;
  }
};

export const writeNotificationsCache = (items: Notification[], unreadCount: number): void => {
  try {
    const capped = items.slice(0, NOTIFICATIONS_CACHE_MAX_ITEMS);
    const payload: NotificationsCache = {
      items: capped,
      unreadCount,
      fetchedAt: Date.now(),
    };
    window.localStorage.setItem(NOTIFICATIONS_CACHE_KEY, JSON.stringify(payload));
  } catch (error) {
    logger.error('Failed to write notifications cache', error);
  }
};

export const clearNotificationsCache = (): void => {
  try {
    window.localStorage.removeItem(NOTIFICATIONS_CACHE_KEY);
  } catch (error) {
    logger.error('Failed to clear notifications cache', error);
  }
};
