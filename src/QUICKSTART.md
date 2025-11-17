# 🚀 Quick Start Guide

Get the Women Safety Index app running in **under 5 minutes!**

## Option 1: Run with Local Data (Fastest)

No setup required! The app works out of the box with 55 cities of mock data.

```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

That's it! Open http://localhost:5173 and start exploring.

**What you can do:**
- ✅ Browse 55 cities
- ✅ Search and filter
- ✅ Compare cities
- ✅ View map
- ✅ Submit incident reports (saved in browser)
- ✅ Toggle dark mode

## Option 2: Connect Live Database (5 minutes)

Get real-time features with Supabase backend.

### Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create new project
3. Wait for project to initialize

### Step 2: Setup Database (1 min)

1. In Supabase, go to **SQL Editor**
2. Copy everything from `/supabase/schema.sql`
3. Paste and click **Run**

### Step 3: Get Credentials (30 sec)

1. Go to **Settings** → **API**
2. Copy these two values:
   - Project URL
   - anon public key

### Step 4: Configure App (30 sec)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=paste_your_url_here
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

### Step 5: Seed Data (1 min)

```bash
npm install -D tsx
tsx scripts/seed-database.ts
```

### Step 6: Start App (10 sec)

```bash
npm run dev
```

Look for the **green dot** 🟢 indicator: "Connected to live database"

**New features unlocked:**
- ✅ Real-time incident reports
- ✅ Live data updates
- ✅ Report verification
- ✅ Analytics

## 🎯 What to Try First

### 1. Explore the Dashboard
- See all 55 cities with safety scores
- Try the search bar
- Use filters (click Filters button)

### 2. Compare Cities
- Click any city card (shows checkmark)
- Click a second city
- Click "Compare Now" button
- View detailed side-by-side analysis

### 3. Check the Map
- Go to "Map View" in navigation
- See color-coded safety markers
- Hover over cities for quick info
- Click for detailed information

### 4. Report an Incident
- Go to "Report" page
- Fill out the form
- Submit anonymously
- See it appear in recent reports

### 5. Toggle Dark Mode
- Click moon/sun icon (top right)
- Watch smooth theme transition
- Preference is saved

## 📱 Mobile Testing

Works perfectly on mobile! Try:

```bash
# Get your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone
http://your-ip:5173
```

## 🔍 Verify Everything Works

### Dashboard Checklist
- [ ] Shows 55 cities
- [ ] Search filters cities
- [ ] Filters work
- [ ] Can select 2 cities
- [ ] Charts display

### Comparison Checklist
- [ ] Shows both cities
- [ ] Bar chart displays
- [ ] Radar chart works
- [ ] Pros/cons lists show

### Map Checklist
- [ ] Cities show as markers
- [ ] Colors match safety levels
- [ ] Click shows details

### Reports Checklist
- [ ] Form validates
- [ ] Can submit
- [ ] Shows in recent list
- [ ] (With Supabase) Saves to DB

## 🆘 Troubleshooting

### Nothing shows on dashboard
**Fix**: Check browser console for errors. Clear browser cache.

### Supabase connection fails
**Fix**: 
1. Check `.env` has correct values
2. No quotes around values
3. Restart dev server
4. App works with local data anyway

### Comparison page empty
**Fix**: Make sure you selected 2 cities on dashboard first

### Charts not rendering
**Fix**: 
```bash
npm install recharts
npm run dev
```

### Port already in use
**Fix**:
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

## 📚 Next Steps

### Learn More
- 📖 Read [FEATURES.md](./FEATURES.md) for all features
- 🔐 Read [SUPABASE_SECURITY.md](./SUPABASE_SECURITY.md) for security
- ⚙️ Read [SETUP.md](./SETUP.md) for detailed setup

### Customize
1. Edit city data in `/data/cities-expanded.ts`
2. Modify colors in `/styles/globals.css`
3. Add components in `/components`

### Deploy
Popular options:
- **Vercel**: Connect GitHub repo (free)
- **Netlify**: Drag & drop build folder
- **Cloudflare Pages**: Connect Git

Don't forget to add environment variables in deployment settings!

## 💡 Pro Tips

1. **Development**: Use local data mode - it's faster
2. **Testing**: Use Supabase mode to test live features
3. **Production**: Always use Supabase for real users
4. **Security**: Never commit `.env` file (it's in `.gitignore`)
5. **Performance**: Enable caching in production
6. **Monitoring**: Check Supabase logs regularly

## 🎉 You're Ready!

Your Women Safety Index app is now running with:
- 55 cities across India
- Real-time safety data
- Interactive comparisons
- Beautiful dark/light themes
- Secure anonymous reporting

Start exploring and building! 🚀

---

**Need help?** Check the other documentation files or open an issue on GitHub.
