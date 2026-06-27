import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const CountUp: React.FC<Props> = ({ value, prefix = '', suffix = '', duration = 2000 }) => {
  const { ref, count } = useCountUp(value, duration);
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default CountUp;
