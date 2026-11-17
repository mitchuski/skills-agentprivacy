---
name: agentprivacy-mages-scroll-sync
description: >
  Build a new Mages City scroll (any sealed κ-evidence bundle, a mage's census, or a wiki's
  κ-registry → a page of nothing but hashes on its own *.mages.city subdomain, joined to the list
  of scrolls and the Sigil ledger), or sync the existing scrolls and quest pages after new spells
  have been cast (new bundles minted → project files → build → copy back → City indexes → tests →
  deploy copies). Use when the keeper says "make a scroll for X", "scroll sync", "update the
  quests with the new casts", "refresh the chains/scrolls", or after any lane mints bundles that a
  quest page should show. Encodes the scroll's hashes-only guard, the builder map, the new-scroll
  walk, the quest-sync walk, the hover/pin interaction, the BLAKE3 second axis, and the gotchas.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "operational_runbook"
  introduced: "2026-10-26"
  target_context: "a keeper + agent pair publishing sealed κ-evidence as hash-only pages in a Mages City; the City's own scrolls are the worked example"
  related_skills:
    - meta/agentprivacy-city-builder
    - meta/agentprivacy-chronicle-reflect
    - meta/agentprivacy-dual-agent-harness
    - role/agentprivacy-lane-chronicle
    - privacy-layer/agentprivacy-content-addressing
  source_corpus: "the mages.city repo (public, github.com/mitchuski/mages.city): bin/scroll-page.mjs, bin/bundle-scroll.mjs, bin/lane-scroll.mjs, bin/soul-scroll.mjs, bin/guide-scroll.mjs, bin/scrolls.mjs, bin/sigil-site.mjs, bin/sync-header.mjs, bin/verify-front.mjs, bin/scrolls/*.json, site/scrolls.json, site/*-seals.json; quest pages built by the members' build (private)"
  upstream: "none recorded"
---

# Mages scroll sync

`nothing leaves but hashes, dates and numerals`

A **scroll** is a mage's work written as nothing but its hashes: one book per sealed root, each
record then the threads drawn from it, beside a star that places every hash by its first six bits.
A **quest** is an evidence-chain page (tree, star, grimoire, scroll, sound) whose Scroll tab is the
same writing. Every scroll lists every other (the line under the header), and every hash it shows
resolves on sigil.mages.city.

Rules that hold every time:

- Nothing but hashes, dates and numerals leaves on a scroll. The builder guards this and **fails
  closed**.
- Lever names (what a cast actually did) stay on the members' build; the public page holds only
  the κ chain.
- Nothing is pushed or deployed without the keeper's word.
- No ANSI escapes in any build output (`NO_COLOR=1`, `TERM=dumb`).
- Other sessions' files stay out of commits: stage by path or hunk.

## The pieces (`bin/` in the mages.city repo)

| file | does |
|---|---|
| `scroll-page.mjs` | the one page template, `scrollPage(DATA, T)`; DATA = `{books:[{n, root, minted, objects, edges:[[κ,from,to]], seq}], epochs, links?, total, built}` |
| `bundle-scroll.mjs` | **any sealed bundle(s) → a scroll**: `node bin/bundle-scroll.mjs <id> <bundle dir>… --title … --label … --h1 … --epi …` → `deploy/<id>.mages.city/`, `site/<id>/`, `site/<id>-seals.json`, merges into `site/seals.json`, registers in `site/scrolls.json` |
| `lane-scroll.mjs` | **many lanes as one scroll that opens on demand**: `node bin/lane-scroll.mjs bin/scrolls/<id>.json` (spec: lanes by chain project or bundle prefix). One book per lane written as bundle roots; `b/<root>.json` per bundle fetched on click; a bundle in two lanes written once. Spec `path: ""` makes it a home's front page; `quests` = the top line of each lane's own Scroll tab; `openAll` = every bundle fetched at once on load. Writes `deploy/_home/<home>/<path>/`, which the members' build lays into that home. The ledger gets lane + bundle roots only (records resolve by `#k=<h>&b=<bundle>`) |
| `soul-scroll.mjs` | the soul mage's census scroll (soul.mages.city) |
| `guide-scroll.mjs` | the guide's κ-registry scroll (guide.mages.city), threads from the star chart's links |
| `scrolls.mjs` | the list of scrolls: soul, guide, every `site/scrolls.json` entry, every quest from `site/chains.json` |
| `sigil-site.mjs` | copies seals.json, guide-registry.json and sigil/ into `deploy/sigil.mages.city` |
| `sync-header.mjs` | the shared header and menu (add a `menu-more` link for a new scroll) |

## A new scroll from a sealed bundle

