/* wiki-plugin-starpath 0.1.0 — collect your walk through the skill space.
 *
 * A 'like'-shaped button: tap ⭐ on a skill's card page to add that skill to your
 * current path (ordered, per-browser, localStorage). The tray shows the path as it
 * forms; from there: visualise it on the star chart (#path=a,b,c) or seal it at the
 * Librarian as a constellation runtime (chain-sealed walk evidence).
 *
 * Item text (key: value lines):
 *   skill: <packet-name>       the skill this button collects (required on card pages)
 *   chart: /assets/site/star.html        where the visualise link points
 *   librarian: http://pi5:4242           where sealing posts (falls back if unreachable)
 *   tray: full | mini                    full = path list + actions (default mini)
 */
(() => {
  const KEY = 'starpath-current';
  const WHO = 'starpath-member';
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const parse = text => {
    const cfg = { skill: '', chart: '/assets/site/star.html', librarian: 'http://pi5:4242', tray: 'mini' };
    for (const line of String(text || '').split('\n')) {
      const m = line.match(/^\s*(skill|chart|librarian|tray)\s*:\s*(.+)$/);
      if (m) cfg[m[1]] = m[2].trim();
    }
    return cfg;
  };

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || { path: [] }; } catch (e) { return { path: [] }; } };
  const save = p => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} };
  const member = () => { try { return localStorage.getItem(WHO) || ''; } catch (e) { return ''; } };

  const CSS = '.starpath{font-size:13px;border:1px solid #d8d2c4;border-radius:6px;padding:.5rem .7rem;background:#fffdf8}' +
    '.sp-btn{font:inherit;border:1px solid #d8d2c4;border-radius:5px;background:#f7f4ee;padding:.25rem .7rem;cursor:pointer}' +
    '.sp-btn:hover{border-color:#9a7b2d}.sp-btn.on{border-color:#9a7b2d;color:#9a7b2d;font-weight:bold}' +
    '.sp-count{color:#8a8375;margin-left:.5rem}.sp-list{margin:.4rem 0;padding:0;list-style:none}' +
    '.sp-list li{padding:.12rem 0;border-bottom:1px dotted #e5dfd2}.sp-x{cursor:pointer;color:#a13a2f;margin-right:.4rem}' +
    '.sp-row{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.4rem}.sp-note{color:#8a8375;font-size:.8rem;margin-top:.3rem}' +
    '.sp-ok{color:#2d6a4f}';

  function render($item, cfg) {
    const st = load();
    const here = cfg.skill && st.path.some(e => e.skill === cfg.skill);
    const n = st.path.length;
    let html = '<div class="starpath">';
    if (cfg.skill) {
      html += '<button class="sp-btn sp-add' + (here ? ' on' : '') + '">' + (here ? '⭐ on your path' : '☆ add to star path') + '</button>' +
        '<span class="sp-count">' + n + ' star' + (n === 1 ? '' : 's') + ' collected</span>';
    } else {
      html += '<b>⭐ Your star path</b><span class="sp-count">' + n + ' star' + (n === 1 ? '' : 's') + '</span>';
    }
    if (cfg.tray === 'full' || !cfg.skill) {
      html += '<ol class="sp-list">' + st.path.map((e, i) =>
        '<li><span class="sp-x" data-i="' + i + '" title="remove">×</span>' + (i + 1) + '. ' + esc(e.skill) + '</li>').join('') + '</ol>';
    }
    html += '<div class="sp-row">' +
      (n >= 1 ? '<button class="sp-btn sp-view">✨ visualise on the chart</button>' : '') +
      (n >= 2 ? '<button class="sp-btn sp-seal">\u{1F4DA} seal as runtime</button>' : '') +
      (n >= 2 ? '<button class="sp-btn sp-contrib">\u{2B50} contribute constellation</button>' : '') +
      (n >= 1 ? '<button class="sp-btn sp-clear">clear</button>' : '') +
      '</div><div class="sp-note"></div></div>';
    $item.html(html);
  }

  const emit = ($item, item) => {
    if (!document.getElementById('starpath-style')) {
      const st = document.createElement('style'); st.id = 'starpath-style'; st.textContent = CSS;
      document.head.appendChild(st);
    }
    render($item, parse(item.text));
  };

  const bind = ($item, item) => {
    const cfg = parse(item.text);
    const note = (msg, ok) => { const n = $item.find('.sp-note'); n.html(ok ? '<span class="sp-ok">' + esc(msg) + '</span>' : esc(msg)); };
    $item.on('click', '.sp-add', () => {
      const st = load();
      const i = st.path.findIndex(e => e.skill === cfg.skill);
      if (i > -1) st.path.splice(i, 1); else st.path.push({ skill: cfg.skill, at: new Date().toISOString(), page: location.pathname });
      save(st); render($item, cfg);
    });
    $item.on('click', '.sp-x', e => {
      const st = load(); st.path.splice(+$(e.currentTarget).data('i'), 1); save(st); render($item, cfg);
    });
    $item.on('click', '.sp-clear', () => { save({ path: [] }); render($item, cfg); });
    $item.on('click', '.sp-view', () => {
      const st = load();
      window.open(cfg.chart + '#path=' + st.path.map(e => encodeURIComponent(e.skill)).join(','), '_blank');
    });
    $item.on('click', '.sp-seal', async () => {
      const st = load();
      let who = member();
      if (!who) {
        who = (window.prompt('Seal as which member (your network handle)?') || '').trim();
        if (!who) return note('sealing needs a member handle');
        try { localStorage.setItem(WHO, who); } catch (e) {}
      }
      const name = (window.prompt('Name this constellation:', 'walked-' + new Date().toISOString().slice(0, 10)) || '').trim();
      if (!name) return;
      const body = { member: who, constellation: name, path: st.path.map(e => e.skill), run: 'starpath walk of ' + st.path.length + ' cards via ' + location.host };
      for (const base of [cfg.librarian, 'http://127.0.0.1:4242']) {
        try {
          const r = await fetch(base + '/runtime', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(4000) });
          const j = await r.json();
          if (j.ok) return note('sealed ✓ ' + (j.seal || '').slice(0, 12) + '… — it will appear on the chart', true);
          return note('librarian said: ' + (j.error || r.status));
        } catch (e) { /* try fallback */ }
      }
      note('no librarian reachable (tailnet only) — path kept, seal later');
    });
    $item.on('click', '.sp-contrib', async () => {
      // contribute the collected path as a NAMED constellation — a curated offering
      // to the network (scores on the leaderboard; others walking it scores you more)
      const st = load();
      let who = member();
      if (!who) {
        who = (window.prompt('Contribute as which member (your network handle)?') || '').trim();
        if (!who) return note('contributing needs a member handle');
        try { localStorage.setItem(WHO, who); } catch (e) {}
      }
      const name = (window.prompt('Name your constellation (held by you once contributed):') || '').trim();
      if (!name) return;
      const purpose = (window.prompt('One line: what is this path FOR?') || '').trim();
      const body = { member: who, name, purpose, path: st.path.map(e => e.skill) };
      for (const base of [cfg.librarian, 'http://127.0.0.1:4242']) {
        try {
          const r = await fetch(base + '/constellation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(4000) });
          const j = await r.json();
          if (j.ok) return note('constellation ' + name + ' contributed ✓ — on the chart and the leaderboard', true);
          return note('librarian said: ' + (j.error || r.status));
        } catch (e) { /* try fallback */ }
      }
      note('no librarian reachable (tailnet only) — path kept, contribute later');
    });
    $item.dblclick(() => window.wiki && wiki.textEditor($item, item));
  };

  if (typeof window !== 'undefined') window.plugins.starpath = { emit, bind };
  if (typeof module !== 'undefined') module.exports = { parse };
})();
