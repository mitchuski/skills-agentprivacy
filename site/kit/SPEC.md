# Skill Sync SPEC v0.1 — packet · protocol · trust ladder

## 1. The Skill Packet

One skill/spell/persona/pattern/agent-file = one JSON packet. Neutral envelope, lore
inside. Three zoom levels so a fresh model can load exactly as much as it needs:

```json
{
  "spec": "skill-packet/0.1",
  "name": "agentprivacy-kyra",
  "kind": "persona",                 // skill | persona | pattern | agent | ceremony
  "title": "Kyra",
  "emoji": "☯️💎",
  "card": "≤ 280 chars — what it is + when it fires. The tweet.",
  "brief": "≤ 1200 chars — enough to decide to load it. First paragraphs of the body.",
  "body_ref": "assets/<name>/SKILL.md",   // full text travels as an asset, not inline
  "origin": { "author": "mitch", "site": "skill.localhost", "universe": "agentprivacy",
               "category": "persona", "tier": "0", "version": "5.0" },
  "hash": "sha256 of the full SKILL.md body",
  "published": "2026-08-24T00:00:00Z",
  "requires": [],                     // packet names this one assumes loaded
  "trust": { "adoptions": 0, "attested_runs": 0 }
}
```

Rules:
- `name` is globally unique per author; `hash` makes versions comparable across farms.
- `card` is MANDATORY and is the only thing a discovery notification carries.
- A **loadout** is `{ "name", "purpose", "packets": [names...] }` — a curated deck.
  Loadouts are the density fix: a new model loads a deck, not the corpus.

## 2. Publication (how a skill becomes discoverable)

A participant's farm publishes, on any site it controls:
- `assets/skillsync/catalog.json` — `{ member, updated, packets: [packet...] }` (cards +
  briefs; bodies stay as assets). This is the machine door.
- One fedwiki page per packet (human door), plus a `Skill Shelf` index page.

That's it. No push, no registration. **Publishing = putting the catalog where the
roster can GET it.** The fedwiki pages make every packet forkable — a fork into your
own farm is itself the first trust signal (fork = countersignature, embassy canon).

## 2.1 The garden registry

`POST /garden {member, url, note}` at the librarian publishes a garden into the public
registry: the librarian fetches `<url>/assets/skillsync/catalog.json` at the door
(verified flag + packet count recorded, chain-sealed). `GET /gardens` lists the latest
entry per url with the member’s leaderboard standing deciding the LISTING TIER:
🌰 seedling 0+ · 🌱 rooted 6+ · 🌳 grove 18+. Verified gardens join every dream-loop
pass automatically. Packets also carry a `listing` level (featured = deck-curated ·
listed · archive via config patterns); public UIs default to the curated view.

## 3. Discovery (the dream loop)

Each participant runs `bin/dreamloop.js` (or the `skillsync-dreamloop` agent skill) on
whatever cadence they like. One pass:

1. GET every roster entry's `catalog.json` (falling back to `system/sitemap.json` diff
   for farms that publish pages but no catalog).
2. Diff against `state/<member>.json` → events: `new-skill`, `updated-skill`
   (hash changed), `removed`.
3. Append events to `events/events.jsonl` (the local dream journal).
4. POST each `new-skill` card to marvin's ntfy topic → every subscribed phone/desktop
   gets "🧙 max published spell-x: <card>".
5. Rewrite the `Recent Discoveries` page on the local shelf.

Read-only against everyone else's farms, always.

## 4. Submission & adoption (the pi5 librarian)

Discovery is passive; **adoption is the game**. The librarian (pi5) is the neutral
counter that turns use into credentials:

- `POST /submit` — a member offers a packet for network adoption (lands in the inbox;
  librarian's keeper reviews before it enters the recommended catalog).
- `POST /adopt {member, packet, from}` — "I loaded X's skill and I'm keeping it."
  Appends to a hash-chained ledger (each entry carries the previous entry's hash —
  same seal shape as the VPKB audit log).
- `POST /attest {member, packet, run}` — "I ran it and it worked" + a one-line trace ref.
- `GET /leaderboard` — computed from the ledger, never stored.

## 5. Trust ladder (game-of-42 growth)

Points are earned by OTHERS using your work, not by publishing volume:

| event | points |
|---|---|
| packet published & discovered | 1 |
| adopted by another member | 3 |
| attested run by another member | 7 |
| constellation contributed (`POST /constellation`) | 2 |
| your constellation walked by another member (their runtime on it) | 5 |

| tier | points | standing |
|---|---|---|
| 🚶 Wanderer | 0 | publishing |
| 👍 Hitchhiker | 6 | first adoptions |
| 🧭 Guide | 18 | skills in others' daily decks |
| 📚 Librarian | **42** | may seal submissions into the recommended catalog |

Credentials = ledger excerpts: any member can present their adoption receipts, and any
verifier can recompute the chain. This is a trust task in the KY-A sense — the walk
evidence is the ledger, the seal is the chain head.

## 6. Constellations & constellation runtimes

A **constellation** is a named, ordered path of packets — every loadout deck is one,
and members may draw their own. A **constellation runtime** is the sealed record of an
agent actually walking a path in a real session:

```json
POST /runtime  { "member": "mitch", "constellation": "skill-sync-genesis",
                 "path": ["skillsync-dreamloop", "spell-search"],
                 "run": "one-line evidence ref (chronicle slug, session id, artifact hash)" }
```

Runtimes land on the same hash chain as adoptions — the walk evidence IS the
credential (the same shape as the VPKB pathway grants: constellation = scoped path,
runtime = sealed walk). The star chart (`site/star.html`) draws stars (packets),
real-relation edges (frontmatter kinship · body mentions · deck neighbourhood),
deck constellations, and the recorded runtimes: the sky fills with paths that were
really flown.

## 6.1 Compression artefacts (the harness bridge)

A constellation compresses into a single **skill artefact** (`skill-artefact/0.1`,
via `bin/compress-constellation.js`): purpose + ordered walk + each member skill at
card/brief zoom + pull-lines for full bodies + a **seal** — sha256 over the member
body-hashes in path order. One context-window-sized file for a dual-agent harness
seat: the Mage (proposer) seat holds the artefact; the Swordsman (gate) seat holds
the working item's acceptance criteria, apart. Runs cite the seal, so a sealed
runtime names exactly which skill versions it flew. Artefacts publish at
`site/artefacts/` + `artefacts/index.json`. The librarian-harness method
(`skillsync-librarian-harness`) is the select → compress → seat → walk → seal loop.

## 7. What stays out of scope (v0.1)

- No write access to anyone else's wiki, ever — forks and submissions only.
- No secrets in packets (harvest refuses files matching the leak patterns).
- No auto-adoption: an agent may *recommend* a discovered skill; a member adopts.
