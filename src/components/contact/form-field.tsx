/**
 * Form Field Component
 * Reusable form field with label, input, and error handling
 *
 * Client Component - handles form state
 */

'use client';

import { cn } from '@/lib/utils';

interface FormFieldProps {
  /** Field identifier */
  id: string;
  /** Field label */
  label: string;
  /** Input type */
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  /** Placeholder text */
  placeholder?: string;
  /** Is field required */
  required?: boolean;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Error message */
  error?: string | undefined;
  /** Select options (for type="select") */
  options?: { value: string; label: string }[];
  /** Additional class names */
  className?: string;
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  error,
  options,
  className,
}: FormFieldProps): React.ReactElement {
  const hasError = Boolean(error);
  const inputId = `field-${id}`;
  const errorId = `${inputId}-error`;

  const baseInputStyles = cn(
    'w-full rounded-lg border bg-background px-4 py-3 text-foreground transition-colors',
    'placeholder:text-foreground-muted',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    hasError
      ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
      : 'border-border hover:border-neutral-400'
  );

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className="text-foreground block text-sm font-medium"
      >
        {label}
        {required && (
          <span className="text-error-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Input */}
      {type === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={baseInputStyles}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={baseInputStyles}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseInputStyles}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
      )}

      {/* Error message */}
      {hasError && (
        <p id={errorId} className="text-error-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
