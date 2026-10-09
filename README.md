# THORVON MEDIA — Editorial Agency Website & Creative Vault

Official, modern, responsive website for **THORVON MEDIA** — Creative Content & Editorial PR Agency.

---

## What’s New in This Revision

1. **Complete Removal of Team Buttons**:
   - Stripped all "Meet the Team", "Meet Our Team", and white dead buttons across the hero and page flow.
   - Clean navigation: **Services · Portfolio · Custom Plan · Contact**.

2. **Editorial Creative Portfolio Gallery (`#portfolio`)**:
   - Zero fictional case studies, zero fake statistics, and zero fabricated client quotes.
   - Genuine deliverable-driven creative showcase:
     - Short-form reels & vertical video edits (9:16)
     - Long-form video cuts & podcast edits (16:9)
     - Social media editorial carousels (4:5)
     - Brand visual graphics (1:1 & 16:9)
     - High-CTR YouTube thumbnails (16:9)
   - Interactive category filter bar: **All Work · Video & Reels · Graphics · Social Media · Thumbnails**.
   - **Integrated Media Lightbox**:
     - Videos open in a native responsive player (plays inline, muted by default without loud autoplay).
     - Images open in an editorial high-resolution lightbox preview with zoom.

3. **Official Branding & Thunder Favicon**:
   - High-contrast electric blue lightning `T` mark generated across all standard favicon formats (`favicon.ico`, `assets/favicon-32x32.png`, `assets/favicon-16x16.png`, `apple-touch-icon.png`).

---

## File Structure

```
Thorvon-Media-Website/
├── index.html                   # Clean, semantic HTML5 with portfolio gallery & modals
├── styles.css                   # Dark editorial luxury aesthetic, grid layouts, and lightbox
├── script.js                    # Filter tabs, lightbox video/image player, and plan configurator
├── favicon.ico                  # Electric lightning icon
├── assets/
│   ├── favicon-16x16.png        # Favicons for all browser tabs
│   ├── favicon-32x32.png
│   ├── favicon-192.png
│   ├── favicon-512.png
│   ├── apple-touch-icon.png
│   ├── drishtanta-portrait.jpg  # Founder profile photo
│   └── portfolio/               # Creative media assets
│       ├── sample-reel.mp4      # Video file (short-form reel sample)
│       ├── video-01.jpg         # Poster / thumbnail for video 1
│       ├── video-02.jpg         # Poster / thumbnail for video 2
│       ├── thumb-01.jpg         # High-CTR thumbnail sample
│       ├── thumb-02.jpg         # Executive masterclass thumbnail sample
│       ├── social-01.jpg        # Editorial social carousel sample
│       ├── social-02.jpg        # Twitter/X hook graphic sample
│       ├── graphics-01.jpg      # Brand visual identity sample
│       └── graphics-02.jpg      # Editorial presentation sample
└── README.md
```

---

## How to Replace Portfolio Media with Your Own Work

You can replace any placeholder image or video simply by dropping your actual files into `assets/portfolio/`:

### 1. Videos (Reels / Edits)
- Place your `.mp4` video in `assets/portfolio/` (e.g. `assets/portfolio/my-reel.mp4`).
- Update the item tag in `index.html`:
  ```html
  <article class="portfolio-item item-video item-vertical"
           data-category="video"
           data-type="video"
           data-title="Your Reel Title"
           data-tag="Video Editing"
           data-media="assets/portfolio/my-reel.mp4"
           data-poster="assets/portfolio/my-reel-thumb.jpg">
  ```

### 2. Thumbnails & Graphics
- Drop your high-res `.jpg` or `.png` into `assets/portfolio/`.
- Update the item in `index.html`:
  ```html
  <article class="portfolio-item item-thumbnail item-wide"
           data-category="thumbnail"
           data-type="image"
           data-title="Your YouTube Thumbnail Title"
           data-tag="Thumbnail Design"
           data-media="assets/portfolio/your-thumbnail.jpg">
  ```

---

## How to Update Your Live Website on Vercel (`https://thorvonmediain.vercel.app/`)

Your complete, ready-to-deploy files are located at:
`C:\Users\User\Desktop\Thorvon-Media-Website`

### Option 1: Using Git & GitHub (Recommended)
1. Open PowerShell or Terminal inside `C:\Users\User\Desktop\Thorvon-Media-Website`:
   ```bash
   cd C:\Users\User\Desktop\Thorvon-Media-Website
   git add .
   git commit -m "feat: portfolio gallery, lightbox player, and thunder favicon"
   git push origin main
   ```
2. Vercel will automatically build and publish the changes to **[https://thorvonmediain.vercel.app/](https://thorvonmediain.vercel.app/)** in ~30 seconds.

### Option 2: Drag & Drop via Vercel Dashboard
1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**.
2. Select your `thorvonmediain` project.
3. Go to the **Deployments** tab.
4. Drag and drop the `Thorvon-Media-Website` folder directly into Vercel to redeploy instantly.
