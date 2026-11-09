import type { Notification } from '../../features/notifications/models';
import { createFactory } from '../factory';

export const buildNotification = createFactory<Notification>((sequence) => ({
  id: `notification-${sequence}`,
  userId: 'user-under-test',
  type: 'role.changed',
  title: `Role changed ${sequence}`,
  message: 'Your access **changed**',
  severity: 'info',
  createdAt: '2026-01-15T10:00:00Z',
}));
