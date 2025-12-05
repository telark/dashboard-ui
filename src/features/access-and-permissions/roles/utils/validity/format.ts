import type { Role } from '../../models';

const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) {
    return 'expired';
  }

  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (days > 0) {
    const remainingHours = totalHours % 24;
    if (remainingHours > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${days}d`;
  }

  if (totalHours > 0) {
    const remainingMinutes = totalMinutes % 60;
    if (remainingMinutes > 0) {
      return `${totalHours}h ${remainingMinutes}m`;
    }
    return `${totalHours}h`;
  }

  return `${totalMinutes}m`;
};

export const formatValidity = (validity: Role['validity'], record: Role): string => {
  if (!validity) return 'Permanent';
  if (validity.type === 'permanent') return 'Permanent';
  if (validity.type === 'sessionBased') return 'Session Based';
  if (validity.type === 'temporary') {
    const now = new Date().getTime();

    if (validity.expiresAt) {
      const expiresAt = new Date(validity.expiresAt).getTime();
      const remaining = expiresAt - now;
      const timeRemaining = formatTimeRemaining(remaining);
      return `Temporary (expires in ${timeRemaining})`;
    }

    if (validity.durationHours) {
      // Calculate expiration time from creation date or last update date
      const startDate = record.lastUpdateDate ? new Date(record.lastUpdateDate) : new Date(record.creationDate);
      const expirationTime = startDate.getTime() + validity.durationHours * 60 * 60 * 1000;
      const remaining = expirationTime - now;
      const timeRemaining = formatTimeRemaining(remaining);
      return `Temporary (expires in ${timeRemaining})`;
    }

    return 'Temporary';
  }
  return 'Permanent';
};

