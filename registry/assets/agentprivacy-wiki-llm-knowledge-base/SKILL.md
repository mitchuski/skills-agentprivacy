---
name: agentprivacy-wiki-llm-knowledge-base
description: >
  Building and maintaining a persistent, LLM-maintained knowledge base — the LLM-Wiki
  pattern: an LLM incrementally compiles immutable raw sources into a cross-linked,
  self-consistent wiki it owns, governed by a schema, via ingest / query / lint, with a
  content index and a chronological log. Activates when designing a knowledge base,
  ingesting sources into a wiki, health-checking one, or mapping the pattern onto the
  agentprivacy federation (which IS an instance of it). Part of the git-less
  onboarding/distribution layer kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (mapping + federation framing)"
  upstream: "the 'LLM Wiki' pattern essay (supplied by the user · skill.localhost/llm-wiki.md)"
  upstream_author: "external — an abstract idea file in the Memex / LLM-as-wiki-maintainer lineage"
  provenance: "vendored + re-framed — the pattern is the source's; the agentprivacy federation mapping, the gate correspondence, and the Librarian framing are ours"
  related_skills: "agentprivacy-wiki-to-skill, agentprivacy-wiki-page, agentprivacy-wiki-skill-library, agentprivacy-wiki-merge, agentprivacy-wiki-reindex"
  related_to: "the agentprivacy-wiki-sync skill (~/.claude/skills) — the worked instantiation"
---

# agentprivacy-wiki-llm-knowledge-base

The **LLM-Wiki pattern**: instead of re-deriving knowledge from raw documents on every query (RAG),
an LLM **incrementally builds and maintains a persistent, interlinked wiki** that sits between you and
the sources. Knowledge is **compiled once and kept current** — the cross-references are already there,
the contradictions already flagged, the synthesis already reflects everything read. The wiki is a
*compounding artifact*. You curate sources, explore, and ask questions; the LLM does the summarizing,
cross-referencing, filing, and bookkeeping. *Obsidian (or a FedWiki) is the IDE; the LLM is the
programmer; the wiki is the codebase.*

## The three layers

| Layer | What it is | Rule |
|---|---|---|
| **Raw sources** | the curated source documents (articles, papers, repos, data) | **immutable** — the LLM reads, never modifies; the source of truth |
| **The wiki** | the LLM-generated markdown: summaries, entity/concept pages, comparisons, an overview | the **LLM owns it entirely** — creates, updates, cross-references, keeps consistent; you read it |
| **The schema** | the config doc (CLAUDE.md / AGENTS.md) telling the LLM the structure, conventions, workflows | the key file — makes the LLM a *disciplined maintainer*, not a generic chatbot; co-evolved over time |

## The three operations

- **Ingest** — drop a source in; the LLM reads it, discusses takeaways, writes a summary page, updates the
  index, updates the entity/concept pages it touches (a single source may touch 10–15 pages), appends a log
  entry. One source at a time with supervision, or batch with less.
- **Query** — ask against the wiki; the LLM finds relevant pages, reads, synthesizes a cited answer. **Good
  answers are filed back into the wiki as new pages** — explorations compound just like ingested sources.
- **Lint** — periodically health-check: contradictions between pages, stale claims newer sources supersede,
  orphan pages (no inbound links), important concepts lacking a page, missing cross-references, data gaps to
  fill with a search. Keeps the wiki healthy as it grows.

## Two navigation files

- **index.md** — *content-oriented*: a catalog of every page (link + one-line summary + optional metadata),
  grouped by category. The LLM reads it first when answering. Avoids embedding-RAG at moderate scale (~100s of pages).
- **log.md** — *chronological*: append-only record of ingests/queries/lints. Use a consistent prefix
  (`## [2026-04-02] ingest | Title`) so it's greppable (`grep "^## \[" log.md | tail -5`).

## The load-bearing rules

