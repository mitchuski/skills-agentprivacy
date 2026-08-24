// dreamloop.js — one discovery pass over the roster farms. Read-only against everyone.
//   1. GET each roster member's skillsync catalog (or sitemap fallback)
//   2. diff vs state/<member>.json  -> new-skill / updated-skill / removed events
//   3. append events to events/events.jsonl (the dream journal)
//   4. push each new-skill card to marvin's ntfy topic (best-effort)
//   5. rewrite the Recent Discoveries page on the local shelf
// Loop it from outside (claude /loop, cron, or the skillsync-dreamloop agent skill).
//   node bin/dreamloop.js [--dry]   (--dry: no ntfy, no page rewrite)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const stateDir = path.join(ROOT, 'state');
const eventsFile = path.join(ROOT, 'events', 'events.jsonl');
fs.mkdirSync(stateDir, { recursive: true });
fs.mkdirSync(path.dirname(eventsFile), { recursive: true });
const DRY = process.argv.includes('--dry');

function get(url, timeoutMs) {
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs || 8000), redirect: 'follow' })
    .then(r => (r.ok ? r.json() : null))
    .catch(() => null);
}

// A member's publication surface, normalized to {name, hash, card, title, kind} rows.
async function readMember(m) {
  // machine door first
  const cat = await get(m.url + '/assets/skillsync/catalog.json');
  if (cat && Array.isArray(cat.packets)) {
    return { via: 'catalog', rows: cat.packets.map(p => ({ name: p.name, hash: p.hash, card: p.card || '', title: p.title || p.name, kind: p.kind || 'skill' })) };
  }
  // sitemap fallback: any page whose slug looks like a skill/spell/card/deck publication
  const sm = await get(m.url + '/system/sitemap.json');
  if (Array.isArray(sm)) {
    const rows = sm.filter(e => /^(card-|skill|spell|deck-|persona)/.test(e.slug))
      .map(e => ({ name: e.slug, hash: 'date:' + e.date, card: e.synopsis || '', title: e.title, kind: 'page' }));
    return { via: 'sitemap', rows };
  }
  return { via: 'unreachable', rows: null };
}

function notify(event) {
  if (DRY) return Promise.resolve('dry');
  // ntfy Title header must be ASCII-safe; the mage emoji rides in as a tag instead
  const title = (event.member + ' - ' + event.type.replace('-skill', ' skill') + ': ' + event.title).replace(/[^\x20-\x7E]/g, '?');
  return fetch(cfg.marvin.ntfy + '/' + cfg.marvin.topic, {
    method: 'POST',
    headers: { Title: title, Priority: 'default', Tags: 'mage,sparkles' },
    body: (event.card || '(no card)').slice(0, 500),
    signal: AbortSignal.timeout(6000)
  }).then(r => (r.ok ? 'sent' : 'http ' + r.status)).catch(e => 'unreachable (' + e.name + ')');
}

(async () => {
  // the roster grows itself: verified gardens from the librarian registry join the poll
  let roster = cfg.roster.slice();
  try {
    const gs = await (await fetch(cfg.librarian.url + '/gardens', { signal: AbortSignal.timeout(4000) })).json().catch(() => null)
      || await (await fetch('http://127.0.0.1:4242/gardens', { signal: AbortSignal.timeout(3000) })).json();
    for (const g of gs) if (g.verified && !roster.some(m => m.url === g.url)) roster.push({ member: g.member, url: g.url, owner: 'external' });
  } catch (e) { /* desk closed — configured roster only */ }
  const pass = { at: new Date().toISOString(), members: {}, events: [] };
  for (const m of roster) {
    const res = await readMember(m);
    if (!res.rows) { pass.members[m.member] = 'unreachable'; continue; }
    const stateFile = path.join(stateDir, m.member.replace(/[^A-Za-z0-9.-]/g, '_') + '.json');
    const prev = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : null;
    const prevMap = prev ? Object.fromEntries(prev.rows.map(r => [r.name, r.hash])) : {};
    const curNames = new Set(res.rows.map(r => r.name));
    const events = [];
    if (prev) { // first sight of a member = baseline, not a flood of notifications
      for (const r of res.rows) {
        if (!(r.name in prevMap)) events.push({ type: 'new-skill', member: m.member, name: r.name, title: r.title, kind: r.kind, card: r.card });
        else if (prevMap[r.name] !== r.hash) events.push({ type: 'updated-skill', member: m.member, name: r.name, title: r.title, kind: r.kind, card: r.card });
      }
      for (const n of Object.keys(prevMap)) if (!curNames.has(n)) events.push({ type: 'removed', member: m.member, name: n, title: n });
    }
    fs.writeFileSync(stateFile, JSON.stringify({ at: pass.at, via: res.via, rows: res.rows }, null, 2));
    pass.members[m.member] = res.via + ' · ' + res.rows.length + ' rows · ' + events.length + ' events' + (prev ? '' : ' (baseline)');
    for (const e of events) {
      e.at = pass.at;
      if (m.owner !== 'self' && (e.type === 'new-skill' || e.type === 'updated-skill')) e.notified = await notify(e);
      fs.appendFileSync(eventsFile, JSON.stringify(e) + '\n');
      pass.events.push(e);
    }
  }

  // rewrite Recent Discoveries from the tail of the journal
  if (!DRY) {
    const all = fs.existsSync(eventsFile) ? fs.readFileSync(eventsFile, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
    const tail = all.slice(-40).reverse();
    const id = () => crypto.randomBytes(8).toString('hex');
    const md = text => ({ type: 'markdown', id: id(), text });
    const lines = tail.length
      ? tail.map(e => '- `' + (e.at || '').slice(0, 16) + '` **' + e.member + '** · ' + e.type + ' · ' + e.title + (e.card ? ' — ' + e.card.slice(0, 90) : '')).join('\n')
      : '(journal empty — baselines recorded, waiting for the farms to move)';
    const story = [
      md('\u{1F319} **Recent Discoveries** — what the dream loop found across the roster farms. Rewritten on every pass; history in `events/events.jsonl`.'),
      md('Last pass `' + pass.at.slice(0, 16) + '` — ' + Object.entries(pass.members).map(([k, v]) => k + ': ' + v).join(' · ')),
      md(lines)
    ];
    const page = { title: 'Recent Discoveries', story, journal: [{ type: 'create', item: { title: 'Recent Discoveries', story }, date: Date.now() }] };
    fs.writeFileSync(path.join(cfg.shelf.farm_pages, 'recent-discoveries'), JSON.stringify(page, null, 2));
  }

  console.log(JSON.stringify(pass, null, 2));
})();
