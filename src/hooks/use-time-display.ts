import { useEffect, useState } from 'react';

import { intlFormatDistance } from 'date-fns';

export const useTimeDisplay = (
  date: Date,
  options: {
    addSuffix?: boolean;
    includeSeconds?: boolean;
    style?: 'short' | 'long';
    secondsAlternativeText?: string;
  } = {
    addSuffix: false,
    includeSeconds: false,
    style: 'short',
    secondsAlternativeText: 'Just now',
  },
) => {
  const { addSuffix = false, includeSeconds = false, style = 'short' } = options;

  const [time, setTime] = useState(
    intlFormatDistance(date, new Date(), {
      style,
    }),
  );

  useEffect(() => {
    const timeUnit = getTimeUnit(time) as ShortTimeUnits;
    const interval = setInterval(() => {
      setTime(
        intlFormatDistance(date, new Date(), {
          style,
        }),
      );
    }, milliseconds[timeUnit]);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const formattedTime = time.replace('.', '');
  if (!includeSeconds && formattedTime.includes('sec')) {
    return options.secondsAlternativeText;
  }
  if (!addSuffix) {
    return formattedTime.replace(' ago', '');
  }
  return formattedTime;
};
const shortTimeUnits = ['s', 'm', 'h', 'd', 'w', 'mo', 'y'];
type ShortTimeUnits = (typeof shortTimeUnits)[number];

const milliseconds: Record<ShortTimeUnits, number> = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24,
  w: 1000 * 60 * 60 * 24 * 7,
  mo: 1000 * 60 * 60 * 24 * 30,
  y: 1000 * 60 * 60 * 24 * 365,
};

export const formatDateTime = (date: any) => {
  if (date) {
    const dt = new Date(date);
    const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();

    return day + '/' + month + '/' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes();
  }
  return '';
};

const getTimeUnit = (time: string) => {
  switch (time) {
    case 'now':
      return 's';
    case 'yesterday':
    case 'tomorrow':
      return 'd';
    case 'last week':
    case 'next week':
      return 'w';
    case 'last month':
    case 'next month':
      return 'm';
    case 'last year':
    case 'next year':
      return 'y';
    default:
      return time.split(' ')[1].toLowerCase().charAt(0);
  }
};
