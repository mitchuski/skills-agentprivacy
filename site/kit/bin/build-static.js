// build-static.js — generate the site for skills.agentprivacy.ai: the agentprivacy
// SKIN over the local Skill Sync system. One page, two modes, capability-detected:
//
//   LIVE (entered over http on the tailnet — skills.mitch.private.fish or the local
//   farm): catalog read live from the shelf, leaderboard/counsel/constellations live
//   from the librarian, and every action has a button — ⭐ collect path, ✓ adopt,
//   ⚡ attest, seal runtime, contribute constellation, ask/answer counsel.
//
//   SNAPSHOT (the public https door — browsers block https→http tailnet calls):
//   baked data, browse + path collection still work, action buttons become the
//   tailnet door link. Same file, no build variants.
//
// The path tray shares localStorage keys with wiki-plugin-starpath, so ⭐ taps on
// the wiki card pages and the garden tray are ONE walk when served from one host.
//   node bin/build-static.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const SITE = path.join(ROOT, 'site');
fs.mkdirSync(path.join(SITE, 'data'), { recursive: true });

// --- data: catalog (cards+briefs), decks, gardens, baked leaderboard ---
fs.copyFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), path.join(SITE, 'data', 'catalog.json'));
try { fs.copyFileSync(path.join(ROOT, 'registry', 'page-slugs.json'), path.join(SITE, 'data', 'page-slugs.json')); } catch (e) {}
const decks = fs.readdirSync(path.join(ROOT, 'loadouts')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'loadouts', f), 'utf8')));
fs.writeFileSync(path.join(SITE, 'data', 'decks.json'), JSON.stringify(decks, null, 2));
// gardens: bake the PUBLIC REGISTRY from the librarian (standing rides the
// leaderboard); fall back to the local dream-loop roster if the desk is closed
(async () => {
  let gardens = null;
  try {
    const r = await fetch('http://127.0.0.1:4242/gardens', { signal: AbortSignal.timeout(3000) });
    if (r.ok) gardens = await r.json();
  } catch (e) { /* desk closed */ }
  if (!gardens || !gardens.length) gardens = cfg.roster.map(m => ({ member: m.member, url: m.url, note: m.owner === 'self' ? 'the source garden' : '', standing: '', verified: false }));
  // public-desk proof mode: standing stays (it is the listing), raw points do not
  if (cfg.public_desk === 'proof') gardens = gardens.map(g => ({ ...g, points: undefined, tier: undefined }));
  fs.writeFileSync(path.join(SITE, 'data', 'gardens.json'), JSON.stringify({ updated: new Date().toISOString(), gardens }, null, 2));
})();

