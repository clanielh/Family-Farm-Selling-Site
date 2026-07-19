/* ============================================================
   Kansas Estate Sale — shared site script
   No build step. Runs on every page; each function only does
   something if its page has the matching element on it.
   ============================================================ */

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- tiny helpers ---------- */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function statusLabel(status) {
  return { available: 'Available', pending: 'Pending', sold: 'Sold' }[status] || status;
}

// If a photo file doesn't exist yet (no real photos uploaded), fall back
// to the plaid placeholder instead of showing a broken image icon.
function photoBlock(photoPath, altText, badgeHtml) {
  const wrap = el('div', 'photo-ph');
  if (badgeHtml) wrap.innerHTML = badgeHtml;
  if (photoPath) {
    const img = new Image();
    img.src = photoPath;
    img.alt = altText || '';
    img.loading = 'lazy';
    img.onerror = () => img.remove();
    img.onload = () => {
      const label = wrap.querySelector('.placeholder-label');
      if (label) label.remove();
    };
    wrap.appendChild(img);
  }
  const label = el('span', 'placeholder-label', 'photo coming soon');
  wrap.appendChild(label);
  return wrap;
}

function skeletonCard() {
  const card = el('div', 'skeleton-card');
  card.appendChild(el('div', 'skeleton-photo'));
  const lines = el('div', 'skeleton-lines');
  lines.append(el('div', 'skeleton-line w-1/3'), el('div', 'skeleton-line w-4/5'), el('div', 'skeleton-line w-2/5'));
  card.appendChild(lines);
  return card;
}

function renderSkeletons(container, count) {
  container.innerHTML = '';
  container.setAttribute('aria-busy', 'true');
  for (let i = 0; i < count; i++) container.appendChild(skeletonCard());
}

async function loadItems() {
  const res = await fetch('items.json');
  if (!res.ok) throw new Error('Could not load items.json');
  const data = await res.json();
  return data;
}

/* ---------- header / footer behaviour on every page ---------- */

function initChrome() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  initThemeToggle();
}

/* ---------- light/dark toggle (every page) ----------
   Defaults to light for every first-time visitor, regardless of the
   device's own dark-mode setting — only a visit where someone has
   actually clicked the toggle before switches it. The <html> class is
   also set by a tiny inline script in <head> (before this file loads)
   so there's no flash of light-then-dark on page load. */

const THEME_KEY = 'theme';

function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const icon = btn.querySelector('.icon');
  const label = btn.querySelector('.label');

  function render(isDark) {
    icon.textContent = isDark ? '☀' : '🌙';
    label.textContent = isDark ? 'Light' : 'Dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  render(document.documentElement.classList.contains('dark'));

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) { /* private browsing, etc. — theme just won't persist */ }
    render(isDark);
  });
}

/* ---------- accordion (contact.html FAQ) ---------- */

function initAccordion() {
  document.querySelectorAll('[data-accordion] .accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('open', !isOpen);
    });
  });
}

/* ---------- carousel (index.html) ---------- */

