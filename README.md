# infiniti — recruitment process outsourcing website

A premium, light (white + red) marketing site built with:

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **GSAP** + **ScrollTrigger** (via `@gsap/react`) for pinned and scrubbed scroll animation
- **Lenis** for smooth scrolling, driven by GSAP's ticker so both stay in sync
- Hand-written CSS design system mixing glassmorphism, claymorphism, minimalism and maximalism

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
src/
  app/
    layout.tsx            fonts (next/font), metadata
    page.tsx              page composition
    globals.css           design system + all section styles
    api/contact/route.ts  contact form endpoint (validates input)
  components/
    SmoothScroll.tsx      Lenis + GSAP ticker + animated #anchor links
    Preloader.tsx         infinity-mark intro
    Hero.tsx              scroll + pointer parallax
    Marquee.tsx           giant type ticker, speeds up with scroll velocity
    Manifesto.tsx         scroll-scrubbed word highlight + count-up stats
    Services.tsx          pinned horizontal scroll (desktop), swipe scroller (mobile)
    Process.tsx           pinned, scroll-driven 6-step journey with drawing infinity loop
    Difference.tsx        in-house vs infiniti toggle
    Savings.tsx           interactive savings estimator
    Sections.tsx          industries + FAQ
    Contact.tsx           validated form -> /api/contact
    Footer.tsx            wordmark that fills with red on scroll
    Interactions.tsx      spotlight, magnetic buttons, 3D tilt (event delegation)
  lib/
    content.ts            all copy and data in one place
legacy-static/            the previous plain HTML/CSS/JS version
```

## Things to replace before launch

- Sample statistics (48 hrs, 92 %, 40 %, 25+) and the savings estimator's 12 % infiniti rate in `src/lib/content.ts` / `src/components/Savings.tsx`
- Placeholder contact details (email, phone, address) in `Contact.tsx` and `Footer.tsx`
- Contact form: on Netlify, enquiries are stored by **Netlify Forms** (see below). Elsewhere they post to `src/app/api/contact/route.ts`, which validates them but does not deliver them yet — connect an email service, CRM or database where the `TODO` is

## Deploy to Netlify

The repo is Netlify-ready: `netlify.toml` (build command, Node 22, security headers), `public/__forms.html` (lets Netlify detect the contact form) and automatic Next.js 16 support through Netlify's OpenNext adapter — no plugin or publish folder to configure.

**Option A — from Git (recommended, auto-deploys on every push)**

1. Push this folder to GitHub / GitLab / Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo. Settings are read from `netlify.toml`; just click **Deploy**.
3. After the first deploy, open **Site configuration → Forms → Form notifications** and add an email notification so enquiries reach your inbox.
4. Optional: in **Site configuration → Environment variables** set `NEXT_PUBLIC_SITE_URL` to your custom domain (used for the sitemap, robots.txt and canonical URL). Without it Netlify's `URL` is used.

**Option B — Netlify CLI**

```bash
npm i -g netlify-cli
netlify login
netlify init            # or: netlify link  (to an existing site)
netlify deploy --build --prod
```

Stop `npm run dev` before running a local Netlify build — the dev server locks files in `.next`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, sitemap and robots.txt (falls back to Netlify's `URL`, then `http://localhost:3000`) |
| `NEXT_PUBLIC_SMOOTH_TOUCH` | Set to `false` to turn off Lenis touch smoothing on Android and use native scrolling everywhere (on by default for Android; iOS always uses native scrolling) |
| `NEXT_PUBLIC_FORM_TARGET` | `netlify` or `api` — forces where the contact form posts (auto-detected: `netlify` on Netlify builds) |

## Accessibility and motion

All animation respects `prefers-reduced-motion`: Lenis, pinning, scrubbing and reveals switch off and content is shown statically. Keyboard navigation, focus rings, a skip link and ARIA tab semantics are included.