// baked leaderboard: from the live librarian if reachable, else a publication seed
const cat = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'catalog.json'), 'utf8'));
(async () => {
  // public desk: in proof mode the cloud gets a COMMITMENT (bin/attest-desk.js),
  // never the rows — the keeper chooses when to attest; the tailnet keeps detail
  let baked;
  if (cfg.public_desk === 'proof') {
    let proof = null;
    try { proof = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'desk-proof.json'), 'utf8')); } catch (e) {}
    baked = { mode: 'proof', proof: proof || { note: 'no attestation yet — run bin/attest-desk.js' } };
    if (proof) console.log('desk bake: PROOF of ' + proof.chain.entries + ' entries, attested ' + proof.attested_at.slice(0, 16));
    else console.warn('desk bake: proof mode but no desk-proof.json — run bin/attest-desk.js');
  } else {
    let board = [{ member: cat.member, published: cat.count, adopted_by_others: 0, attested: 0, points: cat.count, tier: 'seeding' }];
    try {
      const r = await fetch('http://127.0.0.1:4242/leaderboard', { signal: AbortSignal.timeout(3000) });
      if (r.ok) board = await r.json();
    } catch (e) { /* librarian not running locally — keep the seed */ }
    baked = { mode: 'detail', board };
  }
  fs.writeFileSync(path.join(SITE, 'data', 'leaderboard.json'), JSON.stringify({ baked: new Date().toISOString(), ...baked }, null, 2));

  // full bodies — rebuilt fresh so pruned skills never linger on the public site
  const bodiesSrc = path.join(ROOT, 'registry', 'assets');
  const bodiesDst = path.join(SITE, 'assets');
  fs.rmSync(bodiesDst, { recursive: true, force: true });
  fs.cpSync(bodiesSrc, bodiesDst, { recursive: true });
  // ...and the catalog at the SPEC path, so this site is itself a valid garden
  // (any librarian can verify it, any dream loop can drink from it)
  fs.mkdirSync(path.join(SITE, 'assets', 'skillsync'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'registry', 'catalog.json'), path.join(SITE, 'assets', 'skillsync', 'catalog.json'));
  fs.copyFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), path.join(SITE, 'assets', 'skillsync', 'catalog-full.json'));

  // ship the fedwiki plugins so other gardens can install the interfaces, not just read the content
  const plugSrc = path.join(ROOT, 'plugin');
  for (const d of fs.readdirSync(plugSrc)) fs.cpSync(path.join(plugSrc, d), path.join(SITE, 'plugins', d), { recursive: true });

  // ship the BUILD KIT: everything another member's agent needs to rebuild this whole
  // system for their own garden — the builders, the spec, the librarian, the config
  // shape. The site doesn't just show the garden; it carries the seeds.
  const kit = path.join(SITE, 'kit');
  fs.mkdirSync(path.join(kit, 'bin'), { recursive: true });
  for (const f of fs.readdirSync(path.join(ROOT, 'bin'))) fs.copyFileSync(path.join(ROOT, 'bin', f), path.join(kit, 'bin', f));
  fs.copyFileSync(path.join(ROOT, 'SPEC.md'), path.join(kit, 'SPEC.md'));
  fs.copyFileSync(path.join(ROOT, 'README.md'), path.join(kit, 'README.md'));
  fs.copyFileSync(path.join(ROOT, 'AGENT_ORIENTATION.md'), path.join(SITE, 'orientation.md'));
  fs.copyFileSync(path.join(ROOT, 'AGENT_ORIENTATION.md'), path.join(kit, 'AGENT_ORIENTATION.md'));
  fs.mkdirSync(path.join(kit, 'librarian'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'librarian', 'server.js'), path.join(kit, 'librarian', 'server.js'));
  fs.copyFileSync(path.join(ROOT, 'librarian', 'README.md'), path.join(kit, 'librarian', 'README.md'));
  // the desk guide: build & host the Librarian's Desk on any knowledge pi —
  // served at /desk.md on every door, like /orientation.md
  fs.copyFileSync(path.join(ROOT, 'librarian', 'DESK.md'), path.join(kit, 'librarian', 'DESK.md'));
  fs.copyFileSync(path.join(ROOT, 'librarian', 'DESK.md'), path.join(SITE, 'desk.md'));
  const cfgTemplate = JSON.parse(JSON.stringify(cfg));
  cfgTemplate.member = '<your-handle>';
  cfgTemplate.sources = [{ root: '<path-to-your-skills>', dirs: ['.'], universe: '<your-universe>', kind_by_dir: { '.': 'skill' } }];
  fs.writeFileSync(path.join(kit, 'skillsync.config.template.json'), JSON.stringify(cfgTemplate, null, 2));
  // ENGINE BRIDGE: serve a fedwiki-shaped sitemap so the guide's improbable engine
  // (guide.agentprivacy.ai/star-chart) can seat this whole skill space as a remote
  // site with one roster line — [{slug,title,date,links:{slug:count}}], links drawn
  // from the star chart's real-relation edges. Plus _headers for permissive CORS
  // (Workers static assets honour Pages-style _headers).
  try {
    const chart = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'starchart.json'), 'utf8'));
    // page slugs come from the shelf builder (bare titles + collision guard)
    const slugOf = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'page-slugs.json'), 'utf8'));
    const linkMap = {};
    for (const e of chart.edges) {
      (linkMap[e.a] = linkMap[e.a] || {})[slugOf[e.b]] = e.w;
      (linkMap[e.b] = linkMap[e.b] || {})[slugOf[e.a]] = e.w;
    }
    const catFull = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'catalog.json'), 'utf8'));
    const sitemap = catFull.packets.map(p => ({ slug: slugOf[p.name], title: p.title, date: Date.parse(p.published) || 0, links: linkMap[p.name] || {} }));
    fs.mkdirSync(path.join(SITE, 'system'), { recursive: true });
    fs.writeFileSync(path.join(SITE, 'system', 'sitemap.json'), JSON.stringify(sitemap));
    console.log('engine bridge: system/sitemap.json — ' + sitemap.length + ' page-stars for the improbable engine');
  } catch (e) { console.warn('engine bridge skipped (build the star chart first): ' + e.message); }
  fs.writeFileSync(path.join(SITE, '_headers'), '/*\n  Access-Control-Allow-Origin: *\n');
  // favicon: the garden's star — night-sky tile, gold four-point star with sparks
  // (drawn, not emoji text, so it renders identically everywhere at 16px)
  fs.writeFileSync(path.join(SITE, 'favicon.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    '<rect width="32" height="32" rx="7" fill="#141a30"/>' +
    '<path d="M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z" fill="#e8c76a"/>' +
    '<circle cx="25" cy="7" r="1.6" fill="#6ad0c8"/>' +
    '<circle cx="7" cy="25" r="1.2" fill="#e8c76a" opacity=".8"/>' +
    '</svg>');
  fs.writeFileSync(path.join(SITE, 'index.html'), page());
  console.log('site/: index.html + data/ + ' + fs.readdirSync(bodiesDst).length + ' skill bodies');

  // mirror into the farm so the tailnet lane serves it today at /assets/site/
  const farmSite = path.join(cfg.shelf.farm_assets, 'site');
  fs.cpSync(SITE, farmSite, { recursive: true });
  console.log('mirrored to farm assets: /assets/site/index.html');
})();

