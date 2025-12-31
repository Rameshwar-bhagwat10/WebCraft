'use client';

/**
 * Dashboard Charts Component
 * Container for all dashboard visualizations
 */

import { useState } from 'react';

import { cn } from '@/lib/utils';

import {
  ConversionFunnel,
  LeadsAreaChart,
  LeadsBarChart,
  LeadsPieChart,
} from './charts';

interface DashboardChartsProps {
  dailyLeads: { date: string; contacts: number; calculator: number; chat: number }[];
  statusBreakdown: { status: string; count: number }[];
  sourceBreakdown: { source: string; count: number }[];
  totalLeads: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#10b981',
  converted: '#8b5cf6',
  closed: '#6b7280',
};

const SOURCE_COLORS: Record<string, string> = {
  contact: '#3b82f6',
  calculator: '#10b981',
  chat: '#8b5cf6',
};

const SOURCE_LABELS: Record<string, string> = {
  contact: 'Contact Forms',
  calculator: 'Quote Requests',
  chat: 'Chat Messages',
};

export function DashboardCharts({
  dailyLeads,
  statusBreakdown,
  sourceBreakdown,
  totalLeads,
}: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'funnel'>('overview');

  const pieData = statusBreakdown.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: STATUS_COLORS[item.status] ?? '#6b7280',
  }));

  const barData = sourceBreakdown.map((item) => ({
    name: SOURCE_LABELS[item.source] ?? item.source,
    value: item.count,
    color: SOURCE_COLORS[item.source] ?? '#6b7280',
  }));

  const funnelData = [
    { label: 'Total Leads', value: totalLeads, color: '#3b82f6' },
    {
      label: 'Contacted',
      value: statusBreakdown.find((s) => s.status === 'contacted')?.count ?? 0,
      color: '#f59e0b',
    },
    {
      label: 'Qualified',
      value: statusBreakdown.find((s) => s.status === 'qualified')?.count ?? 0,
      color: '#10b981',
    },
    {
      label: 'Converted',
      value: statusBreakdown.find((s) => s.status === 'converted')?.count ?? 0,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'sources', label: 'Lead Sources' },
          { id: 'funnel', label: 'Conversion Funnel' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {activeTab === 'overview' && (
          <>
            {/* Area Chart - Leads Over Time */}
            <ChartCard
              title="Leads Over Time"
              subtitle="Last 7 days"
              className="lg:col-span-2"
            >
              <LeadsAreaChart data={dailyLeads} />
              <div className="mt-4 flex flex-wrap gap-4">
                <Legend color="#3b82f6" label="Contact Forms" />
                <Legend color="#10b981" label="Quote Requests" />
                <Legend color="#8b5cf6" label="Chat Messages" />
              </div>
            </ChartCard>

            {/* Pie Chart - Status Distribution */}
            <ChartCard title="Lead Status" subtitle="Distribution by status">
              {pieData.length > 0 ? (
                <LeadsPieChart data={pieData} />
              ) : (
                <EmptyState message="No leads yet" />
              )}
            </ChartCard>

            {/* Bar Chart - Source Comparison */}
            <ChartCard title="Lead Sources" subtitle="Comparison by source">
              {barData.some((d) => d.value > 0) ? (
                <LeadsBarChart data={barData} />
              ) : (
                <EmptyState message="No leads yet" />
              )}
            </ChartCard>
          </>
        )}

        {activeTab === 'sources' && (
          <>
            <ChartCard
              title="Lead Sources Breakdown"
              subtitle="Where your leads come from"
              className="lg:col-span-2"
            >
              <div className="grid gap-6 md:grid-cols-3">
                {barData.map((source) => (
                  <SourceCard
                    key={source.name}
                    name={source.name}
                    value={source.value}
                    total={totalLeads}
                    color={source.color}
                  />
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Source Distribution" className="lg:col-span-2">
              <LeadsBarChart data={barData} />
            </ChartCard>
          </>
        )}

        {activeTab === 'funnel' && (
          <>
            <ChartCard
              title="Conversion Funnel"
              subtitle="Lead progression through stages"
              className="lg:col-span-2"
            >
              <ConversionFunnel data={funnelData} />
            </ChartCard>

            <ChartCard title="Stage Breakdown">
              <div className="space-y-4">
                {funnelData.map((stage, index) => {
                  const prevItem = index > 0 ? funnelData[index - 1] : null;
                  const prevValue = prevItem?.value ?? null;
                  const dropoff = prevValue && prevValue > 0
                    ? Math.round(((prevValue - stage.value) / prevValue) * 100)
                    : null;

                  return (
                    <div key={stage.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-sm text-neutral-700">{stage.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{stage.value}</span>
                        {dropoff !== null && dropoff > 0 && (
                          <span className="text-xs text-red-500">-{dropoff}%</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="Conversion Metrics">
              <div className="grid grid-cols-2 gap-4">
                <MetricBox
                  label="Overall Conversion"
                  value={totalLeads > 0
                    ? `${Math.round(((funnelData[3]?.value ?? 0) / totalLeads) * 100)}%`
                    : '0%'
                  }
                  color="text-emerald-600"
                />
                <MetricBox
                  label="Qualification Rate"
                  value={totalLeads > 0
                    ? `${Math.round(((funnelData[2]?.value ?? 0) / totalLeads) * 100)}%`
                    : '0%'
                  }
                  color="text-blue-600"
                />
              </div>
            </ChartCard>
          </>
        )}
      </div>
    </div>
  );
}


function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white p-6',
        'transition-shadow hover:shadow-lg',
        className
      )}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-neutral-600">{label}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <p className="text-neutral-400">{message}</p>
    </div>
  );
}

function SourceCard({
  name,
  value,
  total,
  color,
}: {
  name: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-neutral-700">{name}</span>
      </div>
      <p className="text-3xl font-bold text-neutral-900">{value}</p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">{percentage}% of total</p>
    </div>
  );
}

function MetricBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4 text-center">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', color)}>{value}</p>
    </div>
  );
}
