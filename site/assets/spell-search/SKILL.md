---
name: spell-search
description: Observe the directories the keeper has been working in, find the ones rich with un-minted skills (written methods that actually ran), draft SKILL.md packets from their evidence, and publish them into Skill Sync after review. Use when the user says "spell search", "survey my directories for skills", "mine this repo for skills", "make a skill out of this project/method", or when a project's method docs + run history deserve to become a shareable skill. Drafting is agent work; publishing rides the existing harvest -> shelf -> tailnet pipeline with its leak scan and PII neutralization.
---

# spell-search

Skills are spells that already worked. This skill finds them in the field and mints them.
Home: `~\skill sync\` (SPEC.md = packet format; README.md = the system).

## 1. Survey (mechanical)

    cd "~\skill sync"
    node bin/spellsearch.js                # every top-level dir under ~
    node bin/spellsearch.js <dir>          # one directory, any depth

Scores = un-catalogued SKILL.md (×10) + method docs (×3) + run-evidence dirs (×4)
+ docs×runs bonus (+6) + Claude-brain (+3) + recency. Results land in `surveys/`.
**Vendored `-main` dirs score 0 by rule** — others' work is never ours to publish;
only a mage layer wrapped around it is (see [[feedback_attribution_vendored_vs_mine]]).

## 2. Choose with the keeper

Present the top candidates with their evidence. The keeper picks; don't mint
speculatively. Prefer dirs where the method RAN more than once (runs/ + chronicles/)
over dirs that only contain plans.

## 3. Draft (agent work)

For a chosen directory:
1. Read the evidence the scanner listed: method docs, GROUND_RULES/METHOD/spec files,
   one or two run chronicles (how it actually went, including failures).
2. Draft `drafts/<skill-name>/SKILL.md` in skill sync — NEVER into the source repo:
   - frontmatter: `name`, `description` (trigger-rich, like the corpus), optional
     `metadata` (category, origin, version 0.1)
   - body: what the method is · when it fires · the steps as actually run ·
     the gotchas the chronicles recorded · pointers to the source repo (path only)
3. Voice: second person to the practicing agent, first person never; the harvest
   neutralizer will scrub stray PII, but write neutral from the start.
4. One skill = one repeatable method. A rich repo may yield several small skills
   rather than one saga.

## 4. Review, then publish

The keeper reviews the draft. On approval the pipeline does the rest — `drafts/` is
already a harvest source (category `drafted`):

    node bin/harvest.js && node bin/build-wiki.js && node bin/build-static.js

That mints the packet (leak-scanned, neutralized, hashed), shelves the card on
skillsync.localhost / skills.mitch.private.fish, and updates the static garden.
The next dream-loop pass announces it to the network.

## Guardrails

- Never publish from a vendored dir; never write drafts into source repos.
- Benchmark/solver material stays behind `exclude_patterns` unless the keeper says otherwise.
- A draft that quotes a chronicle must drop names, machine names and absolute paths.
- Drafting ≠ adopting: the skill enters the inbox game like any other packet.
