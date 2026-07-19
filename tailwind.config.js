/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.html", "./js/**/*.js"],
  // Our own hand-authored @layer components classes (defined in src/input.css)
  // are text-scanned like any other class. Safelisting them by prefix means
  // they always compile in, even if a class is momentarily unused in HTML/JS.
  safelist: [
    { pattern: /^(site-header|nav-|main-nav|brand|btn|hero|section-|carousel|slide-|status-|photo-ph|lot-badge|cat-tile|cat-grid|cat-name|cat-count|site-footer|footer-|filter-|search-field|items-grid|item-card|skeleton-|empty-state|has-tooltip|tooltip-|accordion-|modal-|contact-|platform-note|about-block|wrap|visually-hidden|is-scrolled|theme-toggle)/ },
  ],
  theme: {
    extend: {
      colors: {
        // Reactive tokens: page chrome (bg/text/borders/accents). Values live as
        // CSS variables in src/input.css (:root = light, .dark = dark) so every
        // existing `@apply bg-paper text-ink ...` usage flips automatically —
        // nothing else in this file needs to change per-usage.
        paper: { DEFAULT: 'rgb(var(--color-paper) / <alpha-value>)', deep: 'rgb(var(--color-paper-deep) / <alpha-value>)' },
        ink: { DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)', soft: 'rgb(var(--color-ink-soft) / <alpha-value>)' },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        barn: { DEFAULT: 'rgb(var(--color-barn) / <alpha-value>)', deep: 'rgb(var(--color-barn-deep) / <alpha-value>)' },
        brass: 'rgb(var(--color-brass) / <alpha-value>)',
        sage: 'rgb(var(--color-sage) / <alpha-value>)',
        hairline: 'rgb(var(--color-hairline) / <alpha-value>)',
        // Fixed tokens: same value in both themes. `cream`/`midnight` are the
        // light-text/dark-chip pair used by badges, tooltips, the scrim, and
        // the footer band — those are self-contained and deliberately don't
        // follow the page theme (see src/input.css for the reasoning).
        cream: '#FFFDF9',
        midnight: '#2B2620',
      },
      fontFamily: {
        serif: ['"Zilla Slab"', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
      maxWidth: {
        site: '1180px',
      },
      transitionDuration: {
        150: '150ms',
      },
    },
  },
  plugins: [],
}
