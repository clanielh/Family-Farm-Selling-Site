# Kansas Estate Sale — site

Static HTML, no backend, styled with Tailwind CSS (compiled at build time —
there's nothing to run on a server, ever, once deployed).

For the fuller design history and decisions behind this project (why things
look the way they do, options that were considered and set aside), see the
**[GitLab wiki](https://gitlab.com/clanielh/family-farm-selling-site/-/wikis/home)**.
This README stays focused on "how do I run/edit this."

## Files

```
index.html         Landing page — hero + featured carousel + category tiles
items.html          Full browseable grid — search, category filter, detail popup
contact.html        Email/phone + FAQ accordion — no form, nothing stored
items.json          All item data — this is the file you'll edit most often
js/app.js           All behavior (carousel, search/filter, popup, accordion, theme toggle)
images/             Put your photo files in here

src/input.css       Tailwind SOURCE file — edit THIS to change styles
css/style.css       Tailwind OUTPUT — generated, don't hand-edit, gets overwritten
tailwind.config.js  Design tokens (colors, fonts) live here
package.json        npm scripts (dev/build)
```

## One-time setup (needs Node.js installed)

```
npm install
```

## While making style changes

```
npm run dev
```

This watches `src/input.css` and rebuilds `css/style.css` automatically every
time you save. Leave it running in a terminal while you work in VS Code, and
preview with a local server (below) in your browser.

## Before deploying

```
npm run build
```

Produces a minified `css/style.css`. If you're on Cloudflare Pages or Netlify
connected to your GitHub repo, this happens automatically on every push — you
never have to run it yourself once deployed (build command: `npm run build`,
output already goes to `css/`, so no separate output directory setting is
needed).

## Adding or editing an item

Open `items.json`. Copy one item block, paste it as a new entry, change the
values. Field names must stay exactly as they are — the site reads them by
name.

```json
{
  "id": "019",
  "lot": "H-18",
  "title": "Your Item Title",
  "category": "Household",
  "status": "available",
  "shortDescription": "One sentence, shows on cards and the carousel.",
  "description": "Longer paragraph, shows in the detail popup.",
  "notes": "Condition notes, flaws, anything a buyer should know.",
  "dimensions": "12\" W x 12\" D x 12\" H",
  "condition": "Good",
  "price": "Starting bid $10",
  "photos": ["images/019-yourphoto-1.jpg", "images/019-yourphoto-2.jpg"],
  "tags": ["example", "tag"]
}
```

- `category` must exactly match one of the six in the `categories` list at
  the top of the file (Antiques, Household, Crafts, Farm, Construction &
  Tools, Machinery), or it won't show up under that filter.
- `status` must be `available`, `pending`, or `sold`.
- The `price` field is one plain string — the item card automatically splits
  it at the `$` into a small label and a big value (e.g. `"Starting bid $45"`
  → label "Starting bid", value "$45"), so keep the `$` in there.
- If you don't have photos yet, leave `photos` as `[]` — shows a "photo
  coming soon" placeholder instead of a broken image.
- No need to touch HTML/CSS/JS to add items — everything on the site is
  generated from this one file.

## Previewing on your own computer

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`. Double-clicking `index.html` directly
won't work — browsers block `items.json` from loading over the `file://`
protocol. Once deployed, this is a non-issue.

**If you restart the server and a change doesn't seem to show up**, it's
almost always the browser serving a cached copy of `css/style.css`, not a
real problem — do a hard refresh (Ctrl+Shift+R) or open a private/incognito
window before assuming something's broken. Also worth double-checking you're
on the page the change actually applies to — e.g. the item card redesign
only lives on `items.html`, not the homepage carousel.

## Design system

Colors/fonts are Tailwind theme tokens in `tailwind.config.js`, with the
actual values defined as CSS variables in `src/input.css` (`:root` = light,
`.dark` = dark — see **Dark/light mode** below):

- `paper` / `paper-deep` — page background (flips with theme)
- `ink` / `ink-soft` — text (flips with theme)
- `surface` — card/panel background (flips with theme)
- `barn` / `barn-deep` — primary accent, brightened in dark mode
- `brass`, `sage` — secondary accents, brightened in dark mode
- `hairline` — borders, adjusted in dark mode
- `cream` / `midnight` — **fixed**, same value in both themes. Used for
  self-contained chips that sit on photos (lot badges, tooltip, carousel
  pause button) and the footer band — those are deliberately not supposed to
  change appearance between light and dark mode.
- Status tag colors (available/pending/sold) are plain literal hex values,
  independent of the theme entirely — semantic status color shouldn't shift
  just because someone toggled dark mode.
- Fonts: `font-serif` (Zilla Slab, headings), `font-sans` (Work Sans, body),
  `font-mono` (IBM Plex Mono, lot numbers/labels)

Reusable component classes (`.item-card`, `.carousel`, `.modal-*`,
`.accordion-*`, etc.) are defined once in `src/input.css` under
`@layer components` — edit them there rather than adding one-off styles
scattered across the HTML.

## Dark / light mode

A toggle in the nav (🌙 Dark / ☀ Light — icon + text label, not icon-only)
lets visitors switch themes. Defaults to **light** for every first-time
visitor regardless of their device's own OS setting, and remembers their
choice in `localStorage`. Implemented via Tailwind's `darkMode: 'class'` +
the CSS-variable token system described above, wired up in `initThemeToggle()`
in `js/app.js`. Each HTML page has a small inline script in `<head>` that
applies the saved theme before first paint, so there's no flash of the wrong
theme on load.

## Mobile

Most of the layout is responsive via CSS Grid (`items-grid`, `cat-grid`,
`footer-grid` all reflow automatically). On top of that: touch targets on
the modal close/photo-nav buttons and carousel controls are 44px minimum,
and the modal goes full-bleed (no rounded corners or side padding) under
480px width instead of floating as a cramped card.

## Item card design

The item card on `items.html` ("Giant Inventory Tag") is a deliberate
physical-shipping-tag metaphor: a hole-punch circle, the lot number shown
huge and first, the photo inset mid-card, and price/status/action stacked
in a footer band. Sharp, un-rounded corners are intentional — part of the
tag identity — even though the rest of the site uses softer rounded
corners. See the wiki for the earlier options that were considered before
landing on this one.

## Repository

This project pushes to **two** remotes — keep both in sync when committing:

```
origin  → https://github.com/clanielh/Family-Farm-Selling-Site.git
gitlab  → https://gitlab.com/clanielh/family-farm-selling-site.git
```

```
git push origin main
git push gitlab main
```

## Still open (per project roadmap)

- **Hosting** — recommended: Cloudflare Pages, connected to the GitHub repo
  (free, unlimited bandwidth, automatic HTTPS, strongest DDoS/edge
  protection of the free options). Netlify is the easier drag-and-drop
  alternative if you'd rather skip git entirely. Not yet actually deployed.
- **Real photos/videos** — swap placeholder `photos` arrays for real files.
  Worth a second look at whether any photo filter/treatment is wanted once
  real photos are in (the Figma card concept originally included a sepia
  filter; it was left off so real item photos show true color/condition).
- **Marketplace / Nextdoor / OfferUp links** — placeholder spot on
  `contact.html`; once live, consider adding a `listings` field to each item.
- **SEO pass on descriptions** — not started.
- **Overall aesthetic (palette/fonts)** — current look is intentionally on
  hold pending feedback, separate from the item-card decision above.
