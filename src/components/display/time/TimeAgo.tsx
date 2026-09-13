import React, { useEffect, useState, useMemo } from 'react';
import { Popover } from 'antd';

import { TIME_FORMATS, TIME_CONFIGS } from '../../../constants';
import { formatDateTime, formatTimeAgo, parseDate } from '../../../utils/shared/time';

interface TimeAgoProps {
  date: string | Date;
  formatString?: string;
}

const TimeAgo: React.FC<TimeAgoProps> = React.memo(
  ({ date, formatString = TIME_FORMATS.DEFAULT }) => {
    const [timeAgo, setTimeAgo] = useState('');

    // Memoize the parsed date
    const parsedDate = useMemo(() => parseDate(date), [date]);

    const formattedDate = formatDateTime(parsedDate, formatString);

    // Update every minute
    useEffect(() => {
      const update = () => {
        setTimeAgo(formatTimeAgo(parsedDate));
      };
      update();
      const interval = setInterval(update, TIME_CONFIGS.UPDATE_INTERVAL);
      return () => clearInterval(interval);
    }, [parsedDate]);

    return <Popover content={formattedDate}>{timeAgo}</Popover>;
  },
);

TimeAgo.displayName = 'TimeAgo';

export default TimeAgo;
