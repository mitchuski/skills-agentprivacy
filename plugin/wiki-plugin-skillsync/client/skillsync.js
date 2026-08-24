/* wiki-plugin-skillsync 0.1.0 — a live panel over a skillsync catalog.
 *
 * Item text is simple key: value lines (all optional):
 *   catalog: /assets/skillsync/catalog.json     source catalog (same-site path or full URL)
 *   member: mitch                               label for the panel
 *   days: 7                                     "recent" window
 *   limit: 8                                    max rows shown
 *
 * Renders: packet count + harvest date, the packets published inside the window,
 * and highlights anything NEW since this browser last looked (localStorage seen-set).
 * Clicking a row follows the skill's wiki page (bare titles via page-titles.json).
 */
(() => {
  const DEFAULTS = { catalog: '/assets/skillsync/catalog.json', member: '', days: 7, limit: 8 };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const parse = text => {
    const cfg = { ...DEFAULTS };
    for (const line of String(text || '').split('\n')) {
      const m = line.match(/^\s*(catalog|member|days|limit)\s*:\s*(.+)$/);
      if (m) cfg[m[1]] = m[1] === 'days' || m[1] === 'limit' ? parseInt(m[2], 10) : m[2].trim();
    }
    return cfg;
  };

  const storeKey = cfg => 'skillsync-seen:' + cfg.catalog;
  const seenSet = cfg => {
    try { return new Set(JSON.parse(localStorage.getItem(storeKey(cfg)) || '[]')); } catch (e) { return new Set(); }
  };
  const remember = (cfg, names) => {
    try { localStorage.setItem(storeKey(cfg), JSON.stringify(names.slice(0, 2000))); } catch (e) { /* private window etc. */ }
  };

  const render = (cfg, cat, seen, titles) => {
    if (!cat) return '<div class="skillsync-panel skillsync-err">catalog unreachable: <code>' + esc(cfg.catalog) + '</code></div>';
    const now = Date.now();
    const winMs = (cfg.days || 7) * 864e5;
    const rows = (cat.packets || []).map(p => ({
      name: p.name, title: p.title || p.name, emoji: p.emoji || '', kind: p.kind || 'skill',
      card: p.card || '', when: Date.parse(p.published || 0) || 0
    })).sort((a, b) => b.when - a.when);
    const fresh = rows.filter(r => now - r.when < winMs);
    const unseen = rows.filter(r => !seen.has(r.name));
    const show = (fresh.length ? fresh : rows).slice(0, cfg.limit || 8);
    const head = '<div class="skillsync-head">\u{1F4E1} <b>' + esc(cfg.member || cat.member || 'skill sync') + '</b> — ' +
      (cat.count || rows.length) + ' packets · harvested ' + esc((cat.updated || '').slice(0, 10)) +
      (unseen.length && seen.size ? ' · <span class="skillsync-new">' + unseen.length + ' new since your last visit</span>' : '') + '</div>';
    const list = show.map(r =>
      '<div class="skillsync-row' + (seen.size && !seen.has(r.name) ? ' skillsync-unseen' : '') + '" data-link="' + esc((titles && titles[r.name]) || r.title) + '">' +
      '<span class="skillsync-emoji">' + esc(r.emoji) + '</span> <b>' + esc(r.title) + '</b> <i>' + esc(r.kind) + '</i>' +
      '<div class="skillsync-card">' + esc(r.card.slice(0, 140)) + '</div></div>').join('');
    const foot = '<div class="skillsync-foot">' + (fresh.length ? fresh.length + ' published in the last ' + cfg.days + ' days' : 'nothing in the ' + cfg.days + '-day window — showing newest') + '</div>';
    return '<div class="skillsync-panel">' + head + list + foot + '</div>';
  };

  const CSS = '.skillsync-panel{font-size:13px;border:1px solid #ddd;border-radius:6px;padding:8px;background:#fafafa}' +
    '.skillsync-head{margin-bottom:6px}.skillsync-new{color:#a40;font-weight:bold}' +
    '.skillsync-row{padding:4px 6px;border-radius:4px;cursor:pointer}.skillsync-row:hover{background:#eee}' +
    '.skillsync-unseen{background:#fff7e0}.skillsync-card{color:#666;font-size:12px}' +
    '.skillsync-foot{margin-top:6px;color:#888;font-size:11px}.skillsync-err{color:#a00}';

  const emit = ($item, item) => {
    if (!document.getElementById('skillsync-style')) {
      const st = document.createElement('style'); st.id = 'skillsync-style'; st.textContent = CSS;
      document.head.appendChild(st);
    }
    const cfg = parse(item.text);
    $item.html('<div class="skillsync-panel">\u{1F4E1} loading ' + esc(cfg.catalog) + ' …</div>');
    // page-titles.json (published by the shelf builder, beside the catalog) maps
    // packet name -> its wiki page title, bare-titled with collision exceptions
    const titlesUrl = cfg.catalog.replace(/catalog(-full)?\.json$/, 'page-titles.json');
    Promise.all([
      fetch(cfg.catalog, { credentials: 'same-origin' }).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(titlesUrl, { credentials: 'same-origin' }).then(r => (r.ok ? r.json() : null)).catch(() => null)
    ]).then(([cat, titles]) => {
      const seen = seenSet(cfg);
      $item.html(render(cfg, cat, seen, titles));
      if (cat && cat.packets) remember(cfg, cat.packets.map(p => p.name));
    });
  };

  const bind = ($item, item) => {
    $item.on('click', '.skillsync-row', e => {
      const link = $(e.currentTarget).data('link');
      if (link && window.wiki) wiki.doInternalLink(link, $item.parents('.page'));
    });
    $item.dblclick(() => window.wiki && wiki.textEditor($item, item));
  };

  if (typeof window !== 'undefined') window.plugins.skillsync = { emit, bind };
  if (typeof module !== 'undefined') module.exports = { parse, render };
})();
