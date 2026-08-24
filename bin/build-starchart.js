// build-starchart.js — generate the skill star chart: site/star.html + data/starchart.json.
// Stars = packets, grouped into sky sectors by category. Edges = REAL relations only:
//   related_skills frontmatter · explicit packet-name mentions in bodies · deck co-membership.
// Constellations = the loadout decks (named line-figures) + recorded constellation
// runtimes (agents' walked paths, from the librarian ledger — baked at build, live on tailnet).
//   node bin/build-starchart.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), 'utf8'));
const SITE = path.join(ROOT, 'site');
fs.mkdirSync(path.join(SITE, 'data'), { recursive: true });

const packets = catalog.packets;
const byName = Object.fromEntries(packets.map(p => [p.name, p]));
const names = packets.map(p => p.name);

// --- positions: category sectors around the sky, deterministic per name ---
const cats = [...new Set(packets.map(p => p.origin.category))].sort();
const hash = s => parseInt(crypto.createHash('sha256').update(s).digest('hex').slice(0, 8), 16);
const stars = packets.map(p => {
  const ci = cats.indexOf(p.origin.category);
  const a0 = (ci / cats.length) * Math.PI * 2, a1 = ((ci + 1) / cats.length) * Math.PI * 2;
  const h1 = hash(p.name) / 0xffffffff, h2 = hash(p.name + '#r') / 0xffffffff;
  const ang = a0 + 0.06 + h1 * (a1 - a0 - 0.12);
  const rad = 160 + h2 * 320; // ring band
  return {
    name: p.name, title: p.title, emoji: p.emoji, kind: p.kind, cat: p.origin.category,
    tier: p.origin.tier || '', card: p.card,
    x: Math.round(500 + rad * Math.cos(ang)), y: Math.round(500 + rad * Math.sin(ang)),
    m: p.kind === 'persona' ? 5 : p.kind === 'pattern' ? 4.5 : 3.5 // magnitude
  };
});

// --- edges: real relations only ---
const edges = new Map(); // 'a|b' sorted key -> {a,b,w,why}
const addEdge = (a, b, why) => {
  if (a === b || !byName[a] || !byName[b]) return;
  const k = a < b ? a + '|' + b : b + '|' + a;
  const e = edges.get(k) || { a: a < b ? a : b, b: a < b ? b : a, w: 0, why: [] };
  e.w++; if (!e.why.includes(why)) e.why.push(why);
  edges.set(k, e);
};
// related_skills frontmatter + name mentions in bodies
for (const p of packets) {
  let raw = '';
  try { raw = fs.readFileSync(path.join(ROOT, 'registry', 'assets', p.name, 'SKILL.md'), 'utf8'); } catch (e) { continue; }
  const rel = raw.match(/related_skills:\s*\n((?:\s*-\s*.+\n)+)/);
  if (rel) for (const line of rel[1].split('\n')) {
    const m = line.match(/-\s*(?:[\w-]+\/)?([\w-]+)\s*$/);
    if (m && byName[m[1]]) addEdge(p.name, m[1], 'related');
  }
  for (const other of names) {
    if (other !== p.name && raw.includes(other)) addEdge(p.name, other, 'mentions');
  }
}
// deck co-membership (chain, not clique — constellations draw the figure anyway)
const decks = fs.readdirSync(path.join(ROOT, 'loadouts')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'loadouts', f), 'utf8')));
for (const d of decks) for (let i = 0; i + 1 < d.packets.length; i++) addEdge(d.packets[i], d.packets[i + 1], 'deck:' + d.name);

// cap: keep the strongest ~600 edges so the sky stays legible
const edgeList = [...edges.values()].sort((x, y) => y.w - x.w).slice(0, 600);

