/**
 * Supabase Database Types
 * Auto-generated types for type-safe database operations
 *
 * To regenerate after schema changes:
 * npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Submission status enum
 */
export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
export type CalculatorStatus = 'new' | 'reviewed' | 'converted';
export type ChatSessionStatus = 'active' | 'closed' | 'converted';
export type NewsletterStatus = 'active' | 'unsubscribed';
export type AdminRole = 'super_admin' | 'admin' | 'viewer';
export type LeadSource = 'contact' | 'calculator' | 'chat';

/**
 * Project type enum for forms
 */
export type ProjectType =
  | 'website'
  | 'webapp'
  | 'mobile'
  | 'dashboard'
  | 'maintenance'
  | 'other';

/**
 * Valid status transitions for leads
 */
export const VALID_STATUS_TRANSITIONS: Record<ContactStatus, ContactStatus[]> = {
  new: ['contacted', 'qualified', 'closed'],
  contacted: ['qualified', 'converted', 'closed'],
  qualified: ['converted', 'closed'],
  converted: ['closed'],
  closed: [],
};

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          project_type: ProjectType;
          message: string;
          status: ContactStatus;
          lead_source: LeadSource;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          project_type: ProjectType;
          message: string;
          status?: ContactStatus;
          lead_source?: LeadSource;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          project_type?: ProjectType;
          message?: string;
          status?: ContactStatus;
          lead_source?: LeadSource;
          admin_notes?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      calculator_submissions: {
        Row: {
          id: string;
          project_type: ProjectType;
          features: Json;
          timeline: string;
          estimated_min: number;
          estimated_max: number;
          contact_email: string | null;
          contact_name: string | null;
          status: CalculatorStatus;
          lead_source: LeadSource;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          project_type: ProjectType;
          features: Json;
          timeline: string;
          estimated_min: number;
          estimated_max: number;
          contact_email?: string | null;
          contact_name?: string | null;
          status?: CalculatorStatus;
          lead_source?: LeadSource;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          project_type?: ProjectType;
          features?: Json;
          timeline?: string;
          estimated_min?: number;
          estimated_max?: number;
          contact_email?: string | null;
          contact_name?: string | null;
          status?: CalculatorStatus;
          lead_source?: LeadSource;
          admin_notes?: string | null;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          visitor_id: string;
          status: ChatSessionStatus;
          started_at: string;
          last_message_at: string;
        };
        Insert: {
          id?: string;
          visitor_id: string;
          status?: ChatSessionStatus;
          started_at?: string;
          last_message_at?: string;
        };
        Update: {
          id?: string;
          visitor_id?: string;
          status?: ChatSessionStatus;
          started_at?: string;
          last_message_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          sender: 'visitor' | 'admin';
          message: string;
          visitor_email: string | null;
          visitor_name: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          sender: 'visitor' | 'admin';
          message: string;
          visitor_email?: string | null;
          visitor_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          sender?: 'visitor' | 'admin';
          message?: string;
          visitor_email?: string | null;
          visitor_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      newsletter_subscriptions: {
        Row: {
          id: string;
          email: string;
          source: string;
          status: NewsletterStatus;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          source: string;
          status?: NewsletterStatus;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          status?: NewsletterStatus;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: AdminRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: AdminRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: AdminRole;
          created_at?: string;
        };
      };
      rate_limits: {
        Row: {
          id: string;
          identifier: string;
          endpoint: string;
          count: number;
          window_start: string;
        };
        Insert: {
          id?: string;
          identifier: string;
          endpoint: string;
          count?: number;
          window_start?: string;
        };
        Update: {
          id?: string;
          identifier?: string;
          endpoint?: string;
          count?: number;
          window_start?: string;
        };
      };
    };
    Views: {
      lead_statistics: {
        Row: {
          source: string;
          status: string;
          count: number;
          date: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      check_rate_limit: {
        Args: {
          p_identifier: string;
          p_endpoint: string;
          p_max_requests: number;
          p_window_minutes: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      contact_status: ContactStatus;
      calculator_status: CalculatorStatus;
      chat_session_status: ChatSessionStatus;
      newsletter_status: NewsletterStatus;
      admin_role: AdminRole;
      project_type: ProjectType;
      lead_source: LeadSource;
    };
  };
}

/**
 * Helper types for easier usage
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience type aliases
export type ContactSubmission = Tables<'contact_submissions'>;
export type CalculatorSubmission = Tables<'calculator_submissions'>;
export type ChatSession = Tables<'chat_sessions'>;
export type ChatMessage = Tables<'chat_messages'>;
export type NewsletterSubscription = Tables<'newsletter_subscriptions'>;
export type AdminUser = Tables<'admin_users'>;
