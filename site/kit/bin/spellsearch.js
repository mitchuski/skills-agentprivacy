// spellsearch.js — observe working directories and rank them by skill-richness:
// which of them hold methods worth minting into skill packets for the sync.
// Mechanical signals only; the spell-search agent skill reads the evidence and drafts.
//
//   node bin/spellsearch.js                 survey every top-level dir under ~
//   node bin/spellsearch.js <dir> [dir...]  survey specific directories
//   node bin/spellsearch.js --json          machine output only
//
// Signals per directory (depth ≤ 3):
//   SKILL.md files not yet in the catalog        (instant candidates — just add a source)
//   method docs: *RULES* *PROTOCOL* *SPEC* *CHECKLIST* *PLAYBOOK* *METHOD* *WORKFLOW*
//                *HARNESS* *CEREMONY* *RUNBOOK* .md — written-down repeatable process
//   run evidence: runs/ chronicles/ notes/ artefacts/ census/ — the method actually ran
//   project brain: CLAUDE.md or .claude/skills — a directory Claude worked in
//   recency: newest mtime among the evidence
// Score = evidence-weighted; a dir with docs AND runs beats a dir with docs alone.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const HOME = 'C:/Users/mitch';
const JSON_ONLY = process.argv.includes('--json');
const targets = process.argv.slice(2).filter(a => a !== '--json');

let inCatalog = new Set();
try { inCatalog = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'catalog.json'), 'utf8')).packets.map(p => p.name)); } catch (e) {}
const sourceRoots = cfg.sources.map(s => s.root.toLowerCase());

const SKIP = new Set(['appdata', 'application data', 'onedrive', 'desktop', 'documents', 'downloads', 'pictures', 'music', 'videos', 'links', 'favorites', 'contacts', 'searches', 'saved games', 'local settings', 'nethood', 'printhood', 'recent', 'sendto', 'start menu', 'templates', 'my documents', 'cookies', '__pycache__', 'node_modules', '.git', '.wiki', '.claude', '.cursor', '.agents', 'skill sync', '_snapshots']);
const METHOD_RE = /(RULES|PROTOCOL|SPEC|CHECKLIST|PLAYBOOK|METHOD|WORKFLOW|HARNESS|CEREMONY|RUNBOOK|PLAN|GATE|CANON)[^/\\]*\.md$/i;
const RUN_DIRS = new Set(['runs', 'chronicles', 'notes', 'artefacts', 'artifacts', 'census', 'sweeps', 'overlays', 'audits', 'specs']);

function survey(dir, depth, acc) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
  for (const e of entries) {
    const name = e.name;
    if (SKIP.has(name.toLowerCase()) || name.startsWith('node_modules')) continue;
    const p = path.join(dir, name);
    if (e.isDirectory()) {
      if (RUN_DIRS.has(name.toLowerCase())) acc.runDirs.push(name);
      if (name === '.claude' && fs.existsSync(path.join(p, 'skills'))) acc.brain.push('.claude/skills');
      if (depth < 3 && name !== '.claude') survey(p, depth + 1, acc);
    } else {
      if (name === 'SKILL.md') {
        let skillName = path.basename(path.dirname(p));
        try { const m = fs.readFileSync(p, 'utf8').match(/^\s*name:\s*(.+)$/m); if (m) skillName = m[1].trim().replace(/^["']|["']$/g, ''); } catch (err) {}
        acc.skills.push({ name: skillName, path: p, covered: inCatalog.has(skillName) });
      } else if (name === 'CLAUDE.md') acc.brain.push('CLAUDE.md');
      else if (METHOD_RE.test(name)) acc.docs.push(name);
      try { const mt = fs.statSync(p).mtimeMs; if (mt > acc.newest) acc.newest = mt; } catch (err) {}
    }
  }
}

function scoreDir(dirPath) {
  const acc = { skills: [], docs: [], runDirs: [], brain: [], newest: 0 };
  survey(dirPath, 0, acc);
  // attribution rule: a bare `-main` dir is a vendored copy of someone else's repo —
  // its skills/docs are NOT ours to publish; only a mage layer wrapped around it is.
  const vendored = /-main$/i.test(dirPath);
  const newSkills = acc.skills.filter(s => !s.covered);
  const ageDays = acc.newest ? (Date.now() - acc.newest) / 864e5 : 9999;
  const recency = ageDays < 14 ? 3 : ageDays < 60 ? 2 : ageDays < 180 ? 1 : 0;
  const score =
    newSkills.length * 10 +                                    // ready to harvest
    Math.min(acc.docs.length, 8) * 3 +                         // written method
    Math.min(acc.runDirs.length, 4) * 4 +                      // the method RAN
    (acc.brain.length ? 3 : 0) +                               // Claude worked here
    (acc.docs.length && acc.runDirs.length ? 6 : 0) +          // docs × runs = a real practice
    recency;
  return { dir: dirPath.split('/').pop() || dirPath, path: dirPath, score: vendored ? 0 : score, vendored, newSkills: newSkills.map(s => s.name), coveredSkills: acc.skills.length - newSkills.length, methodDocs: acc.docs.slice(0, 6), runDirs: [...new Set(acc.runDirs)].slice(0, 6), brain: [...new Set(acc.brain)], lastTouched: acc.newest ? new Date(acc.newest).toISOString().slice(0, 10) : '?' };
}

const dirs = targets.length
  ? targets.map(t => path.resolve(t).split(path.sep).join('/'))
  : fs.readdirSync(HOME, { withFileTypes: true })
      .filter(e => e.isDirectory() && !SKIP.has(e.name.toLowerCase()) && !e.name.startsWith('.') && !e.name.startsWith('NTUSER'))
      .map(e => HOME + '/' + e.name)
      .filter(p => !sourceRoots.some(r => p.toLowerCase().startsWith(r)));

const results = dirs.map(scoreDir).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
fs.mkdirSync(path.join(ROOT, 'surveys'), { recursive: true });
const out = { at: new Date().toISOString(), surveyed: dirs.length, candidates: results };
fs.writeFileSync(path.join(ROOT, 'surveys', new Date().toISOString().slice(0, 10) + '-survey.json'), JSON.stringify(out, null, 2));

if (JSON_ONLY) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }
console.log('surveyed ' + dirs.length + ' dirs — ' + results.length + ' with signal — top 25:\n');
for (const r of results.slice(0, 25)) {
  console.log(String(r.score).padStart(3) + '  ' + r.dir + '  (touched ' + r.lastTouched + ')');
  if (r.newSkills.length) console.log('      NEW SKILL.md: ' + r.newSkills.join(', '));
  if (r.methodDocs.length) console.log('      docs: ' + r.methodDocs.join(', '));
  if (r.runDirs.length) console.log('      ran:  ' + r.runDirs.join(', ') + (r.brain.length ? '   brain: ' + r.brain.join(', ') : ''));
}
console.log('\nfull results: surveys/' + new Date().toISOString().slice(0, 10) + '-survey.json');
