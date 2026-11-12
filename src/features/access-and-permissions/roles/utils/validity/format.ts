import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';
import { toTimestamp } from '../../../../../utils/shared/time';

const formatTimeRemaining = (milliseconds: number): string => {
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

const formatExpiresIn = (milliseconds: number): string =>
  milliseconds <= 0 ? RC.VALIDITY.EXPIRED : `(expires in ${formatTimeRemaining(milliseconds)})`;

export interface ValidityFormatResult {
  label: string;
  expiresIn?: string;
}

export const formatValidity = (validity: Role['validity'], record: Role): ValidityFormatResult => {
  if (!validity) return { label: 'Permanent' };
  if (validity.type === 'permanent') return { label: 'Permanent' };
  if (validity.type === 'sessionBased') return { label: 'Session Based' };
  if (validity.type === 'temporary') {
    const now = new Date().getTime();

    if (validity.expiresAt) {
      const expiresAt = toTimestamp(validity.expiresAt);
      const remaining = expiresAt - now;
      return { label: 'Temporary', expiresIn: formatExpiresIn(remaining) };
    }

    if (validity.durationHours) {
      const startTime = toTimestamp(record.lastUpdateDate || record.creationDate);
      const expirationTime = startTime + validity.durationHours * 60 * 60 * 1000;
      const remaining = expirationTime - now;
      return { label: 'Temporary', expiresIn: formatExpiresIn(remaining) };
    }

    return { label: 'Temporary' };
  }
  return { label: 'Permanent' };
};
