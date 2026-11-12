import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TIME_FORMATS, TIME_TEXTS } from '../../constants/shared/time';
import { signIn } from '../../test/helpers/session';
import {
  buildTimeZoneOptions,
  formatDateKey,
  formatDateTime,
  formatTimeAgo,
  formatTimeAgoShort,
  formatTimeZoneOffset,
  fromZonedTime,
  getBrowserRegion,
  getBrowserTimeZone,
  getSupportedTimeZones,
  getTimeZone,
  isValidTimeZone,
  parseDate,
  toDateKey,
  toTimestamp,
  toZonedTime,
} from './time';

const NOW = new Date('2026-06-01T12:00:00Z');

describe('date parsing', () => {
  it.each([[null], [undefined], [''], ['not a date']])('reads %j as no date', (value) => {
    expect(parseDate(value)).toBeNull();
    expect(toTimestamp(value)).toBe(0);
  });

  it('accepts a Date, a number and a string', () => {
    expect(parseDate(NOW)).toBe(NOW);
    expect(toTimestamp(NOW.getTime())).toBe(NOW.getTime());
    expect(toTimestamp(NOW.toISOString())).toBe(NOW.getTime());
  });
});

describe('time zones', () => {
  it.each([
    ['UTC', true],
    ['Europe/Paris', true],
    ['Not/AZone', false],
  ])('isValidTimeZone(%j) is %j', (zone, expected) => {
    expect(isValidTimeZone(zone)).toBe(expected);
  });

  it('lists UTC and the browser zone first, without repeats', () => {
    const zones = getSupportedTimeZones();

    expect(zones[0]).toBe('UTC');
    expect(zones).toContain(getBrowserTimeZone());
    expect(new Set(zones).size).toBe(zones.length);
  });

  it.each([
    ['UTC', 'UTC+00:00'],
    ['Etc/GMT-3', 'UTC+03:00'],
  ])('labels the offset of %s as %s', (zone, expected) => {
    expect(formatTimeZoneOffset(zone, NOW)).toBe(expected);
    // The second read comes from the formatter cache.
    expect(formatTimeZoneOffset(zone, NOW)).toBe(expected);
  });

  it('builds select options with the offset in the label', () => {
    expect(buildTimeZoneOptions()[0]).toEqual({ value: 'UTC', label: 'UTC (UTC+00:00)' });
  });

  it('reads the region of the browser language', () => {
    expect(getBrowserRegion()).toBe('US');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('not a locale!');
    expect(getBrowserRegion()).toBeUndefined();
  });

  it('follows the signed-in user and falls back to the browser for a bad zone', () => {
    signIn({ settings: { timezone: 'Asia/Tokyo' } });
    expect(getTimeZone()).toBe('Asia/Tokyo');
    // The resolved zone is cached until the stored user changes.
    expect(getTimeZone()).toBe('Asia/Tokyo');

    signIn({ settings: { timezone: 'Not/AZone' } });
    expect(getTimeZone()).toBe(getBrowserTimeZone());
  });

  it('round-trips a wall clock through a zone', () => {
    const wall = toZonedTime(NOW, 'Etc/GMT-3');

    expect(wall.getHours()).toBe(15);
    expect(fromZonedTime(wall, 'Etc/GMT-3').getTime()).toBe(NOW.getTime());
  });
});

describe('date formatting', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats in the given zone, and refuses a bad date', () => {
    expect(formatDateTime(NOW, TIME_FORMATS.DATE_TIME, 'UTC')).toBe('Jun 1, 2026 12:00');
    expect(formatDateTime('nope')).toBe(TIME_TEXTS.INVALID_DATE);
  });

  it('builds and reads date keys', () => {
    expect(toDateKey(NOW)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(formatDateKey('2026-06-01')).toBe('June 1, 2026');
  });

  it('says how long ago a date was', () => {
    expect(formatTimeAgo(new Date(NOW.getTime() - 3_600_000))).toBe('about 1 hour ago');
    expect(formatTimeAgo(null)).toBe(TIME_TEXTS.INVALID_DATE);
  });

  it.each([
    [10, TIME_TEXTS.JUST_NOW],
    [-30, TIME_TEXTS.JUST_NOW],
    [90, TIME_TEXTS.AGO_SHORT(1, 'm')],
    [7_200, TIME_TEXTS.AGO_SHORT(2, 'h')],
    [172_800, TIME_TEXTS.AGO_SHORT(2, 'd')],
    [5_184_000, TIME_TEXTS.AGO_SHORT(2, 'mo')],
    [63_072_000, TIME_TEXTS.AGO_SHORT(2, 'y')],
  ])('labels an age of %i s as %j', (seconds, expected) => {
    expect(formatTimeAgoShort(NOW.getTime() - seconds * 1000)).toBe(expected);
  });

  it('labels a bad date in short form', () => {
    expect(formatTimeAgoShort('nope')).toBe(TIME_TEXTS.INVALID_DATE);
  });
});
