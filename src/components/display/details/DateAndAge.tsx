import React from 'react';
import { TIME_FORMATS, TIME_TEXTS } from '../../../constants';
import TimeAgo from '../time/TimeAgo';
import { formatDateTime } from '../../../utils/shared/time';

// "Oct 20, 11:02 · 7h ago": the date to compare, the age to scan, the full time on hover.
const DateAndAge: React.FC<{ date: string }> = ({ date }) => (
  <span>
    {formatDateTime(date, TIME_FORMATS.SHORT_DATE_TIME)} {TIME_TEXTS.DATE_AGE_SEPARATOR}{' '}
    <TimeAgo date={date} short formatString={TIME_FORMATS.DATE_TIME} />
  </span>
);

export default DateAndAge;
