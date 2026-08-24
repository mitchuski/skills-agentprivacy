---
spec: skill-artefact/0.1
constellation: the-contributor-path
kind: contributed  # held by mitch
path: [skillsync-publish-garden, skillsync-dreamloop, skillsync-adopt, skillsync-constellation, spell-search]
seal: 8565d5d5f22a1986bbf87edcf32ccc458666ef29399b87253a0afd2d16f3ef48  # sha256 over member body-hashes in path order
compressed: 2026-08-24T13:12:26.400Z
expand: GET <garden>/assets/skillsync/<name>/SKILL.md per skill; verify sha256 against packet hash
---

# ⭐ the-contributor-path — compression artefact

**Purpose:** the base default constellation: publish your garden, dream the roster, adopt properly, walk and contribute — how a new member joins the sky
**The walk:** 1. skillsync-publish-garden → 2. skillsync-dreamloop → 3. skillsync-adopt → 4. skillsync-constellation → 5. spell-search

Load this artefact into a harness seat instead of 5 separate briefs. Pull a
full body ONLY when its step actually fires; cite the seal in the run record so the
walk can name exactly which skill versions it flew.

## 1. Skillsync Publish Garden (`skillsync-publish-garden`)

> Stand up your own skill garden and join the Skill Sync network — package your skills as neutral packets (card / brief / body), publish a skillsync catalog on your site or fedwiki farm, and get onto the roster so dream loops discover you and marvin announces your work. Use when a…

Stand up your own skill garden and join the Skill Sync network — package your skills as neutral packets (card / brief / body), publish a skillsync catalog on your site or fedwiki farm, and get onto the roster so dream loops discover you and marvin announces your work. Use when a member says "publish my skills", "join skill sync", "set up my garden", "make my skills discoverable", or is bringing a new fedwiki farm universe of skills into the space.

Publishing = putting a catalog where the roster can GET it. No registration, no push access, no account. Full protocol: SPEC.md in the skill sync home.

