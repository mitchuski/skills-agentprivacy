// compress-constellation.js — compress a constellation (ordered path of skills) into a
// single COMPRESSION ARTEFACT: a context-window-sized working brief the dual-agent
// harness can load into a seat, instead of N separate briefs or full bodies.
//
//   node bin/compress-constellation.js <constellation-name>     (deck or contributed)
//   node bin/compress-constellation.js --list
//
// The artefact carries: the constellation header (name, purpose, ordered path), each
// member skill compressed to card + brief + a pull-line for the full body, and a SEAL:
// sha256 over the member packets' body hashes in path order — so a harness run can
// cite exactly which skill versions its seat was loaded with (compression provenance,
// kappa-style: the artefact names what it compresses and how to expand it back).
// Artefacts land in artefacts/<name>.md + artefacts/index.json, and mirror to the
// static site so the network can fetch them.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), 'utf8'));
const byName = Object.fromEntries(catalog.packets.map(p => [p.name, p]));
const AR = path.join(ROOT, 'artefacts');
fs.mkdirSync(AR, { recursive: true });

async function allConstellations() {
  const decks = fs.readdirSync(path.join(ROOT, 'loadouts')).filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'loadouts', f), 'utf8')))
    .map(d => ({ name: d.name, emoji: d.emoji, purpose: d.purpose, path: d.packets, member: cfg.member, kind: 'deck' }));
  let contributed = [];
  for (const base of [cfg.librarian.url, 'http://127.0.0.1:4444']) {
    try {
      const r = await fetch(base + '/constellations', { signal: AbortSignal.timeout(3000) });
      if (r.ok) { contributed = (await r.json()).map(c => ({ ...c, kind: 'contributed' })); break; }
    } catch (e) { /* next */ }
  }
  const seen = new Set();
  return decks.concat(contributed).filter(c => (seen.has(c.name) ? false : seen.add(c.name)));
}

(async () => {
  const cons = await allConstellations();
  const arg = process.argv[2];
  if (!arg || arg === '--list') {
    console.log(cons.map(c => c.kind + ': ' + c.name + ' (' + c.path.length + ')').join('\n'));
    return;
  }
  const c = cons.find(x => x.name === arg);
  if (!c) { console.error('no such constellation: ' + arg + ' (use --list)'); process.exit(1); }

  const members = c.path.map(n => byName[n]).filter(Boolean);
  const missing = c.path.filter(n => !byName[n]);
  const seal = crypto.createHash('sha256').update(members.map(p => p.hash).join('\n')).digest('hex');

  const lines = [];
  lines.push('---');
  lines.push('spec: skill-artefact/0.1');
  lines.push('constellation: ' + c.name);
  lines.push('kind: ' + c.kind + (c.member ? '  # held by ' + c.member : ''));
  lines.push('path: [' + c.path.join(', ') + ']');
  lines.push('seal: ' + seal + '  # sha256 over member body-hashes in path order');
  lines.push('compressed: ' + new Date().toISOString());
  lines.push('expand: GET <garden>/assets/skillsync/<name>/SKILL.md per skill; verify sha256 against packet hash');
  lines.push('---');
  lines.push('');
  lines.push('# ' + (c.emoji ? c.emoji + ' ' : '') + c.name + ' — compression artefact');
  lines.push('');
  if (c.purpose) lines.push('**Purpose:** ' + c.purpose);
  lines.push('**The walk:** ' + c.path.map((n, i) => (i + 1) + '. ' + n).join(' → '));
  lines.push('');
  lines.push('Load this artefact into a harness seat instead of ' + c.path.length + ' separate briefs. Pull a');
  lines.push('full body ONLY when its step actually fires; cite the seal in the run record so the');
  lines.push('walk can name exactly which skill versions it flew.');
  lines.push('');
  members.forEach((p, i) => {
    lines.push('## ' + (i + 1) + '. ' + (p.emoji ? p.emoji + ' ' : '') + p.title + ' (`' + p.name + '`)');
    lines.push('');
    lines.push('> ' + p.card);
    lines.push('');
    lines.push(p.brief);
    lines.push('');
    lines.push('*full body:* `assets/skillsync/' + p.name + '/SKILL.md` · *hash* `' + p.hash.slice(0, 16) + '`');
    lines.push('');
  });
  if (missing.length) lines.push('> ⚠ not in this garden\'s catalog (pull from the author\'s): ' + missing.join(', '));
  lines.push('---');
  lines.push('*On completing a real walk with this artefact: seal the runtime —*');
  lines.push('`POST /runtime {"member":"you","constellation":"' + c.name + '","path":[...],"run":"<evidence> · artefact ' + seal.slice(0, 12) + '"}`');

  const out = lines.join('\n');
  fs.writeFileSync(path.join(AR, c.name + '.md'), out);
  // index + mirror to the static site data
  const idxPath = path.join(AR, 'index.json');
  const idx = fs.existsSync(idxPath) ? JSON.parse(fs.readFileSync(idxPath, 'utf8')) : { artefacts: [] };
  idx.artefacts = idx.artefacts.filter(a => a.constellation !== c.name)
    .concat([{ constellation: c.name, kind: c.kind, seal, packets: members.length, bytes: out.length, at: new Date().toISOString(), ref: 'artefacts/' + c.name + '.md' }]);
  fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2));
  for (const dst of [path.join(ROOT, 'site', 'artefacts'), path.join(cfg.shelf.farm_assets, 'site', 'artefacts')]) {
    fs.mkdirSync(dst, { recursive: true });
    fs.copyFileSync(path.join(AR, c.name + '.md'), path.join(dst, c.name + '.md'));
    fs.copyFileSync(idxPath, path.join(dst, 'index.json'));
  }
  console.log('artefact: artefacts/' + c.name + '.md · ' + members.length + ' skills compressed to ' +
    (out.length / 1024).toFixed(1) + 'KB · seal ' + seal.slice(0, 16) + ' · mirrored to site');
})();
