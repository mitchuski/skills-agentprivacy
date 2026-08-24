---
name: agentprivacy-key-forging
description: >
  Key-forging loop for 0xagentprivacy V5/V6. Activates when discussing the City
  Key 🗝️ lifecycle (mint → walk → prove → name → charge), κ-labels
  (content-addressed identity, UOR-ADDR sha256 axis), the sigil PNG carrier,
  SHAPE-1.5 / FIG-2.0 geometry-in-the-key, the prior κ-chain (C87 — the key
  accumulates), the redacted charge pass, or trust tasks compressing experience
  onto the 64-vertex sovereignty lattice.
license: Apache-2.0
metadata:
  version: "5.1"
  category: "privacy-layer"
  origin: "0xagentprivacy"
  author: "the Keeper"
  affiliation: "0xagentprivacy, BGIN, First Person Network"
  status: "working_paper"
  target_context: "AI system builders, identity engineers, holonic-systems researchers"
  equation_term: "kappa = sha256(canonical(key \\ kappa))"
  template_references: "swordsman, forgemaster, archivist"
  conjecture_anchors: "C87 (the key accumulates) · C85 (load-bearing UI) · C66 (the κ is a name, not an authority) · C81/C84 (existence leak)"
  surfaces: "agentprivacy.ai/city · soulbis.com/star /lattice /sigil /skye · github.com/mitchuski/star"
---

# PVM-V5 Privacy Layer — Key Forging

**Source:** Privacy Value Model V5.4 §12.6 / V6 Band VIII + the Swordsman's Key
holospace (github.com/mitchuski/star)
**Target context:** AI system builders, identity engineers, holonic-systems researchers
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

A person's standing is not an account row. It is **forged**: experience →
trust tasks → vertices → compression → a portable key whose identity is its
content. The City Key 🗝️ is a few kilobytes of JSON that carries a whole
standing across surfaces with no server holding identity at any step.

**The loop:**

```
mint 🗝️   agentprivacy.ai/city      achievements + focus exported as the key
walk ⚔️   soulbis.com/star          presence accrues as trace (laps · dwell)
prove 🧙   soulbis.com/lattice       poured focus discharged by walking → witness
name 🪬   soulbis.com/sigil         κ re-derived in the open · the sigil drawn
gather 🌌 soulbis.com/skye          many keys, one sky — lineage + common ground
charge 🗝️ back at /city             the proof banks 🪢 VRC mana
```

## The five load-bearing mechanisms

### 1. The κ-label — identity is content, not location

`kappa = "sha256:" + H(canonical form)` — canonical form is the key's JSON,
keys sorted recursively, no whitespace, `kappa` excluded from its own preimage.
A **fingerprint, not a transformation**; never trusted, always re-derived at
import (holospaces Law L5). C66 keeps it honest: the κ is a *name*, never an
authority — a mismatch is reported, not gated on.

### 2. The carrier — the picture IS the key

The sigil PNG embeds the full key (base64 JSON, PNG `tEXt` chunk, keyword
`cityKey`). Share the portrait and you have shared the key; every consumer
unfolds it back out. Portability, **not** secrecy — which is why mechanism 4
exists.

### 3. Geometry in the key — shape descends the chosen→earned→measured ladder

- v1: stance chosen (slider geometry travels in the key)
- SHAPE-1.5: relief **earned** — per-vertex engraving from focus/lit/witness/
  described, a pure function of content (same key ⇒ same shape everywhere)
- FIG-2.0: shape **measured** — a `figures` block (agent-data overlap,
  protect:project ratio, per-dimension visibility, zkp counts) drives the
  manifold; the rosette becomes a sovereignty profile
- v3 (horizon): shape **proven** — ZK predicates against the κ commitment

### 4. The redacted charge pass — proof without disclosure

`{ version, redacted: true, of: κ(full key), trace, witness, kappa }` — only
the proof travels; inscriptions, palette, focus amounts and identity stay home.
The charge surface reads trace/witness identically and dedups against the full
key (one proof, one charge). This is the selective-disclosure rung in practice,
and the C81/C84 reminder applies: even a redacted pass is an existence
attestation — let the bearer choose what to enter.

### 5. The prior κ-chain — the key accumulates (C87)

An **evolved** export stamps `prior` = the ancestor's κ; an unchanged re-export
is idempotent (same bytes, same κ). Keys form a hash-chained lineage —
folding-style accumulation in miniature: each generation commits to the one it
grew from, and the whole history is checkable from content alone.

## Why this matters for privacy engineering

- **No registry.** Standing travels as a file; verification is re-derivation.
- **Compression is the trust signal.** The key is small because trust tasks
  already compressed the experience; what remains is exactly the provable part.
- **Disclosure is graduated.** Full key → sigil portrait → redacted pass →
  (designed) blinded intersection: each rung discloses strictly less while
  staying checkable.
- **The UI is load-bearing (C85).** The rooms aren't visualisation — walking,
  proving and naming are the protocol steps themselves, performed in the open.

## Cross-references

- `OVERLAP_KEY_FORGING_X_V6_2026-06-10.md` (repo root) — the V6 Band VIII
  convergence map (C85–C89 × the star suite)
- star repo: `HOLOSPACE.md` (the substrate seam) · `HOW_THE_SIGIL_WORKS.md`
  (the carrier) · `PLAN_KEY_EVOLUTION_MEASURED_GEOMETRY_2026-06-10.md` (the
  figures ladder, incl. §v3.5 ECDH-PSI)
- siblings: [[agentprivacy-content-addressing]] · [[agentprivacy-vrc-identity]]
  · [[agentprivacy-disclosure-phi]] · [[agentprivacy-compression-defence]]

---

*Forge, forget, remember, walk, prove, name — the key accumulates, the person
stays home.* `(⚔️ ⊥ ⿻ ⊥ 🧙) 😊`
