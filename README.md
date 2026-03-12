# Interns Platform — GitHub Pages Deployment

## 🚀 Deploy Steps

### 1. Create a GitHub repository
Push all files in this folder to a new GitHub repo:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save — the workflow will auto-deploy on every push to `main`

Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

### 3. Update Supabase Redirect URLs
In Supabase Dashboard → **Authentication** → **URL Configuration**:
- **Site URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO`
- **Redirect URLs**: `https://YOUR_USERNAME.github.io/YOUR_REPO/**`

---

## 📱 PWA — Install on Device
Once deployed, visit the URL on mobile → tap **"Add to Home Screen"** to install as a PWA.

## 🔧 Files Modified for GitHub Pages
| File | Change |
|------|--------|
| `manifest.json` | `start_url` and `scope` changed to `./` (relative) |
| `sw.js` | Asset paths now derived from `self.registration.scope` |
| `404.html` | Added for SPA routing support |
| `.nojekyll` | Prevents Jekyll processing |
| `.github/workflows/deploy.yml` | Auto-deploy on push to `main` |