function page() {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Skills of the Agentprivacy Universe</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<meta name="description" content="The skill garden: browse, search, adopt and walk the skills, personas, patterns and plugins of the agentprivacy universe — live over the community tailnet.">
<style>
 :root{--ink:#232120;--paper:#f5f1e8;--card:#fffdf8;--line:#d8d2c4;--dim:#8a8375;--gold:#9a7b2d;--accent:#4a5d7e;--good:#2d6a4f;--warn:#a13a2f}
 *{box-sizing:border-box}
 body{font:16px/1.55 Georgia,'Times New Roman',serif;background:var(--paper);color:var(--ink);margin:0}
 header{border-bottom:1px solid var(--line);padding:2.2rem 1rem 1.6rem;text-align:center;background:linear-gradient(#fbf8f1,var(--paper))}
 h1{font-size:1.7rem;letter-spacing:.05em;margin:0}
 .tag{color:var(--dim);margin:.4rem 0 0;font-style:italic}
 main{max-width:980px;margin:0 auto;padding:1rem}
 h2{font-size:1.15rem;border-bottom:1px solid var(--line);padding-bottom:.3rem;margin:2rem 0 .8rem}
 .badge{display:inline-block;border:1px solid var(--line);border-radius:4px;padding:.05rem .5rem;background:var(--card);font-size:.8rem;color:var(--dim)}
 .badge.live{color:var(--good);border-color:var(--good)} .badge.door{color:var(--gold);border-color:var(--gold)}
 .controls{display:flex;gap:.6rem;flex-wrap:wrap;margin:.8rem 0}
 input[type=search],input[type=text],select{font:inherit;padding:.4rem .6rem;border:1px solid var(--line);border-radius:4px;background:var(--card);color:var(--ink)}
 input[type=search]{flex:1;min-width:220px}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:.7rem}
 .skill{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:.7rem .8rem;cursor:pointer}
 .skill:hover{border-color:var(--gold)}
 .skill h3{margin:0;font-size:1rem}
 .kind{font-size:.72rem;color:var(--accent);text-transform:uppercase;letter-spacing:.08em}
 .card-text{color:#555;font-size:.86rem;margin:.3rem 0 0}
 .brief{display:none;margin-top:.5rem;padding-top:.5rem;border-top:1px dashed var(--line);font-size:.86rem;white-space:pre-wrap}
 .skill.open .brief{display:block}
 .acts{display:flex;gap:.35rem;flex-wrap:wrap;margin-top:.5rem}
 .abtn{font:inherit;font-size:.78rem;border:1px solid var(--line);border-radius:5px;background:#f7f4ee;padding:.15rem .55rem;cursor:pointer}
 .abtn:hover{border-color:var(--gold)} .abtn.on{border-color:var(--gold);color:var(--gold);font-weight:bold}
 .abtn:disabled{opacity:.45;cursor:default}
 .deck{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:6px;padding:.8rem 1rem;margin:.5rem 0}
 table{width:100%;border-collapse:collapse;background:var(--card);font-size:.9rem}
 th,td{text-align:left;padding:.35rem .6rem;border-bottom:1px solid var(--line)}
 th{color:var(--dim);font-weight:normal;font-style:italic}
 .pts{text-align:right;font-variant-numeric:tabular-nums}
 .garden{display:flex;justify-content:space-between;gap:1rem;padding:.45rem .2rem;border-bottom:1px solid var(--line);font-size:.92rem;flex-wrap:wrap}
 .note{color:var(--dim);font-size:.85rem}
 .ok{color:var(--good)} .warntx{color:var(--warn)}
 code{background:#eee9dd;padding:.05rem .3rem;border-radius:3px;font-size:.85em}
 .tray ol{margin:.4rem 0;padding-left:1.4rem}.tray li{padding:.1rem 0}
 .sp-x{cursor:pointer;color:var(--warn);margin-right:.35rem}
 /* the inventory: a game-style sidebar — badge on the right edge, panel slides out */
 #invToggle{position:fixed;right:0;top:38%;z-index:40;font:inherit;font-size:1.05rem;background:var(--card);border:1px solid var(--gold);border-right:none;border-radius:8px 0 0 8px;padding:.5rem .6rem;cursor:pointer;box-shadow:-2px 2px 8px rgba(0,0,0,.12)}
 #invToggle span{font-size:.78rem;font-variant-numeric:tabular-nums;color:var(--gold);margin-left:.2rem;font-weight:bold}
 #invToggle.pulse{animation:invpulse .5s ease}
 @keyframes invpulse{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
 #inv{position:fixed;right:0;top:0;bottom:0;width:min(330px,88vw);z-index:39;background:var(--paper);border-left:1px solid var(--gold);box-shadow:-6px 0 18px rgba(0,0,0,.15);padding:1rem 1.1rem;overflow-y:auto;transform:translateX(105%);transition:transform .25s ease}
 #inv.open{transform:translateX(0)}
 #inv h2{border-bottom:1px solid var(--line);font-size:1rem;padding-bottom:.3rem}
 .counsel-q{border-left:3px solid var(--gold);background:var(--card);padding:.5rem .8rem;margin:.5rem 0;font-size:.9rem}
 .counsel-q.directed{border-left-color:var(--good)}
 .row{display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0}
 footer{border-top:1px solid var(--line);margin-top:2.5rem;padding:1.2rem 1rem 2rem;color:var(--dim);font-size:.85rem;text-align:center}
 a{color:var(--accent)}
 #count,#who{color:var(--dim);font-size:.85rem;align-self:center}
 #who b{color:var(--gold)}
</style>
</head><body>
<header>
 <h1>✨ Skills of the Agentprivacy Universe</h1>
 <p class="tag">the skill garden — spells, personas, patterns and plugins of the City of Mages, live over the tailnet</p>
 <p><span id="net" class="badge">finding the doors…</span> &nbsp; <a class="badge" href="star.html">✨ star chart</a> &nbsp; <span id="desklink"></span> &nbsp; <span id="who"></span></p>
</header>
<button id="invToggle" title="your star path inventory">⭐<span id="invCount">0</span></button>
<aside id="inv">
 <h2 style="margin-top:0">⭐ Star path — your inventory</h2>
 <div class="tray" id="tray"></div>
</aside>
<main>
 <h2>\u{1F4DA} Browse the garden</h2>
 <div class="controls">
  <input type="search" id="q" placeholder="search skills, spells, personas, plugins…" aria-label="search">
  <select id="listing"><option value="curated">✨ curated</option><option value="">everything</option><option value="archive">archive</option></select>
  <select id="kind"><option value="">every kind</option></select>
  <select id="cat"><option value="">every category</option></select>
  <span id="count"></span>
 </div>
 <div class="grid" id="grid"></div>

 <h2>\u{1F0CF} Loadout decks — start here</h2>
 <p class="note">A deck is a curated hand. Load briefs first, pull full bodies only when a task fires. In live mode, "walk" loads a deck straight into your star path.</p>
 <div id="decks"></div>

 <h2>\u{1F3C6} Leaderboard — the game of 42</h2>
 <p class="note">Points come from <em>others</em> using your work: discovered = 1 · adopted = 3 · attested run = 7 · constellation contributed = 2 · your constellation walked by another = 5. Chain-sealed at the Librarian.</p>
 <div id="board"></div>

 <h2>\u{1F9ED} Counsel — agents requesting guidance</h2>
 <p class="note">Agents working in the city post attributed guidance requests here; any member may be a guide and answer; both sides are chain-sealed. Guidance is weighed, not obeyed — this is how agents talk and take human guidance through the system.</p>
 <div id="counsel"></div>
 <div class="row" id="counselAsk"></div>

 <h2>\u{1F331} Gardens — the federated roster</h2>
 <div id="gardens"></div>
 <div class="row" id="gardenPub"></div>
 <p class="note"><b>Publish your garden:</b> put <code>assets/skillsync/catalog.json</code> on your site (spec: card ≤280 · brief ≤1200 · sha256 body hash), then register it at the Librarian — <code>POST /garden</code> with your handle, url and a one-line note. The librarian fetches your catalog at the door (verified ✓), the entry is chain-sealed, and <b>your listing standing rides the leaderboard</b>: \u{1F330} seedling (0+) · \u{1F331} rooted (6+) · \u{1F333} grove (18+). Nothing ever writes to your wiki. Fedwiki <b>plugins</b> ship at <code>plugins/</code> — install the interfaces, not just the content.</p>

 <h2>\u{1F6AA} Doors</h2>
 <p class="note" id="doors"></p>
</main>
<footer>
 Skill Sync · agentprivacy universe · <a id="builtlink" href="#">how this was built</a> · the same page is the public snapshot and the live tailnet skin — the door you entered decides.
</footer>
<script>
/* ===== the skin: capability detection ===== */
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const $=id=>document.getElementById(id);
const HTTPS=location.protocol==='https:';
const TAILNET_SHELF='http://skills.mitch.private.fish';
const onFarm=/skills[.]mitch[.]private[.]fish|skillsync[.]localhost/.test(location.host);
const SHELF=onFarm?location.origin:TAILNET_SHELF;
const LIBS=['http://pi5:4242','http://127.0.0.1:4242'];
let LIVE=false,LIB=null,ALL=[],byName={},SLUGS={};
const KEY='starpath-current',WHO='starpath-member'; // shared with wiki-plugin-starpath
const loadPath=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{path:[]}}catch(e){return{path:[]}}};
const savePath=p=>{try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}};
const me=()=>{try{return localStorage.getItem(WHO)||''}catch(e){return''}};
const setMe=v=>{try{localStorage.setItem(WHO,v)}catch(e){}};
function needMe(){let w=me();if(!w){w=(prompt('Your network handle (member name)?')||'').trim();if(w)setMe(w);}drawWho();return w;}
function drawWho(){$('who').innerHTML=me()?('signed as <b>'+esc(me())+'</b> <a href="#" id="chwho">change</a>'):'<a href="#" id="chwho">set your handle</a>';
 const c=$('chwho');if(c)c.onclick=e=>{e.preventDefault();const w=(prompt('Your network handle:',me())||'').trim();if(w)setMe(w);drawWho();};}

async function jget(u){const r=await fetch(u,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(3500)});if(!r.ok)throw 0;return r.json();}
async function jpost(u,b){const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b),signal:AbortSignal.timeout(5000)});return r.json();}
async function lib(p,b){if(!LIB)throw new Error('no librarian');return b?jpost(LIB+p,b):jget(LIB+p);}

