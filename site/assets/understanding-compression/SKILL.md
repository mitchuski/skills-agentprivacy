---
name: understanding-compression
description: Take a unified semantic core (e.g. the In-brief summaries from wiki-to-pdf) and re-express it for a plurality of communities, while proving every re-expression compresses back to the SAME invariant. Use when the same content must be told different ways to different audiences (developers, funders, artists, institutions) without drifting in meaning - turning one truth into many tellings and back. Compressions: maths / principles / actions. Expansions: markets / plurality / intents.
---

# understanding-compression

One meaning, many tellings, provably the same. This skill formalises a recursion:

```
            COMPRESS  ->  maths | principles | actions      (strip to the invariant)
  INVARIANT
            EXPAND    ->  markets | plurality | intents     (re-tell for audiences)
```

- **Compressions** discard audience and surface; they keep only what is invariant -
  expressed as a *number/formula* (maths), a *law/axiom* (principles), or a *minimal doable*
  (actions).
- **Expansions** add audience back: a *value/incentive* framing (markets), a set of
  *community-specific tellings* (plurality, >=2), and the *goals/why* (intents).
- The loop **closes** with a re-compression check: take one expansion, compress it again,
  and assert the recovered invariant matches the original. That round-trip IS the coherence
  test for meaning - the semantic sibling of `fedwiki-cohere-sync`'s page-level checker.

## Workflow
1. **seed** - build blank "understanding cards" from a `wiki-to-pdf` `model.json`. Each card
   is pre-seeded with `invariant_seed` (the milestone's five In-briefs).
   ```
   python understanding.py seed                       # -> cards.json
   ```
2. **author** (the judgement step - you, guided by this file): for each card, distill the
   `invariant` to ONE sentence that survives every re-telling, then fill the three
   compressions and three expansions. Keep the same invariant across all plurality tellings;
   only the surface changes. Finish each card's `recheck`: pick one expansion (`from`),
   compress it back to a `recovered_invariant`, set `matches: true` only if it really matches.
3. **cohere** - gate the work (non-zero exit blocks):
   ```
   python understanding.py cohere --cards cards.json
   ```
   Fails on: empty invariant/axis, <2 plurality communities, missing recheck, or round-trip
   drift (recovered invariant shares <25% of the invariant's key terms).
4. **render** - formal PDF (purple "understanding" layer), per milestone: Invariant ->
   Compressions table -> Expansions (plurality fanned by community) -> round-trip line.
   ```
   python understanding.py render --cards cards.json    # -> out/understanding.pdf
   ```

## Authoring guidance
- **Invariant**: the thing a developer, a funder and an artist would all agree is *the same
  claim*, with all framing removed. If two communities would dispute it, it's not invariant -
  push more surface into the expansions.
- **maths**: prefer real quantities/relations from the source (counts, rates, prizes, dates),
  not decoration. A formula or an inequality is ideal.
- **principles**: a one-line law ("X compounds Y"). Should read as true beyond this milestone.
- **actions**: what someone does on Monday. Minimal, concrete, checkable.
- **markets**: who pays/earns/exchanges what; the incentive that makes it self-sustaining.
- **plurality**: >=2 audiences, each told in *their* language and stakes - same invariant.
- **intents**: the underlying goal; why it's worth doing at all.
- **recheck**: be honest. If compressing an expansion doesn't recover the invariant, the
  expansion drifted (or the invariant was too narrow). Fix one of them - that's the recursion.

## Demo
`agm-demo.json` is a fully-authored card for AGM 2027 (passes cohere; rendered to
`out/understanding-agm-demo.pdf`). Use it as the worked example of the format.

## Pipeline
- Upstream: `wiki-to-pdf` produces `model.json` + the dossier's **Unified Summary** (the core).
- This skill expands that core per community and proves the round-trip.
- Sibling: `fedwiki-cohere-sync` checks coherence at the *page* level; this checks it at the
  *meaning* level.

## Dependencies
Python 3 + `reportlab` (render only). seed/cohere are pure-stdlib.
