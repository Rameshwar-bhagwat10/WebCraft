'use client';

/**
 * Quick Stats Component
 * Animated stat cards for dashboard
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface QuickStatsProps {
  totalLeads: number;
  newLeads: number;
  contacts: { total: number; new: number };
  calculator: { total: number; new: number };
  chat: { total: number; unread: number };
  newsletter: { total: number; active: number };
  projects?: { total: number; published: number; featured: number; drafts: number };
}

export function QuickStats({
  totalLeads,
  newLeads,
  contacts,
  calculator,
  chat: _chat,
  newsletter,
  projects,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Leads"
        value={totalLeads}
        highlight={newLeads}
        highlightLabel="new"
        href="/admin/leads"
        icon={<UsersIcon />}
        gradient="from-violet-500 to-purple-600"
        delay={0}
      />
      <StatCard
        title="Contact Forms"
        value={contacts.total}
        highlight={contacts.new}
        highlightLabel="new"
        href="/admin/contacts"
        icon={<MailIcon />}
        gradient="from-blue-500 to-cyan-500"
        delay={100}
      />
      <StatCard
        title="Quote Requests"
        value={calculator.total}
        highlight={calculator.new}
        highlightLabel="new"
        href="/admin/calculator"
        icon={<CalculatorIcon />}
        gradient="from-emerald-500 to-teal-500"
        delay={200}
      />
      <StatCard
        title="Projects"
        value={projects?.total ?? 0}
        highlight={projects?.published ?? 0}
        highlightLabel="published"
        href="/admin/projects"
        icon={<FolderIcon />}
        gradient="from-pink-500 to-rose-500"
        delay={300}
      />
      <StatCard
        title="Newsletter"
        value={newsletter.total}
        highlight={newsletter.active}
        highlightLabel="active"
        href="/admin/newsletter"
        icon={<NewsIcon />}
        gradient="from-amber-500 to-orange-500"
        delay={400}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  highlight: number;
  highlightLabel: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

function StatCard({
  title,
  value,
  highlight,
  highlightLabel,
  href,
  icon,
  gradient,
  delay,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <Link
      href={href}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6',
        'bg-white border border-neutral-200',
        'transition-all duration-300',
        'hover:shadow-xl hover:shadow-neutral-200/50 hover:-translate-y-1',
        'opacity-0 translate-y-4',
        isVisible && 'opacity-100 translate-y-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-300',
          'group-hover:opacity-5',
          `bg-linear-to-br ${gradient}`
        )}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-4xl font-bold text-neutral-900">
            {displayValue}
          </p>
          {highlight > 0 && (
            <p className={cn(
              'mt-1 inline-flex items-center gap-1 text-sm font-medium',
              'text-emerald-600'
            )}>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {highlight} {highlightLabel}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            'transition-transform duration-300 group-hover:scale-110',
            `bg-linear-to-br ${gradient}`
          )}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </Link>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}
