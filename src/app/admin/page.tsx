/**
 * Admin Dashboard Page
 * Professional dashboard with charts and real data
 */

import Link from 'next/link';

import { getAdminSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

import { DashboardCharts } from './components/dashboard-charts';
import { QuickStats } from './components/quick-stats';
import { RecentActivity } from './components/recent-activity';

interface DashboardStats {
  contacts: { total: number; new: number };
  calculator: { total: number; new: number };
  chat: { total: number; unread: number };
  newsletter: { total: number; active: number };
  statusBreakdown: { status: string; count: number }[];
  sourceBreakdown: { source: string; count: number }[];
  dailyLeads: { date: string; contacts: number; calculator: number; chat: number }[];
}

type ContactRow = { id: string; status: string; lead_source: string; created_at: string };
type CalcRow = { id: string; status: string; lead_source: string; created_at: string };
type ChatRow = { id: string; is_read: boolean; created_at: string };
type NewsRow = { id: string; status: string };

async function getDashboardData(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [contacts, calculator, chat, newsletter] = await Promise.all([
    supabase.from('contact_submissions').select('id, status, lead_source, created_at'),
    supabase.from('calculator_submissions').select('id, status, lead_source, created_at'),
    supabase.from('chat_messages').select('id, is_read, created_at').eq('sender', 'visitor'),
    supabase.from('newsletter_subscriptions').select('id, status'),
  ]);

  const contactsData = (contacts.data ?? []) as ContactRow[];
  const calculatorData = (calculator.data ?? []) as CalcRow[];
  const chatData = (chat.data ?? []) as ChatRow[];
  const newsletterData = (newsletter.data ?? []) as NewsRow[];

  const statusCounts: Record<string, number> = {};
  contactsData.forEach((c) => {
    statusCounts[c.status] = (statusCounts[c.status] ?? 0) + 1;
  });
  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  const sourceBreakdown = [
    { source: 'contact', count: contactsData.length },
    { source: 'calculator', count: calculatorData.length },
    { source: 'chat', count: chatData.length },
  ];

  const dailyLeads = getLast7DaysData(contactsData, calculatorData, chatData);

  return {
    contacts: {
      total: contactsData.length,
      new: contactsData.filter((c) => c.status === 'new').length,
    },
    calculator: {
      total: calculatorData.length,
      new: calculatorData.filter((c) => c.status === 'new').length,
    },
    chat: { total: chatData.length, unread: chatData.filter((c) => !c.is_read).length },
    newsletter: {
      total: newsletterData.length,
      active: newsletterData.filter((n) => n.status === 'active').length,
    },
    statusBreakdown,
    sourceBreakdown,
    dailyLeads,
  };
}


function getLast7DaysData(
  contacts: { created_at: string }[],
  calculator: { created_at: string }[],
  chat: { created_at: string }[]
) {
  const days: { date: string; contacts: number; calculator: number; chat: number }[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0] ?? '';
    const displayDate = date.toLocaleDateString('en-US', { weekday: 'short' });

    days.push({
      date: displayDate,
      contacts: contacts.filter((c) => c.created_at.startsWith(dateStr)).length,
      calculator: calculator.filter((c) => c.created_at.startsWith(dateStr)).length,
      chat: chat.filter((c) => c.created_at.startsWith(dateStr)).length,
    });
  }

  return days;
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

function BellIcon() {
  return (
    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const [stats, recentLeads, session] = await Promise.all([
    getDashboardData(),
    getRecentLeads(),
    getAdminSession(),
  ]);

  const totalLeads = stats.contacts.total + stats.calculator.total;
  const newLeads = stats.contacts.new + stats.calculator.new;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">
            Welcome back{session?.email ? `, ${session.email.split('@')[0]}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Live data
        </div>
      </div>

      <QuickStats
        totalLeads={totalLeads}
        newLeads={newLeads}
        contacts={stats.contacts}
        calculator={stats.calculator}
        chat={stats.chat}
        newsletter={stats.newsletter}
      />

      {newLeads > 0 && (
        <div className="rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <BellIcon />
              </div>
              <div>
                <p className="font-semibold text-blue-900">
                  {newLeads} new lead{newLeads !== 1 ? 's' : ''} waiting
                </p>
                <p className="text-sm text-blue-700">Review and respond to new inquiries</p>
              </div>
            </div>
            <Link
              href="/admin/leads?status=new"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2',
                'bg-blue-600 text-sm font-medium text-white',
                'transition-all hover:bg-blue-700 hover:shadow-lg'
              )}
            >
              View New Leads
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      )}

      <DashboardCharts
        dailyLeads={stats.dailyLeads}
        statusBreakdown={stats.statusBreakdown}
        sourceBreakdown={stats.sourceBreakdown}
        totalLeads={totalLeads}
      />

      <RecentActivity leads={recentLeads} />
    </div>
  );
}
