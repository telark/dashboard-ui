import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { fromZonedTime, toZonedTime, type DateInput } from '../../shared/time';

// Picker values are real instants; what the picker shows and hands to
// disabledDate/disabledTime is the wall clock in the user's time zone.
export const toZonedDayjs = (value: Dayjs | DateInput): Dayjs => {
  const date = dayjs(value);
  return date.isValid() ? dayjs(toZonedTime(date.toDate())) : date;
};

export const fromZonedDayjs = (wallClock: Dayjs): Dayjs => dayjs(fromZonedTime(wallClock.toDate()));

export const zonedNow = (): Dayjs => toZonedDayjs(new Date());

export const startOfZonedDay = (value: Dayjs | DateInput): Dayjs =>
  fromZonedDayjs(toZonedDayjs(value).startOf('day'));

export const endOfZonedDay = (value: Dayjs | DateInput): Dayjs =>
  fromZonedDayjs(toZonedDayjs(value).endOf('day'));

export const getDisabledTimeForFutureDates = () => {
  return (current: Dayjs | null) => {
    if (!current) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const now = zonedNow();
    const isToday = current.isSame(now, 'day');

    if (!isToday) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const currentHour = now.hour();
    const currentMinute = now.minute();

    return {
      disabledHours: () => {
        return Array.from({ length: currentHour }, (_, i) => i);
      },
      disabledMinutes: (selectedHour: number | null) => {
        if (selectedHour === null) {
          return [];
        }

        if (selectedHour === currentHour) {
          return Array.from({ length: currentMinute }, (_, i) => i);
        }

        if (selectedHour < currentHour) {
          return Array.from({ length: 60 }, (_, i) => i);
        }

        return [];
      },
    };
  };
};
