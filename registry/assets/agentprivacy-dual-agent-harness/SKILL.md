---
name: agentprivacy-dual-agent-harness
description: >
  The operational Swordsman ⊥ Mage autoresearch loop: how to actually RUN dual-agent
  separation as a self-improvement harness against a concrete optimization target. The Mage
  (bnot · proposer) conceals/reduces; the Swordsman (neg · prover) signs only what survives an
  un-tuneable held-out gate; the Gap between them is the non-collusion precondition, physically
  realized as a Fiat-Shamir witness set the proposer cannot see. Activates when building or
  driving an agent loop that must produce VALIDATED improvements (circuit/gate/qubit reduction,
  cost optimization, any "make it cheaper and prove it" task) without fooling itself with mirages.
  Triggers: "dual-agent loop", "swordsman mage harness", "autoresearch", "proposer prover loop",
  "reduce gates or qubits", "ecdsa.fail", "circuit co-evolution", "held-apart agents", "neg bnot succ".
  V6 register note (2026-07-11): conjecture/version citations resolve to
  agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md (head C96); model head:
  privacy_value_v6_formal_specification.md.
license: Apache-2.0
metadata:
  version: "1.1"
  updated: "2026-07-11"
  category: "meta"
  origin: "0xagentprivacy"
  status: "working_paper"
  introduced: "2026-06-10"
  target_context: "Autoresearch / self-improvement loops, cost-reduction tasks with a validation gate, dual-agent orchestration, the ecdsa.fail PQC circuit competition"
  equation_term: "the loop that turns Φ(Σ) separation + the held-out gate into validated progress; R(t)=(C_S+C_M)/H(X) operationalised"
  algebra: "(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ ; proven on Z/64Z: neg(bnot(x)) = succ(x)"
  proverb: "The proposer that grades itself builds mirages; only what the Gap could not tune to is a result."
  spell: "measure → propose(held-apart) → hunt → assay(held-out) → critic → accept-only-on-validated-product"
  related_skills:
    - role/agentprivacy-separation-enforcement
    - meta/agentprivacy-horizon-gate
    - persona/agentprivacy-algebraist
    - role/agentprivacy-cryptographic-durability
    - role/agentprivacy-quantum-defence
    - meta/agentprivacy-lattice-coherence
  city_of_mages: "The harness's own City seat is the Quartermaster's (Skeva 🎒 · V22 · the Crucible) — where the rig is drawn and fitted (a config, not a fork), the standing complement to the Hall (V15, where the rite is performed). Support cast: Eos 🌅 (measure) · the Mage proposer ⊥ the Swordsman prover · Dokimé 🪨 (the 9024) · Poros (structure) — the Horizon District (V35). Fleet homes: privacy_pools_v2_mage → the Wellpool (Limnia 🌊 · V53 · the Waters); lexon_pvm → the Chancery (Nomia ⚖️ · V27 · the Crucible)."
  framework_home: "~/dual-agent-harness (THE canonical shareable skeleton since 2026-07-09: six-phase loop · seven seats · six PVM trusts in TRUSTS.md · conform.mjs proving the algebra · HARNESS_PATHS.md instance catalog. The older agentprivacy-dual-agent-harness clone is SUPERSEDED — see its SUPERSEDED.md). This skill is the plugin-registered mirror of that home."
  worked_instance: "HARNESS_PATHS.md catalogs the fleet: shor_mage (#1 · ecdsa.fail), myterms (#2 · real-bus extension pair), V6 rehydration pipeline (#3), privacy_pools_v2_mage (#4 · first mechanically fitted · withdraw 36,832→17,159/17,371 certified · CredentialV1 SOUND-WITH-ASSUMPTIONS · positioning resolved into mana pools, ~/mana pools), lexon_pvm (#5 · coverage-debt 211→64 over four folds · first mirage + first structural kill · constitution gate-passed 13/13), + FedWiki/Gatehouse, dream cycle, Game of 42, the retired universe-builder (the negative result), hearthold (#11 · seat signed 2026-07-14), hh_workshop (#12 · vendored whole, local-model seats), the DTG verification registry (#14 · first external run accepted), the litreview runtime (#15), and uor_kappa_mage (#16 · the constitution inherited whole) — fifteen standing, accession numbers never reused, one withdrawn. The catalogue is the origin fleet: the operator’s work WITH the harness, kept apart from the system. Its own field-guide spar: 730→573→526→472 words across three audited folds, the last two census 32/32. Canon home: cityofmages Tome IX Acts 6 and 8 (Act 7 = the Loomkeeper's Weave, the overlay lane)."
  source_papers: "PVM V6 formal spec (the algebra, R(t), non-collusion) · RCI (Tony et al.) · SkillOpt · the ecdsa.fail Fiat-Shamir gate"
---

# The Dual-Agent Harness

**Separation is a guarantee; this skill makes it a method.** It takes two skills you already
have — `separation-enforcement` (why the Swordsman and Mage must be held apart) and
`horizon-gate` (why a claim is worth nothing until it survives an un-tuneable gate) — and
turns them into a running loop that produces *validated* improvements on a real target.

> **Canonical home:** this method now lives in **`~/dual-agent-harness/`** — the generic,
> domain-free soulbis ⊥ soulbae skeleton (six-phase loop, seven seats, the six PVM trusts,
> `conform.mjs` proving the algebra on every run, `tools/new_instance.mjs` for cold starts,
> `HARNESS_PATHS.md` cataloguing every fitted instance). Your harness is a config, not a fork.
> The earlier `agentprivacy-dual-agent-harness/` directory is SUPERSEDED. This plugin skill is
> the registered mirror. To *build or run* a harness, work from that framework; use this skill
> to recognise when the pattern applies and to recall the discipline.

