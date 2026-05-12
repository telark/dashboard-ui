import { createAsyncThunk } from '@reduxjs/toolkit';
import logger from '../../../../logging';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} from '../../clients';
import { extractErrorMessage } from '../../../../utils/helpers/format';
import { NOTIFICATIONS_ERROR_MESSAGES, NOTIFICATIONS_STORE_ACTIONS } from '../../constants';
import type { NotificationListData } from '../../models';

export interface FetchNotificationsThunkArg {
  userId: string;
  silent?: boolean;
  limit?: number;
}

export const fetchNotificationsThunk = createAsyncThunk<
  NotificationListData,
  FetchNotificationsThunkArg,
  { rejectValue: string }
>(NOTIFICATIONS_STORE_ACTIONS.FETCH, async ({ userId, silent, limit }, { rejectWithValue }) => {
  try {
    const response = await fetchNotifications({ userId, silent, limit });
    return response.data;
  } catch (error: unknown) {
    if (!silent) {
      logger.error(NOTIFICATIONS_ERROR_MESSAGES.STORE.FETCH, error);
    }
    return rejectWithValue(extractErrorMessage(error, NOTIFICATIONS_ERROR_MESSAGES.STORE.FETCH));
  }
});

export interface MarkNotificationReadThunkArg {
  id: string;
  userId: string;
}

export const markNotificationReadThunk = createAsyncThunk<
  string,
  MarkNotificationReadThunkArg,
  { rejectValue: string }
>(NOTIFICATIONS_STORE_ACTIONS.MARK_READ, async ({ id, userId }, { rejectWithValue }) => {
  try {
    await markNotificationRead(id, userId);
    return id;
  } catch (error: unknown) {
    logger.error(NOTIFICATIONS_ERROR_MESSAGES.STORE.MARK_READ, error);
    return rejectWithValue(
      extractErrorMessage(error, NOTIFICATIONS_ERROR_MESSAGES.STORE.MARK_READ),
    );
  }
});

export const markAllNotificationsReadThunk = createAsyncThunk<
  void,
  { userId: string },
  { rejectValue: string }
>(NOTIFICATIONS_STORE_ACTIONS.MARK_ALL_READ, async ({ userId }, { rejectWithValue }) => {
  try {
    await markAllNotificationsRead(userId);
  } catch (error: unknown) {
    logger.error(NOTIFICATIONS_ERROR_MESSAGES.STORE.MARK_ALL_READ, error);
    return rejectWithValue(
      extractErrorMessage(error, NOTIFICATIONS_ERROR_MESSAGES.STORE.MARK_ALL_READ),
    );
  }
});

export const clearNotificationsThunk = createAsyncThunk<
  void,
  { userId: string },
  { rejectValue: string }
>(NOTIFICATIONS_STORE_ACTIONS.CLEAR, async ({ userId }, { rejectWithValue }) => {
  try {
    await clearNotifications(userId);
  } catch (error: unknown) {
    logger.error(NOTIFICATIONS_ERROR_MESSAGES.STORE.CLEAR, error);
    return rejectWithValue(extractErrorMessage(error, NOTIFICATIONS_ERROR_MESSAGES.STORE.CLEAR));
  }
});
