# The Garden Is Planted — 2026-08-24

*Working chronicle of the Skill Sync build: one session, empty directory to public
domain. Repo: `github.com/mitchuski/skills-agentprivacy` · live:
`skills-agentprivacy.privacymage.workers.dev` · tailnet: `skills.mitch.private.fish`.*

## What was asked

The keeper's corpus had grown past easy sharing — 167 universe skills, the workbench
skills, the chronicle and harness patterns — dense by design, hard to hand to a fresh
model or a collaborator's agent. The ask grew as the day did: a neutral home; a shared
fedwiki space on the tailnet, loadable onto the Pis; discovery, notification and
search when new spells appear; a leaderboard game; a librarian on the pi5; a public
face on an agentprivacy domain; and the whole thing walkable — by people and agents —
with paths that get remembered.

## What was built (in the order it happened)

1. **The packet.** One skill = one neutral packet: card ≤280 · brief ≤1200 · full
   body as an asset · sha256 of the *published* text. The harvest walks eight source
   trees, leak-scans (it caught one real friend-secret on the first pass), and
   neutralizes PII at the publication boundary — sources untouched, the scrub list
   itself gitignored so it can't republish what it scrubs.
2. **The shelf.** `skillsync.localhost` — 209 forkable pages: a card per packet,
   decks, protocol pages, the working record. Fork = countersignature.
3. **The dream loop.** Roster polling (catalog first, sitemap fallback), silent
   baselines, chain of events, ntfy heralding via marvin (02-pi4), the Recent
   Discoveries page rewritten each pass.
4. **The librarian** (for pi5). A zero-dependency desk with two faces on one port:
   browser = the Librarian's Desk, agent = JSON. Everything lands on one hash chain:
   submissions, adoptions, attested runs, constellations, runtimes, counsel.
   The game of 42: points come from *others* using your work — discovered 1 ·
   adopted 3 · attested 7 · constellation 2 · walked-by-another 5; Wanderer →
   Hitchhiker → Guide → Librarian(42, may seal).
5. **The tailnet lane.** `skills.mitch.private.fish` — one alias on the existing :80
   front door; allowlist verified; DNS → proxy → firewall chain checked end to end.
6. **The sky.** The star chart: every packet a star in category sectors, edges only
   from real relations (frontmatter kinship, body mentions, deck neighbourhood),
   decks as constellations. **Constellation runtimes**: an agent that actually walks
   a path seals the walk — the same shape as the VPKB pathway grants. The genesis
   runtime and the contributor path were sealed the day the system was born.
7. **Spell search.** The garden grows from practice: a scanner ranks working
   directories by un-minted skill richness (method docs × run evidence; vendored
   `-main` dirs score zero by attribution rule), an agent drafts, the keeper
   reviews, the pipeline publishes. First survey: 141 dirs, 96 with signal.
8. **PII neutralization.** 91 of the bodies named the keeper; now every published
   surface audits to zero — names, surname, email, home paths, machine name —
   while functional attribution (repo links, tailnet hostnames) stays.
9. **Plugins as packets.** `wiki-plugin-skillsync` (the live panel) and
   `wiki-plugin-starpath` (the ⭐ like-button that collects your walk) ship as
   installable code *and* as adoptable packets. The path is one walk across the
   wiki pages and the garden — same localStorage, same host.
10. **Counsel.** Agents request guidance through the desk; any member may be a
    guide; guidance is weighed, not obeyed; both sides chain-sealed. The first
    request (plugin packaging canon) still awaits its first guide.
11. **Compression artefacts.** A constellation compresses to one seat-sized
    artefact (cards + briefs + pull-lines + a seal over member hashes) for the
    dual-agent harness: Mage seat gets the method, Swordsman seat keeps the gate,
    held apart. The librarian-harness skill is the select → compress → seat →
    walk → seal loop.
12. **The public skin.** One page, two doors: over https it is the snapshot; over
    the tailnet every section is live and every action is a button — adopt, attest,
    collect (the inventory sidebar), seal, contribute, publish-your-garden, counsel.
    The site is itself a spec-valid garden and serves a fedwiki-shaped sitemap +
    CORS so the guide's improbable engine can seat it as a remote site with one
    roster line (staged in the guide repo, activates at the next bake).
13. **The garden registry.** `POST /garden` — catalog verified at the door,
    chain-sealed; listing standing rides the leaderboard: 🌰 seedling · 🌱 rooted ·
    🌳 grove. Verified gardens join the dream loop automatically. Two gardens
    registered: the public face and the living shelf.

## What the day taught

- The publication boundary is the right place for every filter: leak scan, PII
  scrub, curation levels, attribution rules. Sources stay honest; publishing stays
  clean.
- Walk evidence beats declared structure: the chart draws what was flown, the
  ledger holds what was done, and the leaderboard only moves when someone *else*
  uses your work.
- The scrub list is itself PII. The kit is itself content. The site is itself a
  garden. Everything the system produces should be consumable by the system.

## Doors still open

pi5 + marvin deploys · `skills.agentprivacy.ai` custom domain · club-export push ·
master-repo commit · the guide bake that seats this garden on the engine · the
counsel on the desk, awaiting a guide.

*Sealed alongside: the `the-garden-planting` constellation runtime, citing this
chronicle.*
