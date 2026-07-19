# SESSION HANDOFF — read this first

Written by Claude (claude.ai) at the end of a planning/build session, for
Claude Code to pick up from inside VS Code. This file is the bridge between
the two — there's no automatic way to import the claude.ai chat itself, so
everything that matters has been written down here and in `context.md` /
`memory.md`.

## What this project is

A static site advertising items from a household estate sale ahead of a
Kansas auction, for sharing on Facebook Marketplace, Nextdoor, and OfferUp.
No login, no backend, no stored visitor data, no checkout — photos and
descriptions only.

## Current state: fully built and verified working

All of the following has been checked this session, from a clean state:
- `items.json` — valid JSON, 18 items across all 5 categories
- `js/app.js` — no syntax errors
- Tailwind build (`npm run build`) — runs clean, produces `css/style.css`
- All custom component classes (`.item-card`, `.accordion-*`, `.tooltip-*`,
  `.skeleton-*`, `.search-field`, `.modal-*`, etc.) confirmed present in the
  compiled CSS output
- All three pages (`index.html`, `items.html`, `contact.html`) serve 200 via
  a local static server, no duplicate HTML ids

**This is a real, working state — not a rough draft.** Treat the existing
structure, class names, and data schema as established conventions to build
on, not to redesign from scratch, unless the user asks for that.

## First thing to do

```bash
npm install
npm run dev     # watches src/input.css, rebuilds css/style.css on save
```

In a second terminal, to actually view it:
```bash
python3 -m http.server 8000
```
then open `http://localhost:8000`. Opening `index.html` directly by
double-click will NOT work — browsers block `items.json` from loading over
`file://`. This is expected, not a bug.

## Stack

Static HTML/CSS/JS, no framework, no server. Styling is a **full Tailwind
CSS build** (chosen deliberately by the user over the simpler CDN option,
accepting the Node/build-step tradeoff). Source of truth for styles is
`src/input.css` — `css/style.css` is generated output, never hand-edit it.

## File map

```
index.html, items.html, contact.html   The three pages
js/app.js                               All behavior — carousel, search,
                                         modal, accordion, tooltips, skeleton
                                         loading, nav scroll shadow
items.json                              All item data — the schema is
                                         established, don't invent a
                                         parallel structure for new fields;
                                         propose additions instead
src/input.css                           Tailwind source — EDIT THIS
css/style.css                           Tailwind output — generated, don't
                                         hand-edit, gets overwritten
tailwind.config.js                      Design tokens (colors/fonts) as
                                         first-class Tailwind theme values
images/                                 Empty — real photos go here later
context.md, memory.md                   Full decision history and session
                                         log — read these for "why", this
                                         file is the "what's next"
README.md                               Setup/workflow instructions for a
                                         non-technical maintainer
```

## Known gotcha already handled — don't reintroduce it

Tailwind's content-based purge will silently strip **any** class not found
as literal text somewhere in the scanned HTML/JS files — including our own
hand-authored `@layer components` classes, not just utility classes. This
bit us once already (skeleton/tooltip/accordion classes vanished from the
build with zero error output). Fixed via a `safelist` pattern in
`tailwind.config.js` covering all our component class prefixes. **If you add
a new component class, either use it somewhere in HTML/JS right away, or
extend the safelist pattern** — otherwise it'll compile away silently and
the failure mode looks like "my CSS just isn't applying" with no error.

## Decisions that are locked in — don't relitigate

- No backend, no login, no stored user data, no checkout (hard constraint
  from the original project brief)
- Data schema in `items.json` (see `context.md` for the full field list)
- Stack: static + Tailwind build, no framework
- Design tokens (colors, fonts) — confirmed final

## Decisions still genuinely open — safe to help move forward

- **Item card visual style** — currently a simple functional card. Four
  alternative layouts exist in `item-card-options.html` (not in this repo —
  it's a separate reference file in the user's Project Knowledge on
  claude.ai) — user has intentionally deferred picking one.
- **Hosting/deployment** — recommendation is Cloudflare Pages connected to a
  GitHub repo, not yet actually deployed. Confirmed settings: Framework
  preset `None`, Build command `npm run build`, Build output directory `/`.
  A `.node-version` file (set to `22`) is already in the repo to avoid
  Cloudflare defaulting to an old Node version. `node_modules`/`.git` are
  auto-excluded from Cloudflare's deploy regardless of `.gitignore`.
- **Real photos/videos** — `items.json` photo paths point to files that
  don't exist yet; the site gracefully shows a placeholder until they do.
- **Marketplace/Nextdoor/OfferUp listing links** — placeholder block exists
  on `contact.html`; a `listings` field per item in `items.json` has been
  proposed but not added.
- **SEO pass on item descriptions** — not started at all.

## Suggested immediate next step

Get this into git and deployed:
1. VS Code Source Control panel → Initialize Repository → Publish to GitHub
2. Cloudflare dashboard → Workers & Pages → Create → Connect to Git → use
   the settings listed above
3. Confirm the live `*.pages.dev` URL actually renders correctly (the local
   smoke test passed, but a real deploy is the real test)

After that, real photos and the item-card visual decision are probably the
highest-value next steps before this goes out on Marketplace/Nextdoor/OfferUp.
