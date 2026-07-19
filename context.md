# context.md — Current State Snapshot

This is the "source of truth" file: what's decided vs. still open. Overwrite sections as decisions get made — this file should always reflect where the project stands *right now*, not the history of how it got there (that's `memory.md`).

Re-upload this file to Project Knowledge whenever it changes, since chats don't share context unless it's in the knowledge base.

---

## Project summary
Static website hosting photos/descriptions of estate sale & auction items (antiques, household, farm, construction/tools, machinery) to support advertising on Facebook Marketplace, Nextdoor, and OfferUp ahead of a Kansas auction house sale. No login, no backend, no stored visitor data.

## Decisions locked in
- **Data schema:** `items.json` — fields: `id`, `lot`, `title`, `category`, `status`, `shortDescription`, `description`, `notes`, `dimensions`, `condition`, `price`, `photos[]`, `tags[]`. Now has 18 sample items across all 5 categories (expanded from the original 5 using terms pulled from a real Kansas-auction word cloud).
- **Categories:** Antiques, Household, Farm, Construction & Tools, Machinery.
- **No sign-in / no backend / no stored personal data** — confirmed hard requirement.
- **Stack:** Static HTML/CSS/JS, no server, **styled with a full Tailwind CSS build** (Node + `tailwindcss` CLI). Build step is source-only — the shipped site is still 100% static files; Cloudflare Pages/Netlify run `npm run build` automatically on push, so end users and even the site owner (once deployed) never touch the build step directly.
- **Site structure (built):** `index.html` (hero + featured carousel + category tiles), `items.html` (search + category filter + detail modal), `contact.html` (mailto/phone + FAQ accordion — no form). Shared `js/app.js` and Tailwind-compiled `css/style.css`.
- **Design tokens:** carried forward from `item-card-options.html`'s "estate ledger" direction — now formalized as Tailwind theme colors in `tailwind.config.js`: `paper`/`paper-deep` (bg), `ink`/`ink-soft` (text), `barn`/`barn-deep` (primary accent), `brass`, `sage` (secondary accents), `hairline` (borders), `cream` (surfaces). Fonts: Zilla Slab (serif/headings), Work Sans (sans/body), IBM Plex Mono (mono/labels). **Confirmed as final** — no longer pending.
- **Component library (built, checklist.design-informed):** carousel (manual + autoplay, dots, pause, swipe, reduced-motion aware), sticky nav with scroll shadow + mobile menu, footer with utility links, item cards, live search bar, tooltips (glossary terms like "starting bid"), FAQ accordion, skeleton-card loading states, accessible modal/lightbox.
- **Hosting recommendation:** **Cloudflare Pages**, connected to a GitHub repo — free, unlimited bandwidth, strongest DDoS/edge protection of the free options, automatic HTTPS, and pairs cleanly with the Tailwind build step (Cloudflare runs `npm run build` on every push). **Netlify** is the fallback if drag-and-drop-without-git is preferred over connecting GitHub. A GitHub (or GitLab) repo is required to get Cloudflare's automatic build-on-push — direct upload without git would mean running `npm run build` locally and re-uploading manually every time.
  - **Confirmed Cloudflare Pages dashboard settings:** Framework preset: `None` · Build command: `npm run build` · Build output directory: `/` (site files live at repo root, not a separate `dist/` folder) · No environment variables needed (no secrets, fully static).
  - **Node version gotcha (handled):** Cloudflare defaults to an old pinned Node version unless overridden. Fixed by adding `.node-version` (set to `22`) to the repo root.
  - `node_modules`, `.git`, `.DS_Store` are auto-excluded from Cloudflare's deploy regardless of `.gitignore` — no extra cleanup needed before pushing.
  - Final pick and actual deploy: *not yet done* — next concrete step.

## Open decisions
- **Item card visual style:** still pinned/deferred. 4 options remain in `item-card-options.html` (A: Ledger Row, B: Catalog Card, C: Tag Card, D: Spec Sheet Card). Current live site uses a simple functional card (Catalog-Card-like) as a placeholder — swappable anytime without touching data or JS logic.
- **Hosting — final pick + actual deployment:** recommendation given (Cloudflare Pages), not yet executed.
- **Photo/video sourcing:** still placeholder — `photos[]` arrays in `items.json` reference filenames that don't exist yet; site gracefully shows a "photo coming soon" pattern until real files are dropped into `/images`.
- **Domain:** still TBD (host's default subdomain vs. custom domain).
- **Marketplace / Nextdoor / OfferUp listing links:** placeholder block exists on `contact.html`; once listings are live, consider adding a `listings: {marketplace, offerup, nextdoor}` field per item in `items.json` so cards can link out directly.
- **SEO keyword pass on item descriptions:** not started — planned next, after hosting is settled.

## Files in project knowledge
- `items.json` — 18-item starter data set (updated this session)
- `item-card-options.html` — visual comparison of 4 card layouts (still relevant, decision pending)
- `context.md` — this file
- `memory.md` — session log

## Files delivered but NOT in project knowledge (need manual re-upload if you want Claude to reference them directly in future chats)
The full site build (`index.html`, `items.html`, `contact.html`, `js/app.js`, `src/input.css`, `css/style.css`, `tailwind.config.js`, `postcss.config.js`, `package.json`, `README.md`) was delivered as downloadable output files, not auto-saved to Project Knowledge. If you want a future chat to pick up the actual site code (not just this summary), re-upload the files you're keeping under version control.
