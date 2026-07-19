# Kansas Estate Sale — site

Static HTML, no backend, styled with Tailwind CSS (compiled at build time —
there's nothing to run on a server, ever).

## Files

```
index.html         Landing page — hero + featured carousel + category tiles
items.html          Full browseable grid — search, category filter, detail popup
contact.html         Email/phone + FAQ accordion — no form, nothing stored
items.json           All item data — this is the file you'll edit most often
js/app.js            All behavior (carousel, search/filter, popup, accordion)
images/               Put your photo files in here

src/input.css         Tailwind SOURCE file — edit THIS to change styles
css/style.css          Tailwind OUTPUT — generated, don't hand-edit, gets overwritten
tailwind.config.js     Design tokens (colors, fonts) live here
package.json            npm scripts (dev/build)
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

- `category` must exactly match one of the five in the `categories` list at
  the top of the file, or it won't show up under that filter.
- `status` must be `available`, `pending`, or `sold`.
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

## Design system

All colors/fonts/spacing are Tailwind theme tokens in `tailwind.config.js`:

- `paper` / `paper-deep` — background
- `ink` / `ink-soft` — text
- `barn` / `barn-deep` — primary accent (buttons, links)
- `brass`, `sage` — secondary accents (status tags, category headers)
- `hairline` — borders
- `cream` — card/surface background
- Fonts: `font-serif` (Zilla Slab, headings), `font-sans` (Work Sans, body),
  `font-mono` (IBM Plex Mono, lot numbers/labels)

Reusable component classes (`.item-card`, `.carousel`, `.modal-*`,
`.accordion-*`, etc.) are defined once in `src/input.css` under
`@layer components` — edit them there rather than adding one-off styles
scattered across the HTML.

## Still open (per project roadmap)

- **Hosting** — recommended: Cloudflare Pages, connected to a GitHub repo
  (free, unlimited bandwidth, automatic HTTPS, strongest DDoS/edge
  protection of the free options). Netlify is the easier drag-and-drop
  alternative if you'd rather skip git entirely.
- **Real photos/videos** — swap placeholder `photos` arrays for real files.
- **Item card visual style** — still simple/functional by design; the four
  options in `item-card-options.html` remain on the table.
- **Marketplace / Nextdoor / OfferUp links** — placeholder spot on
  `contact.html`; once live, consider adding a `listings` field to each item.
- **SEO pass on descriptions** — not started.