function initCarousel(items) {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const featured = items.filter(i => i.status !== 'sold').slice(0, 6);
  if (featured.length === 0) {
    root.replaceWith(el('p', 'empty-state', 'New items are being added soon — check back shortly.'));
    return;
  }

  const track = root.querySelector('.carousel-track');
  track.innerHTML = '';
  track.style.transform = '';
  const dotsWrap = root.querySelector('.carousel-dots');
  let index = 0;
  let timer = null;

  featured.forEach((item, i) => {
    const slide = el('div', 'carousel-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${featured.length}: ${item.title}`);

    const photo = photoBlock(item.photos && item.photos[0], item.title,
      `<span class="lot-badge">LOT ${item.lot}</span>`);
    slide.appendChild(photo);

    const body = el('div', 'slide-body');
    body.innerHTML = `
      <span class="cat">${item.category}</span>
      <h3>${item.title}</h3>
      <p class="desc">${item.shortDescription}</p>
      <div class="slide-footer">
        <span class="price">${item.price}</span>
        <span class="status-tag status-${item.status}">${statusLabel(item.status)}</span>
      </div>
      <div><a class="btn btn-secondary" href="items.html?item=${encodeURIComponent(item.id)}">View details</a></div>
    `;
    slide.appendChild(body);
    track.appendChild(slide);

    const dot = el('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(i) {
    index = (i + featured.length) % featured.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    [...dotsWrap.children].forEach((d, di) => d.setAttribute('aria-current', String(di === index)));
  }

  root.querySelector('.carousel-arrow.prev').addEventListener('click', () => { goTo(index - 1); restart(); });
  root.querySelector('.carousel-arrow.next').addEventListener('click', () => { goTo(index + 1); restart(); });

  const pauseBtn = root.querySelector('.carousel-pause');
  let playing = !PREFERS_REDUCED_MOTION && featured.length > 1;

  function start() {
    if (!playing) return;
    timer = setInterval(() => goTo(index + 1), 5000);
  }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  pauseBtn.addEventListener('click', () => {
    playing = !playing;
    pauseBtn.textContent = playing ? '⏸' : '▶';
    pauseBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    playing ? start() : stop();
  });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  // basic swipe support
  let touchX = null;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    touchX = null;
    restart();
  });

  pauseBtn.textContent = playing ? '⏸' : '▶';
  pauseBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  goTo(0);
  start();
}

/* ---------- category tiles (index.html) ---------- */

function initCategoryTiles(items, categories) {
  const root = document.querySelector('[data-category-tiles]');
  if (!root) return;
  categories.forEach(cat => {
    const count = items.filter(i => i.category === cat).length;
    const tile = el('a', 'cat-tile');
    tile.href = `items.html?category=${encodeURIComponent(cat)}`;
    tile.innerHTML = `<div class="cat-name">${cat}</div><div class="cat-count">${count} item${count === 1 ? '' : 's'}</div>`;
    root.appendChild(tile);
  });
}

/* ---------- items grid + filters + modal (items.html) ---------- */

function initItemsPage(items, categories) {
  const grid = document.querySelector('[data-items-grid]');
  if (!grid) return;

  const filterBar = document.querySelector('[data-filter-bar]');
  const searchInput = document.querySelector('[data-search-input]');
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'All';
  let query = '';

  function buildChips() {
    filterBar.innerHTML = '';
    ['All', ...categories].forEach(cat => {
      const chip = el('button', 'filter-chip', cat);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', String(cat === activeCategory));
      chip.addEventListener('click', () => {
        activeCategory = cat;
        buildChips();
        renderGrid();
      });
      filterBar.appendChild(chip);
    });
  }

  function matchesQuery(item, q) {
    if (!q) return true;
    const haystack = [item.title, item.shortDescription, item.category, ...(item.tags || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  }

  function renderGrid() {
    grid.innerHTML = '';
    grid.removeAttribute('aria-busy');
    const q = query.trim().toLowerCase();
    const filtered = items.filter(i =>
      (activeCategory === 'All' || i.category === activeCategory) && matchesQuery(i, q)
    );
    if (filtered.length === 0) {
      const msg = q
        ? `No items match "${query.trim()}"${activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}.`
        : `No items in "${activeCategory}" right now — check another category.`;
      grid.appendChild(el('p', 'empty-state', msg));
      return;
    }
    filtered.forEach(item => grid.appendChild(buildCard(item)));
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      const value = e.target.value;
      debounceTimer = setTimeout(() => { query = value; renderGrid(); }, 150);
    });
  }

  // item.price is one string like "Starting bid $45" or "Starting bid $60 for
  // the pair" — split it into a small label and a big value for the tag's
  // price row, rather than adding a separate field to items.json.
  function splitPrice(price) {
    const i = price.indexOf('$');
    if (i === -1) return { label: '', value: price };
    return { label: price.slice(0, i).trim(), value: price.slice(i).trim() };
  }

  function buildCard(item) {
    const card = el('button', 'item-card');
    card.type = 'button';
    card.setAttribute('aria-haspopup', 'dialog');

    card.appendChild(el('div', 'tag-punch', '<span></span>'));

    card.appendChild(el('div', 'tag-header', `
      <span class="cat">${item.category}</span>
      <span class="lot">LOT ${item.lot}</span>
    `));

    card.appendChild(el('div', 'tag-details', `
      <p class="title">${item.title}</p>
      <p class="desc">${item.shortDescription}</p>
    `));

    const photoWrap = el('div', 'tag-photo');
    photoWrap.appendChild(photoBlock(item.photos && item.photos[0], item.title));
    card.appendChild(photoWrap);

    const { label, value } = splitPrice(item.price);
    const footer = el('div', 'tag-footer');
    footer.innerHTML = `
      <div class="tag-price-row">
        <span class="price-label">${label}</span>
        <span class="price-value">${value}</span>
      </div>
      <div class="tag-actions">
        <span class="status-tag status-${item.status}">${statusLabel(item.status)}</span>
        <span class="btn-view">View details</span>
      </div>
    `;
    card.appendChild(footer);

    card.addEventListener('click', () => openModal(item, card));
    return card;
  }

  buildChips();
  renderGrid();

  // deep link: ?item=ID opens the modal directly (used by carousel "View details")
  const wantedId = params.get('item');
  if (wantedId) {
    const found = items.find(i => i.id === wantedId);
    if (found) openModal(found, null);
  }
}

/* ---------- modal (shared by items.html) ---------- */

let modalReturnFocus = null;

function openModal(item, triggerEl) {
  modalReturnFocus = triggerEl;
  const overlay = document.querySelector('[data-modal]');
  if (!overlay) return;

  let photoIndex = 0;
  const photos = (item.photos && item.photos.length) ? item.photos : [null];

  function renderPhoto() {
    const photoWrap = overlay.querySelector('.modal-photo');
    photoWrap.innerHTML = '';
    const p = photoBlock(photos[photoIndex], item.title, '');
    p.style.height = '100%';
    photoWrap.appendChild(p);
    if (photos.length > 1) {
      const prev = el('button', 'modal-photo-nav prev', '‹');
      prev.type = 'button'; prev.setAttribute('aria-label', 'Previous photo');
      prev.addEventListener('click', () => { photoIndex = (photoIndex - 1 + photos.length) % photos.length; renderPhoto(); });
      const next = el('button', 'modal-photo-nav next', '›');
      next.type = 'button'; next.setAttribute('aria-label', 'Next photo');
      next.addEventListener('click', () => { photoIndex = (photoIndex + 1) % photos.length; renderPhoto(); });
      const count = el('span', 'modal-photo-count', `${photoIndex + 1} / ${photos.length}`);
      photoWrap.append(prev, next, count);
    }
  }

  overlay.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-photo"></div>
      <button type="button" class="modal-close" aria-label="Close">✕</button>
      <div class="modal-body">
        <span class="cat">${item.category} · LOT ${item.lot}</span>
        <h2 id="modal-title">${item.title}</h2>
        <p class="desc">${item.description}</p>
        <dl class="modal-spec">
          <dt>Dimensions</dt><dd>${item.dimensions}</dd>
          <dt>Condition</dt><dd>${item.condition}</dd>
          <dt>Notes</dt><dd>${item.notes}</dd>
        </dl>
        <div class="modal-footer">
          <span class="price">${item.price}</span>
          <span class="status-tag status-${item.status}">${statusLabel(item.status)}</span>
        </div>
      </div>
    </div>
  `;
  renderPhoto();
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = overlay.querySelector('.modal-close');
  closeBtn.focus();
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', onModalKeydown);
}

function onModalKeydown(e) {
  if (e.key === 'Escape') closeModal();
}

function closeModal() {
  const overlay = document.querySelector('[data-modal]');
  if (!overlay) return;
  overlay.hidden = true;
  overlay.innerHTML = '';
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onModalKeydown);
  if (modalReturnFocus) modalReturnFocus.focus();
}

/* ---------- boot ---------- */

document.addEventListener('DOMContentLoaded', async () => {
  initChrome();
  initAccordion();
  const grid = document.querySelector('[data-items-grid]');
  const carousel = document.querySelector('[data-carousel]');
  const tiles = document.querySelector('[data-category-tiles]');
  if (!grid && !carousel && !tiles) return; // contact page etc. — nothing to load

  if (grid) renderSkeletons(grid, 6);
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    if (track) { track.appendChild(skeletonCard()); track.style.transform = 'none'; }
  }

  try {
    const data = await loadItems();
    initCarousel(data.items);
    initCategoryTiles(data.items, data.categories);
    initItemsPage(data.items, data.categories);
  } catch (err) {
    console.error(err);
    const target = grid || carousel;
    if (target) {
      target.innerHTML = '';
      target.appendChild(el('p', 'empty-state',
        'Items could not be loaded. If you\'re viewing this file directly on your computer, ' +
        'run it through a local server (or deploy it) — browsers block loading items.json from a plain file.'));
    }
  }
});
