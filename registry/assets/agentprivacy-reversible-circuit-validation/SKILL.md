---
name: agentprivacy-reversible-circuit-validation
description: >
  Validate and debug the CORRECTNESS of a reversible or quantum circuit, not its size. Use
  whenever a circuit "gives wrong answers on some inputs", "ancilla aren't returning to zero /
  uncomputation is leaving garbage", there are "phase errors", "it passes my basis-state test but
  I'm not sure it's right in superposition", or someone needs to test a reversible adder,
  multiplier or modular-arithmetic block before trusting it inside Shor's. Covers the
  classical/phase/ancilla (cls/pha/anc) three-channel decomposition, differential testing against
  a trusted reference on RANDOM inputs, the forward-inverse identity check, telling a designed
  approximation failure from a real bug, per-channel zero-reachability as a go/no-go for seed
  searches, and localising the first broken op. Fires on informal phrasing ("my uncompute is
  dirty", "results get corrupted when I compose it", "is 0.3% failure expected?"). For making a
  correct circuit SMALLER use agentprivacy-peak-qubit-reduction (qubits) or
  agentprivacy-toffoli-reduction (gates); this skill owns CORRECTNESS.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "operational"
  introduced: "2026-06-30"
  target_context: "anyone shipping reversible/quantum arithmetic that will run coherently (Shor, QPE, amplitude estimation, or composed into a larger circuit), and harness lanes gating optimised circuits before submission"
  related_skills:
    - role/agentprivacy-peak-qubit-reduction
    - role/agentprivacy-toffoli-reduction
    - role/agentprivacy-benchmark-frontier-archaeology
    - role/agentprivacy-review-receipts
    - meta/agentprivacy-dual-agent-harness
  source_corpus: "developed on a public quantum-circuit benchmark (reversible elliptic-curve point addition validated over a fixed graded shot set plus random differential inputs); the method is domain-neutral"
  upstream: "none recorded"
---

# Reversible circuit validation

A reversible/quantum circuit is correct only if it is correct in **three independent channels at
once**, and the trap that bites everyone is that the easiest test (feed a basis state, check the
output bits) exercises only *one* of them. The other two fail silently in the computational basis
and only bite once the circuit runs in superposition, where you can no longer see them by
inspection.

## The three channels: cls / pha / anc

| Channel | What's wrong | How it hides | Why it's fatal |
|---|---|---|---|
| **cls** (classical) | the output *value* is wrong on some inputs | it does not: a basis-state test catches it | wrong answer |
| **pha** (phase) | the value is right, but a spurious **relative phase** was stamped on the state | invisible to any value check | destroys the interference Shor/QPE depend on |
| **anc** (ancilla) | scratch qubits do not return to **\|0⟩**; they stay **entangled** with the data | the output register still reads correct | leftover entanglement decoheres the computation and breaks reversibility |

**A value check is necessary but not sufficient.** A circuit can pass "basis state in → correct
bits out" on every input you try and still be broken in `pha` or `anc`. Validate all three and
track them *separately*: they have different causes and different fixes.

## The core loop

1. **Decide which channels you need.** Standalone classical use → `cls` may be enough. Anything
   run in superposition (Shor, QPE, amplitude estimation, or any circuit *composed* into a larger
   one) → all three. State this first.
2. **Differential-test** against a trusted reference, on **random** inputs (not only the
   structured/graded set).
3. **Decompose** every failure into `cls` / `pha` / `anc`.
4. **Classify** each failure: a *designed* approximation failure, or a real *bug*?
5. **Localise** real bugs to the first broken operation.
6. **Fix the smallest responsible mechanism, re-validate** all three channels; a fix in one can
   disturb another.

## Step 2: differential testing, on random inputs

Compare the circuit's output to a **trusted classical reference** computing the same function
(e.g. compute `P+Q` classically and check the output register equals it).

- **Use random inputs, seeded for reproducibility, not only the graded set.** A fixed or
  hash-derived test set can systematically *dodge* an input-dependent bug; a bug triggering on
  0.2% of inputs may never appear in 24 hand-picked cases. A few hundred random inputs catch gross
  bugs; ~10k surface rare input-dependent ones.
- **Report `cls / pha / anc` per batch**, not a single pass/fail. Seeing *which* channel is dirty,
  and how often, immediately narrows the cause.

## Step 3: measuring each channel

- **anc**: after the run every ancilla must be provably **\|0⟩**. Assert it (measure, or check the
  statevector). Non-zero, or *entangled-but-happens-to-read-zero*, both count as dirty: clean
  means **disentangled and \|0⟩**, not "value unused."
- **pha**: a value check cannot see relative phase, so test it directly: (a) the
  **forward-inverse identity** `U†U = I` catches a stray phase; (b) run a **superposition** input
  and check the output interferes as the reference unitary predicts; or (c) compare against the
  reference unitary on basis states *with phase tracked*.
- **cls**: compare the output register to the classical reference on each input.

The **forward-inverse identity (`U†U = I`)** is the highest-leverage single check: it exercises
`pha` and `anc` together and needs no superposition machinery. If the composed circuit does not
return every input exactly to itself, something is dirty. Make it your first reflex.

## Step 4: designed approximation failure vs real bug

Many space-optimised circuits **deliberately** truncate carries, narrow compare windows, or
approximate a reduction, so they are *supposed* to be wrong on a small fraction of inputs. Before
chasing a "bug," decide whether a failure is **designed-hard** or **unexpected**:

- Build (or reuse) a **classical model of the approximation** (e.g. a model of an iterative
  inversion's width/convergence envelope) and run each failing input through it. If the model
  predicts failure (width overflow, non-convergence in the budget, a lost needed bit), the input
  is **designed-hard**: expected, not a bug.
- If the model says the input *should* be clean but the circuit failed → **unexpected**: a real
  bug, or an approximation the model does not capture.
- **Know your model's coverage.** A classical filter usually models *some* approximations, not
  all (say, inversion-width failures but not an apply-phase carry truncation). An
  "unexpected-clean" failure can still be a designed truncation the model is blind to. Widen the
  model, or localise (Step 5), before concluding.

For a circuit graded on a **fixed input set**, the endgame is a **clean island**: since
designed-hard inputs are a tiny fraction, you search for a seed/parameter under which every graded
input dodges the hard set, giving `0/0/0` on exactly that set. Validation's job is to *confirm*
`0/0/0` across all graded shots, and to keep the random-input failure rate at the designed level,
no higher. Never let "clean on the graded set" stand in for "correct on all inputs" in a note or
an evidence record; they are different claims.

### Per-channel zero-reachability: a cheap go/no-go for that search

When searching candidates (seeds, nonces, parameters) for one clean in **all** channels at once,
read the verdict off a modest sample first:

> A jointly clean candidate (`0/0/0`) needs every channel at 0 **simultaneously**. A *necessary*
> condition is that each channel reaches 0 **independently** somewhere in your sample. If a channel
> is **never** 0 across many candidates, it has a **per-channel floor**, a defect no seed removes,
> and joint-clean is **unreachable**.

Rank candidate sets by whether **{cls→0, pha→0, anc→0} each occur somewhere**, even over a set with
lower average severity:

- `A = {(2,0,0), (0,1,1), (0,2,0)}`: every channel hits 0 somewhere → `0/0/0` plausibly
  reachable; keep searching.
- `B = {(2,0,0), (1,2,0), (2,1,0)}`: `cls` is *never* 0 → unreachable; **stop and fix the `cls`
  mechanism** (a real bug or an over-aggressive truncation), then resample.

Necessary, not sufficient, but the cheapest screen there is: a single floored channel kills the
search outright and names *which* channel to repair.

## Step 5: localise a real bug to the first broken op

Treat the circuit as a program under debugging and find the *first* operation where an invariant
breaks:

- **Bisect the op stream.** Run to op `K`, check an invariant (an intermediate value, or "ancilla
  X should still be \|0⟩ here"), and binary-search the first `K` where it breaks.
- **Per-section invariants and counters.** Carry/borrow width histograms, compare-decision
  agreement counts, "this scratch is clean at this boundary" receipts.
- **The channel tells you where to look:** `anc` → a missing or incorrect *uncompute* (a compute
  with no matching reverse, or an aliased qubit reused before it was cleaned); `pha` → a wrong
  measurement/phase fixup, or a relative-phase gadget whose mirror did not cancel; `cls` → the
  arithmetic itself (a truncation too far, a wrong control).

## Step 6: fix the smallest mechanism, re-validate all three channels

Patch the one responsible op (restore the uncompute, fix the phase fixup, widen the one
truncation), then **re-run the full cls/pha/anc validation**, not just the channel you fixed.
Repairs interact: restoring an uncompute can change timing that exposes a phase bug; a phase fix
can leave an ancilla dirty. The circuit is correct only when all three channels are clean on
random inputs at the designed failure rate.

## Guardrails

- **Never ship on a value check alone.** `cls`-clean with dirty `pha`/`anc` is the most common
  silent failure.
- **Random inputs expose what structured inputs hide.**
- **Clean ≠ value-unused.** An ancilla can hold the "right" value and still be entangled. Demand
  provable \|0⟩ and disentanglement (`U†U = I` proves it).
- **Do not over-trust your approximation model.** Confirm by localising rather than assuming.
- **A gate's NO-GO is a NO-GO.** If your own validation gate fails, fix the mechanism; do not
  submit over it.

## Worked example (shape only)

Validating a space-optimised reversible point-add (output `P+Q`): 10,000 **random, non-graded**
inputs (seeded), each compared to the classical `P+Q`, with `cls/pha/anc` reported per batch.
Pattern: **`anc` always 0** (structurally clean; every scratch uncomputes), and the only `cls`
failures were ~0.16% of inputs hitting the **designed** carry/width truncation. Each failure went
through the classical inversion filter and was classified non-convergence / width overflow /
body-trim mismatch → **designed-hard**; a residue the filter did not model (an apply-phase
truncation) showed up as **unexpected-clean**, a reminder that the filter's coverage is partial.
The fixed graded shot set, on its searched island, validated `0/0/0`. The whole exercise is Steps
2–4 of this loop.

## Relationship to the other skills

This is the **correctness** counterpart of the two optimisation skills: every qubit freed with
`agentprivacy-peak-qubit-reduction` and every gate cut with `agentprivacy-toffoli-reduction` is
exactly the kind of change that risks a `pha`/`anc` regression (an ancilla freed too early, a
measurement whose phase fixup is wrong, a skipped cleanup that was not redundant). Run this loop
after any such change. For a benchmark's own filter, seed-search tooling and graded-shot harness,
use that benchmark's published docs or skills.
