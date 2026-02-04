# Moonwater Website

A clean, principle-driven website for Moonwater performance marketing agency. Built with pure HTML, CSS, and JavaScript—no frameworks.

## File Structure

```
moonwater-site/
├── index.html      # Main HTML file (all content)
├── styles.css      # All styles (responsive, accessible)
├── script.js       # Testimonials carousel functionality
└── README.md       # This file
```

## Local Preview

To preview the site locally, you can use any simple web server:

**Option 1: Python (built into Mac)**
```bash
cd ~/moonwater-site
python3 -m http.server 8000
```
Then open http://localhost:8000

**Option 2: VS Code**
Install the "Live Server" extension and click "Go Live"

**Option 3: Just open the file**
Double-click `index.html` to open in your browser (some features may not work due to CORS)

---

## Deploying to Cloudflare Pages

### Method 1: Direct Upload (Easiest)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages** in the sidebar
3. Click **Create application** → **Pages** → **Upload assets**
4. Name your project: `moonwater` (or any name you want)
5. Drag and drop the **contents** of the `moonwater-site` folder (not the folder itself—just the files inside)
6. Click **Deploy site**
7. Your site will be live at `moonwater-xxx.pages.dev`

### Method 2: Connect GitHub (Better for updates)

1. Create a GitHub account if you don't have one
2. Create a new repository named `moonwater-site`
3. Upload these files to the repository
4. In Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**
5. Select **Connect to Git**
6. Authorize Cloudflare to access your GitHub
7. Select the `moonwater-site` repository
8. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/` (just a forward slash)
9. Click **Save and Deploy**

---

## Connecting Your Domain (moonwater.co)

### Step 1: Add Custom Domain in Cloudflare Pages

1. In Cloudflare Dashboard, go to your Pages project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `moonwater.co`
5. Click **Continue**

### Step 2: Update DNS (if domain is already on Cloudflare)

If moonwater.co is already using Cloudflare DNS:
- Cloudflare will automatically add the correct CNAME record
- Just click **Activate domain**

### Step 3: Update DNS (if domain is elsewhere)

If your domain is registered elsewhere (GoDaddy, Namecheap, etc.):

1. Log into your domain registrar
2. Go to DNS settings
3. Delete or update any existing A/CNAME records for `@` or `moonwater.co`
4. Add a CNAME record:
   - **Name/Host**: `@` (or blank, depending on registrar)
   - **Value/Points to**: `moonwater-xxx.pages.dev` (your Cloudflare Pages URL)
   - **TTL**: Auto or 300

For `www.moonwater.co`:
- Add another CNAME record:
   - **Name/Host**: `www`
   - **Value/Points to**: `moonwater-xxx.pages.dev`

### Step 4: Wait for SSL

- Cloudflare automatically provisions an SSL certificate
- This usually takes 5-15 minutes
- Your site will be live at https://moonwater.co

---

## Switching from Carrd

Once your Cloudflare Pages site is working:

1. **Test thoroughly** at the `.pages.dev` URL first
2. Update your domain's DNS to point to Cloudflare Pages (see above)
3. DNS propagation takes 0-48 hours (usually much faster)
4. Carrd will stop serving your site once DNS points elsewhere
5. You can keep or cancel your Carrd subscription

---

## Making Future Updates

### Content Changes

All content is in `index.html`. To update:

1. **Principles**: Find the `<article class="principle">` sections
2. **Testimonials**: Find the `<div class="testimonial">` sections
3. **Header/Footer**: Find the `<header>` and `<footer>` sections

### Style Changes

All styles are in `styles.css`. Key sections:
- Colors: Lines 8-18 (CSS variables)
- Typography: Lines 20-28
- Spacing: Lines 30-36
- Header: Lines 101-170
- Principles: Lines 212-266
- Testimonials: Lines 268-341

### Re-deploying

**If using Direct Upload:**
1. Go to Cloudflare Pages dashboard
2. Click your project
3. Click **Create new deployment**
4. Upload your updated files

**If using GitHub:**
1. Push your changes to GitHub
2. Cloudflare automatically rebuilds and deploys

---

## Troubleshooting

**Site not loading?**
- Clear browser cache (Cmd+Shift+R on Mac)
- Check Cloudflare Pages deployment status
- DNS changes can take up to 48 hours

**Styles look wrong?**
- Hard refresh: Cmd+Shift+R
- Check browser console for errors (Cmd+Option+J in Chrome)

**Testimonials not rotating?**
- Check browser console for JavaScript errors
- Ensure script.js is in the same folder as index.html

---

## Support

For questions about this build, you can reach out to the developer who created it.

For Cloudflare Pages issues, see: https://developers.cloudflare.com/pages/
