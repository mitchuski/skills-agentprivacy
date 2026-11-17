---
name: agentprivacy-wiki-sync
description: >
  Sync the agentprivacy canon into the federated guide wiki — guide.agentprivacy.ai
  plus sibling subdomain sites (skill / tomes / research / atlas), served locally as
  ~/.wiki farm hosts. Use when projecting a canon directory into forkable wiki pages,
  adding a new area to the federation, re-syncing a site after a repo change, wiring
  cross-site links, or auditing coverage and leaks. Encodes the distribution gates
  G0–G7, the manifest-first G1 discipline, the per-source builders, the verification
  recipes, and the full registry of every area to sync (done + gaps).
license: Apache-2.0
metadata:
  version: "1.0"
  origin: "0xagentprivacy"
  author: "the Keeper"
  tooling: "~/.wiki/skill-fedwiki/"
  plan: "~/.claude/plans/moonlit-stirring-lagoon.md"
  related_skills: "fedwiki-cohere-sync, agentprivacy-wiki-page, agentprivacy-wiki-to-skill, tile-from-page"
---

# agentprivacy-wiki-sync

Project the agentprivacy canon (many git repos) into a **federated, forkable wiki**: a guide hub
(`guide.agentprivacy.ai`) that rosters one sibling subdomain wiki per canon source. Built local-first as
`~/.wiki/<host>/` farm hosts; going public is just forking the host up (or DNS-mapping the farm) —
`localhost` → the agentprivacy domain, no structural change.

**Golden rule:** the git repo is always the source of truth. The wiki is a *projection that carries lineage*.
*The Librarian forks; the Archivist never copies.*

## The model

```
guide.localhost  ← the hub (build-guide-host.js): index · federation-map · distribution-gates · contribute
   ├─ skill.localhost     ← agentprivacy-skills-v5
   ├─ tomes.localhost     ← cityofmages/tomes
   ├─ research.localhost  ← agentprivacy-docs
   ├─ atlas.localhost     ← spellweb/src/data  (the graph — the hyperlink backbone)
   └─ library.localhost   ← agentprivacy_master/public  (the 5 narrative spellbooks)
```
Serve all hosts: `"$HOME/AppData/Roaming/npm/wiki" --data ~/.wiki --port 3030 --farm`
(use the ABSOLUTE wiki path — a bare `wiki` exits 127). Log: `~/.wiki/_farm.log`.
Each host = `pages/<slug>` + `assets/<slug>/<file>` + `status/owner.json` (`{name:"<owner>",friend:{secret:"<friend-secret — never commit the live value>"}}`).

## The area registry — everything to sync (NAME ALL AREAS HERE)

Status: ✅ done · ◻️ gap (public canon not yet federated) · 🔒 sealed (never federate) · ♻️ dup (never double-federate).

