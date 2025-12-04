import type { Role, RoleFormData, RoleFormValues, ValidityType } from '../../models';
import { ROLES_CONSTANTS as RC } from '../../constants';
import dayjs from 'dayjs';

export const buildValidityForAPI = (
  validity: RoleFormValues['validity'],
): RoleFormData['validity'] => {
  if (!validity) {
    return { type: RC.VALIDITY_TYPES.PERMANENT };
  }

  const baseValidity: RoleFormData['validity'] = {
    type: validity.type as ValidityType,
  };

  if (validity.type === RC.VALIDITY_TYPES.TEMPORARY) {
    if (validity.expiresAt) {
      baseValidity.expiresAt = dayjs.isDayjs(validity.expiresAt)
        ? validity.expiresAt.toISOString()
        : validity.expiresAt;
    }
    if (validity.durationHours !== undefined) {
      baseValidity.durationHours = validity.durationHours;
    }
    baseValidity.autoRevoke = Boolean(validity.autoRevoke);
  }

  return baseValidity;
};

export const buildValidityForForm = (
  validity: Role['validity'],
): RoleFormValues['validity'] => {
  if (!validity) {
    return { type: RC.VALIDITY_TYPES.PERMANENT };
  }

  const baseValidity: RoleFormValues['validity'] = {
    type: validity.type,
  };

  if (validity.type === RC.VALIDITY_TYPES.TEMPORARY) {
    if (validity.expiresAt) {
      baseValidity.expiresAt = dayjs(validity.expiresAt);
    }
    if (validity.durationHours !== undefined) {
      baseValidity.durationHours = validity.durationHours;
    }
    if (validity.autoRevoke !== undefined) {
      baseValidity.autoRevoke = validity.autoRevoke;
    }
    baseValidity.expirationModel = validity.expiresAt
      ? RC.VALIDITY.EXPIRATION_MODEL_OPTIONS.EXPIRES_AT
      : validity.durationHours
        ? RC.VALIDITY.EXPIRATION_MODEL_OPTIONS.DURATION
        : undefined;
  }

  return baseValidity;
};

