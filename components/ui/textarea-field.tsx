'use client'

import { AlertCircle } from 'lucide-react'

interface CharacterCounterProps {
  current: number
  max: number
  min?: number
}

function getCounterColor(length: number, min: number, max: number): string {
  if (length > max || (length > 0 && length < min)) {
    return 'text-destructive font-medium'
  }
  if (length > max * 0.9) {
    return 'text-yellow-600 dark:text-yellow-500'
  }
  return 'text-muted-foreground'
}

export function CharacterCounter({ current, max, min = 0 }: CharacterCounterProps) {
  return (
    <span
      className={`text-xs ${getCounterColor(current, min, max)}`}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  )
}

interface TextareaFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  rows?: number
  minHeight?: string
  required?: boolean
  disabled?: boolean
  error?: string
  min?: number
  max: number
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 2,
  minHeight = '2.5rem',
  required = false,
  disabled = false,
  error,
  min = 0,
  max,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        style={{ minHeight }}
        className={`block w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring [field-sizing:content] disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? 'border-destructive' : 'border-input'
        }`}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
      />
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs text-destructive" role="alert">
            <AlertCircle className="size-3" aria-hidden="true" />
            {error}
          </p>
        ) : (
          <span />
        )}
        <CharacterCounter current={value.length} max={max} min={min} />
      </div>
    </div>
  )
}
