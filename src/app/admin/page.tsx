/**
 * Admin Dashboard Page
 * Overview of all submissions and stats
 */

import Link from 'next/link';

import { createServerSupabaseClient } from '@/lib/supabase/server';
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

interface RecentContact {
  id: string;
  name: string;
  email: string;
  project_type: string;
  status: string;
  created_at: string;
}

async function getRecentContacts(): Promise<RecentContact[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('contact_submissions')
    .select('id, name, email, project_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data as RecentContact[] | null) ?? [];
}

export default async function AdminDashboardPage() {
  const [stats, recentContacts] = await Promise.all([
    getStats(),
    getRecentContacts(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Overview of your leads and submissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Contact Leads"
          total={stats.contacts.total}
          highlight={stats.contacts.new}
          highlightLabel="new"
          href="/admin/contacts"
        />
        <StatCard
          title="Quote Requests"
          total={stats.calculator.total}
          highlight={stats.calculator.new}
          highlightLabel="new"
          href="/admin/calculator"
        />
        <StatCard
          title="Chat Messages"
          total={stats.chat.total}
          highlight={stats.chat.unread}
          highlightLabel="unread"
          href="/admin/chat"
        />
        <StatCard
          title="Newsletter"
          total={stats.newsletter.total}
          highlight={stats.newsletter.active}
          highlightLabel="active"
          href="/admin/newsletter"
        />
      </div>

      {/* Recent Contacts */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">Recent Contact Leads</h2>
          <Link
            href="/admin/contacts"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {recentContacts.length === 0 ? (
            <p className="px-6 py-8 text-center text-neutral-500">
              No contact submissions yet
            </p>
          ) : (
            recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-neutral-900">{contact.name}</p>
                  <p className="text-sm text-neutral-500">{contact.email}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={contact.status} />
                  <p className="mt-1 text-xs text-neutral-400">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
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
}: {
  title: string;
  total: number;
  highlight: number;
  highlightLabel: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-medium text-neutral-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-neutral-900">{total}</p>
      {highlight > 0 && (
        <p className="mt-1 text-sm text-primary-600">
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
    closed: 'bg-neutral-100 text-neutral-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? colors.new}`}
    >
      {status}
    </span>
  );
}
