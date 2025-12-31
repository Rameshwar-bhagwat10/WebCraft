'use client';

/**
 * Conversion Funnel
 * Visual funnel showing lead progression
 */

import { cn } from '@/lib/utils';

interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

interface ConversionFunnelProps {
  data: FunnelStep[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((step, index) => {
        const widthPercent = (step.value / maxValue) * 100;
        const prevItem = index > 0 ? data[index - 1] : null;
        const prevValue = prevItem?.value ?? null;
        const conversionRate = prevValue && prevValue > 0
          ? Math.round((step.value / prevValue) * 100)
          : null;

        return (
          <div key={step.label} className="group relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700">
                {step.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900">
                  {step.value}
                </span>
                {conversionRate !== null && (
                  <span className="text-xs text-neutral-400">
                    ({conversionRate}%)
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-8 w-full overflow-hidden rounded-lg bg-neutral-100">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out',
                  'group-hover:brightness-110'
                )}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: step.color,
                  animationDelay: `${index * 150}ms`,
                }}
              />
            </div>
            {index < data.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <svg
                  className="h-4 w-4 text-neutral-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
