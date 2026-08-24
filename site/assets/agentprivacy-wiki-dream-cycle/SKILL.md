---
name: agentprivacy-wiki-dream-cycle
description: >
  The standing research loop that keeps the static guide rebound to the source.
  Each relevant /mitch repo "dreams" about itself — a deep multi-lap pass that
  diffs the repo's canon against the live FedWiki, writes a standing
  `chronicles/DREAM-<date>.md` (its resumable work-ledger), and feeds a single
  confirm-able GATE document. The First Person ticks the GATE; builders write the
  approved canon into ~/.wiki; the snapshot publishes it. Activates when planning
  what to fill into the guide next, running a daily research cycle, fanning out
  per-directory gap analysis, or turning "what's missing" into ordered next
  actions. Four stages — RESEARCH → GATE → BUILD → SNAPSHOT — looped until
  comfortable to push. Authored by the Chronicler 🧙📖, kept by the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  authoring_persona: "chronicler"
  origin: "0xagentprivacy"
  author: "the Keeper"
  tooling: "agentprivacy.guide/flow/ (audit.mjs · builders/ · run.mjs · sync-*.mjs · DREAM-CYCLE.md)"
  introduced: "2026-06-29"
  related_skills: "agentprivacy-wiki-resync (the per-turn op), agentprivacy-wiki-sync (the schema), agentprivacy-wiki-llm-knowledge-base (the governed-wiki pattern), agentprivacy-wiki-merge, agentprivacy-wiki-reindex"
  stages: ["RESEARCH", "GATE", "BUILD", "SNAPSHOT"]
  human_gate: true
---

# agentprivacy-wiki-dream-cycle

The **dream cycle** is how the agentprivacy guide stays rebound to the universe
across `/mitch`. Where `agentprivacy-wiki-resync` is the *per-turn* operation
("I changed a repo → rebuild the wiki"), the dream cycle is the *discovery* layer
that runs *before* you know what to change: every current repo dreams about
itself, surfaces its gaps, and proposes what to fill — and the First Person
decides.

It is the Chronicler's loop (it *produces chronicles*) cataloged by the Librarian
(the `wikis/` keeper). The dream files are standing ledgers that travel **with**
each repo, so the next cycle resumes from them.

## The four stages (looped)

```
1. RESEARCH   scan the source dirs → diff vs the live FedWiki → gap report
2. GATE       the First Person reads the dreams and ticks what to fill   ← the only human step
3. BUILD      builders write the approved canon into ~/.wiki (journal-versioned, [[linked]], hub backlinks)
4. SNAPSHOT   tools/snapshot.mjs → ./site → review on :3200
   ↺ loop until comfortable → push → guide.agentprivacy.ai
              (the live ~/.wiki stays the editable, tunnel-able carry copy)
```

## Two layers of dream

1. **Thematic dreams** (`flow/dream/`): cross-cutting passes by site/topic —
   grimoire+research, tomes/cast/city, skills/personas, atlas/graph,
   library/narrative, and the **relevance-curated** wider-universe pass that
   triages the ~80 `/mitch` dirs into *current · stale · irrelevant* so the
   fan-out never dreams on cruft.
2. **Per-directory dreams** (`<repo>/chronicles/DREAM-<date>.md`): each current
   repo dreams about its own state + its link to the guide. This is the daily
   work-ledger. Template:

   ```
   # Dream — <DirName> — <date>
   ## What this is
   ## Current state & open threads (within the dir)
   ## Guide coverage (projected vs missing)  | site | item | status | source |
   ## Suggestions (prioritized)              | suggestion | target | why | H/M/L |
   ## To get rolling tomorrow (ordered next actions)
   ## Notes & uncertainties
   ```

## Discipline (the keeper's rules)

- **Relevance first.** Never treat a stale/duplicate/version-named dir
  (`v4…`, `nov11…`, `…copy`, `…fork`) or a system folder as a gap. Triage, then
  verify each surviving candidate against the live sites before calling it a gap.
- **No duplicate information flows.** Source canon → one guide projection. Fill
  what's *missing*; **link**, don't re-create, what already lives elsewhere
  (sibling hosts, other sites). Resolve collisions as cleanups, not new dupes.
- **The dreams are research input, not content to paste.** They drive *what canon
  to build*; they stay as the working ledger.
- **Human gate is load-bearing.** Nothing is built from a dream without the First
  Person ticking it; nothing is pushed/published without an explicit ask.
- **Honest framing carries.** e.g. estimation is not attack; vendored work is not
  the author's — every dream preserves the source's honesty.

## Run it

```bash
node flow/run.mjs audit              # RESEARCH → flow/gap-report.json
#   (read flow/GUIDE-DREAM-SUGGESTIONS.md — the GATE — and decide)
node flow/run.mjs build <site>       # BUILD the approved gaps into ~/.wiki
node flow/run.mjs snapshot           # SNAPSHOT → ./site → review on :3200
node flow/run.mjs cycle <site>       # audit → build → snapshot → audit, in one
```

The fan-out of per-directory dreams is driven from the relevance ledger; refresh
it when the `/mitch` layout changes, then dream each current repo. See
`flow/DREAM-CYCLE.md` for the full convention and `flow/builders/` for the
per-site builders (grimoire and research are the worked examples).

## Lineage

Born 2026-06-29 building the `guide.agentprivacy.ai` static snapshot, when the
question shifted from "patch this gap" to "keep the guide standing-rebound to the
whole universe." The Chronicler writes the dreams; the Librarian federates them;
the First Person decides.
