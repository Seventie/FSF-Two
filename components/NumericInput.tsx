
import React from 'react';

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  label?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "?", 
  autoFocus = false,
  label = "Answer"
}) => {
  return (
    <div className="w-full relative group">
      <label className="absolute -top-6 left-0 text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold">
        {label}
      </label>
      <input 
        autoFocus={autoFocus}
        className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-white/60 focus:border-amber-100 focus:ring-0 px-0 py-2 text-6xl md:text-8xl font-light font-display text-right transition-all placeholder:text-white/40 outline-none"
        placeholder={placeholder}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
      />
    </div>
  );
};

export default NumericInput;
