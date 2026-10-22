import React from 'react';
import { TIME_FORMATS } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { formatDateTime } from '../../../../utils/shared/time';
import { APPLICATIONS_UI } from '../../constants';

const O = APPLICATIONS_UI.SECTIONS.OVERVIEW;

// "Oct 20, 11:02 · 7h ago": the date to compare, the age to scan, the full time on hover.
const DateAndAge: React.FC<{ date: string }> = ({ date }) => (
  <span>
    {formatDateTime(date, O.DATE_FORMAT)} {O.DATE_SEPARATOR}{' '}
    <TimeAgo date={date} short formatString={TIME_FORMATS.DATE_TIME} />
  </span>
);

export default DateAndAge;
