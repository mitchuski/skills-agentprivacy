// librarian/server.js — the pi5 librarian. Zero-dependency node service.
// The neutral counter that turns use into credentials: submissions inbox, hash-chained
// adoption/attestation ledger, computed leaderboard. Tailnet is the auth boundary
// (bind to the tailscale interface or front with `tailscale serve`); writes are
// append-only JSON lines, the chain head is the seal.
//
//   node server.js [port]           (default 4444)
//
// API:
//   GET  /                      -> service card
//   GET  /catalog               -> recommended catalog (sealed submissions)
//   GET  /inbox                 -> pending submissions
//   POST /submit  {member, packet}            -> inbox
//   POST /adopt   {member, packet, from}      -> ledger  (member adopts from's packet)
//   POST /attest  {member, packet, from, run} -> ledger  (member ran from's packet; run = one-line trace ref)
//   POST /seal    {librarian, submission}     -> inbox -> catalog (requires tier 42 on the leaderboard)
//   GET  /ledger                -> the chain (verify: each entry.prev === sha256 of previous line)
//   GET  /leaderboard           -> computed points + tiers, never stored
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.argv[2]) || 4444;
const DATA = path.join(__dirname, 'data');
fs.mkdirSync(DATA, { recursive: true });
const LEDGER = path.join(DATA, 'ledger.jsonl');
const INBOX = path.join(DATA, 'inbox.jsonl');
const CATALOG = path.join(DATA, 'catalog.json');

const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const lines = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean) : []);

function chainHead() {
  const ls = lines(LEDGER);
  return ls.length ? sha(ls[ls.length - 1]) : 'genesis';
}
function appendLedger(entry) {
  entry.at = new Date().toISOString();
  entry.prev = chainHead();
  const line = JSON.stringify(entry);
  fs.appendFileSync(LEDGER, line + '\n');
  return { seal: sha(line), prev: entry.prev };
}

const POINTS = { published: 1, adopted: 3, attested: 7, constellation: 2, walked: 5 };
const TIERS = [[42, '\u{1F4DA} Librarian'], [18, '\u{1F9ED} Guide'], [6, '\u{1F44D} Hitchhiker'], [0, '\u{1F6B6} Wanderer']];
// garden listing standing rides the leaderboard: the member's points decide how
// their garden shows in the public registry. Trust in the garden = trust earned
// by its keeper's work being used.
const GARDEN_STANDING = [[18, '\u{1F333} grove'], [6, '\u{1F331} rooted'], [0, '\u{1F330} seedling']];

// latest contribution per constellation name defines its author + path
function constellations() {
  const map = {};
  for (const l of lines(LEDGER)) {
    const e = JSON.parse(l);
    if (e.type === 'constellation') map[e.name] = { name: e.name, emoji: e.emoji || '\u{2B50}', purpose: e.purpose || '', path: e.path, member: e.member, at: e.at };
  }
  return Object.values(map);
}

function leaderboard() {
  const board = {}; // member -> counts (credited to the AUTHOR: from)
  const row = m => (board[m] = board[m] || { member: m, published: 0, adopted_by_others: 0, attested: 0, constellations: 0, walked_by_others: 0 });
  const consAuthor = Object.fromEntries(constellations().map(c => [c.name, c.member]));
  for (const l of lines(LEDGER)) {
    const e = JSON.parse(l);
    if (e.type === 'publish') row(e.member).published++;
    if (e.type === 'adopt' && e.from !== e.member) row(e.from).adopted_by_others++;
    if (e.type === 'attest' && e.from !== e.member) row(e.from).attested++;
    if (e.type === 'constellation') row(e.member).constellations++;
    if (e.type === 'runtime') { // walking another member's contributed constellation credits its author
      const author = consAuthor[e.constellation];
      if (author && author !== e.member) row(author).walked_by_others++;
    }
  }
  return Object.values(board).map(r => {
    const points = r.published * POINTS.published + r.adopted_by_others * POINTS.adopted + r.attested * POINTS.attested +
      r.constellations * POINTS.constellation + r.walked_by_others * POINTS.walked;
    const tier = TIERS.find(([min]) => points >= min)[1];
    return { ...r, points, tier };
  }).sort((a, b) => b.points - a.points);
}

function body(req) {
  return new Promise(res => {
    let b = '';
    req.on('data', c => { b += c; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { res(JSON.parse(b)); } catch { res(null); } });
  });
}
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end(JSON.stringify(obj, null, 2)); };

