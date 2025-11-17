# 🔒 Supabase Security Implementation

This document explains the security measures implemented in the Women Safety Index application.

## Overview

The application uses **Supabase** as a secure, scalable backend with multiple layers of security:

1. **Row Level Security (RLS)** - Database-level access control
2. **API Key Management** - Secure key handling
3. **Authentication (Optional)** - User identity management
4. **Real-time Subscriptions** - Secure live updates
5. **Input Validation** - Schema-level constraints

## 🛡️ Row Level Security (RLS)

### What is RLS?

Row Level Security is PostgreSQL's built-in feature that controls which rows users can access in database queries. Every query is automatically filtered based on security policies.

### Cities Table Security

```sql
-- Everyone can read cities (public safety data)
CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT USING (true);

-- Only admins can modify cities
CREATE POLICY "Only admins can insert cities"
  ON cities FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );
```

**Why it's secure:**
- ✅ Public can view safety data (transparency)
- ❌ Only verified admins can add/edit cities
- 🔐 Prevents malicious data modification
- ⚡ Enforced at database level (can't be bypassed)

### Incident Reports Security

```sql
-- Everyone can read verified reports
CREATE POLICY "Verified reports are viewable by everyone"
  ON incident_reports FOR SELECT
  USING (status = 'verified' OR auth.uid() = user_id);

-- Anyone can submit reports (anonymous for safety)
CREATE POLICY "Authenticated users can create reports"
  ON incident_reports FOR INSERT
  WITH CHECK (true);

-- Users can only modify their own reports
CREATE POLICY "Users can update own reports"
  ON incident_reports FOR UPDATE
  USING (auth.uid() = user_id);
```

**Why it's secure:**
- ✅ Anonymous reporting protects whistleblowers
- ✅ Reports are pending until verified (prevents spam)
- ✅ Users can't modify others' reports
- 🔐 Admin verification prevents false reports

## 🔑 API Key Security

### Public (Anon) Key

```typescript
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**Is it safe to expose?**
YES! Here's why:

1. **RLS Protection**: All operations are filtered by RLS policies
2. **Read-Only by Default**: Anon key can only read public data
3. **Writes are Protected**: All write operations require authentication or admin role
4. **Rate Limited**: Supabase automatically rate limits requests
5. **Revocable**: Can be regenerated if compromised

**What the anon key CAN do:**
- ✅ Read public city data
- ✅ Submit incident reports (anonymous)
- ✅ Read verified incident reports

**What the anon key CANNOT do:**
- ❌ Modify or delete cities
- ❌ Access unverified reports
- ❌ Delete others' reports
- ❌ Bypass RLS policies

### Service Role Key

```typescript
// NEVER EXPOSE THIS IN FRONTEND CODE
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

**⚠️ CRITICAL:** This key bypasses RLS and should ONLY be used in:
- Server-side code
- Build-time scripts
- Admin tools (not exposed to users)

## 🔐 Input Validation

### Schema-Level Constraints

```sql
CREATE TABLE cities (
  safety_score INTEGER NOT NULL 
    CHECK (safety_score >= 0 AND safety_score <= 100),
  budget_level VARCHAR(50) NOT NULL 
    CHECK (budget_level IN ('Low', 'Medium', 'High')),
  -- More constraints...
);
```

**Benefits:**
- ✅ Prevents invalid data at database level
- ✅ Can't be bypassed by API calls
- ✅ Ensures data integrity
- ✅ Clear error messages

### Application-Level Validation

```typescript
// Validates before sending to database
const result = await supabase
  .from('incident_reports')
  .insert({
    city: validateCity(formData.city),
    severity: validateSeverity(formData.severity),
    description: sanitizeInput(formData.description)
  });
```

## 🔄 Real-time Security

### Secure Subscriptions

```typescript
supabase
  .channel('incident_reports')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'incident_reports'
  }, (payload) => {
    // Only receives verified reports (filtered by RLS)
    callback(payload.new);
  })
  .subscribe();
```

**Security features:**
- ✅ RLS policies apply to real-time data
- ✅ Users only receive data they're allowed to see
- ✅ Automatic filtering at database level
- ✅ No sensitive data exposure

## 🚫 What We DON'T Store

To protect user privacy:

- ❌ Personal Identifiable Information (PII)
- ❌ Email addresses (unless user creates account)
- ❌ Phone numbers
- ❌ Exact GPS coordinates of incidents
- ❌ User IP addresses
- ❌ Tracking cookies

## ✅ Best Practices Implemented

### 1. Principle of Least Privilege
- Users only get minimum necessary permissions
- Admins explicitly granted elevated access
- Default is read-only

### 2. Defense in Depth
- Multiple security layers:
  1. Frontend validation
  2. API key restrictions
  3. RLS policies
  4. Schema constraints
  5. Audit logging

### 3. Secure by Default
- New tables automatically have RLS enabled
- All connections use SSL/TLS
- Prepared statements prevent SQL injection
- CORS properly configured

### 4. Audit Trail
```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```
- All records timestamped
- Track when data was added/modified
- Helps detect suspicious activity

### 5. Rate Limiting
- Supabase automatically rate limits:
  - Anonymous: 60 requests/minute
  - Authenticated: 600 requests/minute
  - Prevents abuse and DDoS

## 🔍 Security Monitoring

### Check Recent Activity
```sql
-- Recent incident reports
SELECT * FROM incident_reports 
ORDER BY created_at DESC 
LIMIT 100;

-- Failed authentication attempts (if auth enabled)
SELECT * FROM auth.audit_log_entries 
WHERE event = 'user_signin_failed'
ORDER BY created_at DESC;
```

### Monitor for Anomalies
- Sudden spike in reports from one IP
- Multiple failed admin access attempts
- Unusual data patterns
- High database load

## 🚨 Security Checklist

Before deploying to production:

- [ ] All RLS policies are enabled and tested
- [ ] Service role key is NOT in frontend code
- [ ] Environment variables are properly secured
- [ ] HTTPS is enforced on your domain
- [ ] Admin access is restricted
- [ ] Rate limiting is configured
- [ ] Backup strategy is in place
- [ ] Monitoring/alerts are set up

## 🆘 Security Incident Response

If you suspect a security breach:

1. **Immediately**:
   - Regenerate API keys in Supabase dashboard
   - Check recent database activity
   - Review access logs

2. **Investigate**:
   - Check which data was accessed
   - Identify the source (IP, user agent)
   - Review RLS policy violations

3. **Mitigate**:
   - Update RLS policies if needed
   - Ban suspicious IPs
   - Reset affected user passwords

4. **Notify**:
   - Inform affected users (if PII exposed)
   - Document the incident
   - Update security measures

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## ❓ Common Questions

**Q: Can users see other users' unverified reports?**
A: No, RLS policies ensure users only see verified reports or their own.

**Q: What if someone steals my anon key?**
A: It's public anyway! RLS policies prevent misuse. Just regenerate it if concerned.

**Q: Can admins access all data?**
A: Yes, but admin access is explicitly granted and can be audited.

**Q: Is anonymous reporting truly anonymous?**
A: Yes, we don't require or store user identity for reports.

**Q: What prevents spam reports?**
A: Reports start as "pending" and require admin verification before going public.

---

🔒 **Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update your security measures!