One skill/spell/persona = one packet, three zoom levels: - `card` (≤280 chars, MANDATORY — it's what a discovery notification carries) - `brief` (≤1200 — enough to decide to load it) - full body as an asset (`assets/skillsync/<name>/SKILL.md`), sha256-hashed

If your skills are SKILL.md files, the reference harvester does this mechanically (`bin/harvest.js` — includes a leak scan and PII neutralization; run BOTH before anything ships. A packet that names you everywhere will follow you everywhere).

*full body:* `assets/skillsync/skillsync-publish-garden/SKILL.md` · *hash* `a4d25d0308d2943e`

## 2. Skillsync Dreamloop (`skillsync-dreamloop`)

> Run the Skill Sync dream loop — discover new skills/spells/personas published across the tailnet fedwiki farms and the fedwiki.club roster, notify via marvin's ntfy, refresh the Recent Discoveries shelf page, and (when asked) recommend discoveries for adoption or record adoption…

Run the Skill Sync dream loop — discover new skills/spells/personas published across the tailnet fedwiki farms and the fedwiki.club roster, notify via marvin's ntfy, refresh the Recent Discoveries shelf page, and (when asked) recommend discoveries for adoption or record adoptions with the pi5 librarian. Use when the user says "run the dream loop", "any new skills on the farms?", "check the skill roster", "what did the network publish", or wants recurring skill discovery (pair with /loop). Read-only against every remote farm.

The agent side of the Skill Sync system at `~\skill sync\` (see its `README.md` and `SPEC.md` for the protocol). One dream = one pass:

cd "~\skill sync"     node bin/dreamloop.js          # poll roster -> diff -> events -> ntfy -> shelf page

1. Reads `skillsync.config.json` (roster of farms, marvin/ntfy, pi5/librarian). 2. For each roster member, GETs `assets/skillsync/catalog.json` (machine door) or    falls back to `system/sitemap.json` filtered to skill-shaped slugs. 3. Diffs against `state/<member>.json`. First sight of a member = silent baseline. 4. Appends `new-skill` / `updated-skill` / `removed` events to `events/events.jso…

*full body:* `assets/skillsync/skillsync-dreamloop/SKILL.md` · *hash* `db2a083a9e402c1b`

## 3. Skillsync Adopt (`skillsync-adopt`)

> Adopt and attest skills from the Skill Sync network — browse a garden's shelf or catalog, load a skill properly (card first, brief to decide, body on demand), fork the card as your countersignature, then record the adoption and later the attested run at the pi5 Librarian so trus…

Adopt and attest skills from the Skill Sync network — browse a garden's shelf or catalog, load a skill properly (card first, brief to decide, body on demand), fork the card as your countersignature, then record the adoption and later the attested run at the pi5 Librarian so trust points flow to the author. Use when a member or agent says "adopt this skill", "load skills from the network", "record that I'm using X's skill", "attest a run", or wants a working hand from someone else's garden.

Adoption is the game. Discovery is passive; adopting turns another member's work into your working hand — and into their credentials.

1. `GET <garden>/assets/skillsync/catalog.json` — read CARDS only. 2. Prefer a deck/constellation over the whole shelf; load the BRIEFS for its names. 3. Pull a full body (`assets/skillsync/<name>/SKILL.md`) only when a task fires it. Verify what you fetched: sha256 of the body must equal the packet's `hash`.

*full body:* `assets/skillsync/skillsync-adopt/SKILL.md` · *hash* `0ac025d63ee7e9cd`

## 4. Skillsync Constellation (`skillsync-constellation`)

> Walk, seal, and contribute constellations in the Skill Sync sky — collect an ordered path of skills with the starpath button (or by hand), visualise it on the star chart, seal the walk as a chain-sealed constellation runtime at the Librarian, and contribute good paths as named c…

Walk, seal, and contribute constellations in the Skill Sync sky — collect an ordered path of skills with the starpath button (or by hand), visualise it on the star chart, seal the walk as a chain-sealed constellation runtime at the Librarian, and contribute good paths as named constellations the network can adopt. Use when someone says "record my path", "seal this runtime", "contribute a constellation", "map a path through the skills", or an agent finishes a session and should record which skills it actually flew.

A constellation = a named, ordered path of skills. A runtime = the sealed record of actually walking one. The star chart draws both: the sky fills with paths that were really flown, not just drawn.

- Browsing: tap ⭐ on card pages (the starpath plugin) — order of taps = the path.   The homepage tray shows it forming; "visualise" opens `star.html#path=a,b,c`. - Agent-side: at session end, list the skills the session ACTUALLY used, in the   order they fired. That list is a walked path — don't pad it.

*full body:* `assets/skillsync/skillsync-constellation/SKILL.md` · *hash* `d1535da1afdbec7c`

## 5. Spell Search (`spell-search`)

> Observe the directories the keeper has been working in, find the ones rich with un-minted skills (written methods that actually ran), draft SKILL.md packets from their evidence, and publish them into Skill Sync after review. Use when the user says "spell search", "survey my dire…

Observe the directories the keeper has been working in, find the ones rich with un-minted skills (written methods that actually ran), draft SKILL.md packets from their evidence, and publish them into Skill Sync after review. Use when the user says "spell search", "survey my directories for skills", "mine this repo for skills", "make a skill out of this project/method", or when a project's method docs + run history deserve to become a shareable skill. Drafting is agent work; publishing rides the existing harvest -> shelf -> tailnet pipeline with its leak scan and PII neutralization.

Skills are spells that already worked. This skill finds them in the field and mints them. Home: `~\skill sync\` (SPEC.md = packet format; README.md = the system).

cd "~\skill sync"     node bin/spellsearch.js                # every top-level dir under ~     node bin/spellsearch.js <dir>          # one directory, any depth

*full body:* `assets/skillsync/spell-search/SKILL.md` · *hash* `84914b957644d448`

---
*On completing a real walk with this artefact: seal the runtime —*
`POST /runtime {"member":"you","constellation":"the-contributor-path","path":[...],"run":"<evidence> · artefact 8565d5d5f22a"}`