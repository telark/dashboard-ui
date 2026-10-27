import React, { useEffect, useState, useMemo } from 'react';

import { TIME_FORMATS, TIME_CONFIGS } from '../../../constants';
import {
  formatDateTime,
  formatTimeAgo,
  formatTimeAgoShort,
  formatTimeZoneOffset,
  getTimeZone,
  parseDate,
} from '../../../utils/shared/time';
import ExactTimePopover from './ExactTimePopover';

interface TimeAgoProps {
  date: string | Date;
  formatString?: string;
  // "5h ago" instead of "about 5 hours ago".
  short?: boolean;
  // Labeled exact times for the popover in place of `date` alone ("Updated …", "Created …").
  exactRows?: { label: string; date: string | Date }[];
}

const TimeAgo: React.FC<TimeAgoProps> = React.memo(
  ({ date, formatString = TIME_FORMATS.DEFAULT, short = false, exactRows }) => {
    const [timeAgo, setTimeAgo] = useState('');

    const parsedDate = useMemo(() => parseDate(date), [date]);

    const formattedDate = exactRows
      ? exactRows.map((row) => `${row.label} ${formatDateTime(row.date, formatString)}`).join(' · ')
      : formatDateTime(parsedDate, formatString);
    const timeZoneLabel = formatTimeZoneOffset(getTimeZone());
    const format = short ? formatTimeAgoShort : formatTimeAgo;

    useEffect(() => {
      const update = () => {
        setTimeAgo(format(parsedDate));
      };
      update();
      const interval = setInterval(update, TIME_CONFIGS.UPDATE_INTERVAL);
      return () => clearInterval(interval);
    }, [parsedDate, format]);

    return <ExactTimePopover exact={`${formattedDate} (${timeZoneLabel})`} text={timeAgo} />;
  },
);

TimeAgo.displayName = 'TimeAgo';

export default TimeAgo;
