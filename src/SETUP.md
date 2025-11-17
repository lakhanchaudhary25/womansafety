# Women Safety Index - Setup Guide

## 🚀 Quick Start

This application can run in two modes:
1. **Local Mode**: Uses mock data from `cities-expanded.ts` (no setup required)
2. **Live Mode**: Connects to Supabase for real-time data (requires Supabase setup)

## 📦 Installation

```bash
npm install
npm run dev
```

The app will work immediately with local data. To enable live database features, follow the Supabase setup below.

## 🔐 Supabase Backend Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in your project details:
   - Project Name: `women-safety-index`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

### Step 2: Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the entire contents of `/supabase/schema.sql`
3. Paste into the SQL Editor and click **Run**
4. This will create:
   - `cities` table with Row Level Security (RLS)
   - `incident_reports` table with RLS
   - Security policies
   - Indexes for performance
   - Triggers for timestamps
   - Useful views for analytics

### Step 3: Import City Data

You have two options to populate the database:

#### Option A: Manual Import (Recommended)
1. Go to **Table Editor** > **cities** table
2. Click **Insert** > **Insert row**
3. Copy city data from `/data/cities-expanded.ts`
4. Repeat for all cities (or write a script)

#### Option B: Use Supabase API
```javascript
// Run this script once to seed data
import { supabase } from './lib/supabase';
import { cities } from './data/cities-expanded';

async function seedCities() {
  const { error } = await supabase
    .from('cities')
    .insert(cities);
  
  if (error) console.error('Error:', error);
  else console.log('Cities imported successfully!');
}

seedCities();
```

### Step 4: Configure Environment Variables

1. In your Supabase project, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Restart your development server

### Step 5: Verify Connection

1. Open your app in the browser
2. Look for the green dot indicator at the top: "Connected to live database"
3. Try creating an incident report
4. Check the Supabase **Table Editor** to see if data was saved

## 🔒 Security Features

### Row Level Security (RLS)

The database is secured with RLS policies:

#### Cities Table
- ✅ **Everyone** can read city data (public information)
- ❌ **Only admins** can create/update/delete cities
- 🔐 Prevents unauthorized modifications

#### Incident Reports Table
- ✅ **Everyone** can submit reports (anonymous for safety)
- ✅ **Users** can view their own reports
- ✅ **Users** can delete their own reports
- ❌ Only **verified** reports are publicly visible
- 🔐 **Admins** can verify/reject reports

### API Key Security

- Uses **anon (public) key** - safe to expose in frontend
- All sensitive operations protected by RLS
- User authentication via Supabase Auth (optional)
- Rate limiting enabled by default

### Best Practices Implemented

1. **Prepared Statements**: All queries use parameterized inputs
2. **Input Validation**: Schema-level constraints
3. **Audit Trails**: Created/updated timestamps on all records
4. **No Direct Database Access**: All operations through Supabase API
5. **CORS Protection**: Supabase handles CORS automatically
6. **SSL/TLS**: All connections encrypted

## 🔧 Optional: Enable User Authentication

To enable user accounts (optional feature):

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## 📊 Database Monitoring

### View Real-Time Activity
1. Go to **Database** > **Replication** in Supabase
2. Enable real-time for `incident_reports` table
3. The app will automatically receive updates

### Check Performance
1. Go to **Database** > **Query Performance**
2. Monitor slow queries
3. Add indexes if needed

### View Analytics
```sql
-- Get safety statistics by state
SELECT * FROM city_safety_analytics;

-- Get incident statistics
SELECT * FROM incident_statistics;
```

## 🚨 Troubleshooting

### "Failed to load cities from database"
- ✅ Check your `.env` file has correct Supabase credentials
- ✅ Verify database schema is set up correctly
- ✅ Check browser console for detailed errors
- ℹ️ App will fallback to local data automatically

### "Failed to submit incident report"
- ✅ Check Supabase project is active
- ✅ Verify RLS policies are set up
- ✅ Check network connection
- ℹ️ Report is still saved locally in the browser

### Connection Issues
```bash
# Test Supabase connection
curl https://YOUR_PROJECT_URL.supabase.co/rest/v1/

# Should return: {"message":"The server is running"}
```

## 📈 Scaling Considerations

### Free Tier Limits (Supabase)
- 500 MB Database
- 2 GB Bandwidth
- 50,000 Monthly Active Users
- Perfect for MVP and testing

### Upgrade Path
1. **Pro Plan ($25/mo)**: More storage, bandwidth
2. **Add indexes**: For faster queries as data grows
3. **Enable caching**: Use Supabase edge functions
4. **CDN**: For static assets

## 🧪 Testing with Mock Data

To test without Supabase:
1. Don't create a `.env` file
2. App will use local data from `cities-expanded.ts`
3. Incident reports stored in browser memory
4. Perfect for development and demos

## 📝 Admin Setup (Optional)

To create an admin user:

```sql
-- In Supabase SQL Editor
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

Admins can:
- Create/update/delete cities
- Verify/reject incident reports
- Access analytics

## 🆘 Support

For issues:
1. Check browser console for errors
2. Check Supabase logs: **Logs** > **API Logs**
3. Review RLS policies: **Authentication** > **Policies**
4. Test queries in SQL Editor

## 🎉 You're All Set!

Your Women Safety Index app is now:
- ✅ Secure with RLS policies
- ✅ Scalable with Supabase backend
- ✅ Real-time with subscriptions
- ✅ Reliable with automatic fallback to local data

Happy coding! 🚀
