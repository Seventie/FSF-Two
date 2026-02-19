
import React from 'react';

interface NumberLabelProps {
  value: number;
  className?: string;
}

const NumberLabel: React.FC<NumberLabelProps> = ({ value, className = "" }) => {
  return (
    <div className={`mt-2 text-xs uppercase tracking-[0.3em] font-bold opacity-80 text-center ${className}`}>
      Count: {value}
    </div>
  );
};

export default NumberLabel;
