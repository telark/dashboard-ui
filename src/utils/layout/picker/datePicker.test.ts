import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  endOfZonedDay,
  fromZonedDayjs,
  getDisabledTimeForFutureDates,
  startOfZonedDay,
  toZonedDayjs,
  zonedNow,
} from './datePicker';

// Local noon, so "today" is the same day in every zone the suite may run in.
const NOW = new Date(2026, 5, 1, 12, 30);

describe('zoned picker values', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips an instant through the wall clock', () => {
    const value = dayjs(NOW);

    expect(fromZonedDayjs(toZonedDayjs(value)).valueOf()).toBe(value.valueOf());
    expect(zonedNow().valueOf()).toBe(toZonedDayjs(NOW).valueOf());
  });

  it('leaves an invalid date invalid', () => {
    expect(toZonedDayjs('not a date').isValid()).toBe(false);
  });

  it('bounds a day in the user zone', () => {
    const start = startOfZonedDay(NOW);
    const end = endOfZonedDay(NOW);

    expect(toZonedDayjs(start).hour()).toBe(0);
    expect(toZonedDayjs(end).hour()).toBe(23);
    expect(end.isAfter(start)).toBe(true);
  });

  it('disables nothing without a date, or on another day', () => {
    const disabled = getDisabledTimeForFutureDates();

    for (const current of [null, dayjs(NOW).add(2, 'day')]) {
      expect(disabled(current).disabledHours()).toEqual([]);
      expect(disabled(current).disabledMinutes(1)).toEqual([]);
    }
  });

  it('disables the past hours and minutes of today', () => {
    const zoned = zonedNow();
    const { disabledHours, disabledMinutes } = getDisabledTimeForFutureDates()(zoned);
    const hour = zoned.hour();

    expect(disabledHours()).toHaveLength(hour);
    expect(disabledMinutes(hour)).toHaveLength(zoned.minute());
    expect(disabledMinutes(hour - 1)).toHaveLength(60);
    expect(disabledMinutes(hour + 1)).toEqual([]);
    expect(disabledMinutes(null)).toEqual([]);
  });
});
