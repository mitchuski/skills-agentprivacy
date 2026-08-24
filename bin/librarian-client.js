// librarian-client.js — talk to the pi5 librarian.
//   node bin/librarian-client.js status
//   node bin/librarian-client.js submit <packet-name>          (from registry/packets/)
//   node bin/librarian-client.js adopt <packet-name> [--from <author>]
//   node bin/librarian-client.js attest <packet-name> --from <author> --run "<trace ref>"
//   node bin/librarian-client.js leaderboard
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const LOCAL = 'http://127.0.0.1:4242';
// prefer the configured librarian (pi5); fall back to a local one if the configured
// host doesn't answer as a skillsync-librarian (e.g. pi5 not deployed yet)
async function resolveBase() {
  for (const base of [cfg.librarian.url, LOCAL]) {
    try {
      const r = await fetch(base + '/', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
      const j = await r.json();
      if (j && String(j.service || '').startsWith('skillsync-librarian')) return base;
    } catch (e) { /* try next */ }
  }
  throw new Error('no librarian answering at ' + cfg.librarian.url + ' or ' + LOCAL);
}
let BASE = cfg.librarian.url;
const [cmd, name] = process.argv.slice(2);
const flag = f => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : undefined; };

async function call(method, p, bodyObj) {
  const r = await fetch(BASE + p, {
    method,
    headers: bodyObj ? { 'Content-Type': 'application/json' } : {},
    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
    signal: AbortSignal.timeout(8000)
  });
  const j = await r.json().catch(() => ({}));
  console.log(r.status, JSON.stringify(j, null, 2));
}

(async () => {
  BASE = await resolveBase();
  if (BASE !== cfg.librarian.url) console.log('(using local librarian at ' + BASE + ')');
  if (cmd === 'status') return call('GET', '/');
  if (cmd === 'leaderboard') return call('GET', '/leaderboard');
  if (cmd === 'submit') {
    const packet = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'packets', name + '.json'), 'utf8'));
    return call('POST', '/submit', { member: cfg.member, packet });
  }
  if (cmd === 'adopt') return call('POST', '/adopt', { member: cfg.member, packet: name, from: flag('--from') || 'mitch' });
  if (cmd === 'attest') return call('POST', '/attest', { member: cfg.member, packet: name, from: flag('--from'), run: flag('--run') || '' });
  if (cmd === 'runtime') return call('POST', '/runtime', { member: cfg.member, constellation: name, path: (flag('--path') || '').split(',').filter(Boolean), run: flag('--run') || '' });
  if (cmd === 'runtimes') return call('GET', '/runtimes');
  if (cmd === 'constellation') return call('POST', '/constellation', { member: cfg.member, name, purpose: flag('--purpose') || '', path: (flag('--path') || '').split(',').filter(Boolean) });
  if (cmd === 'constellations') return call('GET', '/constellations');
  if (cmd === 'counsel') return call('POST', '/counsel', { member: cfg.member, agent: flag('--agent') || '', question: name, context: flag('--context') || '' });
  if (cmd === 'guide' || cmd === 'direct') return call('POST', '/guide', { member: cfg.member, counsel: name, guidance: flag('--guidance') || flag('--direction') || '' });
  if (cmd === 'counsels') return call('GET', '/counsel');
  console.log('usage: status | submit <name> | adopt <name> [--from a] | attest <name> --from a --run "ref" | runtime <constellation> --path a,b,c --run "ref" | runtimes | leaderboard');
})().catch(e => { console.error('librarian unreachable: ' + e.message); process.exit(1); });
