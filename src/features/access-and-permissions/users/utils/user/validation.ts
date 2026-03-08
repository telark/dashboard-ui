import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FULLNAME_ALLOWED_CHARS = /^[a-zA-ZÀ-ÿ\s'\-.]+$/;

export const makeUsernameUniqueRule = (existingUsers: User[], currentUserId?: string) => ({
  validator(_: unknown, value: string) {
    if (!value?.trim()) return Promise.resolve();
    const isTaken = existingUsers.some(
      (u) =>
        u.username.toLowerCase() === value.trim().toLowerCase() && u.id !== currentUserId,
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

export const makeFullnameCharsRule = () => ({
  validator(_: unknown, value: string) {
    if (!value?.trim()) return Promise.resolve();
    return FULLNAME_ALLOWED_CHARS.test(value.trim())
      ? Promise.resolve()
      : Promise.reject(new Error(UC.LABELS.VALIDATION.FULLNAME_SPECIAL_CHARS));
  },
});