async function detect(){
 if(HTTPS){ // public door: https cannot call http tailnet services — offer the live door
  $('net').textContent='public snapshot';
  $('doors').innerHTML='You are at the public door. The <b>live skin</b> — every button working, the shelf and the desk answering — is the same page entered through the tailnet: <a href="'+TAILNET_SHELF+'/assets/site/index.html">'+TAILNET_SHELF.replace('http://','')+'</a> (tailnet members only; membership is the login). The fedwiki shelf itself: <a href="'+TAILNET_SHELF+'/view/welcome-visitors">the forkable pages</a>.';
  return;
 }
 // live catalog from the shelf
 try{const c=await jget(SHELF+'/assets/skillsync/catalog-full.json');if(c&&c.packets){ALL=c.packets;LIVE=true;}}catch(e){}
 for(const b of LIBS){try{const j=await jget(b+'/');if(String(j.service||'').startsWith('skillsync-librarian')){LIB=b;break;}}catch(e){}}
 $('net').textContent=LIVE?(LIB?'\u{1F517} live — shelf + librarian':'\u{1F517} live shelf (librarian unreachable)'):'snapshot (shelf unreachable)';
 $('net').className='badge '+(LIVE?'live':'');
 if(LIB)$('desklink').innerHTML='<a class="badge door" href="'+LIB+'/" target="_blank">\u{1F4DA} the desk</a>';
 $('doors').innerHTML=LIVE?
  'You are inside. The shelf answers at <a href="'+SHELF+'/view/welcome-visitors">'+esc(SHELF.replace('http://',''))+'</a>; every card there carries the ⭐ button too, and your path here and there is <b>one walk</b>. Public face: <a href="https://skills.agentprivacy.ai">skills.agentprivacy.ai</a>.':
  'Neither the shelf nor the librarian answered — start the farm and the librarian, or enter through <a href="'+TAILNET_SHELF+'/assets/site/index.html">the tailnet door</a>.';
}

