/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  // Our own hand-authored @layer components classes (defined in src/input.css)
  // are text-scanned like any other class. Safelisting them by prefix means
  // they always compile in, even if a class is momentarily unused in HTML/JS.
  safelist: [
    { pattern: /^(site-header|nav-|main-nav|brand|btn|hero|section-|carousel|slide-|status-|photo-ph|lot-badge|cat-tile|cat-grid|cat-name|cat-count|site-footer|footer-|filter-|search-field|items-grid|item-card|skeleton-|empty-state|has-tooltip|tooltip-|accordion-|modal-|contact-|platform-note|about-block|wrap|visually-hidden|is-scrolled)/ },
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F3EFE4', deep: '#EAE3D2' },
        ink: { DEFAULT: '#2B2620', soft: '#5C5548' },
        barn: { DEFAULT: '#8C2F1B', deep: '#6E2414' },
        brass: '#A98338',
        sage: '#6B7A5E',
        hairline: '#C9C0AC',
        cream: '#FFFDF9',
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