// --- constellations: decks + baked runtimes from the librarian ---
(async () => {
  let runtimes = [], contributed = [];
  try {
    const r = await fetch('http://127.0.0.1:4242/runtimes', { signal: AbortSignal.timeout(3000) });
    if (r.ok) runtimes = await r.json();
    const c = await fetch('http://127.0.0.1:4242/constellations', { signal: AbortSignal.timeout(3000) });
    if (c.ok) contributed = await c.json();
  } catch (e) { /* librarian offline — chart ships without baked runtimes */ }

  const data = {
    built: new Date().toISOString(),
    cats,
    stars,
    edges: edgeList,
    constellations: decks.map(d => ({ name: d.name, emoji: d.emoji, path: d.packets, kind: 'deck' }))
      .concat(contributed.map(c => ({ name: c.name, emoji: c.emoji || '\u{2B50}', path: c.path, kind: 'contributed', member: c.member, purpose: c.purpose }))),
    runtimes: runtimes.map(r => ({ member: r.member, constellation: r.constellation, path: r.path, run: r.run, at: r.at }))
  };
  fs.writeFileSync(path.join(SITE, 'data', 'starchart.json'), JSON.stringify(data));
  fs.writeFileSync(path.join(SITE, 'star.html'), page());
  console.log('star chart: ' + stars.length + ' stars · ' + edgeList.length + ' edges · ' +
    data.constellations.length + ' deck constellations · ' + runtimes.length + ' recorded runtimes');

  // mirror into the farm assets alongside the rest of the static site
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
  const farmSite = path.join(cfg.shelf.farm_assets, 'site');
  fs.mkdirSync(path.join(farmSite, 'data'), { recursive: true });
  fs.copyFileSync(path.join(SITE, 'star.html'), path.join(farmSite, 'star.html'));
  fs.copyFileSync(path.join(SITE, 'data', 'starchart.json'), path.join(farmSite, 'data', 'starchart.json'));
  console.log('mirrored: /assets/site/star.html');
})();

