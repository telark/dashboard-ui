import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../../constants';
import {
  DEFAULT_NAME_VALIDATION_CONFIG as CONFIG,
  type NameValidationConfig,
} from '../constants/nameValidation';
import { removeRetryState, retryReducer, upsertRetryState, RETRY_STATUS } from '../retry';
import { googleRedirectUri } from './googleRedirect';
import { sanitizeName } from './nameSanitization';
import { createNameValidator, nameValidationError, validateNameFormat } from './nameValidation';
import { textChanged } from './textChanged';

const SHORT: NameValidationConfig = { ...CONFIG, minLength: 3, maxLength: 5 };

describe('validateNameFormat', () => {
  it.each([
    ['', null],
    ['  ', null],
    ['ab', SHORT.lengthErrorMessage(3, 5)],
    ['abcdef', SHORT.lengthErrorMessage(3, 5)],
    ['a b!', SHORT.invalidCharsErrorMessage],
    [' abc ', null],
  ])('reads %j as %j', (value, expected) => {
    expect(validateNameFormat(value, SHORT)).toBe(expected);
  });
});

describe('nameValidationError', () => {
  const existingItems = [{ name: 'Taken' }, { name: 'Mine' }];
  const base = { existingItems, getName: (item: { name: string }) => item.name, config: CONFIG };

  it.each<
    [string, Partial<Parameters<typeof nameValidationError<{ name: string }>>[0]>, string | null]
  >([
    ['nothing typed', { value: ' ' }, null],
    ['a free name', { value: 'free' }, null],
    ['a bad format', { value: 'no spaces' }, CONFIG.invalidCharsErrorMessage],
    ['a taken name in any case', { value: 'TAKEN' }, CONFIG.duplicateErrorMessage],
    ['its own name while editing', { value: 'mine', isEditMode: true, currentName: 'Mine' }, null],
    [
      'another name while editing',
      { value: 'taken', isEditMode: true, currentName: 'Mine' },
      CONFIG.duplicateErrorMessage,
    ],
  ])('reads %s', (_, options, expected) => {
    expect(nameValidationError({ value: '', ...base, ...options })).toBe(expected);
  });

  it('turns the check into a form validator', async () => {
    const validate = createNameValidator(existingItems, base.getName, CONFIG);

    await expect(validate(null, 'free')).resolves.toBeUndefined();
    await expect(validate(null, 'taken')).rejects.toThrow(CONFIG.duplicateErrorMessage);
  });
});

describe('name and text helpers', () => {
  it.each([
    ['a b-c!', 'ab-c'],
    ['', ''],
  ])('sanitizeName(%j) is %j', (input, expected) => {
    expect(sanitizeName(input, CONFIG)).toBe(expected);
  });

  it.each([
    [undefined, '', false],
    [null, undefined, false],
    ['a', 'a', false],
    ['a', 'b', true],
    ['a', undefined, true],
  ])('textChanged(%j, %j) is %j', (stored, current, expected) => {
    expect(textChanged(stored, current)).toBe(expected);
  });

  it('builds the redirect URI on this origin', () => {
    expect(googleRedirectUri()).toBe(`${window.location.origin}${APP_ROUTES.GOOGLE_CALLBACK}`);
  });
});

describe('retry slice', () => {
  const entry = {
    key: 'k',
    attempt: 1,
    lastAttemptAt: 1,
    nextAttemptAt: 2,
    status: RETRY_STATUS.RETRYING,
  };

  it('stores and removes a retry entry', () => {
    const stored = retryReducer(undefined, upsertRetryState(entry));

    expect(stored.byKey.k).toEqual(entry);
    expect(retryReducer(stored, removeRetryState('k')).byKey).toEqual({});
  });
});
