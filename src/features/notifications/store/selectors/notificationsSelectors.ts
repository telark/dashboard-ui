import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store';

export const selectNotificationsState = (state: RootState) => state.notifications;

export const selectNotifications = createSelector([selectNotificationsState], (s) => s.items);

export const selectNotificationsUnreadCount = createSelector(
  [selectNotificationsState],
  (s) => s.unreadCount,
);

export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (s) => s.loading,
);

export const selectNotificationsError = createSelector([selectNotificationsState], (s) => s.error);

export const selectNotificationsPanelOpen = createSelector(
  [selectNotificationsState],
  (s) => s.panelOpen,
);
