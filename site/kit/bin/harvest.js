// harvest.js — walk the configured skill sources, build one neutral skill-packet per
// SKILL.md, and write registry/catalog.json + registry/packets/<name>.json.
// Bodies are NOT inlined: they're staged under registry/assets/<name>/SKILL.md so the
// shelf can serve them as forkable/downloadable assets. Leak patterns refuse a packet.
//   node bin/harvest.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const regDir = path.join(ROOT, 'registry');
const pkDir = path.join(regDir, 'packets');
const asDir = path.join(regDir, 'assets');
fs.mkdirSync(pkDir, { recursive: true });
fs.mkdirSync(asDir, { recursive: true });

const leakRes = cfg.leak_patterns.map(p => new RegExp(p));
const exclRes = (cfg.exclude_patterns || []).map(p => new RegExp(p));

// --- frontmatter parsing (matches the corpus conventions) ---
function parseFm(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: '', body: raw };
  return { fm: m[1], body: m[2] };
}
function fmGet(fm, key) {
  const m = fm.match(new RegExp('^\\s*' + key + ':\\s*(.+)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}
function fmDesc(fm) {
  const m = fm.match(/^description:\s*[>|][-+]?\s*\r?\n([\s\S]*?)(?=^\S|(?![\s\S]))/m);
  if (m) return m[1].split('\n').map(l => l.trim()).filter(Boolean).join(' ');
  return fmGet(fm, 'description');
}

const clip = (s, n) => { s = (s || '').trim(); return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…'; };

// --- PII neutralization (publication boundary only — sources stay untouched) ---
// Personal names, email, home paths and the machine name become neutral role terms.
// Functional URLs/hostnames (github repo links, *.mitch.private.fish, *.ts.net) are
// guarded first and restored after: scrubbing them would break working links, and the
// repo/tailnet addresses are deliberate public attribution. Reported, not scrubbed.
//
// The personal terms live in pii.local.json (GITIGNORED — the scrub list would
// otherwise republish the very PII it scrubs). Shape: {"replacements": [[regex,
// flags, replacement], ...]}. Missing file = neutralization off, loudly.
let PII = [];
try {
  PII = JSON.parse(fs.readFileSync(path.join(ROOT, 'pii.local.json'), 'utf8'))
    .replacements.map(([re, fl, to]) => [new RegExp(re, fl), to]);
} catch (e) {
  console.warn('WARN: pii.local.json missing/unreadable — publishing WITHOUT PII neutralization');
}
function neutralize(text) {
  const guards = [];
  const guard = m => { guards.push(m); return '\x00G' + (guards.length - 1) + '\x00'; };
  let t = String(text)
    .replace(/https?:[^\s)\]"']+/gi, guard)
    .replace(/github\.com\/[\w.-]+/gi, guard)
    .replace(/[\w-]+(?:\.[\w-]+)*\.(?:fish|ts\.net)\b/gi, guard);
  for (const [re, to] of PII) t = t.replace(re, to);
  return t.replace(/\x00G(\d+)\x00/g, (_, i) => guards[+i]);
}

// brief = description + first non-heading body paragraphs, up to 1200 chars
function makeBrief(desc, body) {
  const paras = body.replace(/\r\n/g, '\n').split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p && !p.startsWith('#') && !p.startsWith('---') && !p.startsWith('```'));
  let out = desc || '';
  for (const p of paras) {
    if (out.length > 900) break;
    const flat = p.replace(/\n/g, ' ');
    if (!out.includes(flat.slice(0, 60))) out += (out ? '\n\n' : '') + flat;
  }
  return clip(out, 1200);
}

const deckMembers = new Set();
try { for (const f of fs.readdirSync(path.join(ROOT, 'loadouts'))) if (f.endsWith('.json')) JSON.parse(fs.readFileSync(path.join(ROOT, 'loadouts', f), 'utf8')).packets.forEach(n => deckMembers.add(n)); } catch (e) {}
const archRes = (cfg.archive_patterns || []).map(p => new RegExp(p));
const packets = [];
const refused = [];

for (const src of cfg.sources) {
  for (const dir of src.dirs) {
    const base = path.join(src.root, dir);
    if (!fs.existsSync(base)) { console.warn('missing source dir: ' + base); continue; }
    for (const entry of fs.readdirSync(base)) {
      const skillPath = path.join(base, entry, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;
      const raw = fs.readFileSync(skillPath, 'utf8');
      const leak = leakRes.find(re => re.test(raw));
      if (leak) { refused.push({ name: entry, reason: 'leak pattern ' + leak }); continue; }
      const { fm, body } = parseFm(raw);
      const name = fmGet(fm, 'name') || entry;
      const excl = exclRes.find(re => re.test(name));
      if (excl) { refused.push({ name, reason: 'excluded by filter ' + excl }); continue; }
      const pub = neutralize(raw); // what actually publishes (and what the hash covers)
      const desc = fmDesc(fm);
      const kind = src.kind_by_dir[dir] || 'skill';
      const stat = fs.statSync(skillPath);
      const packet = {
        spec: 'skill-packet/0.1',
        name,
        kind,
        title: name.replace(/^agentprivacy-/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        emoji: fmGet(fm, 'emoji'),
        card: neutralize(clip(desc, 280)),
        brief: neutralize(makeBrief(desc, body)),
        body_ref: 'assets/' + name + '/SKILL.md',
        origin: {
          author: cfg.member,
          universe: src.universe,
          category: src.category || (dir === '.' ? 'workbench' : dir),
          tier: fmGet(fm, 'tier'),
          version: fmGet(fm, 'version'),
          alignment: fmGet(fm, 'alignment'),
          source_path: neutralize(skillPath.split(path.sep).join('/'))
        },
        hash: crypto.createHash('sha256').update(pub).digest('hex'), // hash of the PUBLISHED body — peers can verify what they downloaded
        published: stat.mtime.toISOString(),
        listing: archRes.some(re => re.test(name)) ? 'archive' : (deckMembers.has(name) ? 'featured' : 'listed'),
        requires: [],
        trust: { adoptions: 0, attested_runs: 0 }
      };
      // stage the full body as an asset
      const aDir = path.join(asDir, name);
      fs.mkdirSync(aDir, { recursive: true });
      fs.writeFileSync(path.join(aDir, 'SKILL.md'), pub);
      fs.writeFileSync(path.join(pkDir, name + '.json'), JSON.stringify(packet, null, 2));
      // same name in a later source = the working copy; it supersedes the corpus one
      const prior = packets.findIndex(p => p.name === name);
      if (prior > -1) packets.splice(prior, 1);
      packets.push(packet);
    }
  }
}

// prune registry orphans: packets/bodies from earlier runs that no longer harvest
const keep = new Set(packets.map(p => p.name));
for (const f of fs.readdirSync(pkDir)) {
  const n = f.replace(/[.]json$/, '');
  if (!keep.has(n)) { fs.unlinkSync(path.join(pkDir, f)); console.log('pruned packet: ' + n); }
}
for (const d of fs.readdirSync(asDir)) {
  if (!keep.has(d)) { fs.rmSync(path.join(asDir, d), { recursive: true }); console.log('pruned body: ' + d); }
}

packets.sort((a, b) => a.name.localeCompare(b.name));
const catalog = {
  spec: 'skill-catalog/0.1',
  member: cfg.member,
  updated: new Date().toISOString(),
  count: packets.length,
  packets: packets.map(p => ({ ...p, brief: undefined }))  // catalog = cards only; briefs live in packets/
};
fs.writeFileSync(path.join(regDir, 'catalog.json'), JSON.stringify(catalog, null, 2));
// full catalog (cards + briefs) for the shelf's machine door
fs.writeFileSync(path.join(regDir, 'catalog-full.json'), JSON.stringify({ ...catalog, packets }, null, 2));

console.log('harvested ' + packets.length + ' packets');
const byKind = {};
for (const p of packets) byKind[p.kind] = (byKind[p.kind] || 0) + 1;
console.log(JSON.stringify(byKind));
if (refused.length) { console.log('REFUSED (leak patterns):'); refused.forEach(r => console.log('  ' + r.name + ' — ' + r.reason)); }
