---
name: agentprivacy-guide-gatehouse
description: >
  Operate the Gatehouse — sigil-gates that hide documents encrypted inside the
  public guide.agentprivacy.ai static site behind a two-token trust ceremony
  (emoji sigil + canon proverb → PBKDF2 → AES-GCM, decrypted client-side at
  /gates/). Use when adding a gate for new documents (letters, meeting prep,
  mageletters, agentic outputs), rebuilding or deploying the guide (the gate
  build is a MANDATORY post-snapshot step), choosing/minting sigil+proverb
  tokens, testing that gates open, or auditing the site for token leaks before
  a push. Encodes the crypto/normalization spec, the letter-keyed vs
  canon-keyed gate classes, the deploy path (Workers, NOT Pages), and the
  gotchas that cost rounds.
---

# The Gatehouse — sigil-gates for the agentprivacy guide

Documents sealed **inside the public static site**, opened by a two-token
ceremony. The Swordsman guards the gate; the visitor is the mage who casts
the spell. Plan + public register: `agentprivacy.guide/GATES.md`. Chronicle:
`~/.wiki/chronicles/2026-07-02_gatehouse_sigil_gates.md`.

Canonical twin: `agentprivacy-skills-v5/wikis/agentprivacy-guide-gatehouse/`
— kept by the **Gatekeeper 🗡️👤** (first non-Librarian keeper in wikis/);
aspects: **Cipher 🗡️🔐** (crypto spec) · **Herald 🧙📡** (correspondence /
mageletters) · **Registry-keeper ⚚** (the gate register); authored by the
**Chronicler 🧙📖**. Registered in the suite's MAPPING.md. **Swordsman-aligned**:
this is where the lore enters the Swordsman — the first door into the canon
where the visitor meets a refusal overcome only by reading; the boundary is
the pedagogy.

## The design in three lines

- **sigil** (emoji string) = address + entropy: `id = hex(SHA-256(sigilN))[:12]`
  names the blob and salts the key.
- **proverb** (canon line) = proof of reading.
- key = `PBKDF2-SHA256(sigilN + "\n" + proverbN, salt "gatehouse:"+id,
  310000 iters)` → AES-256-GCM. Neither token opens anything alone.

Normalization (identical in builder and door — never fork it):
- sigil: `NFC` → strip all whitespace → strip `U+FE0F` (write it `️` in
  regexes; the literal char is invisible and fragile). ZWJ kept.
- proverb: `NFC` → lowercase → non-letter/digit runs (Unicode-aware) → single
  space → trim. Case/punctuation/spacing can never fork the key.

## File map (`~\agentprivacy.guide`)

| path | committed? | role |
|---|---|---|
| `GATES.md` | yes | plan + public gate register (ids + hints ONLY) |
| `flow/gates.local.json` | **NO — gitignored** | the key register: plaintext sigil, proverb, hint, absolute doc paths |
| `tools/gate.mjs` | yes | builder: md→HTML (marked), encrypt, emit door |
| `site/gates/index.html` | yes | the door (self-contained; inline WebCrypto) |
| `site/gates/manifest.json` | yes | public `[{id, hint}]` |
| `site/gates/<id>.json` | yes | sealed blob `{v, id, iv, ct}` |

Source documents stay OUTSIDE the repo (e.g. `~/Downloads`,
`cityofmages/mageletters/`). Only ciphertext is committed.

## Operations

### Add a gate

1. Pick tokens. Prefer tokens the documents already carry (epigraph sigil
   line + proverb — the founding move: letters carry their own keys). If
   minting: sigil = 4-6 emoji, distinctive, high-entropy; proverb = a real
   line of the canon. Record which **class** (below).
2. Append the gate object to `flow/gates.local.json`:
   `{name, title, note, hint, sigil, proverb, docs: [{path, title}]}`.
   The hint is PUBLIC — it must point a reader at where the tokens live
   without containing them.
3. Build + test + deploy (below).

### Build · test · deploy (the full loop)

