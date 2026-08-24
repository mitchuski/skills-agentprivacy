// attest-desk.js — seal a PROOF of the librarian's desk for the public site.
// The keeper runs this when they CHOOSE to publish desk state; the public cloud
// gets commitments, the tailnet keeps the detail. Because the ledger is a hash
// chain, chain_head commits to the entire history: a tailnet member holding the
// detail can recompute every digest here and check the cloud told the truth.
//   node bin/attest-desk.js        (librarian must be reachable)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
// canonical: stable key order so a verifier's recompute matches byte-for-byte
const canon = o => o === null || typeof o !== 'object' ? JSON.stringify(o)
  : Array.isArray(o) ? '[' + o.map(canon).join(',') + ']'
  : '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + canon(o[k])).join(',') + '}';

(async () => {
  let base = null;
  for (const b of [cfg.librarian.url, 'http://127.0.0.1:4444']) {
    try { const j = await (await fetch(b + '/', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) })).json();
      if (String(j.service || '').startsWith('skillsync-librarian')) { base = b; break; } } catch (e) {}
  }
  if (!base) { console.error('no librarian reachable — nothing to attest'); process.exit(1); }
  const j = p => fetch(base + p, { headers: { Accept: 'application/json' } }).then(r => r.json());
  const [ledger, board, gardens, cons, runtimes] = await Promise.all([j('/ledger'), j('/leaderboard'), j('/gardens'), j('/constellations'), j('/runtimes')]);

  const byType = {};
  for (const e of ledger) byType[e.type] = (byType[e.type] || 0) + 1;
  const chainHead = ledger.length ? sha(JSON.stringify(ledger[ledger.length - 1])) : 'genesis';

  const proof = {
    spec: 'desk-proof/0.1',
    attested_at: new Date().toISOString(),
    desk: 'the librarian of the agentprivacy skill sync',
    chain: { head: chainHead, entries: ledger.length, by_type: byType },
    digests: {
      leaderboard: sha(canon(board)),
      gardens: sha(canon(gardens)),
      constellations: sha(canon(cons)),
      runtimes: sha(canon(runtimes))
    },
    counts: { members: board.length, gardens: gardens.length, constellations: cons.length, runtimes: runtimes.length },
    verify: 'On the tailnet: GET the detail from the librarian, canonicalize (sorted keys), sha256, compare. The chain head = sha256 of the last ledger line; each entry.prev = sha256 of the previous line, so the head commits to the whole history.'
  };
  fs.writeFileSync(path.join(ROOT, 'registry', 'desk-proof.json'), JSON.stringify(proof, null, 2));
  console.log('desk attested: ' + ledger.length + ' entries · head ' + chainHead.slice(0, 16) + ' · ' +
    Object.entries(proof.counts).map(([k, v]) => v + ' ' + k).join(' · '));
  console.log('registry/desk-proof.json — bake with build-static, publish when YOU choose (git push)');
})();
