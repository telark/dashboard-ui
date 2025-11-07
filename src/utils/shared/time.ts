export const ParseGoTimeDate = (goTimeString: string): string => {
  if (!goTimeString || goTimeString === 'Unknown') {
    return new Date().toISOString();
  }

  // Handle Go time.Date format: time.Date(2025, time.September, 28, 12, 13, 1, 0, time.Local)
  const match = goTimeString.match(
    /time\.Date\((\d+),\s*time\.(\w+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*time\.Local\)/,
  );

  if (match) {
    const [, year, monthName, day, hour, minute, second] = match;

    // Convert month name to number
    const monthMap: { [key: string]: number } = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const month = monthMap[monthName] || 0;
    const date = new Date(
      Number.parseInt(year),
      month,
      Number.parseInt(day),
      Number.parseInt(hour),
      Number.parseInt(minute),
      Number.parseInt(second),
    );
    return date.toISOString();
  }

  // If it's already a valid ISO string, return as is
  try {
    new Date(goTimeString);
    return goTimeString;
  } catch {
    // Fallback to current time
    return new Date().toISOString();
  }
};
