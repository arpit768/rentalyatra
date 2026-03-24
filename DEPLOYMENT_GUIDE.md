# Community Tours and Travels — Vercel Deployment Guide

This project has two parts:
- **Frontend** — React 19 + Vite (root directory) → deploy to **Vercel**
- **Backend** — Express.js (`/server`) → deploy to **Railway** (Vercel doesn't support persistent Express servers)

---

## Part 1 — Deploy Frontend to Vercel

### Step 1 — Push your code to GitHub

Vercel deploys from a Git repository.

```bash
cd "/home/arpitswar/Downloads/projects/Rental "
git init          # skip if already a git repo
git add .
git commit -m "Initial commit"
```

Create a new repo on [github.com](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/community-tours-and-travels.git
git push -u origin master
```

---

### Step 2 — Add vercel.json to the project root

Create this file so Vercel handles React Router / SPA navigation correctly:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Save it as `vercel.json` in the root (same folder as `package.json`).

---

### Step 3 — Deploy on Vercel (Dashboard method — easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `community-tours-and-travels` repository
4. Vercel will auto-detect **Vite** — confirm these settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (leave blank / default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**

Your frontend will be live at `https://community-tours-and-travels.vercel.app` in ~1 minute.

---

### Step 4 — Add Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value | Notes |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.railway.app/api` | Set after deploying backend (Part 2) |
| `GEMINI_API_KEY` | `your_gemini_key` | Optional — only needed for AI chat |

> ⚠️ All frontend env variables **must** start with `VITE_` to be exposed to the browser.

After adding variables, go to **Deployments → Redeploy** to apply them.

---

### Step 5 — Deploy via CLI (alternative to dashboard)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
cd "/home/arpitswar/Downloads/projects/Rental "
vercel

# Promote to production
vercel --prod
```

---

## Part 2 — Deploy Backend to Railway

The Express backend (`/server`) uses an in-memory database. For production you should switch to a real database, but the steps below will get it running.

### Step 1 — Go to [railway.app](https://railway.app) and sign in with GitHub

### Step 2 — Create a new project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `community-tours-and-travels` repository
4. Railway will detect Node.js automatically

### Step 3 — Set the root directory to `/server`

In Railway project → **Settings → Source**:
- Set **Root Directory** to `server`

### Step 4 — Add environment variables in Railway

In **Variables** tab, add:

| Variable | Value |
|---|---|
| `PORT` | `3001` |
| `JWT_SECRET` | `any-long-random-string-change-this` |
| `NODE_ENV` | `production` |

### Step 5 — Copy your Railway backend URL

Once deployed, Railway gives you a URL like:
```
https://community-tours-and-travels-production.up.railway.app
```

Go back to **Vercel → Settings → Environment Variables** and update:
```
VITE_API_URL = https://community-tours-and-travels-production.up.railway.app/api
```

Then redeploy on Vercel.

---

## Part 3 — Fix CORS for Production

The backend must allow requests from your Vercel domain. Update `server/server.js`:

```js
// Replace this:
app.use(cors());

// With this:
app.use(cors({
  origin: [
    'https://community-tours-and-travels.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Commit and push — Railway will redeploy automatically.

---

## Quick Reference — Final URLs

| Service | URL |
|---|---|
| Frontend (Vercel) | `https://community-tours-and-travels.vercel.app` |
| Backend (Railway) | `https://community-tours-and-travels-production.up.railway.app` |
| Backend health check | `https://community-tours-and-travels-production.up.railway.app/` |

---

## Default Login Credentials (after deploy)

| Role | Email | Password |
|---|---|---|
| Admin | admin@communitytours.com | admin123 |
| Staff | staff@communitytours.com | staff123 |

> These are seeded automatically from `services/initUsers.ts` on first load via `localStorage`.

---

## Troubleshooting

**White screen after deploy**
- Check that `vercel.json` has the rewrite rule for SPA routing
- Check Vercel build logs for TypeScript errors

**Login not working on production**
- The app uses `localStorage` for auth — this works fine in production browsers
- Make sure `VITE_API_URL` points to your live Railway backend

**Backend not reachable**
- Visit `https://your-backend.up.railway.app/` — should return `{ "status": "ok" }`
- Check Railway logs under **Deployments**

**Environment variables not applied**
- Variables prefixed with `VITE_` are baked in at build time
- After changing any `VITE_*` variable on Vercel, you must **Redeploy** (not just save)

**CORS error in browser console**
- Update `server.js` with your exact Vercel domain in the `cors()` config (see Part 3)

---

## Cost

| Service | Free Tier |
|---|---|
| Vercel | Unlimited personal projects, 100GB bandwidth/month |
| Railway | $5 free credit/month (enough for a small backend) |

**Total cost to start: $0**