```sh
cd ~\agentprivacy.guide
node tools/snapshot.mjs     # only if wiki content changed (clears site/!)
node tools/gate.mjs         # MANDATORY after every snapshot (nav links /gates/)
node flow/run.mjs verify    # integrity gate — must PASS
# round-trip test: decrypt every gate with door-identical code, wrong-token
# refusal, cross-gate refusal, manifest-leak check (script pattern in the
# chronicle; rewrite in scratchpad if absent)
npx wrangler deploy --assets site --name agentprivacy-guide --compatibility-date 2026-07-01
```

**Deploy truth: guide.agentprivacy.ai is a WORKERS project
(`agentprivacy-guide`, account privacymage), NOT Cloudflare Pages.** Its
git-connected Workers Builds freeze at "Initializing build environment"
(Cloudflare-side; commit content is irrelevant). The wrangler direct deploy
above is the standing path (~30 s, hash-deduped). Needs one-time
`npx wrangler login` (interactive — user runs `! npx wrangler login`).

### Pre-push leak sweep (ALWAYS, before any commit)

```sh
grep -rl "<each sigil>" . | grep -v node_modules | grep -v .git
grep -rl "<each proverb>" . | grep -v node_modules | grep -v .git
```

Every hit must be `flow/gates.local.json` — nothing else. (This sweep once
caught GATES.md itself closing with half a proverb as a flourish.) Also
confirm: `git check-ignore flow/gates.local.json` returns the ignore rule.

## Gate classes — declare one per gate

- **letter-keyed** (e.g. gate 001, TIG × AIDDA): tokens travel only inside
  sent documents. Proof of receipt. Genuinely strong — the sigil is
  unguessable without the artefact in hand.
- **canon-keyed** (e.g. gate 002, the Archon Exchange — sigil
  `(⚔️⊥⿻⊥🧙)😊`, proverb *three solar systems, one teaching*): both tokens
  sit in the open canon. Zero secrecy BY DESIGN — a reading rite, proof of
  having read the City's record. Never put anything behind a canon-keyed
  gate you'd mind a diligent stranger reading.

## Honest limits (state them when asked "is it secure")

- Encryption is real (live blob: no plaintext fragments, entropy ~7.999
  bits/byte) but the wall is TOKEN ENTROPY: blobs are public; offline
  guessing works and GCM confirms hits; PBKDF2 only prices each guess.
- Deferred-public: opened plaintext is re-shareable; blob size leaks length.
- NEVER credential-class or cookie-class material behind a gate.
- No unlock telemetry exists. If a gate needs a witness, that's the myTerms
  future arc, not analytics.

## Gotchas (each cost a round)

1. `tools/snapshot.mjs` clears `site/` → gate build is a mandatory
   post-snapshot step; nav's ⚔️ Gatehouse item 404s without it.
2. The door page must contain `<article>` — the audit's empty-page rule only
   reads `<article>` text.
3. A literal `href="` inside the door's inline JS trips the audit link
   scanner — keep it split in source (`'h' + 'ref='`).
4. `deadLinkSweep` in snapshot.mjs runs before the gate build and must exempt
   `/gates/` (already patched) — the audit enforces existence afterwards.
5. Run `node tools/gate.mjs` from the repo root (module resolution).
6. Git Bash mangles `/gates/` inside curl `-w` format strings into
   `C:/Program Files/Git/...` — use PowerShell or full URLs for probes.

## Future arcs (planned in GATES.md §7, not built)

City Key PNG on unlock (tEXt + κ machinery in tileglyph/game42) · myTerms
agreement step between decrypt and render · tileglyph tiles whose glyph IS
the sigil · per-recipient sigils (which sigil surfaces tells you which copy
walked) · gates roster page in the guide.

## Candidate vaults already scouted (2026-07-02)

Searls/MyTerms set (proverb exists: *"What does not collapse, composes."*) ·
plat0x · proof-of-personhood-zk (*"The impossibility theorem is the proof
that the gap was always load-bearing."*) · UOR · Lionsberg · Bakhta · Burgess
· KYA-OS DIF contribution — files in `~/Downloads`; mageletters (the
canonical primitive, cityofmages chronicle 2026-05-12) are the natural
supply line: the Gatehouse is their SENT-but-unpublished sharing room.
