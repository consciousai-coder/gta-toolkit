# GTA Realtor AI Toolkit — Cloudflare Pages Deployment

## Folder structure
```
your-repo/
├── index.html               ← sales page + analyzer (updated)
├── wrangler.toml            ← Cloudflare config
├── functions/
│   └── api/
│       └── analyze.js       ← serverless function (replaces Netlify)
└── README.md
```

## Deploy in 5 steps

### 1. Push to GitHub
Create a new GitHub repo and push all files in this folder to it.

### 2. Connect to Cloudflare Pages
1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select your GitHub repo
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `.` (a single dot)
5. Click **Save and Deploy**

### 3. Add your API key (environment variable)
1. In Cloudflare dashboard → your Pages project → **Settings** → **Environment variables**
2. Click **Add variable**
   - Variable name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
   - Select **Production** (and **Preview** if you want)
3. Click **Save**
4. Go to **Deployments** → **Retry deployment** (env vars require a redeploy)

### 4. Add your custom domain
1. In your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `gtarealtortoolkit.ca`
3. Follow the DNS instructions — add the CNAME record at WHC.ca pointing to your Pages URL

### 5. Update Gumroad URL
In `index.html`, find:
```
window.open('YOUR_GUMROAD_URL_HERE', '_blank')
```
Replace with your actual Gumroad product URL.

## How it works
- `index.html` is served as a static file (free, unlimited requests)
- When a realtor runs the analyzer, the browser POSTs to `/api/analyze`
- Cloudflare runs `functions/api/analyze.js` as a serverless Worker
- The Worker reads `ANTHROPIC_API_KEY` from env (never exposed to browser)
- Calls Anthropic API and returns the result to the page

## Free tier limits (Cloudflare)
- Static page views: **unlimited**
- Analyzer function calls: **100,000/day** (you need ~300)
- Bandwidth: **unlimited**
- Commercial use: **allowed**

## Auto-deploys
Every push to your GitHub `main` branch triggers an automatic redeploy.
No manual steps needed after initial setup.
