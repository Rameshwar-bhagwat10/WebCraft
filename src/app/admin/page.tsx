/**
 * Admin Dashboard Page
 * Overview of all submissions and stats
 * Server Component - handles data fetching
 */

import Link from 'next/link';

import { getAdminSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import type {
  CalculatorSubmission,
  ChatMessage,
  ContactSubmission,
  NewsletterSubscription,
} from '@/types/database';

async function getStats() {
  const supabase = await createServerSupabaseClient();

  const [contacts, calculator, chat, newsletter] = await Promise.all([
    supabase
      .from('contact_submissions')
      .select('id, status', { count: 'exact' }),
    supabase
      .from('calculator_submissions')
      .select('id, status', { count: 'exact' }),
    supabase
      .from('chat_messages')
      .select('id, is_read', { count: 'exact' })
      .eq('sender', 'visitor'),
    supabase
      .from('newsletter_subscriptions')
      .select('id, status', { count: 'exact' }),
  ]);

  const contactsData = contacts.data as Pick<ContactSubmission, 'id' | 'status'>[] | null;
  const calculatorData = calculator.data as Pick<CalculatorSubmission, 'id' | 'status'>[] | null;
  const chatData = chat.data as Pick<ChatMessage, 'id' | 'is_read'>[] | null;
  const newsletterData = newsletter.data as Pick<NewsletterSubscription, 'id' | 'status'>[] | null;

  const contactsNew = contactsData?.filter((c) => c.status === 'new').length ?? 0;
  const calculatorNew = calculatorData?.filter((c) => c.status === 'new').length ?? 0;
  const chatUnread = chatData?.filter((c) => !c.is_read).length ?? 0;
  const newsletterActive = newsletterData?.filter((n) => n.status === 'active').length ?? 0;

  return {
    contacts: { total: contacts.count ?? 0, new: contactsNew },
    calculator: { total: calculator.count ?? 0, new: calculatorNew },
    chat: { total: chat.count ?? 0, unread: chatUnread },
    newsletter: { total: newsletter.count ?? 0, active: newsletterActive },
  };
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  project_type: string;
  status: string;
  lead_source: string;
  created_at: string;
}

async function getRecentLeads(): Promise<RecentLead[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('contact_submissions')
    .select('id, name, email, project_type, status, lead_source, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data as RecentLead[] | null) ?? [];
}

export default async function AdminDashboardPage() {
  const [stats, recentLeads, session] = await Promise.all([
    getStats(),
    getRecentLeads(),
    getAdminSession(),
  ]);

  const totalLeads = stats.contacts.total + stats.calculator.total;
  const newLeads = stats.contacts.new + stats.calculator.new;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">
          Welcome back{session?.email ? `, ${session.email.split('@')[0]}` : ''}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          total={totalLeads}
          highlight={newLeads}
          highlightLabel="new"
          href="/admin/leads"
          color="primary"
        />
        <StatCard
          title="Contact Forms"
          total={stats.contacts.total}
          highlight={stats.contacts.new}
          highlightLabel="new"
          href="/admin/contacts"
          color="blue"
        />
        <StatCard
          title="Quote Requests"
          total={stats.calculator.total}
          highlight={stats.calculator.new}
          highlightLabel="new"
          href="/admin/calculator"
          color="green"
        />
        <StatCard
          title="Newsletter"
          total={stats.newsletter.total}
          highlight={stats.newsletter.active}
          highlightLabel="active"
          href="/admin/newsletter"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      {newLeads > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900">
                  You have {newLeads} new lead{newLeads !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-blue-700">Review and respond to new inquiries</p>
              </div>
            </div>
            <Link
              href="/admin/leads?status=new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View New Leads
            </Link>
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">Recent Leads</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {recentLeads.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-neutral-500">No leads yet</p>
              <p className="text-sm text-neutral-400">Leads will appear here when visitors submit forms</p>
            </div>
          ) : (
            recentLeads.map((lead: RecentLead) => (
              <Link
                key={lead.id}
                href={`/admin/leads?search=${encodeURIComponent(lead.email)}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {lead.status === 'new' && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  <div>
                    <p className="font-medium text-neutral-900">{lead.name}</p>
                    <p className="text-sm text-neutral-500">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <SourceBadge source={lead.lead_source ?? 'contact'} />
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatRelativeDate(lead.created_at)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  total,
  highlight,
  highlightLabel,
  href,
  color = 'primary',
}: {
  title: string;
  total: number;
  highlight: number;
  highlightLabel: string;
  href: string;
  color?: 'primary' | 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    primary: 'text-primary-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:shadow-md hover:border-neutral-300"
    >
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900">{total}</p>
      {highlight > 0 && (
        <p className={cn('mt-1 text-sm font-medium', colorClasses[color])}>
          {highlight} {highlightLabel}
        </p>
      )}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    converted: 'bg-purple-100 text-purple-700',
    closed: 'bg-neutral-100 text-neutral-700',
  };

  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', colors[status] ?? colors.new)}>
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
      {source}
    </span>
  );
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
