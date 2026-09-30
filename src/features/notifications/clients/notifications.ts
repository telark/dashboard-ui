import { Client, exporterApiClient, type ExtendedAxiosError } from '../../../api/index';
import logger from '../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../constants';
import { NOTIFICATIONS_ERROR_MESSAGES } from '../constants';
import type { NotificationListResponse, NotificationMutationResponse } from '../models';

export interface FetchNotificationsParams {
  userId: string;
  limit?: number;
  cursor?: string | null;
  silent?: boolean;
}

export const fetchNotifications = async ({
  userId,
  limit,
  cursor,
  silent = false,
}: FetchNotificationsParams) => {
  try {
    const params: Record<string, string | number> = { userId };
    if (typeof limit === 'number') params.limit = limit;
    if (cursor) params.cursor = cursor;

    const config = silent
      ? {
          params,
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : { params };

    return await Client<NotificationListResponse>(
      exporterApiClient,
      Endpoints.NOTIFICATIONS.LIST.path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(NOTIFICATIONS_ERROR_MESSAGES.CLIENT.FETCH_NOTIFICATIONS_FAILED, error);
    }
    throw error;
  }
};

export const markNotificationRead = async (id: string, userId: string) => {
  try {
    return await Client<NotificationMutationResponse>(
      exporterApiClient,
      Endpoints.NOTIFICATIONS.MARK_READ(id).path,
      {
        method: Endpoints.NOTIFICATIONS.MARK_READ(id).method,
        params: { userId },
      },
    );
  } catch (error) {
    // Unknown or already cleared: nothing is left to mark, so keep it read locally.
    if ((error as ExtendedAxiosError).normalized?.isNotFound) return null;
    logger.error(
      `${NOTIFICATIONS_ERROR_MESSAGES.CLIENT.MARK_NOTIFICATION_READ_FAILED} "${id}":`,
      error,
    );
    throw error;
  }
};

export const markAllNotificationsRead = async (userId: string) => {
  try {
    return await Client<NotificationMutationResponse>(
      exporterApiClient,
      Endpoints.NOTIFICATIONS.MARK_ALL_READ.path,
      {
        method: 'POST',
        params: { userId },
      },
    );
  } catch (error) {
    logger.error(NOTIFICATIONS_ERROR_MESSAGES.CLIENT.MARK_ALL_NOTIFICATIONS_READ_FAILED, error);
    throw error;
  }
};

export const deleteNotification = async (id: string, userId: string) => {
  try {
    return await Client<NotificationMutationResponse>(
      exporterApiClient,
      Endpoints.NOTIFICATIONS.DELETE(id).path,
      {
        method: Endpoints.NOTIFICATIONS.DELETE(id).method,
        params: { userId },
      },
    );
  } catch (error) {
    // Already gone: the row is removed locally either way.
    if ((error as ExtendedAxiosError).normalized?.isNotFound) return null;
    logger.error(
      `${NOTIFICATIONS_ERROR_MESSAGES.CLIENT.DELETE_NOTIFICATION_FAILED} "${id}":`,
      error,
    );
    throw error;
  }
};

export const clearNotifications = async (userId: string) => {
  try {
    return await Client<NotificationMutationResponse>(
      exporterApiClient,
      Endpoints.NOTIFICATIONS.CLEAR.path,
      {
        method: 'DELETE',
        params: { userId },
      },
    );
  } catch (error) {
    logger.error(NOTIFICATIONS_ERROR_MESSAGES.CLIENT.CLEAR_NOTIFICATIONS_FAILED, error);
    throw error;
  }
};
