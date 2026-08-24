---
name: agentprivacy-wiki-resync
description: >
  Operate the federated wiki on a research turn — lint it and auto-sync it in one
  command. `audit.js` reads every host and reports page counts, broken links,
  leak-scan, orphans, and cross-site refs (the LLM-Wiki "lint" op); `resync.js [area]`
  rebuilds the chosen sources, runs the post-passes, audits, and publishes the result.
  Activates when re-syncing a site after a repo change, health-checking the federation,
  publishing the audit, or running the per-turn ingest→lint→publish cycle. Part of the
  git-less onboarding/distribution layer kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy"
  author: "the Keeper"
  tooling: "~/.wiki/skill-fedwiki/"
  related_skills: "agentprivacy-wiki-sync (the schema), agentprivacy-wiki-llm-knowledge-base (the pattern), agentprivacy-wiki-merge, agentprivacy-wiki-reindex"
---

# agentprivacy-wiki-resync

The **per-turn operation** of the agentprivacy federation (a governed LLM-Wiki — see
`agentprivacy-wiki-llm-knowledge-base`). Two tools turn "I changed a repo" into "the wiki is rebuilt,
cross-linked, family-bound, linted, and the audit is published" — in one command.

## `resync.js [area...]` — one-command auto-sync

```bash
node resync.js                  # full re-sync (all sites)
node resync.js research         # only research changed → rebuild it + post-passes + audit
node resync.js tomes grimoire   # several areas
```

Run order it encodes (so you never have to remember it):

1. **`forkback.js`** — report any external contributions *before* the rebuild overwrites them (gate **G7**).
   Non-zero OPEN → review first.
2. **builders** — the chosen areas (default all): `build-all`(+`build-local-host skill.localhost`) ·
   `build-tomes` · `build-research` · `build-atlas` · `build-grimoire` · `build-library` · `build-guide-host`.
3. **`link-tomes-research.js`** — re-wire act↔conjecture cross-site links (a rebuild wipes them).
4. **`add-family.js`** — re-bind the family roster on every host (derived from `FAMILY`, never drifts).
5. **`audit.js`** — lint (below).
6. **`build-guide-extras.js`** — publish `log.md` → Federation Log, `notes/*` → The Notes, `AUDIT.md` →
   **Federation Audit**, on the guide.

Areas are the post-passes' prerequisite, but the post-passes always run — so the family, log, audit, and
notes stay coherent even on a one-area resync.

## `audit.js` — the lint op (reads only)

```bash
node audit.js                   # → AUDIT.md + a `lint` log entry + a PASS/WARN table
```

Per host it checks: **page count · broken wikilinks · leak-scan (sealed slugs) · orphan pages · cross-site
ref validity**. It writes `AUDIT.md` (timestamped) and publishes it (via `build-guide-extras`) as the live
**Federation Audit** page. **It never edits the wiki or git.**

Reading the report — most non-zero numbers are *not* problems:

- **Broken links** ≠ 0 is usually benign in-content example `[[ ]]` (DSL/syntax samples in the wiki-authoring
  skills). Confirm the link is content, not navigation, before acting.
- **Leak-scan hits** are *candidates*, not confirmed leaks — typically false positives (`chronicler` the
  persona, a canonical `*-audit` spec, "plan" inside "plane"). Confirm each is an internal record, not content,
  before sealing it out.
- **Orphans** = pages with no inbound `[[ ]]` on their own host (hubs/index/node-lists excluded). A real orphan
  wants a cross-reference or a home on a hub.
- **Cross-refs (broken)** ≠ 0 *is* actionable — a `reference` item points at a page that doesn't exist on the
  target host. Fix the slug or the target.

## The operational layer (what gets published)

- **`log.md`** — chronological, append-only, greppable (`grep "^## \[" log.md`); `log.js <op> <detail>` appends.
- **`AUDIT.md`** — the latest lint; the *Federation Audit* page.
- **`notes/`** — good answers filed back (`file-answer.js`); the *The Notes* hub.

## The turn loop

A research/ingest turn is: change a source repo → `node resync.js <area>` → read the **Federation Audit** page
→ adjudicate any leak candidates / orphans → (optionally) `file-answer.js` a synthesis. The wiki stays current,
governed, and self-checked with near-zero bookkeeping cost.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · the `agentprivacy-wiki-sync` skill (the schema + full
registry) · root index `~/.wiki/skill-fedwiki/INDEX.md`
