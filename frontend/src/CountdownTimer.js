import React, { useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';

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
      {`${timeLeft.days} days, ${timeLeft.hours} hours`}
    </div>
  );
};

const calculateTimeLeft = (endDate) => {
  const now = new Date();
  const duration = intervalToDuration({ start: now, end: new Date(endDate) });

  return {
    days: duration.days,
    hours: duration.hours,
    total: duration.seconds + duration.minutes * 60 + duration.hours * 3600 + duration.days * 86400
  };
};

export default CountdownTimer;
