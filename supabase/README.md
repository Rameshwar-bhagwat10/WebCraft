# WebCraft Supabase Setup Guide

## Phase 12: Backend Integration

This guide walks you through setting up Supabase for WebCraft.

---

## 1. Create Supabase Projects

Create **3 separate projects** at [supabase.com](https://supabase.com):

| Environment | Project Name | Tier |
|-------------|--------------|------|
| Development | webcraft-dev | Free |
| Staging | webcraft-staging | Free |
| Production | webcraft-prod | Pro (recommended) |

---

## 2. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL

This creates:
- All required tables
- Indexes for performance
- RLS policies for security
- Helper functions

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
# Get these from: Supabase Dashboard > Settings > API

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **NEVER commit `.env.local` to version control!**

---

## 4. Create Admin User

### Step 1: Create Auth User

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add User**
3. Enter admin email and password
4. Click **Create User**
5. Copy the user's **UUID**

### Step 2: Add to Admin Table

Run this SQL in the SQL Editor:

```sql
INSERT INTO admin_users (id, email, role)
VALUES (
  'paste-user-uuid-here',
  'your-admin-email@example.com',
  'super_admin'
);
```

### Step 3: Enable MFA (Recommended)

1. Go to **Authentication > Providers**
2. Enable **TOTP** under MFA
3. Admin can set up MFA on first login

---

## 5. Configure Auth Settings

In Supabase Dashboard > Authentication > Settings:

| Setting | Value |
|---------|-------|
| Enable email confirmations | Optional (disable for dev) |
| Enable email signup | **DISABLED** (admin-only) |
| Minimum password length | 12 |
| Site URL | `http://localhost:3000` (dev) or your production URL |
| Redirect URLs | `http://localhost:3000/admin` |

---

## 6. Test the Setup

### Test Public Endpoints

```bash
# Start dev server
npm run dev

# Test contact form submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "project_type": "website",
    "message": "This is a test message for the contact form."
  }'
```

### Test Admin Login

1. Go to `http://localhost:3000/admin/login`
2. Enter admin credentials
3. Verify dashboard loads with stats

---

## 7. Production Deployment

### Vercel Environment Variables

Add these in Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Production Checklist

- [ ] Use Pro tier Supabase project
- [ ] Enable Point-in-Time Recovery
- [ ] Set up database backups
- [ ] Configure custom domain (optional)
- [ ] Enable MFA for all admin users
- [ ] Test rate limiting under load
- [ ] Verify RLS policies are working

---

## Database Schema Overview

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `contact_submissions` | Contact form leads | Public INSERT, Admin READ/UPDATE |
| `calculator_submissions` | Quote requests | Public INSERT, Admin READ/UPDATE |
| `chat_sessions` | Chat conversations | Public INSERT, Admin READ/UPDATE |
| `chat_messages` | Individual messages | Public INSERT (visitor), Admin ALL |
| `newsletter_subscriptions` | Email subscribers | Public INSERT, Admin READ/UPDATE |
| `admin_users` | Admin access control | Admin READ only |
| `rate_limits` | Rate limiting data | Service role only |

### Key Functions

| Function | Purpose |
|----------|---------|
| `is_admin()` | Check if current user is admin |
| `check_rate_limit()` | Sliding window rate limiting |
| `update_updated_at_column()` | Auto-update timestamps |

---

## Troubleshooting

### "Permission denied" errors

- Verify RLS policies are created
- Check that admin user exists in `admin_users` table
- Ensure you're using the correct Supabase keys

### Rate limiting not working

- Check `rate_limits` table has data
- Verify `check_rate_limit` function exists
- Check service role key is set correctly

### Admin can't log in

- Verify user exists in Auth > Users
- Check user is in `admin_users` table
- Ensure email/password are correct

---

## Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** to the client
2. **RLS is mandatory** - all tables have it enabled
3. **Rate limiting** protects against abuse
4. **Honeypot fields** catch spam bots
5. **Input validation** happens server-side

---

## Next Steps (Post Phase 12)

- [ ] Phase 13: Dynamic Portfolio (Supabase Storage)
- [ ] Phase 14: Real-time Chat (Supabase Realtime)
- [ ] Phase 15: Client Portal (Extended Auth)
- [ ] Email notifications (Resend integration)