// --- the Librarian's Desk: a human-viewable dashboard on the same port ---
// GET / with an html Accept header renders this; agents keep getting JSON.
const UI = `<!doctype html><meta charset="utf-8"><title>The Librarian's Desk</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
 :root{--ink:#232120;--paper:#f7f4ee;--card:#fffdf8;--line:#d8d2c4;--dim:#8a8375;--gold:#9a7b2d;--good:#2d6a4f;--bad:#a13a2f}
 body{font:15px/1.5 Georgia,'Times New Roman',serif;background:var(--paper);color:var(--ink);margin:0;padding:2rem 1rem;}
 main{max-width:880px;margin:0 auto}
 h1{font-size:1.5rem;letter-spacing:.04em;margin:0} h2{font-size:1.05rem;border-bottom:1px solid var(--line);padding-bottom:.3rem;margin:1.6rem 0 .6rem}
 .sub{color:var(--dim);margin:.2rem 0 0}
 .badge{display:inline-block;border:1px solid var(--line);border-radius:4px;padding:.1rem .5rem;background:var(--card);font-size:.85rem}
 .badge.ok{color:var(--good);border-color:var(--good)} .badge.err{color:var(--bad);border-color:var(--bad)}
 table{width:100%;border-collapse:collapse;background:var(--card);font-size:.92rem}
 th,td{text-align:left;padding:.35rem .6rem;border-bottom:1px solid var(--line)} th{color:var(--dim);font-weight:normal;font-style:italic}
 .pts{text-align:right;font-variant-numeric:tabular-nums} .mono{font-family:Consolas,monospace;font-size:.82rem;color:var(--dim)}
 .empty{color:var(--dim);font-style:italic;padding:.5rem .2rem}
 .rules{color:var(--dim);font-size:.85rem;margin-top:.4rem}
 footer{margin-top:2rem;color:var(--dim);font-size:.8rem;border-top:1px solid var(--line);padding-top:.6rem}
</style>
<main>
 <h1>\u{1F4DA} The Librarian's Desk</h1>
 <p class="sub">skill sync network counter — submissions, adoptions, the game of 42 · <span id="chain" class="badge">checking chain…</span></p>
 <p class="sub">this desk answers at <b id="door">…</b> — whichever pi or knowledge-author farm that name belongs to, its keeper is the first person here · <a href="/desk.md">run a desk on your own pi → /desk.md</a></p>
 <h2>\u{1F3C6} Leaderboard</h2>
 <div id="board"></div>
 <p class="rules">discovered = 1 pt · adopted by another = 3 · attested run = 7 · constellation contributed = 2 · your constellation walked by another = 5 &nbsp;·&nbsp; \u{1F6B6} Wanderer 0 · \u{1F44D} Hitchhiker 6 · \u{1F9ED} Guide 18 · \u{1F4DA} Librarian 42 (may seal)</p>
 <h2>\u{1F4E5} Inbox — submitted for adoption</h2>
 <div id="inbox"></div>
 <h2>\u{1F9ED} Counsel — agents requesting guidance</h2>
 <div id="counsel"></div>
 <h2>\u{1F41F} Names — requests for the shared DNS zones</h2>
 <div id="names"></div>
 <h2>\u{1F4D6} Ledger — the last 20 entries</h2>
 <div id="ledger"></div>
 <h2>✅ Recommended catalog</h2>
 <div id="catalog"></div>
 <footer>agents speak JSON to this same port: GET /catalog /inbox /ledger /leaderboard /names · POST /submit /adopt /attest /seal /name /grant — the ledger is a hash chain, verify it yourself. Want a desk like this on your own knowledge pi? This desk carries its own guide: <a href="/desk.md">/desk.md</a>.</footer>
</main>
<script>
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const el=i=>document.getElementById(i);
el('door').textContent=location.host||'localhost';
const table=(cols,rows)=>rows.length?'<table><tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>'+rows.join('')+'</table>':'<div class="empty">nothing yet — the shelf is quiet</div>';
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
(async()=>{
 const j=p=>fetch(p,{headers:{Accept:'application/json'}}).then(r=>r.json());
 const [board,inbox,ledger,cat,counsel,names]=await Promise.all([j('/leaderboard'),j('/inbox'),j('/ledger'),j('/catalog'),j('/counsel'),j('/names')]);
 el('names').innerHTML=names.length?names.slice(-10).reverse().map(q=>'<div style="border-left:2px solid '+(q.status==='granted'?'var(--good)':q.status==='declined'?'var(--line)':'var(--gold)')+';padding:.3rem .6rem;margin:.4rem 0"><span class="mono">'+esc((q.at||'').slice(0,16))+' · '+esc(q.id)+'</span><br><b>'+esc(q.member)+'</b> asks for <b>'+esc(q.fqdn)+'</b>'+(q.target?' → '+esc(q.target):'')+(q.note?'<br><span style="color:var(--dim)">'+esc(q.note)+'</span>':'')+(q.resolves?'<br><span style="color:var(--dim)">already resolves → '+esc(q.address)+' (wildcard or taken — keeper decides)</span>':'')+(q.grants.length?q.grants.map(g=>'<br>\u{1F41F} <b>'+esc(g.member)+'</b> '+esc(g.status)+(g.target?' → '+esc(g.target):'')+(g.note?' — '+esc(g.note):'')).join(''):'<br><i style="color:var(--gold)">awaiting the zone keeper — grant: POST /grant {request:\"'+esc(q.id)+'\", member, status:\"granted\"}</i>')+'</div>').join(''):'<div class="empty">no name requests on the desk</div>';
 el('counsel').innerHTML=counsel.length?counsel.slice(-10).reverse().map(q=>'<div style="border-left:2px solid '+(q.guidance.length?'var(--good)':'var(--gold)')+';padding:.3rem .6rem;margin:.4rem 0"><span class="mono">'+esc((q.at||'').slice(0,16))+' · '+esc(q.id)+'</span><br><b>'+esc(q.member)+(q.agent?' / '+esc(q.agent):'')+'</b> asks: '+esc(q.question)+(q.context?'<br><span style="color:var(--dim)">'+esc(q.context)+'</span>':'')+(q.guidance.length?q.guidance.map(g=>'<br>\u{1F9ED} <b>'+esc(g.member)+'</b> guides: '+esc(g.guidance)).join(''):'<br><i style="color:var(--gold)">awaiting guidance — be a guide: POST /guide {counsel:\"'+esc(q.id)+'\", member, guidance}</i>')+'</div>').join(''):'<div class="empty">no guidance requests on the desk</div>';
 el('board').innerHTML=table(['member','published','adopted-by-others','attested','constellations','walked-by-others','points','tier'],
   board.map(r=>'<tr><td><b>'+esc(r.member)+'</b></td><td class="pts">'+r.published+'</td><td class="pts">'+r.adopted_by_others+'</td><td class="pts">'+r.attested+'</td><td class="pts">'+(r.constellations||0)+'</td><td class="pts">'+(r.walked_by_others||0)+'</td><td class="pts"><b>'+r.points+'</b></td><td>'+esc(r.tier)+'</td></tr>'));
 el('inbox').innerHTML=table(['when','member','packet','card'],
   inbox.map(s=>'<tr><td class="mono">'+esc((s.at||'').slice(0,16))+'</td><td>'+esc(s.member)+'</td><td><b>'+esc(s.packet.name)+'</b></td><td>'+esc((s.packet.card||'').slice(0,120))+'</td></tr>'));
 el('ledger').innerHTML=table(['when','entry','seal'],
   ledger.slice(-20).reverse().map(e=>'<tr><td class="mono">'+esc((e.at||'').slice(0,16))+'</td><td><b>'+esc(e.type)+'</b> · '+esc(e.member)+(e.from?' ← '+esc(e.from):'')+' · '+esc(e.packet||'')+'</td><td class="mono">'+esc((e.prev||'').slice(0,10))+'…</td></tr>'));
 el('catalog').innerHTML=table(['packet','kind','card'],
   (cat.packets||[]).map(p=>'<tr><td><b>'+esc(p.name)+'</b></td><td>'+esc(p.kind)+'</td><td>'+esc((p.card||'').slice(0,120))+'</td></tr>'));
 let prev='genesis',ok=true;
 for(const e of ledger){if(e.prev!==prev){ok=false;break}prev=await sha256(JSON.stringify(e))}
 const c=el('chain');c.textContent=ok?'chain VALID ('+ledger.length+' entries)':'chain BROKEN';c.className='badge '+(ok?'ok':'err');
})();
</script>`;

