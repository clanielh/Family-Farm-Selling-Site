# memory.md — Session Log

Append-only history: what happened each session, decisions made and why, and what's next. Add a new dated entry at the top each time you wrap up a work session — don't rewrite old entries. When a decision here becomes "current state," reflect it in `context.md` too.

---

## 2026-07-19 (cont'd) — Card hierarchy fix, modal concepts reviewed, docs/wiki set up
**Did:**
- Fixed a real bug reported by the owner after actually viewing the shipped Giant Inventory Tag card: the hole-punch circle (16–48px from card top) overlapped the category text, because the card's top padding (`pt-10`, 40px) didn't clear it. Bumped to `pt-14` (56px).
- Rebalanced the card's type hierarchy per owner feedback: originally the huge 32px lot number (faithful to the Figma concept) dominated the card, with the title secondary. Owner felt the item name should be the focal point instead. Category+lot were shrunk down to share one small `Category · LOT ID` line, and the title was bumped up to `text-2xl`/bold to become the largest text on the card.
- Debugged a "changes aren't showing up" report — turned out to be two things: (1) a Python `http.server` doesn't send `Cache-Control` headers, only `Last-Modified`, so browsers can serve heuristically-cached CSS/JS even after the server itself is restarted (restarting the server does not clear browser cache — these are independent); (2) I'd left an orphaned `http.server` process running on port 8000 from my own earlier verification checks in this session (background jobs from separate Bash tool calls don't share job-control state, so my `kill %1` calls were silently no-ops) — cleaned that up. Proved server-side correctness definitively by curling the live-served files and confirming the new CSS classes/JS functions were present in what was actually being served, before pointing at browser caching as the cause.
- Reviewed two more Figma Make batches (6 more card concepts total, across "Round 2" and an unlabeled round): Concept 1 Inspector's Tag, Concept 2 Archival Folder, Concept 3 Bill of Sale/Ledger Entry, Concept 4 Public Notice, Concept 5 Ruled Index Card, Concept 6 Quadrant Lot Box. None of these (or the original 9 across all 3 rounds) were actually designed as a modal/detail view — Figma was never told a separate modal exists, so every concept it generated is a card/tile design. The owner's actual question was which rejected concept could be repurposed as the bigger, more spacious "view details" modal.
- Gave a ranked recommendation (Quadrant Lot Box and Inspector's Tag as strongest fits — both give the photo a proper full-size region, needed for the existing multi-photo slideshow's prev/next arrows; Bill of Sale and Ruled Index Card were flagged as weaker fits specifically because they treat the photo as a small rotated "attachment," which fights against browsing multiple real photos clearly). Owner chose to **hold this for stakeholder feedback** rather than decide now, same pattern as the original grid-card decision.
- Set up documentation the owner asked for: rewrote `README.md` to cover everything built this session (dark mode, mobile pass, item card design, dual-remote setup), and stood up a **GitLab wiki** (`family-farm-selling-site.wiki.git`, cloned/pushed directly via git since GitLab auto-provisions an empty wiki repo) with 5 pages: Home, Design System, Item Card History, Accessibility and Mobile, Deployment and Repository. Marked explicit "Screenshot needed" callouts in 3 of those pages rather than fabricating any — there's no browser available in this environment to capture real screenshots, so those need to be added by whoever next has a real browser open on the live site.
- Also resolved a repo-sync question: GitLab was 2 commits behind GitHub (owner had committed/pushed to GitHub only from VS Code); pushed the missing commits to catch GitLab up, per owner's choice to keep mirroring both rather than dropping GitLab.

**Decided:**
- Item card title is the primary visual hierarchy element; lot/category are secondary, small, and share one line — this was a real course-correction from the original Figma concept's emphasis, not a preference to relitigate lightly.
- Modal/detail-view redesign: **on hold**, pending stakeholder feedback across all 6 newly-reviewed concepts (not narrowed early, matching how the grid-card decision was handled).

**Open / next steps:**
- Waiting on: stakeholder feedback on the 6 modal-candidate concepts; stakeholder feedback on the original 4 grid-card concepts (the grid card decision — Giant Inventory Tag — was made by the owner directly rather than through that feedback round, so it's worth confirming whether the peer-feedback round on the original 4 still matters or is now moot).
- Wiki screenshots still need to be added by the owner (or a future session with real browser access) — see the 3 callouts in the wiki.
- Real photos, hosting deployment, aesthetic (palette/font) exploration all still open as before.

## 2026-07-19 — Item card design decided (via Figma Make) and implemented
**Did:**
- Owner ran the Figma AI design brief drafted last session and came back with a Figma Make export (a full React/Vite/Tailwind-v4 scaffold — this is a design-prototyping tool output, not something we're adopting as our stack; the actual site stays static HTML/vanilla JS/Tailwind-v3-build as already locked in). The export contained 3 new card concepts, all built around the same brief (huge type, massive tap targets, zero hover reliance): Concept 7 "Perforated Ticket," Concept 8 "Giant Inventory Tag," Concept 9 "Framed Exhibition Placard."
- Confirmed the Figma-generated color tokens (`paper`/`panel`/`text-main`/`text-muted`/`accent-red`/`accent-brass`/`accent-sage`/`border-main`/`surface`) map cleanly onto our existing palette — the brief's constraint to reuse the locked tokens worked as intended.
- Owner picked **Concept 8, Giant Inventory Tag**, and confirmed swapping the auction-style button copy ("Bid Now" etc.) for "View details," matching our no-checkout/contact-only model.
- Ported Concept 8 from the Figma React/JSX into `.item-card` (`src/input.css`) and `buildCard()` (`js/app.js`), replacing the old simple catalog-style placeholder card on `items.html`. Adaptations made during the port (not explicitly asked about, but reasonably called given the constraints already established this project):
  - **Dropped the sepia/grayscale photo filter** the Figma mockup applied — real listing photos need to show true color/condition for a buyer to judge the item; an aging filter fights that, however nice it looks on stock photos.
  - **Dropped the separate on-photo lot-number and status badges** used everywhere else — Concept 8 already shows the lot number huge in the header and status in the footer, so repeating them over the photo would be redundant clutter this design doesn't call for.
  - **Split the single `price` string** (e.g. `"Starting bid $60 for the pair"`) into a small label + big value for the tag's price row, via a `splitPrice()` helper that splits on the first `$` — no `items.json` schema change needed.
  - **Kept sharp, un-rounded corners** throughout this card, matching Concept 8's printed-tag identity, even though the rest of the site uses soft `rounded-md`/`rounded-sm` — a deliberate departure, not an oversight.
  - **Kept the existing color-coded status-tag system** (green/amber/grey by status) rather than Concept 8's plain dark pill, since color-coding status is more informative and was already established.
  - Confirmed this card design correctly participates in the dark/light mode token system built last session with zero extra work — the reactive tokens (`ink`/`surface`/`paper`/`paper-deep`/`hairline`) Figma happened to use are exactly the ones already wired to flip with `.dark`.
  - `items-grid`'s column minmax bumped 260px→300px to give the richer layout room.
- Verified: clean `npm run build`, valid `items.json`, all pages still serve 200, spot-checked the compiled CSS to confirm the new card's reactive vs. fixed tokens resolved as intended.

**Decided:**
- Item card visual style: **Giant Inventory Tag (Concept 8)** — no longer an open decision, implemented live on `items.html`.
- This card is taller and lower-density than the old placeholder (expected — a direct consequence of the "massive tap target, huge type" brief that was intentionally written for this project's older/rural audience).

**Open / next steps:**
- The loading skeleton (`.skeleton-card`) wasn't updated to match the new card's taller proportions/sharp corners — cosmetic only (it shows for a fraction of a second on a local JSON fetch), flagged but not fixed; revisit if it looks jarring in practice.
- Aesthetic exploration (palette/fonts) is still on hold, per the standing agreement — this session only touched the card component itself.
- Real photos, once sourced, will be the first real test of dropping the sepia filter — worth a look to confirm that call still feels right once actual item photos are in place instead of the plaid placeholder.

## 2026-07-18 — Dark/light mode + mobile-responsive pass
**Did:**
- Before building, confirmed two product decisions with the owner: (1) the site should always start in light mode for every first-time visitor regardless of their device's OS dark-mode setting — only switches if they've actually clicked the toggle before (stored in `localStorage['theme']`); (2) the toggle shows both an icon and a text label ("🌙 Dark" / "☀ Light"), not an icon alone, consistent with the earlier senior-usability framing (nothing should depend on recognizing an icon convention).
- While designing the dark-mode CSS-variable architecture, found that several existing elements reuse the `ink`/`paper`/`cream` tokens for a *different* role than "page chrome" — photo-overlay badges (`.lot-badge`), the tooltip, the carousel pause button, the modal backdrop scrim, and the entire footer band are all self-contained dark-chip-with-light-text elements that are supposed to look the same regardless of page theme (a modal scrim going light in dark mode, or a tooltip flipping to a light bg with light text, would just be broken). Resolved by splitting the token system into three tiers instead of naively flipping everything:
  - **Reactive** (CSS vars, flip with `.dark`): `paper`/`paper-deep` (bg), `ink`/`ink-soft` (text), new `surface` token (replaces ~11 `bg-cream` panel usages — cards, modal, filter chips, search input, etc.), `barn`/`barn-deep`/`brass`/`sage` (accents, brightened for dark), `hairline` (borders).
  - **Fixed** (same value always): `cream` (unchanged, already was a plain literal) and a new `midnight` token (`#2B2620` — literally today's light-mode `ink` value) for the photo-chip/tooltip/scrim/footer group, repointed from `bg-ink`/`text-paper` to `bg-midnight`/`text-cream`.
  - **Literal, decoupled from tokens entirely**: the 3 status-tag colors (available/pending/sold), since they're semantic and conventionally shouldn't shift with theme — previously piggybacked on `sage`/`brass`/`ink-soft`, which would've broken specifically for "sold" once `ink-soft` started brightening for dark-mode text contrast.
  - Net effect: badges, tooltip, status tags, and the footer band render **pixel-identical** to the current shipped site in both themes; only page backgrounds, card surfaces, body text, and accent colors actually change.
- Implemented via `tailwind.config.js` (`darkMode: 'class'`, colors converted to `rgb(var(--color-x) / <alpha-value>)`) + a `:root`/`.dark` CSS variable block added to `src/input.css`. `initThemeToggle()` added to `js/app.js` (toggles the `dark` class, persists to `localStorage`, updates the button's icon/label/aria state). Each of the 3 HTML pages got a tiny inline anti-flash script in `<head>` (reads `localStorage` before first paint, so there's no flash of light-then-dark) and the toggle button itself, added to the nav inside a new `.nav-actions` wrapper (alongside the existing mobile hamburger).
- Mobile-responsive gaps closed: most layout was already responsive (grid `auto-fit`, existing nav/contact-grid breakpoints), so this was a gap-filling pass — bumped several touch targets that were 30–36px up to 44px (`.modal-close`, `.modal-photo-nav`, `.carousel-pause`, `.carousel-arrow`), made the modal go full-bleed under 480px instead of a cramped floating card, and trimmed the carousel photo height / hero / section padding at that same breakpoint.
- Verified: `npm run build` compiles cleanly; read back the compiled `css/style.css` and confirmed the `.dark` variable block, the renamed `surface`/`midnight` rules, and the literal status-tag hex all made it through correctly; all 3 pages still serve 200; no duplicate HTML ids introduced by the nav restructure.

**Decided:**
- Default theme: always light for first-time visitors (owner's call, to avoid confusing a less tech-savvy visitor whose device happens to be in dark mode without their realizing it).
- Toggle style: icon + text label, not icon-only.
- The footer band and photo-overlay chips (lot badges, tooltip, carousel pause, modal scrim) intentionally do **not** change appearance between light and dark mode — this was a design call made this session while working through the token architecture, not something the owner was explicitly asked about. Worth flagging back to them if it ever looks like an inconsistency rather than a choice.

**Open / next steps:**
- No visual/browser verification was possible in this environment (no browser tool available) — owner should click the toggle and resize to phone width in an actual browser and flag anything that looks off before considering this fully done.
- Aesthetic exploration (palette/fonts) and the item-card decision both remain on hold, as before — this session's work was scoped to not touch either.

## 2026-07-18 — Repo consolidation, GitHub+GitLab, card review, aesthetic reconsideration
**Did:**
- Consolidated the Tailwind-build files (delivered earlier to `Downloads/files 3`) into the actual working repo, restructured into `js/`, `src/`, `css/`, `images/` per the file map in `SESSION_HANDOFF.md`. Removed a stale pre-Tailwind copy that had been sitting in a `Landing_Page/` folder.
- Verified from scratch: valid JSON, clean JS syntax, clean `npm run build`, all pages/assets serving 200 locally.
- Committed and pushed to `github.com/clanielh/Family-Farm-Selling-Site` (first commit — repo was previously initialized but empty).
- Discovered a second, non-empty remote at `gitlab.com/clanielh/family-farm-selling-site` with its own unrelated history (a GitLab-generated README plus bot commits enabling SAST and Secret Detection via `.gitlab-ci.yml`). Merged histories with `--allow-unrelated-histories` (kept the real project README, kept the `.gitlab-ci.yml` security scanning config) and pushed the merged history to both remotes so they now match.
- Owner made manual edits: location copy changed Iola → Fredonia; added `Crafts` to `items.json`'s category list (stakeholder feedback, no items tagged yet); added `Crafts` to the footer category links on `index.html`/`items.html`. Caught and fixed two side-effects of those edits: `items.html`'s footer had lost its `©` character, and `contact.html`'s footer categories list hadn't been updated to match.
- Per owner request: removed the "no accounts, no tracking" line from the `index.html`/`items.html` footers entirely and left it living only on `contact.html` (already reinforced there by an FAQ answer) — avoids repeating a disclaimer on every page footer.
- Per owner request (this site is personal/local, not a business): removed the `©` symbol from all three footers, keeping just the year + site name.
- Built and published a side-by-side visual comparison of the 4 item-card concepts (Ledger Row / Catalog Card / Tag Card / Spec Sheet Card) as a Claude Artifact, using the site's real Tailwind color tokens, actual embedded Zilla Slab/Work Sans/IBM Plex Mono fonts, and 3 real listings from `items.json`. Annotated each with a tradeoff for an older, less tech-savvy, rural SE Kansas audience, plus a comparison table and one labeled recommendation (Spec Sheet Card, as the option that leaves nothing to be inferred from color/icon alone). Framed explicitly as a *recreation* of the 4 named concepts, since the original `item-card-options.html` comparison file was never actually delivered into this repo — only ever lived in claude.ai Project Knowledge.
- Drafted a structured Figma AI generation prompt (design tokens + audience constraints + real data fields + "don't just repeat the 4 already-explored concepts") for the owner to run independently and bring results back to share.

**Decided:**
- Card visual style: **on hold**, pending feedback from the owner's peers/stakeholders across all 4 options (not narrowed early to owner's personal favorites of Ledger Row and Tag Card, precisely so other options stay in play for that feedback round).
- Repo convention going forward: push to both GitHub and GitLab remotes.
- Footer copy: no `©` anywhere (personal site, not a business); privacy/no-tracking note consolidated onto `contact.html` only.

**Open / next steps:**
- Owner is weighing whether to also explore alternate color palette/font pairings (not just card layout) once stakeholder card feedback comes in. Not yet decided whether to generate options for this — reasoning surfaced this session: doing it *now*, in parallel with the card-layout feedback round, risks confounding feedback (stakeholders reacting to color/font changes and card-shape changes at once, making it hard to tell which reaction is about which). Leaning toward sequencing it — finish the card-layout feedback round first, then treat aesthetic exploration as its own separate round once a card direction (or a hybrid) is chosen. Not yet actioned either way — waiting on owner's call.
- Waiting on: stakeholder/peer feedback on the 4 card options; Figma AI output if the owner runs the drafted prompt; Cloudflare Pages deploy still not done; real photos still not sourced.

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
