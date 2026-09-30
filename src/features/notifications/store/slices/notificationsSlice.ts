import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Notification, NotificationsState } from '../../models';
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
  clearNotificationsThunk,
  deleteNotificationThunk,
} from '../thunks/notificationsThunks';

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  panelOpen: false,
  fetchedAt: null,
};

const computeUnread = (items: Notification[]): number =>
  items.reduce((acc, n) => (n.readAt ? acc : acc + 1), 0);

const removeItem = (state: NotificationsState, id: string): void => {
  state.items = state.items.filter((n) => n.id !== id);
  state.unreadCount = computeUnread(state.items);
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.panelOpen = action.payload;
    },
    hydrateFromCache: (
      state,
      action: PayloadAction<{ items: Notification[]; unreadCount: number; fetchedAt: number }>,
    ) => {
      state.items = action.payload.items;
      state.unreadCount = action.payload.unreadCount;
      state.fetchedAt = action.payload.fetchedAt;
    },
    optimisticMarkRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find((n) => n.id === id);
      if (item && !item.readAt) {
        item.readAt = new Date().toISOString();
        state.unreadCount = computeUnread(state.items);
      }
    },
    optimisticDelete: (state, action: PayloadAction<string>) => {
      removeItem(state, action.payload);
    },
    optimisticMarkAllRead: (state) => {
      const now = new Date().toISOString();
      state.items.forEach((n) => {
        if (!n.readAt) n.readAt = now;
      });
      state.unreadCount = 0;
    },
    optimisticClear: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    rollbackState: (
      state,
      action: PayloadAction<{ items: Notification[]; unreadCount: number }>,
    ) => {
      state.items = action.payload.items;
      state.unreadCount = action.payload.unreadCount;
    },
    resetNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.error = null;
      state.fetchedAt = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state, action) => {
        if (!action.meta.arg.silent) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.unreadCount = action.payload.unreadCount ?? computeUnread(state.items);
        state.fetchedAt = Date.now();
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        if (!action.meta.arg.silent) {
          state.error = String(action.payload ?? action.error.message ?? '');
        }
      })
      .addCase(markNotificationReadThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.items.find((n) => n.id === id);
        if (item && !item.readAt) {
          item.readAt = new Date().toISOString();
        }
        state.unreadCount = computeUnread(state.items);
      })
      .addCase(markAllNotificationsReadThunk.fulfilled, (state) => {
        const now = new Date().toISOString();
        state.items.forEach((n) => {
          if (!n.readAt) n.readAt = now;
        });
        state.unreadCount = 0;
      })
      .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
        removeItem(state, action.payload);
      })
      .addCase(clearNotificationsThunk.fulfilled, (state) => {
        state.items = [];
        state.unreadCount = 0;
      });
  },
});

export const {
  setPanelOpen,
  hydrateFromCache,
  optimisticMarkRead,
  optimisticDelete,
  optimisticMarkAllRead,
  optimisticClear,
  rollbackState,
  resetNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
