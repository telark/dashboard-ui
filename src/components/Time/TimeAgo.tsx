import React, { useEffect, useState, useMemo } from "react";
import { formatDistanceToNow, format } from "date-fns";

import { Popover } from "antd";

import { DEFAULT_DATE_FORMAT } from "../../config";

interface TimeAgoProps {
  date: string | Date; // Accepts either a string or a Date object
  formatString?: string; // Optional format for detailed popover
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, formatString = DEFAULT_DATE_FORMAT }) => {
  const [timeAgo, setTimeAgo] = useState("");

  // Memoize the parsed date
  const parsedDate = useMemo(() => new Date(date), [date]);
  const isValidDate = useMemo(() => !isNaN(parsedDate.getTime()), [parsedDate]);

  const formattedDate = isValidDate ? format(parsedDate, formatString) : "Invalid Date";

  // Update every minute
  useEffect(() => {
    const update = () => {
      setTimeAgo(isValidDate ? formatDistanceToNow(parsedDate, { addSuffix: true }) : "Invalid Date");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [parsedDate, isValidDate]);

  return <Popover content={formattedDate}>{timeAgo}</Popover>;
};

export default TimeAgo;
