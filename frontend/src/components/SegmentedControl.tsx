/**
 * セグメントコントロールコンポーネント
 * タブ形式のラジオボタングループを提供します
 */
import React, { ReactNode } from 'react';

interface SegmentOption {
  value: string;
  label: string;
  count?: number;
  icon?: ReactNode; // アイコンを追加
  disabled?: boolean;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  name,
  className = '',
  size = 'md'
}: SegmentedControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // サイズに応じたスタイルを定義
  const sizeStyles = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4',
  };

  return (
    <div className={`inline-flex rounded-md bg-aws-paper-light p-1 ${className}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const buttonClasses = `
          ${sizeStyles[size]}
          rounded-md
          transition-colors
          ${isSelected 
            ? 'bg-white text-aws-squid-ink-light shadow-sm' 
            : 'text-aws-font-color-gray hover:text-aws-squid-ink-light'}
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `;

        return (
          <label key={option.value} className={buttonClasses}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={handleChange}
              disabled={option.disabled}
              className="sr-only"
            />
            <span className="flex items-center">
              {/* アイコンがある場合は表示 */}
              {option.icon && (
                <span className="mr-1.5 flex items-center">{option.icon}</span>
              )}
              {option.label}
              {option.count !== undefined && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  isSelected ? 'bg-aws-paper-light' : 'bg-white'
                }`}>
                  {option.count}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
