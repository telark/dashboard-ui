import React, { useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';

import { TIME_FORMATS, TIME_REMAINING, TIME_TEXTS } from '../../../constants';
import {
  formatDateTime,
  formatTimeAgo,
  formatTimeZoneOffset,
  getTimeZone,
  parseDate,
} from '../../../utils/shared/time';

interface TimeRemainingProps {
  date: string | Date;
  prefix?: string;
  endedPrefix?: string;
  formatString?: string;
}

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function formatRemaining(msLeft: number): string {
  const sec = Math.ceil(msLeft / SEC);
  if (sec <= TIME_REMAINING.FAST_THRESHOLD_SEC) {
    return `${sec}${TIME_REMAINING.UNIT_SECOND}`;
  }
  if (msLeft < HOUR) {
    return `${Math.ceil(msLeft / MIN)}${TIME_REMAINING.UNIT_MINUTE}`;
  }
  if (msLeft < DAY) {
    return `${Math.floor(msLeft / HOUR)}${TIME_REMAINING.UNIT_HOUR}`;
  }
  return `${Math.floor(msLeft / DAY)}${TIME_REMAINING.UNIT_DAY}`;
}

const TimeRemaining: React.FC<TimeRemainingProps> = React.memo(
  ({ date, prefix, endedPrefix = TIME_REMAINING.ENDED, formatString = TIME_FORMATS.DATE_TIME }) => {
    const parsedDate = useMemo(() => parseDate(date), [date]);

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
      if (!parsedDate) return;
      let timeoutId: ReturnType<typeof setTimeout>;
      const schedule = () => {
        const msLeft = parsedDate.getTime() - Date.now();
        const delay =
          msLeft > TIME_REMAINING.FAST_THRESHOLD_SEC * SEC
            ? TIME_REMAINING.TICK_SLOW_MS
            : TIME_REMAINING.TICK_FAST_MS;
        timeoutId = setTimeout(() => {
          setNow(Date.now());
          schedule();
        }, delay);
      };
      schedule();
      return () => clearTimeout(timeoutId);
    }, [parsedDate]);

    if (!parsedDate) return <>{TIME_TEXTS.INVALID_DATE}</>;

    const exact = `${formatDateTime(parsedDate, formatString)} (${formatTimeZoneOffset(getTimeZone())})`;
    const msLeft = parsedDate.getTime() - now;

    if (msLeft <= 0) {
      const ago = formatTimeAgo(parsedDate);
      return <Popover content={exact}>{`${endedPrefix} ${ago}`}</Popover>;
    }

    const label = formatRemaining(msLeft);
    const text = prefix ? `${prefix} ${label}` : label;
    return <Popover content={exact}>{text}</Popover>;
  },
);

TimeRemaining.displayName = 'TimeRemaining';

export default TimeRemaining;