1. The LLM owns the wiki layer; the human owns sourcing, direction, and questions.
2. Raw sources are immutable — never edited, always the source of truth.
3. The schema governs — disciplined maintenance comes from the config doc, not the model's whim.
4. Maintenance cost is near zero (the LLM touches 15 files without boredom), so the wiki stays current —
   that is *why it works* where human-maintained wikis are abandoned.
5. Answers worth keeping are filed back, not lost to chat history.

## This federation IS an instance of the pattern

The agentprivacy guide federation (see the `agentprivacy-wiki-sync` skill) is a worked LLM-Wiki:

| LLM-Wiki concept | agentprivacy federation realization |
|---|---|
| **Raw sources** (immutable) | the git canon repos — `agentprivacy-skills-v5`, `cityofmages`, `agentprivacy-docs`, `spellweb` (gate **G0**: git is upstream, never authored-first on the wiki) |
| **The wiki** (LLM-owned) | the FedWiki federation — `skill / tomes / research / atlas` ≈ 1,175 forkable, cross-linked pages |
| **The schema** (CLAUDE.md) | the `agentprivacy-wiki-sync` skill — conventions, the gates G0–G7, the manifest-first discipline |
| **Ingest** | the `build-*` sync passes — manifest-first **G1** classify, project canon → pages + assets, cross-link |
| **Query** | FedWiki `search` + `activity` + the `federationmap`; **answers filed back** via `file-answer.js` → `notes/` → the **The Notes** hub on the guide (so explorations compound) |
| **Lint** | the leak-scan + link-integrity sweep + the coverage audit + `forkback.js` (**G7**) |
| **index.md** | the hub/`welcome-visitors` pages + the live `federationmap` (sized by page count) |
| **log.md** | `log.js` → a single greppable **Federation Log** (`grep "^## \[" log.md`), published as a page; the dated chronicles remain the long-form prose log |
| **cross-references** | `[[wikilinks]]` derived from the spellweb graph edges (**G5**); cross-site `reference` items |
| **search/CLI tool (qmd)** | the FedWiki `search` plugin + the verify recipes (sitemap / link-integrity / leak-scan) |

The difference our framing adds: the **distribution gates** make the LLM-Wiki *governed* — what crosses
from raw→wiki (G0–G6) and wiki→raw (G7) is gated for classification, coherence, attribution, and a
First-Person sign-off, rather than ungoverned LLM edits. The Memex maintenance problem Vannevar Bush
couldn't solve — *who does the bookkeeping* — the LLM solves; the gates keep it honest.

**Fully realised (2026-06-27):** every operation now has a home — including the two the essay names that a
chronicle-only system lacked: **answers filed back** (`file-answer.js` → the *The Notes* hub) and a single
**greppable `log.md`** (`log.js` → the *Federation Log* page). Worked synthesis: *Governing an LLM-Wiki: the
eight gates* (filed in The Notes). Tooling: `~/.wiki/skill-fedwiki/{log.js, file-answer.js, build-guide-extras.js}`.

## When applying the pattern fresh

1. Define the **three layers** for the domain (where raw sources live, where the wiki lives, the schema doc).
2. Write the **schema** first (it is the LLM-Wiki's `CLAUDE.md`) — conventions, page formats, the ingest/lint
   workflows. Co-evolve it.
3. **Ingest** one source: summary page → index → touched entity/concept pages → log entry.
4. **Query**, and file good answers back.
5. **Lint** regularly (contradictions / stale / orphans / missing pages / gaps).
6. Keep `index.md` (content) and `log.md` (chronological, greppable) current.

**Upstream:** the LLM-Wiki pattern essay supplied by the user (`skill.localhost/llm-wiki.md`) — vendored +
re-framed; the pattern is the source's, the federation mapping and gate correspondence are ours.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · the `agentprivacy-wiki-sync` skill (the instantiation) ·
plan `~/.claude/plans/moonlit-stirring-lagoon.md`
