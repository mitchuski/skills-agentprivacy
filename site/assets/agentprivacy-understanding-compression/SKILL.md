---
name: agentprivacy-understanding-compression
description: >
  Take a unified semantic core (e.g. the In-brief summaries a wiki-to-pdf dossier produces) and
  re-express it for a plurality of communities, while proving every re-expression compresses back
  to the SAME invariant. Use when the same content must be told different ways to different
  audiences (developers, funders, artists, institutions) without drifting in meaning: one truth
  into many tellings, and back. Compressions: maths / principles / actions. Expansions: markets /
  plurality / intents. Encodes the card format, the authoring rules for each axis, the
  round-trip recheck that closes the loop, and a stdlib cohere gate that blocks publication on
  any gap or drift.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "operational (scripts/understanding.py: seed / cohere / render)"
  introduced: "2026-06-28"
  target_context: "an agent re-telling one body of content for several audiences and needing proof that meaning did not drift"
  related_skills:
    - meta/agentprivacy-chronicle-reflect
    - role/agentprivacy-narrative-compression
    - role/agentprivacy-story-diffusion
    - role/agentprivacy-media-plurality
    - wikis/agentprivacy-wiki-to-pdf
  source_corpus: "the local understanding-compression skill: SKILL.md, understanding.py (seed/cohere/render), a fully authored demo card; the demo card here is a neutral replacement"
  upstream: "wiki-to-pdf (named by the source as the pipeline input: model.json + the dossier's Unified Summary); sibling fedwiki-cohere-sync (page-level coherence)"
---

# Understanding compression

One meaning, many tellings, provably the same. This skill formalises a recursion:

```
            COMPRESS  ->  maths | principles | actions      (strip to the invariant)
  INVARIANT
            EXPAND    ->  markets | plurality | intents     (re-tell for audiences)
```

- **Compressions** discard audience and surface; they keep only what is invariant, expressed as a
  *number/formula* (maths), a *law/axiom* (principles), or a *minimal doable* (actions).
- **Expansions** add audience back: a *value/incentive* framing (markets), a set of
  *community-specific tellings* (plurality, ≥ 2), and the *goals/why* (intents).
- The loop **closes** with a re-compression check: take one expansion, compress it again, and
  assert the recovered invariant matches the original. That round-trip IS the coherence test for
  meaning: the semantic sibling of a page-level coherence checker.

The same law runs the suite's chronicle reflection: every voice of an event must compress back to
the same invariant core (see `agentprivacy-chronicle-reflect`). Narrative compression
(`agentprivacy-narrative-compression`) goes the other way along one axis, experience → story →
proverb; this skill holds the meaning fixed and fans it out.

## Workflow

The script lives in `scripts/understanding.py`. Paths default to the current directory, so cards
and PDFs land in your project, not in the skill folder.

1. **seed**: build blank "understanding cards" from a `wiki-to-pdf` `model.json` (any list of
   `{sub, title, date, questions:[{in_brief}]}` works). Each card is pre-seeded with
   `invariant_seed` (the milestone's In-briefs).
   ```sh
   python scripts/understanding.py seed --model model.json      # -> cards.json
   ```
2. **author** (the judgement step, guided by this file): for each card, distil the `invariant` to
   ONE sentence that survives every re-telling, then fill the three compressions and three
   expansions. Keep the same invariant across all plurality tellings; only the surface changes.
   Finish each card's `recheck`: pick one expansion (`from`), compress it back to a
   `recovered_invariant`, and set `matches: true` only if it really matches.
3. **cohere**: gate the work (non-zero exit blocks):
   ```sh
   python scripts/understanding.py cohere --cards cards.json
   ```
   Fails on: an empty invariant or axis, fewer than 2 plurality communities, a missing recheck, or
   round-trip drift (the recovered invariant shares < 25% of the invariant's key terms).
4. **render**: a formal PDF (purple "understanding" layer) per milestone: Invariant →
   Compressions table → Expansions (plurality fanned by community) → round-trip line.
   ```sh
   python scripts/understanding.py render --cards cards.json    # -> out/understanding.pdf
   ```

## Authoring guidance

- **Invariant**: the thing a developer, a funder and an artist would all agree is *the same
  claim*, with all framing removed. If two communities would dispute it, it is not invariant:
  push more surface into the expansions.
- **maths**: prefer real quantities and relations from the source (counts, rates, dates), not
  decoration. A formula or an inequality is ideal.
- **principles**: a one-line law ("X compounds Y"). It should read as true beyond this milestone.
- **actions**: what someone does on Monday. Minimal, concrete, checkable.
- **markets**: who pays, earns or exchanges what; the incentive that makes it self-sustaining.
- **plurality**: ≥ 2 audiences, each told in *their* language and stakes, same invariant.
- **intents**: the underlying goal; why it is worth doing at all.
- **recheck**: be honest. If compressing an expansion does not recover the invariant, the
  expansion drifted (or the invariant was too narrow). Fix one of them: that is the recursion.

## Worked example

`references/example-card.json` is a fully authored card (a reading gate for shared letters) that
passes `cohere`. Use it as the template for the format:

```sh
python scripts/understanding.py cohere --cards references/example-card.json
```

## Share-safety

Cards are built from whatever the source summaries say, and the `maths` axis invites concrete
numbers. Before a card set leaves the keeper's machine, read every axis for personal names,
private contact counts, partner terms or unannounced figures, and generalise them; the invariant
almost never needs them.

## Pipeline

- Upstream: `wiki-to-pdf` produces `model.json` + the dossier's **Unified Summary** (the core).
- This skill expands that core per community and proves the round-trip.
- Sibling: a page-level coherence sync checks coherence at the *page* level; this checks it at the
  *meaning* level.

## Dependencies

Python 3; `reportlab` for `render` only. `seed` and `cohere` are pure stdlib.
