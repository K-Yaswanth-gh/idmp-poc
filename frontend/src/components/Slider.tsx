/**
 * スライダーコンポーネント
 */
import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export default function Slider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  className = ''
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-aws-squid-ink-light mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-aws-paper-light rounded-lg appearance-none cursor-pointer accent-aws-sea-blue-light"
        />
        <span className="text-sm text-aws-font-color-gray w-12 text-right">
          {Math.round(value * 100)}%
        </span>
      </div>
    </div>
  );
}
