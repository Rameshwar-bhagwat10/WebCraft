/**
 * CalculatorField Component
 * Reusable select field for calculator inputs
 *
 * Server Component compatible - no client JS needed
 */

import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CalculatorFieldProps {
  id: string;
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  description?: string;
}

export function CalculatorField({
  id,
  label,
  value,
  options,
  onChange,
  description,
}: CalculatorFieldProps): React.ReactElement {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={descriptionId}
        className={cn(
          'w-full rounded-lg border px-3 py-2.5',
          'border-border bg-background text-foreground',
          'text-sm',
          'transition-colors duration-200',
          'hover:border-primary-300',
          'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none',
          'cursor-pointer appearance-none',
          // Custom dropdown arrow
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")]",
          'bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat',
          'pr-10'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p id={descriptionId} className="text-foreground-muted text-xs">
          {description}
        </p>
      )}
    </div>
  );
}
