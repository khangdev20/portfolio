# Le Nhut Khang Vo — Portfolio Website

> **Elite Fullstack Developer & AI Specialist Portfolio**  
> Designed with a 2026 AI-generated generative dark-mode aesthetic (Awwwards / Linear / Vercel inspired).  
> Built as a **100% static, zero-backend, zero-build deployment** ready to publish immediately to **GitHub Pages**, **Vercel**, or **Netlify**.

---

## ⚡ Quick Deployment

Because this project uses pure, modern static files (HTML5, CSS3, Vanilla ES6+ JavaScript), there is no `npm run build` or compilation step required.

### 1. GitHub Pages
1. Push this repository to GitHub (`khangdev20/portfolio` or `khangdev20.github.io`).
2. Navigate to **Settings → Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be live at `https://khangdev20.github.io/`.

### 2. Vercel
1. Run `npx vercel` or import the Git repository on [vercel.com](https://vercel.com).
2. Framework Preset: **Other** / **Static HTML**.
3. Click **Deploy**.

### 3. Netlify
1. Drag and drop the root folder into [Netlify Drop](https://app.netlify.com/drop) or connect your repository.
2. Publish directory: `.` (root).

---

## 🛠 Tech Stack & Architecture

- **Markup:** Semantic HTML5, accessible ARIA attributes, structured metadata, and Open Graph tags.
- **Styling:** Vanilla CSS with custom properties (CSS variables), glassmorphism (`backdrop-filter: blur()`), hairline borders, and responsive grid layouts.
- **Interactions:** Vanilla JavaScript (ES6+):
  - 3D perspective card tilt with cursor-following specular spotlight (`--mouse-x`, `--mouse-y`)
  - Magnetic CTA buttons with spring physics
  - Smooth Lenis momentum scrolling
  - Animated number counters with `IntersectionObserver`
  - Dynamic category-filtered bento grid with sliding pill indicator
  - Zero-backend modal case studies and clipboard toast notifications
  - Ambient aurora gradient blobs with subtle mouse parallax
  - Tactile SVG noise / grain overlay

---

## 📦 CDN Libraries Used

All external scripts and fonts are loaded through fast, high-availability public CDNs:

1. **Lenis Smooth Scroll**
   - **URL:** `https://unpkg.com/lenis@1.1.18/dist/lenis.min.js`
   - **CSS:** `https://unpkg.com/lenis@1.1.18/dist/lenis.css`
   - **Purpose:** Ultra-smooth, hardware-accelerated momentum scrolling. Automatically falls back to native browser smooth scrolling if offline or if `prefers-reduced-motion: reduce` is enabled.

2. **Google Fonts**
   - **Display Font:** `Plus Jakarta Sans` (weights: 300, 400, 500, 600, 700, 800)
   - **Monospace Font:** `JetBrains Mono` (weights: 400, 500, 600, 700)
   - **URL:** `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap`

---

## 🎨 Customization Guide

### 1. Swapping Color Accents
All colors are centralized in `css/style.css` under the `:root` pseudo-class:

```css
:root {
  /* Dark Neutral Base */
  --bg-base: #090a0f;              /* Near-black base */
  
  /* Electric Accents */
  --accent-violet: #8b5cf6;        /* Primary accent (violet) */
  --accent-cyan: #22d3ee;          /* Secondary accent (cyan) */
  --accent-indigo: #4f46e5;
  --accent-magenta: #ec4899;
  --accent-emerald: #10b981;

  /* Gradients */
  --accent-gradient: linear-gradient(135deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%);
}
```

*Example: If you wish to switch to an emerald/amber theme:*
- Change `--accent-violet` to `#10b981`
- Change `--accent-cyan` to `#f59e0b`

### 2. Changing Typography
To use **Inter** or **Geist Sans**, update the Google Fonts link in `index.html` and update `--font-sans` in `css/style.css`:

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### 3. Replacing Screenshot Placeholders
In `index.html`, inside the `#featuredTripMarketplace` section:
- **Web App Browser Frame:** Locate `.mockup-screen-content`. Replace the abstract SVG/markup elements with an `<img>` tag:
  ```html
  <img src="assets/trip-marketplace-web.png" alt="Trip Marketplace Web App" class="w-full h-full object-cover rounded-md">
  ```
- **Mobile Phone Frame:** Locate `.phone-screen-content` inside `.phone-frame-mockup`. Replace the abstract card with:
  ```html
  <img src="assets/trip-marketplace-mobile.png" alt="Trip Marketplace iOS App" class="w-full h-full object-cover rounded-md">
  ```

---

## 📁 Project File Structure

```
portfolio/
├── index.html          # Semantic single-page application structure
├── css/
│   └── style.css       # Complete design system, glassmorphism, animations, responsive rules
├── js/
│   └── main.js         # Interactive engine (Lenis, 3D tilt, filters, modal, counters)
├── assets/             # Media and static graphics directory
└── README.md           # Documentation and deployment manual
```

---

## 👤 Profile & Attribution

- **Name:** Le Nhut Khang Vo
- **Title:** Fullstack Developer · Master of Information Technology (AI Major) @ QUT
- **Location:** Brisbane, QLD, Australia
- **Visa Status:** Subclass 485 Temporary Graduate Visa (2 Years) &middot; Full Working Rights
- **Email:** [lenhutkhangvo@gmail.com](mailto:lenhutkhangvo@gmail.com)
- **LinkedIn:** [linkedin.com/in/vokhang](https://linkedin.com/in/vokhang)
- **GitHub:** [github.com/khangdev20](https://github.com/khangdev20)
- **GitLab:** [gitlab.com/khangdev20](https://gitlab.com/khangdev20)
