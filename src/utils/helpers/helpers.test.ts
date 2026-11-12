import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HTTP_STATUS, UTILS_TEXTS } from '../../constants';
import { buildConfirmMessage } from '../layout/modals/buildMessage';
import { loadAvatarStyle } from '../layout/user-avatar/loadAvatarStyles';
import { applySearch } from '../search';
import { extractItemsFromResponse } from './api';
import { isDevelopment } from './env';
import { extractErrorMessage, rejectionMessage } from './format';
import { inputGuard } from './inputGuard';
import { pollWhileVisible } from './poll';

describe('extractItemsFromResponse', () => {
  it('returns the items of a successful response', () => {
    const body = { status: HTTP_STATUS.SUCCESS, data: { items: [1] } };

    expect(extractItemsFromResponse(body)).toEqual([1]);
  });

  it('reads a response without a list as empty', () => {
    expect(extractItemsFromResponse({ status: HTTP_STATUS.SUCCESS, data: {} })).toEqual([]);
  });

  it.each([[null], [{ status: 'error', data: { items: [] } }], [{ status: HTTP_STATUS.SUCCESS }]])(
    'refuses %j',
    (body) => {
      expect(() => extractItemsFromResponse(body)).toThrow(UTILS_TEXTS.ERRORS.INVALID_DATA_FORMAT);
    },
  );
});

describe('error text helpers', () => {
  const normalized = Object.assign(new Error('axios text'), {
    normalized: { message: 'server text' },
  });

  it.each<[unknown, string]>([
    ['a string', 'fallback'],
    [new Error('plain'), 'plain'],
    [normalized, 'server text'],
  ])('extractErrorMessage(%j)', (error, expected) => {
    expect(extractErrorMessage(error, 'fallback')).toBe(expected);
  });

  it.each<[unknown, string]>([
    ['Refused by the server', 'Refused by the server'],
    ['', 'fallback'],
    [undefined, 'fallback'],
    ['Network Error', 'fallback'],
  ])('rejectionMessage(%j)', (rejection, expected) => {
    expect(rejectionMessage(rejection, 'fallback')).toBe(expected);
  });
});

describe('inputGuard', () => {
  it('drops invisible characters from a single line', () => {
    const { normalize, rules, input } = inputGuard(10);

    expect(normalize('a​b\tc\n')).toBe('abc');
    expect(rules).toEqual([]);
    expect(input).toEqual({ maxLength: 10, showCount: false });
  });

  it('keeps line breaks in a text area and adds the required rule', () => {
    const { normalize, rules, input } = inputGuard(5, { required: 'Needed', multiline: true });

    expect(normalize('a\nb​')).toBe('a\nb');
    expect(rules).toEqual([{ required: true, whitespace: true, message: 'Needed' }]);
    expect(input.showCount).toBe(true);
  });
});

describe('pollWhileVisible', () => {
  const setHidden = (hidden: boolean) => {
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(hidden);
    document.dispatchEvent(new Event('visibilitychange'));
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls on the interval, stops while hidden and polls once on return', () => {
    const poll = vi.fn();
    const stop = pollWhileVisible(poll, 100);

    vi.advanceTimersByTime(250);
    expect(poll).toHaveBeenCalledTimes(2);

    setHidden(true);
    vi.advanceTimersByTime(500);
    expect(poll).toHaveBeenCalledTimes(2);

    setHidden(false);
    expect(poll).toHaveBeenCalledTimes(3);
    vi.advanceTimersByTime(100);
    expect(poll).toHaveBeenCalledTimes(4);

    stop();
    vi.advanceTimersByTime(500);
    expect(poll).toHaveBeenCalledTimes(4);
  });
});

describe('small helpers', () => {
  it('follows the build mode flag', () => {
    expect(isDevelopment()).toBe(true);
    vi.stubEnv('DEV', false);
    expect(isDevelopment()).toBe(false);
    vi.unstubAllEnvs();
  });

  it.each([
    ['delete', 'x', 'role', 'Are you sure you want to delete role '],
    ['delete', 'x', undefined, 'Are you sure you want to delete '],
  ])('buildConfirmMessage(%j, %j, %j)', (action, name, type, expected) => {
    expect(buildConfirmMessage(action, name, type)).toBe(expected);
  });

  it('searches every field and ignores a blank term', () => {
    const items = [
      { a: 'Alpha', n: 1 },
      { a: null, n: 22 },
    ];
    const fields = [
      (item: (typeof items)[number]) => item.a,
      (item: (typeof items)[number]) => item.n,
    ];

    expect(applySearch(items, '  ', fields)).toBe(items);
    expect(applySearch(items, 'alp', fields)).toEqual([items[0]]);
    expect(applySearch(items, '22', fields)).toEqual([items[1]]);
  });

  it('loads a known avatar style, and nothing for an unknown one', async () => {
    await expect(loadAvatarStyle('identicon')).resolves.toHaveProperty(
      'create',
      expect.any(Function),
    );
    await expect(loadAvatarStyle('no-such-style')).resolves.toBeNull();
  });
});
