# memory.md — Session Log

Append-only history: what happened each session, decisions made and why, and what's next. Add a new dated entry at the top each time you wrap up a work session — don't rewrite old entries. When a decision here becomes "current state," reflect it in `context.md` too.

---

## 2026-07-18 — Site build, Tailwind, hosting research
**Did:**
- Expanded `items.json` from 5 to 18 items, pulling realistic item titles/details from a real Kansas-auction word cloud the user provided, spread across all 5 categories.
- Pinned the item-card visual format decision (A/B/C/D) to revisit later — moved focus to overall site structure and stack per user request.
- Researched checklist.design (Carousel, Contact Us, Navigation, Footer, Card, Loading, Accordion, Searchbar) to ground the build in established UX patterns rather than guesswork.
- Built the full site skeleton: `index.html` (hero + featured carousel + category tiles), `items.html` (browse/filter grid + detail modal), `contact.html` (mailto/phone, no form). Carried forward the "estate ledger" design tokens from `item-card-options.html`.
- Researched current (2026) free static-hosting comparisons. Recommended **Cloudflare Pages** (unlimited bandwidth, strongest free-tier security/DDoS posture, automatic HTTPS) with **Netlify** as the easier no-git fallback. Final hosting pick still not made.
- User chose to bring in a **full Tailwind CSS build** (vs. the simpler CDN option) — decision explicitly made accepting the added Node/build-step complexity, since Cloudflare Pages/Netlify run the build automatically on push.
- Set up the Tailwind toolchain: `package.json`, `tailwind.config.js` (design tokens as first-class theme values), `postcss.config.js`, `src/input.css` (source, edit this) → `css/style.css` (compiled output, don't hand-edit).
- Hit and fixed a real bug: Tailwind's content-based purge was silently dropping hand-authored `@layer components` classes (skeleton/tooltip/accordion) that weren't yet referenced in any HTML/JS — added a `safelist` pattern in `tailwind.config.js` covering all custom component class prefixes so this can't recur.
- Implemented the checklist.design-informed punch list: live search bar on `items.html` (filters by title/description/tags, debounced), glossary tooltips ("lot number", "starting bid") for visitors unfamiliar with auction terms, an FAQ accordion on `contact.html`, skeleton-card loading states (replacing plain "Loading…" text) for both the grid and carousel, and a scroll-triggered header shadow on the sticky nav.
- Smoke-tested: valid JSON, no JS syntax errors, all pages serve 200, no duplicate HTML ids, all custom CSS classes confirmed present in the compiled build.
- Rewrote `README.md` for the new npm-based workflow (`npm install`, `npm run dev`, `npm run build`) and updated local-preview instructions.
- Researched Cloudflare Pages' Git-integration requirements specifically (not just hosting in general): confirmed a GitHub/GitLab repo is required to get automatic `npm run build` on push; documented the exact dashboard settings (Framework preset: None, Build command: `npm run build`, Build output directory: `/`); found and fixed a real gotcha — Cloudflare defaults to an old pinned Node version unless overridden, so added a `.node-version` file (set to `22`) to the repo root. Confirmed `node_modules`/`.git`/`.DS_Store` are auto-excluded from Cloudflare deploys regardless of `.gitignore`, so no extra cleanup needed there.
- User has the official Claude Code VS Code extension installed already. Confirmed there's no built-in way to import a claude.ai chat transcript into it (open, unresolved Anthropic GitHub feature request as of this session) — so instead did a full file-based handoff: synced the working copy and delivered copy, ran a from-scratch verification (JSON validity, JS syntax, clean Tailwind rebuild, live smoke test of all pages), and wrote `SESSION_HANDOFF.md` for Claude Code to read on open.

**Decided:**
- Stack: static HTML/CSS/JS + full Tailwind build (see `context.md`).
- Hosting: Cloudflare Pages recommended (not yet deployed).
- Design tokens: confirmed final (previously "pending card format decision" in earlier context.md — now unblocked since card format itself is a separate, deferred decision that doesn't gate the token system).

**Open / next steps:**
- Handed off to the user's Claude Code (VS Code extension) instance — see `SESSION_HANDOFF.md` in the project root, written specifically for that handoff. Work is continuing there; this claude.ai chat may pick back up later for planning/research-heavy tasks (SEO copy, hosting research, etc.) while Claude Code handles in-editor implementation.
- Actually deploy to Cloudflare Pages and connect a GitHub repo — exact dashboard settings now documented in `context.md` and `SESSION_HANDOFF.md`.
- Pick a final item-card visual style from `item-card-options.html` (A/B/C/D) — still deferred.
- Source real photos/videos and drop into `/images`, replacing placeholder filenames in `items.json`.
- Decide on custom domain vs. host's default subdomain.
- Once Marketplace/Nextdoor/OfferUp listings are live, wire up their links (placeholder exists on `contact.html`; consider a `listings` field per item).
- SEO pass on item descriptions — not started.

---

## 2026-07-18 — Kickoff
**Did:**
- Defined project scope: static advertising/reference site for estate sale items (antiques, household, farm, construction/tools, machinery), no login/backend/stored data, feeding Marketplace/Nextdoor/OfferUp ahead of a Kansas auction.
- Drafted the kickoff prompt for starting the actual build chat.
- Built `items.json` starter schema with 5 sample items across all categories.
- Built `item-card-options.html` — 4 modular card layouts (Ledger Row, Catalog Card, Tag Card, Spec Sheet Card) using a shared "estate sale ledger" design direction (aged paper, barn red/brass accents, slab serif + sans + mono type) for visual review.
- Split project setup into: Project Instructions (persistent rules), Project Knowledge (items.json, item-card-options.html, context.md, memory.md), and a separate kickoff message for starting a build chat.

**Decided:**
- Data schema fields (see `context.md`).
- Category list (see `context.md`).

**Open / next steps (resolved in the session above — kept here for history):**
- ~~Share `item-card-options.html` with a few people, collect which letter (A/B/C/D) they prefer~~ — deferred/pinned instead.
- ~~Decide stack~~ — done: static HTML/CSS/JS + Tailwind.
- ~~Decide hosting target~~ — recommendation made (Cloudflare Pages), not yet executed.
- Confirm photo readiness — still open.
- Confirm domain plan — still open.
