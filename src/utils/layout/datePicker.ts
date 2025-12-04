import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const getDisabledTimeForFutureDates = () => {
  return (current: Dayjs | null) => {
    if (!current) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    const now = dayjs();
    const isToday = current.isSame(now, 'day');

    if (!isToday) {
      // If not today, all hours and minutes are available
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
      };
    }

    // If today, disable past hours and minutes
    const currentHour = now.hour();
    const currentMinute = now.minute();

    return {
      disabledHours: () => {
        // Disable all hours before the current hour
        return Array.from({ length: currentHour }, (_, i) => i);
      },
      disabledMinutes: (selectedHour: number | null) => {
        if (selectedHour === null) {
          return [];
        }

        // If selected hour is the current hour, disable past minutes
        if (selectedHour === currentHour) {
          return Array.from({ length: currentMinute }, (_, i) => i);
        }

        // If selected hour is in the past, disable all minutes
        if (selectedHour < currentHour) {
          return Array.from({ length: 60 }, (_, i) => i);
        }

        // If selected hour is in the future, all minutes are available
        return [];
      },
    };
  };
};
