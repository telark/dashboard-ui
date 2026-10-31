import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';
import { INPUT_LIMITS } from '../../../../../constants';
import {
  DEFAULT_NAME_VALIDATION_CONFIG,
  sanitizeName,
  validateNameFormat,
} from '../../../../shared';

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
// Any script's letters, since OIDC names can be non-Latin.
const FULLNAME_ALLOWED_CHARS = /^[\p{L}\p{M} '.-]+$/u;
const NOT_A_LETTER = /[^\p{L}\p{M}]+/u;

const USERNAME_FORMAT = {
  minLength: INPUT_LIMITS.USERNAME.MIN,
  maxLength: INPUT_LIMITS.USERNAME.MAX,
  allowedPattern: DEFAULT_NAME_VALIDATION_CONFIG.allowedPattern,
  invalidCharsErrorMessage: UC.LABELS.VALIDATION.USERNAME_INVALID_CHARS,
  lengthErrorMessage: UC.LABELS.VALIDATION.USERNAME_LENGTH,
};

// Drops what the username can't hold while typing, like role and group names.
export const sanitizeUsername = (value: string) =>
  sanitizeName(value, DEFAULT_NAME_VALIDATION_CONFIG);

// A new member's first full name, until its owner edits it: the username's runs of letters, as the
// server derives one from an email, since a username may hold digits and _ that a full name can't.
export const fullnameFromUsername = (username: string) =>
  username
    .split(NOT_A_LETTER)
    .filter(Boolean)
    .join(' ')
    .slice(0, INPUT_LIMITS.FULL_NAME.MAX)
    .trim() || UC.DEFAULTS.FULLNAME;

export const makeUsernameFormatRule = () => ({
  validator(_: unknown, value: string) {
    const error = validateNameFormat(value, USERNAME_FORMAT);
    return error ? Promise.reject(new Error(error)) : Promise.resolve();
  },
});

export const makeUsernameUniqueRule = (existingUsers: User[], currentUserId?: string) => ({
  validator(_: unknown, value: string) {
    if (!value?.trim()) return Promise.resolve();
    const isTaken = existingUsers.some(
      (u) => u.username.toLowerCase() === value.trim().toLowerCase() && u.id !== currentUserId,
    );
    return isTaken
      ? Promise.reject(new Error(UC.LABELS.VALIDATION.USERNAME_TAKEN))
      : Promise.resolve();
  },
});

export const makeEmailFormatRule = () => ({
  validator(_: unknown, value: string) {
    if (!value?.trim()) return Promise.resolve();
    return EMAIL_REGEX.test(value.trim())
      ? Promise.resolve()
      : Promise.reject(new Error(UC.LABELS.VALIDATION.INVALID_EMAIL));
  },
});

// Emails are unique case-insensitively: OIDC login matches an account by email.
export const makeEmailUniqueRule = (existingUsers: User[], currentUserId?: string) => ({
  validator(_: unknown, value: string) {
    const email = value?.trim().toLowerCase();
    if (!email) return Promise.resolve();
    return existingUsers.some(
      (u) => u.id !== currentUserId && u.email?.trim().toLowerCase() === email,
    )
      ? Promise.reject(new Error(UC.LABELS.VALIDATION.EMAIL_TAKEN))
      : Promise.resolve();
  },
});

export const makeFullnameCharsRule = () => ({
  validator(_: unknown, value: string) {
    if (!value?.trim()) return Promise.resolve();
    return FULLNAME_ALLOWED_CHARS.test(value.trim())
      ? Promise.resolve()
      : Promise.reject(new Error(UC.LABELS.VALIDATION.FULLNAME_SPECIAL_CHARS));
  },
});