| Area | Source path | → Site | Builder | Status |
|---|---|---|---|---|
| Skills | `agentprivacy-skills-v5/{persona,role,privacy-layer,meta,wikis}` | skill | `build-all.js` (projects `agentprivacy-*` folders only; `skillsync-herald` is outside it) | ✅ 198 (2026-11-12) |
| Tome acts + cast + specs + bestiary + invitations | `cityofmages/tomes/` | tomes | `build-tomes.js` | ✅ 121 |
| Conjecture register + v6 papers | `agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md` + `papers/v6/*` | research | `build-research.js` | ✅ 94 |
| Knowledge graph (nodes+edges) | `spellweb/src/data/{nodes,edges}.ts` | atlas | `build-atlas.js` | ✅ ~660 |
| The hub (index/map/gates/contribute) | — | guide | `build-guide-host.js` | ✅ |
| Ceremonies | `agentprivacy-docs/ceremonies/` | research | `build-research.js` (buildDocs) | ✅ 14 |
| Compendium | `agentprivacy-docs/compendium/_assembled/` | research | `build-research.js` (buildDocs) | ✅ 2 (PLAN.md sealed) |
| Reference | `agentprivacy-docs/reference/` | research | `build-research.js` (buildDocs) | ✅ 10 |
| Lineage + whitepaper papers | `agentprivacy-docs/papers/{lineage,v4,v5,whitepapers}` | research | `build-research.js` (buildDocs) | ✅ 11 |
| Grimoire prose | `agentprivacy-docs/grimoires/` | research | `build-research.js` (buildDocs) | ✅ 4 |
| City blog + letters + lore | `cityofmages/{blog,mageletters}` + top-level public `.md` | tomes | `build-tomes.js` (buildDocsFrom CITY) | ✅ blog 13 · letters 6 · lore 7 |
| Blockchain canon + blade prose | `spellweb/dist/canon/` + root `*-blade.md` | atlas | `build-atlas.js` (buildCanon) | ✅ canon 25 · blades 5 |
| Architecture guides | `agentprivacy_master/docs/guides/` | guide | `build-guide-host.js` | ✅ 9 (chronicles/plans/dupes sealed) |
| Docs deep pass — poems · specs · story-frame · research notes · about | `agentprivacy-docs/{poems,specs,story,research/*.md,*.md}` | research | `build-research.js` (buildDocs) | ✅ poems 3 · specs 7 · story 2 · notes 18 · about 3 (story/acts ♻️=ceremonies, drafts/eml/letters/chronicle sealed) |
| Blog | `agentprivacy-docs/blog/` | research | `build-research.js` (forward-link summary) | ✅ 1 summary page — **forward-links to live `sync.soulbis.com`, NOT reproduced** |
| **Narrative spellbooks** — Story · Parallel Society · Plurality · Zero (Privacymage Grimoire) · Canon | `agentprivacy_master/public/{story,society,plurality,zero,canon}` | **library** (NEW 6th site) | `build-library.js` | ✅ 146 (story 34 · society 22 · plurality 38 · zero 33 · canon 14 + 5 hubs + index; Planning_Document sealed) |
| **Dual-agent harness** — core (loop·trusts·ground rules·contract) + 7 seats + specialisation + 10 harness paths + workflows/runtimes + field-guide toy | `~/dual-agent-harness` | **harness** (NEW site) | `build-harness.js` | ✅ (chronicles/ · universe/ · runs/ · instance ledgers 🔒 — numbers cited from frontier.json, never paged) |
| **DTG research KB** — decision baseline (§-split) + explorations (now incl. X10 + X11 field-guide deployment) + lab NOTES + 2 chronicles | `~/dtgwg-cred-spec-main_mage` via its own `tools/build-kb.mjs` (manifest-first + secrets gate; emits `kb/fedwiki/`) | **dtg** (NEW site) | `node tools/build-kb.mjs` then **`wire-dtg-kb.js`** (wires slug = slugify(title); retires manifest-slug basename copies to recycle — 15 differ, incl. x11) | ✅ 92 = 78 kb + 13 trust-tasks + welcome (vendored spec 58 files NEVER projected; 2 chronicle slugs = manifested circulating, leak-scan false positives) |
| **MyTerms bundle** — alliance application (exec brief + application + A/C/D/E letter docs) + IEEE 7012 integration plan v2 + universe card + standards presentation brief + The Two Familiars (extensions at low altitude) | `~/myterms` (docs directly; `/swordsman` `/mage` `/swordsman-blade` `/mages-spell` = EXPERIMENTS, reference-only) | **myterms** (site: "The Agreement Layer" 📜 #86a9c9) | `build-myterms.js` (+ `myterms-crosslinks.json` outbound refs, `link-myterms.js` inbound post-pass — re-run after any host rebuild) | ✅ 11 (SEALED: IEEE 7012-2025 PDF — copyright + no-AI-ingest; chronicles; `harness/` ♻️ = harness site; superseded v1 plan; stale Feb PDF renders) |
| **Field Guide trust overlay** — 22 pages (counter-spec rulings · question map · acceptance · proverbs · 2 dated chronicles = manifested circulating) + assets lane (whole workbench + runnable bundle) | `~/field_guide_privacymage/wiki/{pages,assets-staging}` — WORKING DIR by ruling (git-less; durable substance folded to `agentprivacy-docs/research/fieldguide/` — docs+maps+runtimes; built on the Mac farm as `privacy.fieldguide.localhost`; also served from embassy Pis as `mitch.private.fish` / `fieldguide.pi4.private.fish`) | **fieldguide** (site: "The Field Guide" 🧭 #4a8c5f) | pages byte-copied (fork lineage kept) + local `welcome-visitors`; see `~/field_guide_privacymage/wiki/push-to-pi.mjs` for the Pi lane | ✅ 23 (2026-08-17 convergence merge) |
| **Runecraft Protocol** — proof-of-understanding as method (6 docs; NOTE: dir name has a SPACE) | `cityofmages/runecraft protocol/` | tomes | `build-tomes.js` | ✅ 6 + hub (2026-08-18) |
| **City workshop lore** — constellations (charthouse, weavers), keeper protocol, Horizon District, ceremony evolution | `cityofmages/tomes/workshops/` (+ its 2 subdirs, flat-scanned separately) | tomes | `build-tomes.js` | ✅ 5 (2026-08-18) |
| **Hearthold letter** | `cityofmages/hearthold/for-the-city-of-mages.md` | tomes | `build-tomes.js` (loreList) | ✅ 1 |
| **Harness default distribution** — the system alone, shareable | `~/dual-agent-harness` (page hand-authored at altitude; `dist/` + `feed.json` + `README.default.md` sealed as generated) | harness | `build-harness.js` — **ALWAYS follow with `build-hh-section.js`** (hh pages ride the same host; a solo rebuild drops them) | ✅ (2026-08-18) |
| **Vision** — hitchhiker timelines (13 milestones × 5 questions) | native wiki host `mitch.vision.localhost` (no repo; the 14 `*.timeline.localhost` mirrors + root wiki = ♻️) | vision | — (hand-kept host; snapshot sibling `/vision/`) | ✅ 99 |
| **Root Tiles / plugin lab** | native wiki host `plugin.localhost` (incl. `the-native-plugins` — commons attribution: Ward Cunningham, Eric Dobbs) | tiles | — (hand-kept host; snapshot sibling `/tiles/`) | ✅ 7 |
| UNBOUND tome acts (fm `status` contains the word UNBOUND: Tome IX acts 07, 10 as of 2026-08-18) | `cityofmages/tomes/tome-*/` | — | `build-tomes.js` seals mechanically | 🔒 until First-Person binding |
| Paper lineage backfills (v3.3/v4.3/v4.4/v4.5/v4.8 — newest editions already project) | `agentprivacy-docs/papers/lineage/` | — | `build-research.js` seals explicitly | 🔒 version-history |
| Chronicles / plans / drafts / audits / version-history / `.bak` / `node_modules` / `dist/` artifacts | (everywhere) | — | — | 🔒 |
| **VTA lane** — the Verifiable Trust Agent (the split made literal) · the Swordsman process · the VTA record · the Mage tools · the walk as content · page posture · the Rungs | `agentprivacy_master/docs/PLAN_KNOWLEDGE_GRAPH_TO_VTA_2026-09-03.md` + `PLAN_CITY_KEY_CRYPTO_UPGRADE_2026-09-03.md` + `~/agentprivacy-mcp` (README, lib/sign.mjs, swordsman/) | **harness** (5) · **guide** (page-posture) · **dtg** (the-rungs) | `agentprivacy.guide/flow/builders/vta-lane.mjs` (manifest-first; registered in `flow/run.mjs` as `vta-lane`; each page carries a `posture` item `by: builder`; re-run after ANY harness/guide/dtg host rebuild — build-harness.js rmSync's the pages dir) | ✅ 7 (2026-09-05) |
| **The City board in the canon** — mages.city recorded, the overlap cycle, the two-way discovery map | `cityofmages/mages-city/{README,CROSSWALK}.md` + `DISCOVERY.json` (the board's working repo `~/mages_city` and plan `agentprivacy_master/docs/mages-city/` = 🔒 plan/twin, never projected) | **guide** (the-city-board · the-overlap-cycle) + a *Doors to the City* block on every VTA-lane page + a door item on guide welcome-visitors | `vta-lane.mjs` (reads DISCOVERY.json, never restates it) | ✅ 2 (2026-09-05) |
| **Page posture** (the 6-bit lattice stance a page carries as a `posture` story item; fork-carried; the star chart seats by it) | keeper rulings on the farm pages themselves (`agentprivacy.guide/tools/posture.mjs` list/suggest/set/unset/seed/audit) | any site | `tools/posture.mjs` — a host rebuild DROPS postures on regenerated pages: re-seed with `seed <site> --write --only-missing` (guide = 34 suggested, awaiting review) then re-bake (`tools/star-chart.mjs`) | ✅ guide 34 + lane 9 (2026-09-05) |
| **The Hold** — what the Star holds (signed relationships beside the City Key; root + count only leave the key; 521 B disclosed, measured) | soulbis `guide/index.html` §hold (the telling) · `agentprivacy-mcp/lib/hold.mjs` + `fixtures/star-hold-conformance/README.md` (the mechanism) · `star-key/docs/STAR_SIGNATURE_ARTEFACT_REVIEW_2026-09-11.md` (the design); the nexus review / stack view / socialisation plan = 🔒 plans | **guide** (what-the-star-holds; links the four 09-08 Star pages) | `vta-lane.mjs` (manifest entry; posture protection·memory·connection, by: builder) | ✅ 1 (2026-09-21) |
| Tome mirrors | `agentprivacy-docs/tomes/` (80) · `agentprivacy_master/docs/tomes/` (164) | — | — | ♻️ = cityofmages/tomes |

When adding an area: append a row here first, then build it. **Naming a thing in this table is step zero of syncing it.**

## The distribution gates (G0–G7)

Out (git → wiki): **G0** source-of-truth (git upstream) · **G1** classify circulating vs sealed · **G2** coherence
(numbers/tiers/versions match register+grimoire) · **G3** attribution (`upstream`/author/license; vendored credited)
· **G4** projection altitude (link down to source, don't dump) · **G5** hyperlink coherence (links resolve; from the
graph edges) · **G6** distribution topology (right site, canonical slugs, no collisions).
Back (wiki → git): **G7** fork-back — coherence + attribution + First-Person sign-off (OPEN→SIGNED); propose a diff,
never auto-commit.

## The process (per area — the 8-step loop)

1. **Manifest (G1) — NON-OPTIONAL.** Enumerate the source dir; mark every file `circulating` or `sealed`. The
   leak and the gaps both came from skipping this. Default-seal chronicles/plans/drafts/audits/version-history.
2. **Map.** Slug + title per file; resolve cross-links (intra-site `[[ ]]`, cross-site `reference` items).
3. **⊥check map.** Adversarially verify classification + coherence against the repo + grimoire/register.
4. **Generate.** Run the converter → page JSONs + staged `assets/<slug>/<sourcefile>`.
5. **Hyperlink.** Inject nav footer + hub rosters + cross-links.
6. **⊥check build.** Slug-collision + link-integrity + orphan sweep (script below) BEFORE serving.
7. **Serve.** Write into `~/.wiki/<host>/`; the farm rebuilds the sitemap on next request.
8. **⊥check live.** Read the live wiki; confirm sitemap count, assets `200 text/markdown`, links resolve, and
   **no sealed slug leaked** (leak-scan below). For structured data (register, graph) a deterministic re-parse
   beats an agent; for prose/lore use an Explore agent to map live↔repo. SIGN (chronicle) only when clean.

## Conventions (do these every time)

- **slug = `slugify(title)`** (`t.replace(/\s/g,'-').replace(/[^A-Za-z0-9-]/g,'').replace(/-+/g,'-').toLowerCase()`),
  and choose **unique, readable, self-namespacing titles** so roster/footer `[[title]]` links always resolve.
- **THE BIJECTION RULE (2026-08-03 ruling, after a fedwiki.club bug report)**: the page's stored slug MUST equal
  FedWiki's own `asSlug(title)` = `t.replace(/\s/g,'-').replace(/[^A-Za-z0-9-]/g,'').toLowerCase()` — downstream
  code (share links, `<slug>.html` static export, forks) assumes title↔slug map to each other. Consequences:
  **titles must be ASCII-clean** (no emoji — `"Archer 🗡️🎯"` slugs to `archer-` with a trailing dash; put emoji in
  the story-card heading instead), no title-vs-filename divergence (`agentprivacy-guild-efficiency` file with
  title "Guild Efficiency" broke fedwiki.club link-gen). `build-all.js` now has a **bijection lint** that fails
  the build on any violation — never push pages that fail it. Rename map for the 2026-08-03 mass fix:
  `~/.wiki/skill-fedwiki/rename-map.json`; club repair script: `club-fix.js`.
- **Cross-site links** = a FedWiki `reference` item `{type:'reference', site:'<host>', slug, title, text}` — NOT a
  bare `[[ ]]` (those resolve same-site only). Add a cross-site ref ONLY if the target page already exists.
- **Neutralise source-body `[[ ]]`** before converting — canon prose (RPP gates etc.) uses `[[ ]]` as content; it
  collides with wikilinks. Strip to plain text, then add your own links.
- **Assets** keep the original source filename (`assets/<slug>/01-the-single-button.md`), not `<slug>.md`.
- Attach each page's source file as a `# Assets` heading + `{type:'assets', text:slug}` item.

## Tooling (`~/.wiki/skill-fedwiki/`)

- `skill-to-fedwiki.js` — `buildPage({srcPath,slug,title,navText,assetsSlug})` module + frontmatter/section split.
- `build-all.js` (skills) · `build-tomes.js` · `build-research.js` · `build-atlas.js` — per-source orchestrators.
- `build-local-host.js <host>` — materialize staged pages+assets into a farm host.
- `build-guide-host.js` — the hub; flip a site's `SITES[].status` to `LIVE` + re-run to roster it (and emit its
  cross-site `tileglyph` tile + `reference`).
- `link-tomes-research.js` — idempotent post-pass wiring act↔conjecture cross-site links (re-run after a rebuild).
- `add-family.js` — idempotent post-pass binding all hosts into a **family**: injects a `roster` item (categories
  Hub=guide · Sister sites=the four) into every welcome-visitors, so each site rosters its sisters and can pull
  the whole family into the neighbourhood. Re-run after a rebuild (welcome-visitors is regenerated).
- `log.js <op> <detail>` — append a greppable entry to `log.md` (`## [date] op | detail`; the LLM-Wiki log).
- `file-answer.js "<title>" [content.md]` — **file a good answer back** into the wiki as a synthesis note
  (`notes/<slug>.md` + a `log.js note` entry) so explorations compound (the LLM-Wiki "answers filed back" op).
- `build-guide-extras.js` — idempotent post-pass: publish `log.md` → **Federation Log**, `notes/*.md` → **The
  Notes**, and `AUDIT.md` → **Federation Audit** on the guide, + a Log & Notes section on welcome-visitors.
- `audit.js` — the **lint** op: reads every host → page counts · broken links · leak-scan · orphans · cross-site
  refs → writes `AUDIT.md` + a `lint` log entry + a PASS/WARN table. Reads only. (Non-zero broken/leaks are
  usually benign in-content `[[ ]]` examples or false-positive candidates — the report says so; confirm before acting.)
- **`resync.js [area...]`** — **one-command auto-sync for a research turn.** Runs forkback (report contributions
  first) → the chosen area builders (default: all) → `link-tomes-research` → `add-family` → `audit` →
  `build-guide-extras`. A research turn that touched only research = `node resync.js research`. Full re-sync = `node resync.js`.
  **This is the run order; resync.js encodes it.**
- `make-favicon.js` — per-host colour-identity favicon flag.
- `forkback.js <host>` — the **G7 gate**: detect external contributions (current story diverges from the `create`
  journal snapshot, or post-create journal actions exist) and print each as an `[OPEN]` proposal for First-Person
  sign-off. **Reads only — never writes to git or the wiki.** Run before re-building a host (a rebuild overwrites
  contributions); fold signed changes into the source repo by hand (page→repo is a lossy projection).
- `push.js` / `push-assets.js` — public push (action API / WebDAV) — **parked**; user pushes to the domain manually.

### Verify recipes
```bash
# sitemap count for a host
curl -s -H "Host: <host>.localhost" http://localhost:3030/system/sitemap.json | grep -o '"slug"' | wc -l
# link integrity (run in ~/.wiki/<host>): 0 broken expected (in-content example [[ ]] are benign)
node -e 'const fs=require("fs");const S=t=>t.replace(/\s/g,"-").replace(/[^A-Za-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,"").toLowerCase();const F=fs.readdirSync("pages"),X=new Set(F);let b=0;for(const f of F){const p=JSON.parse(fs.readFileSync("pages/"+f));for(const it of p.story){if(it.type==="reference")continue;for(const m of (it.text||"").matchAll(/\[\[([^\]]+)\]\]/g))if(!X.has(S(m[1])))b++;}}console.log("broken:",b)'
# leak scan — sealed content that slipped in (verify hits are false positives like a Chronicler persona)
curl -s -H "Host: <host>.localhost" http://localhost:3030/system/sitemap.json | grep -oE '"slug":"[^"]+"' | grep -iE "chronicle|draft|plan|audit|candidate|presync|\.bak"
```

## Gotchas (learned the hard way)

- **Manifest-first or it bites you**: firehosing a whole repo/graph leaks internal nodes (3 chronicle nodes rode
  the spellweb graph into atlas — now sealed by `type:chronicle`/`label:/^Chronicle/`). Spine-only passes
  under-federate (research got 6 of ~100 docs).
- `dist/spellweb/nodes.json` is a **stale 16-node artifact** — parse `src/data/*.ts`.
- Cast `sigil` may carry a parenthetical note — take the glyph only, or slugs break.
- Leak-scan false positives: `chronicler` (the persona), `spec-vertex-naming-audit` (canonical spec), "plan"
  inside "plane". Always confirm a hit is real before sealing.
- Browser extension is offline here — **tileglyph tiles / favicon flags can't be visually verified**; check the
  item JSON, not the render.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · plan `~/.claude/plans/moonlit-stirring-lagoon.md` ·
coverage audit `agentprivacy_master/docs/chronicles/2026-06-27_federation_coverage_audit.md`