function page() {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Skill Star Chart</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<style>
 :root{--sky:#0b0e1a;--sky2:#141a30;--ink:#dfe3f0;--dim:#7c86a8;--line:#2a3354;--gold:#e8c76a;--teal:#6ad0c8;--rose:#e08a9b;--vio:#a48ae0}
 *{box-sizing:border-box} html,body{height:100%}
 body{margin:0;background:radial-gradient(ellipse at 50% 38%,var(--sky2),var(--sky) 70%);color:var(--ink);font:14px/1.5 Georgia,serif;overflow:hidden}
 #chart{position:absolute;inset:0;cursor:grab} #chart:active{cursor:grabbing}
 .hud{position:absolute;z-index:5;background:rgba(11,14,26,.88);border:1px solid var(--line);border-radius:8px;padding: .7rem .9rem;backdrop-filter:blur(4px)}
 #title{top:1rem;left:1rem;max-width:300px}
 #title h1{font-size:1.05rem;margin:0;letter-spacing:.06em;color:var(--gold)}
 #title p{margin:.3rem 0 0;color:var(--dim);font-size:.8rem}
 #legend{bottom:1rem;left:1rem;font-size:.78rem;max-width:270px}
 #cons{top:1rem;right:1rem;font-size:.8rem;max-width:250px;max-height:70vh;overflow:auto}
 #cons h2,#legend h2{font-size:.8rem;margin:0 0 .3rem;color:var(--gold);letter-spacing:.08em;text-transform:uppercase}
 .cbtn{display:block;width:100%;text-align:left;background:none;border:1px solid var(--line);border-radius:5px;color:var(--ink);font:inherit;padding:.25rem .5rem;margin:.2rem 0;cursor:pointer}
 .cbtn:hover{border-color:var(--gold)} .cbtn.on{border-color:var(--gold);color:var(--gold)}
 .rt{border-left:2px solid var(--teal);padding-left:.45rem;margin:.35rem 0;color:var(--dim)}
 .rt b{color:var(--teal)}
 #tip{display:none;pointer-events:none;max-width:300px;font-size:.82rem;z-index:9}
 #tip b{color:var(--gold)} #tip .k{color:var(--dim);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
 .cat-label{fill:var(--dim);font-size:13px;letter-spacing:.18em;opacity:.7}
 a{color:var(--teal)}
</style></head><body>
<svg id="chart" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet"></svg>
<div class="hud" id="title"><h1>\u{2728} THE SKILL STAR CHART</h1><p>every star a skill · lines are real relations (frontmatter kinship, body mentions, deck neighbours) · constellations are decks and recorded runtimes</p><p><a href="index.html">\u{2190} the garden</a></p></div>
<div class="hud" id="cons"><h2>Constellations</h2><div id="decklist"></div><h2 style="margin-top:.6rem">Runtimes</h2><div id="rtlist"><span style="color:var(--dim)">none recorded yet — an agent walks a path and records it at the Librarian:<br><code>POST /runtime {path:[...]}</code></span></div></div>
<div class="hud" id="legend"><h2>Reading the sky</h2><div id="leg"></div><div style="color:var(--dim);margin-top:.3rem">brightness = kind (personas burn brightest) · drag to pan · wheel to zoom · hover a star</div></div>
<div class="hud" id="tip"></div>
<script>
const S=document.getElementById('chart'),NS='http://www.w3.org/2000/svg';
const el=(t,at)=>{const n=document.createElementNS(NS,t);for(const k in at)n.setAttribute(k,at[k]);return n};
const KC={persona:'var(--gold)',skill:'#cfd8ee',pattern:'var(--vio)',agent:'var(--teal)',ceremony:'var(--rose)',plugin:'#6ad06a'};
let D=null,active=null;
fetch('data/starchart.json').then(r=>r.json()).then(d=>{
 D=d;
 // a walked path arriving via the hash (#path=a,b,c — from the starpath plugin)
 const hm=location.hash.match(/path=([^&]+)/);
 if(hm){const p=hm[1].split(',').map(decodeURIComponent).filter(Boolean);
  if(p.length){D.constellations.unshift({name:'your walk',emoji:'\u{1F463}',path:p,kind:'walk'});active='your walk';}}
 draw();
 // live contributed constellations + runtimes when on the tailnet
 fetch('http://pi5:4242/constellations',{signal:AbortSignal.timeout(2500)}).then(r=>r.json()).then(cs=>{
  let added=false;
  for(const c of cs){if(!D.constellations.some(x=>x.name===c.name)){D.constellations.push({name:c.name,emoji:c.emoji||'\u{2B50}',path:c.path,kind:'contributed',member:c.member,purpose:c.purpose});added=true;}}
  if(added)draw();
 }).catch(()=>{});
});
function draw(){
 S.innerHTML='';
 const eg=el('g',{}),cg=el('g',{}),sg=el('g',{}),lg=el('g',{});
 S.append(eg,cg,lg,sg);
 const P=Object.fromEntries(D.stars.map(s=>[s.name,s]));
 // sector labels
 D.cats.forEach((c,i)=>{
  const a=((i+.5)/D.cats.length)*Math.PI*2;
  const t=el('text',{x:500+560*Math.cos(a),y:500+560*Math.sin(a),'text-anchor':'middle','class':'cat-label'});
  t.textContent=c.toUpperCase();lg.append(t);
 });
 for(const e of D.edges){const a=P[e.a],b=P[e.b];if(!a||!b)continue;
  eg.append(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'var(--line)','stroke-width':Math.min(e.w,3)*.35,opacity:.5}));}
 window._cg=cg;window._P=P;
 for(const s of D.stars){
  const c=el('circle',{cx:s.x,cy:s.y,r:s.m*.9,fill:KC[s.kind]||'#fff',opacity:.92});
  c.style.cursor='pointer';
  c.addEventListener('mouseenter',ev=>tip(s,ev));c.addEventListener('mouseleave',()=>{document.getElementById('tip').style.display='none'});
  c.addEventListener('click',()=>{location.href='index.html#'+encodeURIComponent(s.name)});
  sg.append(c);
  if(s.kind==='persona'){sg.append(el('circle',{cx:s.x,cy:s.y,r:s.m*2.2,fill:'none',stroke:KC.persona,opacity:.25}));}
 }
 document.getElementById('leg').innerHTML=Object.entries(KC).map(([k,v])=>'<span style="color:'+v+'">●</span> '+k).join(' &nbsp; ');
 const dl=document.getElementById('decklist');
 dl.innerHTML='';
 for(const c of D.constellations){
  const b=document.createElement('button');b.className='cbtn';
  b.textContent=c.emoji+' '+c.name+' ('+c.path.length+')'+(c.kind==='contributed'?' — by '+c.member:'');
  if(c.purpose)b.title=c.purpose;
  if(active===c.name)b.classList.add('on');
  b.onclick=()=>{active=active===c.name?null:c.name;[...dl.children].forEach(x=>x.classList.remove('on'));if(active)b.classList.add('on');figure()};
  dl.append(b);
 }
 figure();
 if(D.runtimes.length){
  document.getElementById('rtlist').innerHTML=D.runtimes.slice(-8).reverse().map(r=>'<div class="rt"><b>'+r.member+'</b> walked <b>'+r.constellation+'</b> ('+r.path.length+' skills)'+(r.run?'<br>'+r.run:'')+'</div>').join('');
 }
 // live runtimes when on the tailnet
 fetch('http://pi5:4242/runtimes',{signal:AbortSignal.timeout(2500)}).then(r=>r.json()).then(rs=>{
  if(rs.length)document.getElementById('rtlist').innerHTML=rs.slice(-8).reverse().map(r=>'<div class="rt"><b>'+r.member+'</b> walked <b>'+r.constellation+'</b> ('+r.path.length+' skills) \u{1F517}live'+(r.run?'<br>'+r.run:'')+'</div>').join('');
 }).catch(()=>{});
 function figure(){
  cg.innerHTML='';
  if(!active)return;
  const c=D.constellations.find(x=>x.name===active);if(!c)return;
  for(let i=0;i+1<c.path.length;i++){const a=P[c.path[i]],b=P[c.path[i+1]];if(!a||!b)continue;
   cg.append(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'var(--gold)','stroke-width':1.4,opacity:.85,'stroke-dasharray':'1 0'}));}
  for(const n of c.path){const s=P[n];if(!s)continue;cg.append(el('circle',{cx:s.x,cy:s.y,r:s.m*1.9,fill:'none',stroke:'var(--gold)','stroke-width':1,opacity:.9}));}
 }
}
function tip(s,ev){
 const t=document.getElementById('tip');
 t.innerHTML='<span class="k">'+s.kind+' · '+s.cat+(s.tier?' · tier '+s.tier:'')+'</span><br><b>'+(s.emoji||'')+' '+s.title+'</b><br>'+s.card.slice(0,160);
 t.style.display='block';t.style.left=Math.min(ev.clientX+14,innerWidth-320)+'px';t.style.top=Math.min(ev.clientY+10,innerHeight-140)+'px';
}
// pan/zoom
let vb=[0,0,1000,1000],drag=null;
const apply=()=>S.setAttribute('viewBox',vb.join(' '));apply();
S.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,...vb]});
addEventListener('pointerup',()=>drag=null);
addEventListener('pointermove',e=>{if(!drag)return;const k=vb[2]/S.clientWidth;vb[0]=drag[2]-(e.clientX-drag[0])*k;vb[1]=drag[3]-(e.clientY-drag[1])*k;apply()});
S.addEventListener('wheel',e=>{e.preventDefault();const f=e.deltaY>0?1.12:.89;const mx=vb[0]+vb[2]*e.offsetX/S.clientWidth,my=vb[1]+vb[3]*e.offsetY/S.clientHeight;
 vb[2]*=f;vb[3]*=f;vb[0]=mx-(mx-vb[0])*f;vb[1]=my-(my-vb[1])*f;apply()},{passive:false});
</script></body></html>`;
}
