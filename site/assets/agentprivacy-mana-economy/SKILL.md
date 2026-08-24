---
name: agentprivacy-mana-economy
description: >
  Energy mechanics for the grimoire system. Activates when discussing mana
  generation through evocation, spending through casting, presence as local
  color (regime 1), why mana does not attest or confer Sybil resistance yet,
  the witness co-signing and elapsed-time upgrade ladder (C42), or
  engagement-based economics.
  V6 register note (2026-06-10): conjecture and version citations resolve to agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md (head C89); model head: privacy_value_v6_formal_specification.md.
license: Apache-2.0
metadata:
  version: "6.0"
  category: "role"
  origin: "0xagentprivacy"
  author: "the Keeper"
  affiliation: "0xagentprivacy, BGIN, First Person Network"
  status: "working_paper"
  target_context: "Economy designers, engagement architects, Sybil resistance specialists"
  equation_term: "Mana = ∫evocation - Σcasting"
  template_references: "soulbae, ceremony_engine, armor_progression"
  spellbook_act: "Act XXVIII — The Ceremony Engine"
  v5_concept: "V5.2-MANA"
---

# PVM V6 Role Skill · Mana Economy

**Source:** Privacy Value Model V6 (presence regime 1) + First Person Spellbook Act XXVIII (The Ceremony Engine); V5.2 is the lineage stage this skill was first written against
**Target context:** Economy designers, engagement architects, Sybil resistance specialists
**Architecture:** [agentprivacy.ai](https://agentprivacy.ai) · **Sync:** [sync.soulbis.com](https://sync.soulbis.com) · **Contact:** mage@agentprivacy.ai

---

## What this is

Mana is the energy currency of the grimoire system. It is generated through genuine engagement (evocation) and spent through creation (casting). Unlike tokens, mana cannot be purchased — it can only be earned through demonstrated practice.

**Regime 1 (V6, current):** 🪢 mana is non-transferable, non-attesting local color. It is earned by walking, it attests nothing, and it is never an input to admission or trust decisions. This skill teaches why presence does not attest yet, and what would have to be built before it could (witness co-signing, then elapsed-time proofs; C42, ~50%, open).

**The well refills only when you drink with understanding. Buying water doesn't teach you where the spring lies.**

## Core Principles

### 1. Practice, Not Capital · Color, Not Weight

```
Mana ≠ f(tokens)
Mana = f(engagement, comprehension, time)
```

No amount of money can buy mana. But in regime 1 (V6, current) this is NOT a Sybil resistance mechanism: 🪢 is non-transferable, non-attesting local color. It records that a walk happened, for this bearer, on this device; it proves nothing to anyone else, and no admission or trust decision may consume it. Whether stake economics could generate Sybil resistance at least as strong as tier accumulation is C42 (~50%), and it is open.

### 2. Evocation Generates, Casting Spends

```
Balance(t) = Balance(t-1) + Evocation(t) - Casting(t)
```

- **Evocation:** Reading, traversing, engaging with the spellbook
- **Casting:** Creating new wisdom, forging blades, inscribing proverbs

### 3. Comprehension Multiplier

Passive reading generates less mana than demonstrated understanding:

```
Mana(evocation) = base_rate × comprehension_multiplier
```

Where comprehension is verified through:
- Time spent (minimum threshold)
- Scroll depth (meaningful engagement)
- Interaction patterns (not bot-like)
- Understanding ceremonies (explicit verification)

## Evocation Mechanics

### Mana Sources

| Activity | Base Rate | Multiplier Conditions |
|----------|-----------|----------------------|
| Reading inscription | 1 mana/min | ×2 if completion verified |
| Traversing spellweb edge | 0.5 mana | ×3 if conceptually coherent path |
| Proverb meditation | 2 mana/min | ×2 if reflection submitted |
| Constellation navigation | 1 mana/node | ×2 if full constellation traced |
| Return visit (>24h gap) | 0.5 mana bonus | ×1.5 if picks up where left off |

### Engagement Verification

```javascript
function calculateEvocationMana(session) {
  const baseRate = session.duration * MANA_PER_MINUTE;

  const multipliers = [
    session.scrollDepth > 0.8 ? 1.5 : 1.0,
    session.timeOnPage > minReadTime(session.content) ? 1.3 : 1.0,
    session.interactionPattern.isHuman ? 1.2 : 0.5,
    session.returnVisit ? 1.1 : 1.0
  ];

  return baseRate * multipliers.reduce((a, b) => a * b, 1);
}
```

## Casting Mechanics

### Mana Costs

| Activity | Cost | Requirements |
|----------|------|--------------|
| Forge light blade | 10 mana | Understanding ceremony passed |
| Forge medium blade | 25 mana | 3+ inscriptions traversed |
| Forge heavy blade | 50 mana | Full constellation traced |
| Forge dragon blade | 100 mana | Complete spellbook mastery |
| Inscribe proverb | 20 mana | Bilateral witness ceremony |
| Create constellation | 30 mana | 5+ edges identified |
| Submit reflection | 5 mana | Minimum length met |

### Casting Validation

Casting is validated through:
1. Sufficient mana balance
2. Prerequisites met (ceremonies, traversals)
3. Quality check (not spam)
4. Bilateral witness (for high-value casts)

## Sybil Resistance · Why Not Yet

Regime 1 makes no Sybil resistance claim. Mana is fenced off from every trust decision precisely because presence signals are cheap to counterfeit. Three named attacks motivate the fence:

- **Replay.** Captured engagement traces are resubmitted as fresh walks. If mana attested, a recorded walk could be replayed indefinitely.
- **Simulation.** A bot or model generates plausible engagement (scroll depth, dwell time, conceptually coherent paths) with no person present. If mana were a trust input, simulation would mint trust.
- **Sybil farming.** Many cheap identities each walk a little and pool the result. If mana aggregated across identities into standing, farming would convert compute into weight.

The regime-1 answer is structural, not detective: because 🪢 attests nothing and feeds no decision, all three attacks gain nothing. There is nothing to replay into, nothing to simulate for, nothing to farm.

### The Comprehension Gate (quality filter, not security)

Bots can:
- Create many accounts
- Simulate page visits
- Generate fake engagement metrics

Bots cannot (easily):
- Demonstrate genuine understanding
- Pass understanding-as-key ceremonies
- Maintain coherent long-term engagement patterns
- Produce novel insights that survive peer review

The gate shapes the bearer's own walk and keeps mana rates honest. It is heuristic friction, not a security boundary; it never upgrades mana into an admission or trust input.

### The Upgrade Ladder · From Color to Weight

C42 (~50%, open) is the conjecture that stake economics could generate Sybil resistance at least as strong as tier accumulation. Before any mana-like signal may carry weight, the ladder must be climbed in order:

```
Regime 1 (today):  🪢 local color · non-transferable · non-attesting · zero decision inputs
Rung 2:            witness co-signing · a named counterparty co-signs that a walk happened
Rung 3:            elapsed-time proofs · cryptographic evidence that the duration actually elapsed
Regime 2 (open):   C42 resolved · stake-backed presence admissible as a trust input
```

Until those rungs exist, any system that reads mana as trust is reading color as weight, and inherits all three attacks above.

### Rate Limiting

Even genuine users are rate-limited:
- Maximum mana generation per day
- Cooldowns between high-value casts
- Diminishing returns on repeated content

This prevents grinding and ensures mana reflects genuine engagement.

## Economic Properties

### Non-Transferability

Mana is soul-bound:
- Cannot be sent to another user
- Cannot be sold on secondary markets
- Dies with the account

This prevents mana markets and preserves proof-of-practice semantics. Regime 1 (V6): 🪢 is non-transferable, non-attesting local color.

### Decay (Optional)

To encourage ongoing engagement, mana may decay:

```
Balance(t+1) = Balance(t) × (1 - decay_rate) + Evocation(t+1)
```

Decay rate is low (e.g., 1% per week) but prevents hoarding.

### Inflation Control

New mana enters through evocation only. Total mana supply is bounded by:
- Active user count
- Engagement depth
- Content availability

No central minting. No inflation shocks.

## Mapping to PVM V6

| Mana Concept | PVM Term |
|--------------|----------|
| Evocation | T_∫(π) path traversal |
| Casting | Blade forge operations |
| Comprehension multiplier | Understanding ceremony verification |
| Sybil resistance | None in regime 1; C42 (~50%, open) names the conjectured path |
| Regime ladder | Witness co-signing → elapsed-time proofs (the color-to-weight upgrade) |
| Non-transferability | 🪢 regime-1 local color |
| Decay | Temporal dynamics |

## Integration with Ceremonies

### Understanding-as-Key Ceremony

- **Cost:** 15 mana
- **Reward:** 25 mana + blade forge unlock
- **Net:** +10 mana for successful ceremony

Ceremonies are mana-positive to encourage participation.

### Progressive Trust Ceremony

- **Cost:** 0 mana (entry-level)
- **Reward:** Trust tier increase + mana rate boost
- **Effect:** Higher tiers earn mana faster

## Proverb

> "The well refills only when you drink with understanding. Buying water doesn't teach you where the spring lies."

## Emoji Spell

**✨ → 📖(evoke)→+mana · ✍️(cast)→-mana · ¬💰(buy) · 🪢(color)≠⚖️(weight) · 🤝(co-sign)→⏳(elapse)→C42?**

## Open Problems

1. **C42 (~50%, open):** Can stake economics generate Sybil resistance at least as strong as tier accumulation? This is the gate between regime 1 and any future in which presence carries weight.
2. **Comprehension Verification:** How to verify understanding without centralised evaluation?
3. **Bot Sophistication:** As AI improves, how to maintain comprehension gates?
4. **Fairness:** How to ensure mana rates don't disadvantage slow readers?
5. **Cross-Platform Mana:** Regime 1 forbids it (non-transferable, non-attesting). Cross-instance recognition would require at least the witness co-signing rung.
6. **Governance:** Who decides mana rates and casting costs?

---

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [spellweb.ai](https://spellweb.ai) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
