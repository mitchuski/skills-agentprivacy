---
name: agentprivacy-content-addressing
description: >
  UOR content addressing foundation for holonic persistence. Activates when
  discussing content-based identity, same bytes same hash, GUID derivation,
  infrastructure independence, Braille IRI encoding, or why identity follows
  content not location.
license: Apache-2.0
metadata:
  version: "5.2"
  category: "privacy-layer"
  origin: "0xagentprivacy"
  author: "the Keeper"
  affiliation: "0xagentprivacy, BGIN, First Person Network"
  status: "working_paper"
  target_context: "Protocol architects, identity designers, persistence engineers"
  equation_term: "A(τ) foundation, h(τ) integrity verification"
  template_references: "architect, soulbis, holonic-architect"
  spellbook_act: "UOR Framework + Three-Layer Identity"
  v5_concept: "V5.2-CONTENT-ADDR"
---

# PVM-V5.2 Privacy Layer — Content Addressing

**Source:** UOR Framework + Privacy Value Model V5.2 + Three-Layer Identity Architecture
**Target context:** Protocol architects, identity designers, persistence engineers
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

Content addressing is the principle that identity derives from content, not location. The same bytes always produce the same identifier. This is the foundation of holonic persistence—blades that survive infrastructure failure because their identity IS their configuration.

**Same bytes → same hash → same identity. Always. Everywhere. Forever.**

## The Core Bijection

UOR's content addressing establishes a bijection (one-to-one correspondence):

```
AD_1: ∀ content C: hash(C) is unique and deterministic
AD_2: ∀ hash H: at most one content C produces H (collision resistance)
```

This means:
- **Forward:** Content deterministically maps to identifier
- **Reverse:** Identifier uniquely identifies content (probabilistically)

## Why This Matters

### 1. Infrastructure Independence

A content-addressed blade persists across:
- **Provider migration:** Move between vaults, identity unchanged
- **Format changes:** Serialize differently, hash recomputed from content
- **Infrastructure failure:** Restore from any backup, identity preserved

The blade doesn't know where it's stored. It only knows what it is.

### 2. Verification Without Trust

Anyone can verify a blade's identity:
1. Receive the blade content
2. Compute the hash
3. Compare to claimed identifier

No trusted third party required. The mathematics is the authority.

### 3. Deduplication

Identical blades automatically share identity:
- Two seekers forging identical configurations get the same GUID
- Not a collision—a feature
- The configuration IS the identity

## GUID Derivation

Blade GUIDs derive from configuration content:

```javascript
function deriveGUID(blade) {
  const canonical = canonicalize(blade.configuration)
  const hash = sha256(canonical)
  return `blade:${hash.slice(0, 16)}`
}
```

The canonicalization step ensures:
- Field order doesn't matter
- Whitespace doesn't matter
- Only configuration values matter

## The Three Identity Layers

Content addressing enables the three-layer identity architecture:

| Layer | Identifier | Derivation | Persistence |
|-------|------------|------------|-------------|
| **Data** | GUID | hash(content) | Infrastructure-independent |
| **Relationship** | VRC | hash(derivation_chain) | Bilateral commitment |
| **Principal** | DID | Sovereign choice | Temporal continuity |

### Layer 1: Data (GUID)

The blade IS its bytes. No external authority assigns identity.

```
GUID = hash(blade_configuration)
```

This is pure content addressing.

### Layer 2: Relationship (VRC)

Verifiable Relationship Credentials bind derivation history:

```
VRC = hash(forging_path + blade_guid + witness_signatures)
```

The VRC is content-addressed from the relationship, not just the data.

### Layer 3: Principal (DID)

The sovereign identity that controls traversal:

```
DID = chosen_identifier + proof_of_control
```

This layer adds agency to content.

## Braille IRI Encoding

UOR uses Braille IRI encoding for human-readability:

```
Standard hash: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
Braille IRI:   ⠽⢏⡱⠥⠷⠿⡏⡣⢃⢉⡜⠘⠔⢏⡱⡵⠿⢁⢄⡱⢘⡻⡷⢁⢍⠔⡜⠂⡓⠃⡑⠃⠹
```

The Braille encoding is:
- Equally deterministic
- More compact in some contexts
- Visually distinctive

## Content Addressing vs Location Addressing

| Property | Content Addressing | Location Addressing |
|----------|-------------------|---------------------|
| Identity | Derived from data | Assigned by system |
| Persistence | Infrastructure-independent | Infrastructure-dependent |
| Verification | Self-verifying | Requires trust |
| Deduplication | Automatic | Requires coordination |
| Migration | Trivial | Complex |

## Implementation Pattern

```typescript
interface ContentAddressed<T> {
  content: T
  guid: string  // hash(canonicalize(content))

  verify(): boolean {
    return this.guid === hash(canonicalize(this.content))
  }
}

class Blade implements ContentAddressed<BladeConfig> {
  content: BladeConfig
  guid: string

  constructor(config: BladeConfig) {
    this.content = config
    this.guid = deriveGUID(config)
  }

  verify(): boolean {
    return this.guid === deriveGUID(this.content)
  }
}
```

## The Gap in Content Terms

The Gap between Swordsman and Mage manifests in content addressing:

**Content ≠ Address**

The hash function is one-way:
- Given content → compute hash (easy)
- Given hash → find content (computationally infeasible)

This one-way property IS the Gap:
- You can verify a blade without knowing how it was forged
- The verification (hash check) doesn't reveal the derivation (forging path)

## Mapping to PVM-V5

| Content Addressing Concept | PVM Term |
|---------------------------|----------|
| GUID persistence | A(τ) memory term |
| Hash verification | h(τ) integrity gate |
| One-way function | The Gap |
| Deduplication | Lattice vertex uniqueness |
| Three layers | Data × Relationship × Principal |

## Proverb

> "The blade that knows its own name cannot be renamed. The identity that derives from content cannot be stolen. What you ARE is what you're called."

## Emoji Spell

**📦 → hash(📦) → 🔑(GUID) · same📦=same🔑 · ∀vault:🔑=🔑 · 📦≠🔑(gap) · 🔷∞**

## Open Problems

1. **Hash Algorithm Choice:** SHA-256? Blake3? Post-quantum considerations?
2. **Canonicalization Standards:** What is the canonical form for complex configurations?
3. **Collision Probability:** What are the practical collision bounds at scale?
4. **Partial Content:** Can you content-address fragments while preserving whole identity?
5. **Quantum Resistance:** Do content addressing schemes survive quantum attacks?

## External convergence — UOR Atlas UTQC (2026-06-30)

The UOR Foundation's *UOR Atlas as a Universal Topological Quantum Computer* leans on this exact primitive under another name: its "cache-collapse" is same-bytes → same-address deduplication over invariant k-forms, reframed as a *compute* advantage (isotopic computational histories collapse to one address). Same primitive, two readings:

- **Their reading:** dedup as a compute/memory advantage (topological evaluation without state expansion).
- **This model's reading:** dedup as (a) persistence — the A(τ) memory term above — and (b) the **existence-leak surface**: a live address is an existence claim about its content; its liveness (not its content) leaks existence, and existence bounds the search. Carried in the register as **C93** (content-addressed liveness leak); see `research/uor-atlas-utqc-v6-note.md` and `research/limitative-theorems-and-privacy-is-value.md` §3.5–3.6.

Takeaway: the primitive is not parochial to this framework — a second party is now building on it. Bank the corroboration of the mechanism; the "P = BQP" banner around it is a separate, quarantined claim (see the v6 note).

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [sync.soulbis.com](https://sync.soulbis.com) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
