import React, { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

import { Popover } from 'antd';

import { TIME_FORMATS, TIME_CONFIGS, TIME_TEXTS } from '../../constants';

interface TimeAgoProps {
  date: string | Date;
  formatString?: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, formatString = TIME_FORMATS.DEFAULT }) => {
  const [timeAgo, setTimeAgo] = useState('');

  // Memoize the parsed date
  const parsedDate = useMemo(() => new Date(date), [date]);
  const isValidDate = useMemo(() => !isNaN(parsedDate.getTime()), [parsedDate]);

  const formattedDate = isValidDate ? format(parsedDate, formatString) : TIME_TEXTS.INVALID_DATE;

  // Update every minute
  useEffect(() => {
    const update = () => {
      setTimeAgo(
        isValidDate
          ? formatDistanceToNow(parsedDate, { addSuffix: true })
          : TIME_TEXTS.INVALID_DATE,
      );
    };
    update();
    const interval = setInterval(update, TIME_CONFIGS.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [parsedDate, isValidDate]);

  return <Popover content={formattedDate}>{timeAgo}</Popover>;
};

export default TimeAgo;
