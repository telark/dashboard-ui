export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string | null;
}

export interface NotificationListData {
  items: Notification[];
  nextCursor?: string | null;
  unreadCount: number;
}

export interface NotificationListResponse {
  status: string;
  operation: string;
  message?: string;
  data: NotificationListData;
}

export interface NotificationMutationResponse {
  status: string;
  operation: string;
  message?: string;
  data?: Notification | null;
}

export interface NotificationsCache {
  items: Notification[];
  unreadCount: number;
  fetchedAt: number;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  panelOpen: boolean;
  fetchedAt: number | null;
}