http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (req.method === 'OPTIONS') { // CORS preflight — wiki pages seal runtimes from the browser
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' });
    return res.end();
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    if (url === '/desk.md' || url === '/DESK.md') {
      // the desk carries its own instructions: DESK.md ships beside server.js in the
      // kit, so any pi running this file can hand its first person the build guide —
      // no garden door required. Missing file = the minimal quick-start, inline.
      const guide = path.join(__dirname, 'DESK.md');
      res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      if (fs.existsSync(guide)) return res.end(fs.readFileSync(guide));
      return res.end('# The Librarian’s Desk — quick start\n\n(The full guide, DESK.md, was not deployed beside server.js on this pi — fetch it from any garden door at /desk.md, or from the kit at /assets/site/kit/librarian/DESK.md.)\n\nOne zero-dependency node file, one port, two faces: browsers get this dashboard, agents get JSON at the same URLs. Run it:\n\n    mkdir -p ~/desk && cd ~/desk\n    curl -fsSO http://<any-garden>/assets/site/kit/librarian/server.js\n    node server.js 4444\n\nKeep it first-person: bind it to your tailnet (tailscale serve, a tailnet-only Caddy guard, or firewall the port to 100.64.0.0/10). Back up data/ — the ledger is the memory; everything else recomputes from the chain.\n');
    }
    if (url === '/' && /text\/html/.test(req.headers.accept || '')) { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(UI); }
    if (url === '/') return send(res, 200, { service: 'skillsync-librarian/0.1', host: 'pi5', chain_head: chainHead(), endpoints: ['/catalog', '/inbox', '/ledger', '/leaderboard', '/names', '/desk.md', 'POST /submit /adopt /attest /seal /name /grant'], desk: 'open / in a browser for the human view', guide: '/desk.md — build & host this desk on your own knowledge pi' });
    if (url === '/catalog') return send(res, 200, fs.existsSync(CATALOG) ? JSON.parse(fs.readFileSync(CATALOG, 'utf8')) : { spec: 'skill-catalog/0.1', member: 'librarian', packets: [] });
    if (url === '/inbox') return send(res, 200, lines(INBOX).map(l => JSON.parse(l)));
    if (url === '/ledger') return send(res, 200, lines(LEDGER).map(l => JSON.parse(l)));
    if (url === '/leaderboard') return send(res, 200, leaderboard());
    if (url === '/runtimes') return send(res, 200, lines(LEDGER).map(l => JSON.parse(l)).filter(e => e.type === 'runtime'));
    if (url === '/constellations') return send(res, 200, constellations());
    if (url === '/gardens') { // the public garden registry: latest entry per url, standing from the leaderboard
      const latest = {};
      for (const l of lines(LEDGER)) { const e = JSON.parse(l); if (e.type === 'garden') latest[e.url] = e; }
      const board = Object.fromEntries(leaderboard().map(r => [r.member, r]));
      return send(res, 200, Object.values(latest).map(g => {
        const r = board[g.member] || { points: 0, tier: TIERS[3][1] };
        return { member: g.member, url: g.url, note: g.note || '', verified: !!g.verified, packets: g.packets || 0,
          at: g.at, points: r.points, tier: r.tier, standing: GARDEN_STANDING.find(([min]) => r.points >= min)[1] };
      }).sort((a, b) => b.points - a.points));
    }
    if (url === '/names') { // the name lane: DNS name requests paired with the keeper's grants
      const entries = lines(LEDGER).map(l => JSON.parse(l));
      const qs = entries.filter(e => e.type === 'name');
      const gs = entries.filter(e => e.type === 'name-grant');
      return send(res, 200, qs.map(q => {
        const mine = gs.filter(g => g.request === q.id);
        const last = mine[mine.length - 1];
        return { ...q, grants: mine, status: last ? last.status : 'pending' };
      }));
    }
    if (url === '/counsel') { // the counsel lane: guidance requested, paired with guidance given
      const entries = lines(LEDGER).map(l => JSON.parse(l));
      const qs = entries.filter(e => e.type === 'counsel');
      const gs = entries.filter(e => e.type === 'guide' || e.type === 'direct'); // 'direct' = legacy name
      return send(res, 200, qs.map(q => ({ ...q, guidance: gs.filter(g => g.counsel === q.id).map(g => ({ ...g, guidance: g.guidance || g.direction })) })));
    }
    return send(res, 404, { error: 'unknown path' });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'GET/HEAD/POST only' });
  const b = await body(req);
  if (!b || !b.member) return send(res, 400, { error: 'JSON body with member required' });

  if (url === '/submit') {
    if (!b.packet || !b.packet.name || !b.packet.card) return send(res, 400, { error: 'packet with name+card required' });
    fs.appendFileSync(INBOX, JSON.stringify({ at: new Date().toISOString(), member: b.member, packet: b.packet }) + '\n');
    appendLedger({ type: 'publish', member: b.member, packet: b.packet.name, hash: b.packet.hash });
    return send(res, 200, { ok: true, inbox: lines(INBOX).length });
  }
  if (url === '/adopt' || url === '/attest') {
    if (!b.packet || !b.from) return send(res, 400, { error: 'packet + from (author) required' });
    const entry = { type: url.slice(1), member: b.member, from: b.from, packet: b.packet };
    if (url === '/attest') entry.run = b.run || '';
    return send(res, 200, { ok: true, ...appendLedger(entry) });
  }
  if (url === '/runtime') {
    // a constellation runtime: an agent walked an ordered path of skills in a real
    // session and records the walk. path = ordered packet names; run = one-line
    // evidence ref (chronicle slug, session id, artifact hash). Chain-sealed like
    // every other entry — the walk evidence IS the credential.
    if (!Array.isArray(b.path) || b.path.length < 2) return send(res, 400, { error: 'path must be an ordered array of 2+ packet names' });
    return send(res, 200, { ok: true, ...appendLedger({ type: 'runtime', member: b.member, constellation: b.constellation || 'unnamed', path: b.path, run: b.run || '' }) });
  }
  if (url === '/constellation') {
    // contribute a named constellation: a curated path offered to the network.
    // Contributing scores; OTHERS walking it scores you more (see POINTS).
    if (!b.name || !Array.isArray(b.path) || b.path.length < 2) return send(res, 400, { error: 'name + path (2+ packet names) required' });
    const existing = constellations().find(c => c.name === b.name);
    if (existing && existing.member !== b.member) return send(res, 409, { error: 'constellation name is held by ' + existing.member });
    return send(res, 200, { ok: true, ...appendLedger({ type: 'constellation', member: b.member, name: b.name, emoji: b.emoji || '', purpose: b.purpose || '', path: b.path }) });
  }
  if (url === '/counsel') {
    // the counsel lane, agent side: an agent working in the city REQUESTS GUIDANCE
    // from its human — or from any member willing to be a guide. Attributed,
    // chain-sealed, answerable.
    if (!b.question) return send(res, 400, { error: 'question required' });
    const id = sha(b.member + '|' + b.question + '|' + chainHead()).slice(0, 12);
    return send(res, 200, { ok: true, id, ...appendLedger({ type: 'counsel', id, member: b.member, agent: b.agent || '', question: String(b.question).slice(0, 1000), context: String(b.context || '').slice(0, 500) }) });
  }
  if (url === '/garden') {
    // publish your garden into the registry: attributed, chain-sealed, and VERIFIED
    // at the door — the librarian fetches your catalog before recording you. Your
    // listing standing then rides the leaderboard: seedling -> rooted -> grove.
    if (!b.url || !/^https?:[/][/]/.test(b.url)) return send(res, 400, { error: 'url (http/https) required' });
    const gurl = b.url.replace(/\/+$/, '');
    let verified = false, packets = 0;
    try {
      const r = await fetch(gurl + '/assets/skillsync/catalog.json', { signal: AbortSignal.timeout(6000) });
      if (r.ok) { const c = await r.json(); if (c && Array.isArray(c.packets)) { verified = true; packets = c.count || c.packets.length; } }
    } catch (e) { /* unreachable from here — recorded unverified; the dream loop re-checks */ }
    return send(res, 200, { ok: true, verified, packets, ...appendLedger({ type: 'garden', member: b.member, url: gurl, note: String(b.note || '').slice(0, 300), verified, packets }) });
  }
  if (url === '/name') {
    // the name lane, request side: a member (or a persona a member vouches for, like
    // mage) asks for a name in a shared DNS zone — <label>.private.fish by default.
    // The librarian cannot write DNS; the zone keeper holds those keys (deSEC, the
    // embassy). This queues the ask where the keeper already looks: attributed,
    // chain-sealed, answerable at the desk — the same shape as counsel. A name that
    // resolves is not necessarily served: wildcards catch strays, so the door also
    // records what DNS says right now.
    const label = String(b.name || '').toLowerCase().trim();
    if (!/^[a-z0-9]([a-z0-9-]{0,38}[a-z0-9])?$/.test(label)) return send(res, 400, { error: 'name must be a DNS label: a-z 0-9 hyphen, 2-40 chars, no leading/trailing hyphen' });
    const zone = String(b.zone || 'private.fish').toLowerCase().slice(0, 100);
    const fqdn = label + '.' + zone;
    const entries = lines(LEDGER).map(l => JSON.parse(l));
    const grants = entries.filter(e => e.type === 'name-grant');
    const open = entries.filter(e => e.type === 'name' && e.fqdn === fqdn).filter(q => {
      const mine = grants.filter(g => g.request === q.id);
      const last = mine[mine.length - 1];
      return !last || last.status === 'granted'; // pending or granted blocks; declined frees the name
    });
    const held = open.find(q => q.member !== b.member);
    if (held) return send(res, 409, { error: fqdn + ' is already requested/held by ' + held.member });
    if (open.some(q => q.member === b.member)) return send(res, 409, { error: fqdn + ' is already on the desk for you', id: open.find(q => q.member === b.member).id });
    let resolves = false, address = '';
    try {
      const ips = await Promise.race([require('dns').promises.resolve4(fqdn), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500))]);
      if (ips && ips.length) { resolves = true; address = ips[0]; }
    } catch (e) { /* NXDOMAIN or slow resolver — recorded as not resolving */ }
    const id = sha(b.member + '|' + fqdn + '|' + chainHead()).slice(0, 12);
    return send(res, 200, { ok: true, id, fqdn, resolves, address, ...appendLedger({ type: 'name', id, member: b.member, name: label, zone, fqdn, target: String(b.target || '').slice(0, 200), note: String(b.note || '').slice(0, 300), resolves, address }) });
  }
  if (url === '/grant') {
    // the name lane, keeper side: the zone keeper answers a request — granted after
    // placing the record (or noting the wildcard already covers it), or declined.
    // Like guiding, granting is attributed and chain-sealed, not authenticated:
    // the tailnet is the boundary and the chain remembers who answered.
    const status = String(b.status || '').toLowerCase();
    if (!b.request || !['granted', 'declined'].includes(status)) return send(res, 400, { error: 'request (id) + status granted|declined required' });
    const q = lines(LEDGER).map(l => JSON.parse(l)).find(e => e.type === 'name' && e.id === b.request);
    if (!q) return send(res, 404, { error: 'no such name request: ' + b.request });
    return send(res, 200, { ok: true, fqdn: q.fqdn, ...appendLedger({ type: 'name-grant', request: b.request, fqdn: q.fqdn, member: b.member, status, target: String(b.target || q.target || '').slice(0, 200), note: String(b.note || '').slice(0, 300) }) });
  }
  if (url === '/guide' || url === '/direct') { // '/direct' = legacy name for the same act
    // the counsel lane, guide side: guidance offered on an open request. Anyone may
    // guide; the \u{1F9ED} Guide tier is earned, not required — being a guide is how
    // you become one. Not a command: the asking agent weighs it and walks on.
    const guidance = b.guidance || b.direction;
    if (!b.counsel || !guidance) return send(res, 400, { error: 'counsel (id) + guidance required' });
    if (!lines(LEDGER).some(l => { const e = JSON.parse(l); return e.type === 'counsel' && e.id === b.counsel; }))
      return send(res, 404, { error: 'no such guidance request: ' + b.counsel });
    return send(res, 200, { ok: true, ...appendLedger({ type: 'guide', counsel: b.counsel, member: b.member, guidance: String(guidance).slice(0, 1000) }) });
  }
  if (url === '/seal') {
    const board = leaderboard().find(r => r.member === b.member);
    if (!board || board.points < 42) return send(res, 403, { error: 'sealing requires Librarian tier (42 points)', yours: board ? board.points : 0 });
    const inbox = lines(INBOX).map(l => JSON.parse(l));
    const sub = inbox.find(s => s.packet.name === b.submission);
    if (!sub) return send(res, 404, { error: 'no such submission in inbox' });
    const cat = fs.existsSync(CATALOG) ? JSON.parse(fs.readFileSync(CATALOG, 'utf8')) : { spec: 'skill-catalog/0.1', member: 'librarian', packets: [] };
    cat.packets = cat.packets.filter(p => p.name !== sub.packet.name).concat([sub.packet]);
    cat.updated = new Date().toISOString();
    fs.writeFileSync(CATALOG, JSON.stringify(cat, null, 2));
    fs.writeFileSync(INBOX, inbox.filter(s => s.packet.name !== b.submission).map(s => JSON.stringify(s)).join('\n') + '\n');
    appendLedger({ type: 'seal', member: b.member, packet: sub.packet.name });
    return send(res, 200, { ok: true, catalog: cat.packets.length });
  }
  return send(res, 404, { error: 'unknown path' });
}).listen(PORT, () => console.log('skillsync librarian listening on :' + PORT));