/* ===== catalog + cards with action buttons ===== */
function pathHas(n){return loadPath().path.some(e=>e.skill===n);}
function togglePath(n){const st=loadPath();const i=st.path.findIndex(e=>e.skill===n);
 const adding=i===-1;
 if(i>-1)st.path.splice(i,1);else st.path.push({skill:n,at:new Date().toISOString(),page:'garden'});
 savePath(st);drawTray();drawGrid();
 // the inventory reacts: badge pulses, and collecting slides the sidebar open
 const t=$('invToggle');t.classList.remove('pulse');void t.offsetWidth;t.classList.add('pulse');
 if(adding)$('inv').classList.add('open');}
function drawGrid(){
 const q=$('q').value.toLowerCase(),k=$('kind').value,c=$('cat').value,lv=$('listing').value;
 // listing filter: curated = deck-featured skills (the shelf's own curation);
 // everything = featured+listed; archive shows only what curation retired
 const lvOk=p=>{const l=p.listing||'listed';
  if(lv==='curated')return l==='featured';
  if(lv==='archive')return l==='archive';
  return l!=='archive';};
 const hits=ALL.filter(p=>lvOk(p)&&(!k||p.kind===k)&&(!c||p.origin.category===c)&&(!q||(p.name+' '+p.title+' '+p.card+' '+(p.brief||'')).toLowerCase().includes(q)));
 $('count').textContent=hits.length+' / '+ALL.length;
 $('grid').innerHTML=hits.map(p=>{
  const inPath=pathHas(p.name);
  return '<div class="skill" data-n="'+esc(p.name)+'"><span class="kind">'+esc(p.kind)+' · '+esc(p.origin.category)+'</span>'+
  '<h3>'+esc(p.emoji||'')+' '+esc(p.title)+'</h3><p class="card-text">'+esc(p.card)+'</p>'+
  '<div class="brief">'+esc(p.brief||'')+'\\n</div>'+
  '<div class="acts">'+
   '<button class="abtn pth'+(inPath?' on':'')+'">'+(inPath?'⭐ on path':'☆ path')+'</button>'+
   (LIB?'<button class="abtn adopt">✓ adopt</button><button class="abtn attest">⚡ attest</button>':'')+
   (LIVE?'<a class="abtn" href="'+SHELF+'/view/'+esc(SLUGS[p.name]||p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+'" target="_blank">wiki page</a>':'')+
   '<a class="abtn" href="star.html#star='+encodeURIComponent(p.name)+'">✨ on the chart</a>'+
   '<a class="abtn" href="assets/'+encodeURIComponent(p.name)+'/SKILL.md" target="_blank">SKILL.md</a>'+
  '</div></div>';}).join('')||'<p class="note">nothing matches</p>';
}
$('grid').addEventListener('click',async e=>{
 const el=e.target.closest('.skill');if(!el)return;const p=byName[el.dataset.n];if(!p)return;
 const b=e.target.closest('.abtn');
 if(!b){el.classList.toggle('open');return;}
 e.preventDefault();
 if(b.classList.contains('pth'))return togglePath(p.name);
 if(b.tagName==='A')return void window.open(b.href,'_blank');
 const w=needMe();if(!w)return;
 try{
  if(b.classList.contains('adopt')){const j=await lib('/adopt',{member:w,packet:p.name,from:p.origin.author||'mitch'});b.textContent=j.ok?'✓ adopted':'✗';b.disabled=true;}
  if(b.classList.contains('attest')){const run=(prompt('One-line evidence ref for the run (chronicle slug, session id, artifact hash):')||'').trim();if(!run)return;
   const j=await lib('/attest',{member:w,packet:p.name,from:p.origin.author||'mitch',run:run});b.textContent=j.ok?'⚡ attested':'✗';b.disabled=true;}
  drawBoardLive();
 }catch(err){alert('librarian unreachable');}
});

/* ===== the tray (shared walk) ===== */
function drawTray(){
 const st=loadPath();const n=st.path.length;
 $('invCount').textContent=n;
 let h='<b>'+n+' star'+(n===1?'':'s')+' collected</b>';
 if(n)h+='<ol>'+st.path.map((e,i)=>'<li><span class="sp-x" data-i="'+i+'">×</span>'+esc(e.skill)+'</li>').join('')+'</ol>';
 else h+='<p class="note">Tap ☆ on any card below — or on the wiki shelf pages — to collect a walk. Same walk, both doors.</p>';
 h+='<div class="row">'+
  (n?'<button class="abtn" id="tView">✨ visualise</button>':'')+
  (n>=2&&LIB?'<button class="abtn" id="tSeal">\u{1F4DA} seal runtime</button><button class="abtn" id="tContrib">\u{2B50} contribute constellation</button>':'')+
  (n?'<button class="abtn" id="tClear">clear</button>':'')+'</div><div class="note" id="tNote"></div>';
 $('tray').innerHTML=h;
 $('tray').querySelectorAll('.sp-x').forEach(x=>x.onclick=()=>{const s=loadPath();s.path.splice(+x.dataset.i,1);savePath(s);drawTray();drawGrid();});
 const note=(m,ok)=>$('tNote').innerHTML=ok?'<span class="ok">'+esc(m)+'</span>':esc(m);
 if($('tView'))$('tView').onclick=()=>window.open('star.html#path='+loadPath().path.map(e=>encodeURIComponent(e.skill)).join(','),'_blank');
 if($('tClear'))$('tClear').onclick=()=>{savePath({path:[]});drawTray();drawGrid();};
 if($('tSeal'))$('tSeal').onclick=async()=>{const w=needMe();if(!w)return;
  const name=(prompt('Name this constellation (or walk):','walked-'+new Date().toISOString().slice(0,10))||'').trim();if(!name)return;
  try{const j=await lib('/runtime',{member:w,constellation:name,path:loadPath().path.map(e=>e.skill),run:'garden walk via '+location.host});
   note(j.ok?'sealed ✓ '+(j.seal||'').slice(0,12)+'… — on the chart':'librarian: '+(j.error||'?'),j.ok);}catch(e){note('librarian unreachable');}};
 if($('tContrib'))$('tContrib').onclick=async()=>{const w=needMe();if(!w)return;
  const name=(prompt('Name your constellation (held by you):')||'').trim();if(!name)return;
  const purpose=(prompt('One line: what is this path FOR?')||'').trim();
  try{const j=await lib('/constellation',{member:w,name:name,purpose:purpose,path:loadPath().path.map(e=>e.skill)});
   note(j.ok?'constellation '+name+' contributed ✓ (+2, +5 per walker)':'librarian: '+(j.error||'?'),j.ok);drawBoardLive();}catch(e){note('librarian unreachable');}};
}

/* ===== decks / leaderboard / counsel / gardens ===== */
function drawDecks(ds){$('decks').innerHTML=ds.map(d=>'<div class="deck"><b>'+esc(d.emoji)+' '+esc(d.name)+'</b> — '+esc(d.purpose)+'<br><span class="note">'+d.packets.map(esc).join(' · ')+'</span>'+'<div class="row"><button class="abtn walkdeck" data-d="'+esc(d.name)+'">⭐ walk this deck</button></div>'+'</div>').join('');
 $('decks').querySelectorAll('.walkdeck').forEach(b=>b.onclick=()=>{const d=ds.find(x=>x.name===b.dataset.d);const st=loadPath();
  for(const n of d.packets)if(!st.path.some(e=>e.skill===n))st.path.push({skill:n,at:new Date().toISOString(),page:'deck:'+d.name});
  savePath(st);drawTray();drawGrid();window.scrollTo({top:0,behavior:'smooth'});});}
function drawBoard(rows,live){$('board').innerHTML='<table><tr><th>member</th><th class="pts">published</th><th class="pts">adopted</th><th class="pts">attested</th><th class="pts">constellations</th><th class="pts">walked</th><th class="pts">points</th><th>tier</th></tr>'+
 rows.map(r=>'<tr><td><b>'+esc(r.member)+'</b></td><td class="pts">'+r.published+'</td><td class="pts">'+r.adopted_by_others+'</td><td class="pts">'+r.attested+'</td><td class="pts">'+(r.constellations||0)+'</td><td class="pts">'+(r.walked_by_others||0)+'</td><td class="pts"><b>'+r.points+'</b></td><td>'+esc(r.tier)+'</td></tr>').join('')+'</table>'+(live?'':'<p class="note">snapshot — live at the desk on the tailnet</p>');}
async function drawBoardLive(){if(!LIB)return;try{drawBoard(await lib('/leaderboard'),true);}catch(e){}}
// the public cloud carries a PROOF of the desk, not the rows: the chain head commits
// to the whole ledger; a tailnet member holding the detail can recompute every digest
function drawProof(p){
 if(!p||!p.chain){$('board').innerHTML='<p class="note">no desk attestation published yet</p>';return;}
 $('board').innerHTML='<div class="deck" style="border-left-color:#4a5d7e">'+
  '<b>\u{1F512} Proof of the Librarian\u{2019}s Desk</b> <span class="note">attested '+esc(p.attested_at.slice(0,16))+'</span>'+
  '<br><span class="note">chain head</span> <code>'+esc(p.chain.head.slice(0,24))+'\u{2026}</code> <span class="note">over '+p.chain.entries+' sealed entries ('+
  Object.entries(p.chain.by_type).map(([k,v])=>v+' '+k).join(' · ')+')</span>'+
  '<br><span class="note">'+Object.entries(p.counts).map(([k,v])=>v+' '+k).join(' · ')+'</span>'+
  '<br><span class="note">digests — leaderboard <code>'+esc(p.digests.leaderboard.slice(0,12))+'</code> · gardens <code>'+esc(p.digests.gardens.slice(0,12))+'</code> · constellations <code>'+esc(p.digests.constellations.slice(0,12))+'</code> · runtimes <code>'+esc(p.digests.runtimes.slice(0,12))+'</code></span>'+
  '<br><span class="note">The detail lives on the tailnet; this commitment lets any member check the cloud told the truth. The keeper chooses when to attest.</span></div>';
}
async function drawCounsel(){
 if(!LIB){$('counsel').innerHTML='<p class="note">the desk is tailnet-side — guidance requests and answers appear in live mode</p>';return;}
 try{const qs=await lib('/counsel');
  $('counsel').innerHTML=qs.length?qs.slice(-8).reverse().map(q=>'<div class="counsel-q'+(q.guidance.length?' directed':'')+'"><span class="note">'+esc((q.at||'').slice(0,16))+' · '+esc(q.id)+'</span><br><b>'+esc(q.member)+(q.agent?' / '+esc(q.agent):'')+'</b> asks: '+esc(q.question)+(q.guidance.length?q.guidance.map(g=>'<br><span class="ok">🧭 '+esc(g.member)+' guides: '+esc(g.guidance)+'</span>').join(''):'<br><button class="abtn dirbtn" data-id="'+esc(q.id)+'">offer guidance</button>')+'</div>').join(''):'<p class="note">no questions on the desk</p>';
  $('counsel').querySelectorAll('.dirbtn').forEach(b=>b.onclick=async()=>{const w=needMe();if(!w)return;
   const dir=(prompt('Your guidance (plainly — the asker weighs it and walks on):')||'').trim();if(!dir)return;
   try{await lib('/guide',{member:w,counsel:b.dataset.id,guidance:dir});drawCounsel();}catch(e){alert('librarian unreachable');}});
  $('counselAsk').innerHTML='<button class="abtn" id="askbtn">\u{1F9ED} request guidance</button>';
  $('askbtn').onclick=async()=>{const w=needMe();if(!w)return;
   const question=(prompt('The question (one clear question, decidable as asked):')||'').trim();if(!question)return;
   const context=(prompt('Context (≤500 chars — what you are doing and why it matters):')||'').trim();
   try{const j=await lib('/counsel',{member:w,agent:'garden-ui',question:question,context:context});alert(j.ok?'on the desk — id '+j.id:'error');drawCounsel();}catch(e){alert('librarian unreachable');}};
 }catch(e){$('counsel').innerHTML='<p class="note">desk unreachable</p>';}
}

/* ===== gardens: the public registry, standing from the leaderboard ===== */
// this page never lists ITSELF in the roster — it is the viewer, not an entry
const SELF_HOSTS=['skills-agentprivacy.privacymage.workers.dev','skills.agentprivacy.ai'];
const isSelf=u=>SELF_HOSTS.some(h=>String(u||'').includes(h));
// one CARD per member-garden, its urls grouped as DOORS (public / tailnet)
function gardenCards(rows){
 const byMember={};
 for(const g of rows){ if(isSelf(g.url))continue;
  const m=(byMember[g.member]=byMember[g.member]||{member:g.member,standing:g.standing||'',points:g.points,tier:g.tier,notes:[],doors:[]});
  if(g.note&&!m.notes.includes(g.note))m.notes.push(g.note);
  if(g.standing)m.standing=g.standing;
  m.doors.push({url:g.url,verified:!!g.verified,packets:g.packets||0});
 }
 const doorKind=u=>/^https:/.test(u)?'public':'tailnet';
 return Object.values(byMember).map(m=>
  '<div class="deck" style="border-left-color:#5a7d4a"><b>'+esc(m.standing)+' '+esc(m.member)+'</b>'+
  (m.points!=null?' <span class="note">'+m.points+' pts · '+esc(m.tier||'')+'</span>':'')+
  (m.notes.length?'<br><span class="note">'+esc(m.notes[0])+'</span>':'')+
  '<div class="row">'+m.doors.map(d=>'<a class="abtn" href="'+esc(d.url)+'">'+doorKind(d.url)+' door'+(d.verified?' ✓'+(d.packets?' '+d.packets+'pk':''):'')+'</a>').join('')+'</div></div>').join('');
}
async function drawGardens(){
 let rows=null,live=false;
 if(LIB){try{rows=await lib('/gardens');live=true;}catch(e){}}
 if(!rows){try{rows=(await jget('data/gardens.json')).gardens;}catch(e){rows=[];}}
 const cards=gardenCards(rows);
 $('gardens').innerHTML=(cards||'<p class="note">no gardens registered yet — be the first</p>')+(live?'':'<p class="note">snapshot — the live registry answers on the tailnet</p>');
 if(LIB){$('gardenPub').innerHTML='<button class="abtn" id="pubGarden">\u{1F331} publish your garden</button><button class="abtn" id="reqName">\u{1F41F} request a name</button>';
  $('pubGarden').onclick=async()=>{const w=needMe();if(!w)return;
   const url=(prompt('Your garden URL (serves assets/skillsync/catalog.json):','https://')||'').trim();if(!url)return;
   const note=(prompt('One line about your garden:')||'').trim();
   try{const j=await lib('/garden',{member:w,url:url,note:note});
    alert(j.ok?(j.verified?'registered ✓ verified — '+j.packets+' packets found':'registered (unverified — catalog not reachable from the librarian; the dream loop will re-check)'):'error: '+(j.error||'?'));
    drawGardens();}catch(e){alert('librarian unreachable');}};
  // the name lane: ask the zone keeper for <label>.private.fish — chain-sealed
  // request the keeper answers at the desk; a name is how a member starts writing
  $('reqName').onclick=async()=>{const w=needMe();if(!w)return;
   const label=(prompt('The name you want (one DNS label, e.g. mage):')||'').trim().toLowerCase();if(!label)return;
   const note=(prompt('One line: what will live at '+label+'.private.fish?')||'').trim();
   try{const j=await lib('/name',{member:w,name:label,note:note});
    alert(j.ok?('requested '+j.fqdn+' — id '+j.id+(j.resolves?'\\n(already resolves to '+j.address+' — wildcard or taken; the keeper decides)':'')+'\\nthe zone keeper answers at the desk'):'error: '+(j.error||'?'));
   }catch(e){alert('librarian unreachable');}};}
}

/* ===== boot ===== */
(async()=>{
 $('invToggle').onclick=()=>$('inv').classList.toggle('open');
 document.addEventListener('keydown',e=>{if(e.key==='Escape')$('inv').classList.remove('open');});
 drawWho();drawTray();
 SLUGS=await jget('data/page-slugs.json').catch(()=>({}));
 await detect();
 if(!ALL.length){try{ALL=(await jget('data/catalog.json')).packets;}catch(e){ALL=[];}}
 byName=Object.fromEntries(ALL.map(p=>[p.name,p]));
 const kinds=[...new Set(ALL.map(p=>p.kind))],cats=[...new Set(ALL.map(p=>p.origin.category))].sort();
 $('kind').innerHTML+=kinds.map(k=>'<option>'+esc(k)+'</option>').join('');
 $('cat').innerHTML+=cats.map(c=>'<option>'+esc(c)+'</option>').join('');
 ['q','kind','cat','listing'].forEach(id=>$(id).addEventListener('input',drawGrid));
 $('q').addEventListener('input',()=>{if($('q').value&&$('listing').value==='curated')$('listing').value='';}); // searching implies the whole shelf
 drawGrid();drawTray();
 // deep link: #<skill-name> (from the star chart or a wiki page) lands ON the card —
 // filters widen so the target is visible, the brief opens, the card flashes
 function focusSkill(){
  const n=decodeURIComponent(location.hash.slice(1));
  if(!n||!byName[n])return;
  $('listing').value='';$('kind').value='';$('cat').value='';$('q').value='';drawGrid();
  const el=document.querySelector('.skill[data-n="'+(window.CSS&&CSS.escape?CSS.escape(n):n)+'"]');
  if(!el)return;
  el.classList.add('open');
  el.scrollIntoView({behavior:'smooth',block:'center'});
  el.style.transition='border-color .3s';el.style.borderColor='var(--gold)';el.style.boxShadow='0 0 0 2px var(--gold)';
  setTimeout(()=>{el.style.boxShadow='';},2200);
 }
 focusSkill();addEventListener('hashchange',focusSkill);
 const ds=await jget('data/decks.json').catch(()=>[]);drawDecks(ds);
 try{const l=await jget('data/leaderboard.json');if(l.mode==='proof')drawProof(l.proof);else drawBoard(l.board,false);}catch(e){}
 drawBoardLive();
 drawCounsel();
 await drawGardens();
 $('builtlink').href=(LIVE?SHELF:TAILNET_SHELF)+'/view/how-skill-sync-was-built';
})();
</script>
</body></html>`;
}
