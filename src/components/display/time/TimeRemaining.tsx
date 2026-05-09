import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Popover } from 'antd';

import { TIME_FORMATS, TIME_REMAINING, TIME_TEXTS } from '../../../constants';

interface TimeRemainingProps {
  date: string | Date;
  formatString?: string;
}

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function formatRemaining(msLeft: number): string {
  if (msLeft <= 0) return TIME_REMAINING.ENDED;
  const sec = Math.ceil(msLeft / SEC);
  if (sec <= TIME_REMAINING.FAST_THRESHOLD_SEC) {
    return `${sec}${TIME_REMAINING.UNIT_SECOND}${TIME_REMAINING.SUFFIX}`;
  }
  if (msLeft < HOUR) {
    return `${Math.ceil(msLeft / MIN)}${TIME_REMAINING.UNIT_MINUTE}${TIME_REMAINING.SUFFIX}`;
  }
  if (msLeft < DAY) {
    return `${Math.floor(msLeft / HOUR)}${TIME_REMAINING.UNIT_HOUR}${TIME_REMAINING.SUFFIX}`;
  }
  return `${Math.floor(msLeft / DAY)}${TIME_REMAINING.UNIT_DAY}${TIME_REMAINING.SUFFIX}`;
}

const TimeRemaining: React.FC<TimeRemainingProps> = React.memo(
  ({ date, formatString = TIME_FORMATS.DATE_TIME }) => {
    const parsedDate = useMemo(() => new Date(date), [date]);
    const isValidDate = useMemo(() => !Number.isNaN(parsedDate.getTime()), [parsedDate]);

    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
      if (!isValidDate) return;
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
    }, [parsedDate, isValidDate]);

    if (!isValidDate) return <>{TIME_TEXTS.INVALID_DATE}</>;

    const msLeft = parsedDate.getTime() - now;
    const label = formatRemaining(msLeft);
    const exact = format(parsedDate, formatString);

    return <Popover content={exact}>{label}</Popover>;
  },
);

TimeRemaining.displayName = 'TimeRemaining';

export default TimeRemaining;