1. **Find the bundle**: a dir with `root.json` (`root_kappa`, `minted_on`) and `graph.json`
   (objects keyed by κ, edges with `kappa`, `source`, `target`). If the bundle is private work,
   that is fine: the scroll carries only hashes, so a private lane can still have a public
   scroll.
2. `node bin/bundle-scroll.mjs <id> <dir>…` with a title, a label for the list (`the formal
   mage`), an h1 with one `<em>` word, and a one-paragraph epigraph that says *what is held*
   without saying *what it states*.
3. **Rebuild the others** so their list includes it: `node bin/soul-scroll.mjs && node
   bin/guide-scroll.mjs`, then re-run the new one (its own list was written before the rebuilds).
4. **Menu link** in `bin/sync-header.mjs` (`<a class="menu-more" href="<id>/">❦ … scroll →</a>`),
   then `node bin/sync-header.mjs`, `node bin/sigil-site.mjs`, `node bin/verify-front.mjs`.
5. **Look at it**: serve `deploy/<id>.mages.city/public` on a free port, screenshot at 1440 and
   390 px, confirm 0 page errors and that the span count equals `total`.
6. **Deploy** (keeper's word): `cd deploy/<id>.mages.city && npx wrangler deploy` (custom-domain
   route in its `wrangler.jsonc`); mages.city itself goes live by pushing the repo's main.

The first instance was a formal-verification mage's evidence scroll: one sealed bundle from a
private repo, published as hashes only.

## Sync the quests after new casts

1. **Find what was cast since the last build**: list the κ-evidence store(s) against each quest
   project file (its `bundles` list or `bundle_glob`). Bundles under a subdir (e.g.
   `<cast>/final`) are named by that path.
2. **Verdicts come from the record, never from guesswork**: the bundle's REPORT.md
   ("SUBMITTED … REFUTED"), the lane's judge notes, and the lane log. Status words the engine
   knows: `valid`, `refuted`, `rejected`, `not_evaluable`, `validating`, `not submitted`,
   `verified`. Labels stay plain ("third walk cast"), never a lever name.
3. **Build** the quest pages in the members' build (private). If it runs under WSL, drive it
   from PowerShell, not Git Bash, which mangles `/mnt` paths; then run its copy-back step.
4. **City indexes and homes**: regenerate the chain cards (`chains.json` + `seals.json`, merging
   every `*-seals.json` scroll ledger), lay the deploy copies into each home from the **public**
   builds only (with a leak scan), then run the veil sweep (members' names vs public pages: must
   be clean).
5. **Suites**: serve the built site locally and run every page suite (reveal, wave, monitor,
   star, path, sigil, phone). All green before anything ships.
6. Then the scroll rebuilds above (step 3 of a new scroll), so the City's `seals.json` keeps
   every scroll.
7. **Deploy** (keeper's word): `npx wrangler deploy` per home that changed; commit the members'
   build by path, never its untracked new build dirs.

## Interaction

No hash click navigates away. A mouse previews on hover; a tap or click selects and pins a card
with three acts: **🔢** copy hash, **🔏** copy seal, **✍** prove on Sigil (words as tooltips; the
only way to Sigil; shift-click is a desktop shortcut). Quest stars match the soul mage's: every
leaf as gold dust (sampled past ~6,000), read ones glow, one bright thread for the selected hash,
the rest of its entry's threads at 6%. On a lazy scroll a selected bundle root opens on the next
tap, then folds/unfolds. On a phone the card is a full-width sheet, and the reading glow counts
only what shows below the sticky star. The same card lives in `scroll-page.mjs` (City scrolls)
and in the quest page's Scroll tab.

## BLAKE3, the second axis

Bundles minted with a `root_blake3` beside `root_kappa` show it on each book (bundle-scroll) or
each opened bundle (lane-scroll); quest pages carry it per entry (`b3`) as their second hash axis.
The κ (sha256) stays the name a scroll writes and Sigil resolves. Early bundles minted before the
second axis simply lack it; never back-fill.

## Gotchas

- A patch whose comment is inserted mid-line comments out the rest of the line; put comments on
  their own line.
- The chain-card step overwrites `site/seals.json`; a scroll ledger only survives because it
  merges every `*-seals.json`. A new scroll kind must write one.
- The scroll guard rejects any string that is not a 64-hex hash, a date or a numeral: titles live
  in the template options, never in DATA.
- Rebuilding the guide's star chart once deleted another session's room; check `git status` in
  every repo a build touches before committing.
- A local http.server whose cwd is a deploy folder locks it on Windows; stop it before laying
  deploy copies.
- Apostrophes inside the template's single-quoted JS strings break the page: use ’.
- A page over ~5 MB is a candidate for lazy leaves (`lane-scroll`); say so rather than trimming
  silently.
