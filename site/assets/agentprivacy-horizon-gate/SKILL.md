---
name: agentprivacy-horizon-gate
description: >
  The held-out-gate discipline: a claimed improvement is worth nothing until it survives an
  adversarial validation it cannot tune. Activates when accepting or rejecting a claimed
  optimization/fix/result, when designing a benchmark or acceptance gate, when a change "looks
  cheaper" on a probe, or when reasoning about whether an attestation can be trusted. Names the
  failure mode — the nonce-island mirage — and the bounded-change loop that earns trust. In the
  City of Mages this is Dokimé's 🪨 Ceremony of the 9024 Witnesses at the Horizon District.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "working_paper"
  introduced: "2026-06-09"
  target_context: "Acceptance gates, benchmark design, bounded-change review, claim validation, self-improvement loops"
  equation_term: "trust as survival of an un-tuneable held-out gate (Fiat-Shamir); the bilateral-witness primitive at the validation layer"
  proverb: "The cheaper-looking claim that cannot face the witnesses it did not choose is not progress."
  spell: "state-the-waste → smallest-fix → confirm-or-reject-with-metrics → assay(9024)"
  related_skills:
    - role/agentprivacy-cryptographic-durability
    - role/agentprivacy-threat-adversarial
    - persona/agentprivacy-witness
    - persona/agentprivacy-cipher
    - meta/agentprivacy-lattice-coherence
  city_of_mages: "Dokimé 🪨 (Assay-witness · Probe·Assay·Attest) at the Horizon District (V35)"
  source_papers: "RCI (Recursive Criticism & Improvement; Tony et al.) · SkillOpt (held-out acceptance) · the ecdsa.fail Fiat-Shamir gate"
---

# The Horizon Gate

**A claim is worth nothing until it survives the witnesses it did not choose.**

> "The cheaper-looking claim that cannot face the witnesses it did not choose is not progress."

**Spell:** `state-the-waste → smallest-fix → confirm-or-reject-with-metrics → assay(9024)`

---

## 1. The principle: held-out, un-tuneable, adversarial

An improvement validated only on a **self-chosen** probe is not knowledge — it is a guess that
flattered its examiner. Trust requires a gate the claimant **cannot tune**: the test cases are derived
from a hash of the claimant's own work (Fiat-Shamir), so they cannot be picked and cannot be charmed
(C69). This generalises the City's witness-discipline: an attestation is only as good as the witnesses
the attester did not choose.

The canonical instance is **ecdsa.fail**: a claimed-cheaper circuit must pass **9024 = 141 × 64**
Fiat-Shamir-drawn test points — and any structural change reshuffles *which* 9024 you face. A variant
that is cheaper and passes a 2048-shot probe routinely fails the full set.

## 2. The failure mode: the nonce-island mirage

A **nonce-island mirage** is a claim that looked cheaper on a small probe and dies on the full held-out
set. It is the single most common way a self-improvement loop fools itself: it tunes, implicitly, to the
cases it can see. **Name it and reject it** — however cheap it looked. A 2048-shot pass is a *hint, never
a result.* If you cannot state why a win is structural rather than probe-fitted, treat it as a mirage
until the full gate clears.

## 3. The bounded-change loop (RCI · "Tony → Anton")

Earn trust one bounded change at a time:

- **Before:** state the exact waste or risk · the evidence (file, function, knob, metric, prior note) ·
  the expected effect on each axis (cost, correctness, and any invariants) · the **single smallest fix.**
- **After:** confirm or reject **with metrics.** Classify every failure as *structural* (a real limit),
  *held-out-sensitive* (a mirage), or *noise.* Stop a brute-force sweep the moment failures repeat without
  a source-backed reason.

This is RCI (criticise → improve, bounded) and SkillOpt (a bounded edit accepted only on strict held-out
improvement) made a single discipline. No inference-time magic; just the refusal to accept un-validated
cheapness.

## 4. Designing a gate (when you build the benchmark)

- **Derive the test set from the candidate, not the author** (Fiat-Shamir / hash-of-the-op-stream) so it
  cannot be tuned to.
- **Validity is rejection, not penalty:** correctness, plus every structural invariant the artifact must
  preserve (for circuits: reversibility, phase-cleanliness, forward∘inverse = identity).
- **Size the held-out set for the reshuffling:** any structural change should change which cases you face.
- **No silent caps:** if the gate samples or truncates, *log what was dropped* — silent truncation reads
  as "covered everything" when it didn't.

## 5. Decision patterns

- **A change "looks cheaper"?** → run the full held-out gate before believing it. Probe pass = hint only.
- **Accepting a claim/attestation?** → ask which witnesses the claimant chose; trust scales with the ones
  they didn't.
- **A win you can't explain structurally?** → label it a candidate mirage; hold it for full validation.
- **Reviewing your own optimization?** → state-the-waste → smallest-fix → confirm-or-reject-with-metrics.
  One bounded change.

*Authored 2026-06-09 from the ecdsa.fail trust task and the RCI / SkillOpt papers. The gold that fears the stone was never gold.*