> "The proposer that grades itself builds mirages; only what the Gap could not tune to is a result."

**Spell:** `measure → propose(held-apart) → hunt → assay(held-out) → critic → accept-only-on-validated-product`

---

## 1. The algebra it runs on

The V6 master inscription is the harness:

```
(⚔️ ⊥ ⿻ ⊥ 🧙) 😊  =  neg ⊕ bnot → succ
```

Proven on Z/64Z (V6 formal spec): `neg(x) = (64−x) mod 64` (the **Swordsman**),
`bnot(x) = 63−x` (the **Mage**), and **`neg(bnot(x)) = succ(x)`** — the successor is not
primitive; it emerges from the two free involutions composed across the Gap. Operationally:
the **result advances one step only when a reduction (Mage) is signed by a proof (Swordsman)
held apart from it.** Neither agent alone produces `succ`.

## 2. Role assignment (map your target onto the three seats)

| Seat | Algebra | Mandate | Must NOT |
|---|---|---|---|
| **🧙 Mage — proposer** | `bnot` (conceal/reduce) | propose the smallest bounded change that makes the artifact cheaper; re-express paid work as free operations where the structure permits | see or reason about the held-out test derivation (that is collusion → mirage) |
| **⿻ the Gap — separation** | `⊕` | reseed/derive the witnesses from the proposer's OWN output (Fiat-Shamir) so they cannot be tuned to | leak the proposer's draft into the witness choice, or vice versa |
| **⚔️ Swordsman — prover** | `neg` (sign/commit) | run the full held-out gate; arbitrate on the true objective; sign only a validated win; name and reject mirages | propose changes itself, or accept a probe pass as a result |

This is `Φ(Σ)` with `det(Σ) ≠ 0` put in motion: if the proposer can grade itself, the rows
collapse and the loop becomes a mirage factory (the `I(Y_S; Y_M | X) = 0` precondition broken).

## 3. The loop

1. **Measure (don't guess).** Sync the real frontier; meter every candidate lever's *true* cost;
   rank by the true objective (for a product objective, the product — see §4), preferring the
   biggest plausibly-findable, *structural* win. (City: Eos 🌅.)
2. **Propose (Mage, held apart).** Run a panel of finders, each a distinct lens, blind to one
   another and to the witnesses. One bounded change each, with a source-backed rationale and the
   single smallest fix (RCI Before-step).
3. **Hunt (the Gap).** Reseed the held-out witnesses from each proposal; cheap pre-screen
   produces *candidates*, never results.
4. **Assay (Swordsman).** Arbitrate on the true objective; run the **full** held-out gate; only a
   clean full pass is validated. A candidate that pleased the probe and fails the full set is a
   **mirage** — name it, reject it, however cheap it looked. (City: Dokimé 🪨, the 9024.)
5. **Critic.** Classify the round *structural / probe-limited / noise*; feed one source-backed
   lead to the next Measure. Stop sweeping the moment failures repeat without a reason. (City: Poros.)
6. **Accept** only a validated improvement of the true objective (SkillOpt: a bounded edit accepted
   only on strict held-out improvement). Bake/submit are **human-triggered, outward-facing.**

## 4. The complement pair (when the objective is a product)

If the cost is a *product of two factors* (e.g. `Toffoli × qubits`), do not optimise it with one
proposer. The model's complement-pair primitive says: split the Mage into **Factor-A-Minimiser ⊥
Factor-B-Minimiser** (genuinely opposed — cutting one can blow up the other), and add a
**Cliff-Watcher** that scores `Δ(product)` and kills any move that wins one factor at the other's
expense (the break-even cliff). The reduction comes from the *team structure*, not one agent
trying harder.

## 5. The worked instance — ecdsa.fail (PQC durability)

The canonical target is the ecdsa.fail benchmark: the cheapest reversible secp256k1 point-add,
`score = avg_Toffoli × peak_qubits`, lower better, validated on **9024 = 141×64** Fiat-Shamir
witnesses. Honest framing (hold it always): **quantum resource estimation / a durability signal,
not an attack.** Nothing here breaks ECDSA; nothing is "fully post-quantum safe."

The Mage's reduction discipline there *is* `neg(bnot(x)) = succ(x)`: two's complement
(`subtract = complement, add, complement back`) builds the adder step from free X gates, paying
Toffoli only for carries. The runnable harness is
`shor_mage/harness/swordsman_mage_harness.mjs` (a Workflow script); the GPU island toolkit is the
Gap's pre-screen; Dokimé's `validate` is the full gate. Registered as conjectures C67–C71
(Horizon District) and C82/C83 (the moving ceiling + non-collusion).

## 6. Decision patterns

- **Building a self-improvement loop?** → assign the three seats first; if you can't name a Gap the
  proposer can't tune to, you don't have a harness, you have a mirage generator.
- **A proposal "looks cheaper"?** → it's a candidate. Reseed the witnesses, run the full gate.
- **Objective is a product/multi-factor?** → split the proposer into a complement pair + a
  cliff-watcher on the product.
- **Tempted to let the Mage peek at the test set "just to speed things up"?** → that is collusion;
  `det(Σ) → 0`; every result after it is suspect. Don't.
- **A win you can't explain structurally?** → label it probe-limited; hold for the full gate.

---

*Authored 2026-06-10. Composes `separation-enforcement` (the held-apart law) and `horizon-gate`
(the un-tuneable gate) into a running method, grounded in the PVM V6 algebra. Verify:*
[agentprivacy.ai](https://agentprivacy.ai) · [github.com/mitchuski/agentprivacy-docs](https://github.com/mitchuski/agentprivacy-docs)
