---
name: agentprivacy-skillsync-spell-search
description: >
  Observe the directories a keeper has been working in, find the ones rich with
  un-minted skills (written methods that actually ran), draft SKILL.md packets
  from their evidence, and publish them into Skill Sync after review. Use when
  asked for a "spell search", to "survey my directories for skills", "mine this
  repo for skills", "make a skill out of this project/method", or when a
  project's method docs + run history deserve to become a shareable skill.
  Drafting is agent work; publishing rides the existing harvest → shelf →
  tailnet pipeline with its leak scan and PII neutralization. Vendored work is
  never ours to mint. Kept by the Librarian 🗃️; drafted in the Chronicler's hand.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "wikis"
  alignment: "mage"
  layer: "onboarding"
  keeper: "librarian"
  authoring_persona: "chronicler"
  personas: "chronicler (the draft: a method compressed from its run chronicles) · librarian (keeper — what joins the shelf, and only after review) · sentinel (the leak scan, exclude_patterns, names and paths dropped) · gatekeeper (vendored dirs score zero: others' work is never ours to publish)"
  origin: "0xagentprivacy"
  author: "the Keeper"
  introduced: "2026-08-24"
  tooling: "the Skill Sync kit (GET https://skills.agentprivacy.ai/kit/): bin/spellsearch.js · bin/harvest.js · bin/build-wiki.js · bin/build-static.js · SPEC.md"
  related_skills: "agentprivacy-skillsync-dreamloop (announces the minted packet), skillsync-herald, agentprivacy-wiki-to-skill (the fork desk: page → SKILL.md), agentprivacy-wiki-skill-anatomy, agentprivacy-wiki-document"
  source_corpus: "a keeper's working directories: method docs, run chronicles, un-catalogued SKILL.md files"
  upstream: "none recorded"
---

# agentprivacy-skillsync-spell-search

**🧙📖🔍 Spell search — skills are spells that already worked**
Keeper: the Librarian 🗃️ · Authored by the Chronicler 🧙📖 · Category: wikis · Layer: onboarding

> A spell is not what was planned; it is what was cast and held.

This skill finds methods in the field and mints them. Home: the Skill Sync kit
(`<skill-sync>/` — `SPEC.md` = packet format; `README.md` = the system).

## 1. Survey (mechanical)

    cd <skill-sync>
    node bin/spellsearch.js                # every top-level dir under <home>
    node bin/spellsearch.js <dir>          # one directory, any depth

Score = un-catalogued SKILL.md (×10) + method docs (×3) + run-evidence dirs (×4)
+ docs×runs bonus (+6) + agent-memory files present (+3) + recency. Results land
in `surveys/`.

**Vendored dirs score 0 by rule** (by convention, folders ending `-main` are
unpacked upstream archives) — others' work is never ours to publish; only a
method layer we wrapped around it is.

## 2. Choose with the keeper

Present the top candidates with their evidence. The keeper picks; don't mint
speculatively. Prefer dirs where the method RAN more than once (`runs/` +
`chronicles/`) over dirs that only contain plans.

## 3. Draft (agent work)

For a chosen directory:

1. Read the evidence the scanner listed: method docs, GROUND_RULES / METHOD /
   spec files, one or two run chronicles (how it actually went, including the
   failures).
2. Draft `drafts/<skill-name>/SKILL.md` inside the Skill Sync home — **NEVER
   into the source repo**:
   - frontmatter: `name`, `description` (trigger-rich, like the corpus),
     optional `metadata` (category, origin, version 0.1)
   - body: what the method is · when it fires · the steps as actually run ·
     the gotchas the chronicles recorded · pointers to the source repo (relative
     path only)
3. Voice: second person to the practicing agent, first person never. The
   harvest neutralizer scrubs stray PII, but write neutral from the start.
4. One skill = one repeatable method. A rich repo may yield several small skills
   rather than one saga.

## 4. Review, then publish

The keeper reviews the draft. On approval the pipeline does the rest —
`drafts/` is already a harvest source (category `drafted`):

    node bin/harvest.js && node bin/build-wiki.js && node bin/build-static.js

That mints the packet (leak-scanned, neutralized, hashed), shelves the card on
the local shelf site and its tailnet hostname, and updates the static garden.
The next `agentprivacy-skillsync-dreamloop` pass announces it to the network.

## Guardrails

- Never publish from a vendored dir; never write drafts into source repos.
- Benchmark / solver material stays behind `exclude_patterns` unless the keeper
  says otherwise.
- A draft that quotes a chronicle must drop names, machine names and absolute
  paths.
- Drafting ≠ adopting: the skill enters the inbox like any other packet, and
  earns standing by use.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis
