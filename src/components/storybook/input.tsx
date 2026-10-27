import React from 'react'
import type { InputProps } from '@/types/storybook'

export const Input: React.FC<InputProps> = ({
  label,
  id,
  value = '',
  onChange,
  placeholder,
  required = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="px-4 py-2 rounded-lg border border-border dark:border-storymixer-grey-dark bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
      />
    </div>
  )
}
