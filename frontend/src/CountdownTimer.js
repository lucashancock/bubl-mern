import React, { useState, useEffect } from 'react';
import { formatDuration, intervalToDuration } from 'date-fns';
// import axios from 'axios';
// import { hostname } from './App';

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        clearInterval(timer);

      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="w-full text-center">
      {formatDuration(timeLeft, { delimiter: ', ' })}
    </div>
  );
};

const calculateTimeLeft = (endDate) => {
  const now = new Date();
  const duration = intervalToDuration({ start: now, end: new Date(endDate) });

  return {
    years: duration.years,
    months: duration.months,
    days: duration.days,
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds,
    total: duration.seconds + duration.minutes * 60 + duration.hours * 3600 + duration.days * 86400
  };
};

export default CountdownTimer;
