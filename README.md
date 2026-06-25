# Mohamed Osama — Portfolio Website

A fully responsive, single-page storytelling portfolio built with
pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (no frameworks, no build tools).

---

## 📁 Project Structure

```
portfolio/
│
├── index.html                        ← Main page (open this in a browser)
├── Mohamed_Osama_CV_ATS__1_.docx     ← CV file (download button is wired to this)
├── README.md                         ← This file
│
├── css/
│   └── styles.css                    ← All styles (design tokens → sections → responsive)
│
├── js/
│   └── main.js                       ← All JS (canvas, animations, interactions)
│
├── images/
│   ├── profile_placeholder.svg       ← Shown until real photo is added
│   └── profile.jpg                   ← ← YOUR PHOTO GOES HERE (see Step 1 below)
│
└── assets/                           ← Any future assets (icons, og-image, favicon…)
```

---

## 🚀 Quick Start — How to View It

### Option A — Double-click (simplest)
1. Unzip the folder anywhere on your computer.
2. Open **`index.html`** directly in Chrome, Firefox, or Edge.

> ⚠️ If background animations don't show, use Option B (some browsers block
>    canvas on `file://` URLs).

### Option B — Local server (recommended)

If you have **Python** installed:
```bash
cd portfolio
python -m http.server 8080
# Then open http://localhost:8080 in your browser
```

If you have **Node.js** / `npx`:
```bash
cd portfolio
npx serve .
```

If you have **VS Code**, install the **Live Server** extension, right-click
`index.html` → "Open with Live Server".

---

## 📸 Step 1 — Add Your Photo

1. Copy your photo into the `images/` folder and name it **`profile.jpg`**  
   (JPG or PNG both work, square crop recommended, minimum 400 × 400 px).

2. Open `index.html` and find the **PHOTO INSTRUCTIONS** comment block  
   (search for `"HOW TO ADD YOUR PHOTO"`).

3. **Delete** the placeholder `<div class="profile-placeholder">` block.

4. **Uncomment** the `<img>` tag directly above it:
   ```html
   <img
     src="images/profile.jpg"
     alt="Mohamed Osama — Mechatronics Engineering Student"
     class="profile-photo"
   />
   ```

That's it — save and refresh.

---

## ✏️ Step 2 — Personalise the Content

All content lives in `index.html` and is clearly commented.  
Key spots to update:

| What | Where in `index.html` |
|------|----------------------|
| Hero headline & tagline | `<!-- SECTION 1 — HERO -->` |
| Skill bar percentages | `data-w="85"` attributes on `.sk-fill` |
| Project cards | `<!-- PROJECT 01 / 02 / 03 -->` |
| Timeline entries | `<!-- ENTRY 1 / 2 / 3 / 4 -->` |
| Contact email & phone | `<!-- SECTION 8 — CONTACT -->` and `<footer>` |
| LinkedIn URL | Both in Contact section and Footer |

---

## 🎨 Step 3 — Change the Colour Scheme

Open `css/styles.css` and edit the **Design Tokens** at the top:

```css
:root {
  --cyan:    #00CFFF;   /* Primary accent — change this first */
  --violet:  #6E28D9;   /* Secondary accent                   */
  --orange:  #FF5722;   /* Highlight                          */
  --bg-base: #080D1A;   /* Page background                    */
}
```

For example, a **green/teal** theme:
```css
--cyan:   #00E5A0;
--violet: #0099FF;
```

---

## 📄 Step 4 — CV Download Button

The "Download CV" buttons (in the Hero and Footer) are already wired to:
```
Mohamed_Osama_CV_ATS__1_.docx
```
which is included in this zip.  
If you rename or replace the CV file, update the `href` in two places in `index.html`:
```html
<a href="YOUR_NEW_FILENAME.pdf" download …>
```

---

## 🌐 Deployment (Going Live)

### GitHub Pages (free)
1. Create a new GitHub repository.
2. Upload all files (keep the folder structure).
3. Go to **Settings → Pages → Source → main branch / root**.
4. Your site will be live at `https://yourusername.github.io/repo-name/`.

### Netlify (free, drag-and-drop)
1. Go to [netlify.com](https://netlify.com) → Sign in.
2. Drag the entire `portfolio/` folder onto the deploy zone.
3. Done — live URL in seconds.

### Vercel (free)
```bash
npm i -g vercel
cd portfolio
vercel
```

---

## 🔧 JavaScript Modules (main.js)

| Function | What it does |
|----------|-------------|
| `initPCBCanvas()` | Animated circuit-trace background (canvas) |
| `initParticleCanvas()` | Drifting particle field (canvas) |
| `initTypewriter()` | Character-by-character hero eyebrow text |
| `initCounters()` | Animates stat numbers from 0 on scroll |
| `initReveal()` | Fade/slide-in sections on scroll |
| `initSkillBars()` | Fills skill progress bars on scroll |
| `initActiveNav()` | Highlights nav link for current section |
| `initNavScroll()` | Compresses nav on scroll |
| `initMobileNav()` | Hamburger + full-screen mobile overlay |
| `initSmoothScroll()` | Smooth anchor scrolling with nav offset |
| `initCursorGlow()` | Radial glow that follows the mouse |
| `initCardTilt()` | 3-D perspective tilt on project/skill cards |
| `initScrollProgress()` | Cyan progress bar across the top |

---

## ♿ Accessibility

- All decorative elements carry `aria-hidden="true"`.
- Images have descriptive `alt` text.
- Navigation landmarks use `role` attributes.
- Language dots include `aria-label` with numeric proficiency.
- Fully keyboard-navigable.
- Respects `prefers-reduced-motion` — all animations are disabled for users who prefer it.

---

## 📬 Contact

**Mohamed Osama**  
📧 mohamedosama4949@gmail.com  
📞 +20 112 868 3487  
🔗 [linkedin.com/in/mohamed-osama-b22367335](https://linkedin.com/in/mohamed-osama-b22367335)  
📍 Quesna, Menoufia, Egypt
