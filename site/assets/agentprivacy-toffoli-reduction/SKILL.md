---
name: agentprivacy-toffoli-reduction
description: >
  Reduce the Toffoli / T-gate / non-Clifford count of a reversible or quantum circuit: the
  expensive, magic-state-bound resource that dominates error-corrected runtime. Use whenever
  someone wants to "cut the T-count", "lower the Toffoli count", "reduce non-Clifford gates",
  "need fewer magic states", "my carry uncomputation is half my gates", or improve the gate
  factor of a qubits×Toffoli score. Covers venting carry-uncompute into measurement + phase
  fixups, conditional/measured replay so gates only execute on the branch that needs them, fused
  adders and folds, cross-block algebraic fusion of modular add/negate chains, witness-first
  dataflow, ancilla-free majority, skipping provably redundant cleanup, avoiding full
  materialisation, and better arithmetic at the dominant cost centre; distinguishes emitted vs
  average-executed gate counts and value-exact vs support-exact levers. For the QUBIT/width axis
  use agentprivacy-peak-qubit-reduction; for correctness use
  agentprivacy-reversible-circuit-validation.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "operational"
  introduced: "2026-06-30"
  target_context: "circuit engineers and harness lanes cutting non-Clifford cost in reversible/quantum arithmetic under a gate-count or width×gates objective, or a fault-tolerant runtime estimate"
  related_skills:
    - role/agentprivacy-peak-qubit-reduction
    - role/agentprivacy-reversible-circuit-validation
    - role/agentprivacy-benchmark-frontier-archaeology
    - role/agentprivacy-quantum-defence
    - role/agentprivacy-cryptographic-durability
    - meta/agentprivacy-dual-agent-harness
  source_corpus: "developed on a public quantum-circuit benchmark (reversible elliptic-curve point addition, scored peak qubits × average executed Toffoli); worked examples are generalised from public accepted submissions; references/witness-first-dataflow.md distils a public submission analysis"
  upstream: "lever-family appendix adapted from github.com/benhuang2025/ecdsafail-challenge (ecdsafail-agent/toffoli_reduction_skill.md), by benhuang2025"
---

# Toffoli reduction

On error-corrected hardware almost all cost is the **non-Clifford gates** (Toffoli/CCX and the T
gates they decompose into), because each consumes a distilled magic state. Cliffords and
measurements are nearly free by comparison. In a `qubits × Toffoli` objective this skill owns the
second factor; in a fault-tolerant runtime estimate the Toffoli/T count *is* the headline. It is
the dual of `agentprivacy-peak-qubit-reduction`; the two trade, and the exchange-rate section
arbitrates.

Two facts shape every move:

- **Cliffords and measurements are free; only non-Clifford gates cost.** Winning rewrites
  *convert* Toffoli/T work into measurement + Clifford (phase) corrections, or make it *not
  execute*, rather than shuffling it around.
- **The trap is Toffoli DEPTH, not Toffoli COUNT.** "Trade qubits for gates" holds only if a
  rewrite is depth-neutral. Recompute and fewer-ancilla tricks inflate non-Clifford depth, and at
  the magic-state reaction floor that depth is **not refundable**: a count win that triples depth
  can be a real-hardware loss the score does not see.

## Emitted vs average-executed: know which your metric counts

- **Emitted** (every CCX in the circuit) → only *structural* cuts help: fusion, majority gadgets,
  vents, skipped cleanup, less materialisation.
- **Average-executed** (CCX weighted by how often its control condition fires, averaged over
  inputs) → *also* rewards **conditional replay** and **data-dependent elision**: a block emitted
  once but executed on 5% of inputs costs ~0.05× its Toffoli.

State which one applies at the start; it decides which half of the move set is available.

## Two correctness regimes: tag every lever

- **Value-exact**: computes the same function on *all* inputs; only scheduling or ancilla
  handling differs. Adds no new hard inputs.
- **Support-exact** (truncation): drops bits provably zero *on the input support you are graded
  on*, not on all inputs. Saves gates but adds hard inputs, so any fixed-set seed must be
  re-searched.

Either way, **any change to the op stream invalidates a seed searched against the old stream**:
re-search and re-validate. Read the gate count of a candidate (even a failing one) *before*
spending a search on it.

## The core loop

1. **Measure**: get the Toffoli/T count and find the **hot spot** (the phase emitting or executing the most non-Clifford gates). Note emitted vs executed.
2. **Classify** the hot spot's gates by *kind* (table below); the kind dictates the move.
3. **Pick the move** that fits.
4. **Cost it**: depth-neutral? qubit cost? correctness risk? worth it at the exchange rate?
5. **Re-measure**: the hot spot moves; repeat until an irreducible floor.

## Step 2: classify the hot spot

| Kind of Toffoli at the hot spot | The move that fits |
|---|---|
| **Carry-uncompute** (reverse carry chain returning scratch to \|0⟩) | **Vent** it: measurement + Clifford phase fixup (T-count 0) |
| **Recomputed self-uncomputing scratch** (comparators built, read, reversed) | **Conditional replay** under a measurable predicate (executed metric only) |
| **Data-controlled arithmetic** (controlled add / fold-sub on live data) | *Not* conditionable: attack via fusion or materialisation |
| **Majority gadgets** (3-CCX majority) | **Ancilla-free / folded majority** (fewer CCX), peak-neutral |
| **Redundant final cleanup** | **Skip it**, only if provably redundant |
| **Full intermediate products / wide rows** | **Avoid materialisation**: short/streamed/segmented forms |
| **Repeated algebraic stages** (add/negate/subtract chains, separate carry chains) | **Fuse** into one equivalent modular operation or shared carry chain |
| **An O(n²) or ×iterations primitive** (the square, the reduction) | **Better arithmetic** at the cost centre (below), before any schedule knob |

## Step 3: the moves

### Better arithmetic at the dominant cost centre (audit first)

The biggest wins by far come from structural rewrites of a primitive that runs every iteration. If
the modular square runs every inversion round, an O(n²) improvement there has enormous leverage:

- **Karatsuba** the square (`x = hi·2^k + lo` → `lo²`, `hi²`, `(lo+hi)²`): roughly a quarter off
  the schoolbook cross-products, from a small diff. Recurse on the halves as a follow-up.
- **Signed-digit (NAF) recoding** of a modulus constant: fewer non-zero terms means fewer
  add/sub passes in every reduction (e.g. `977 = 2^10 − 2^5 − 2^4 + 1`, four signed terms vs six
  unsigned).
- **Apply each recoded term directly** (`±(value ≪ shift) mod q` via shifted adds and
  pseudo-Mersenne overflow folds) instead of building a full register and doubling up to each
  offset.

Rule: **before touching schedule knobs, audit every O(n²) or ×iterations primitive for a
structural rewrite.**

### Venting: carry-uncompute → measurement (the exact, depth-neutral primitive)

A hybrid controlled adder costs `Toffoli = 3n − 2 − vents`. Each **vent** replaces one carry
*uncompute* Toffoli with an **X-basis measurement + a CZ phase fixup** (T-count 0): exactly −1
Toffoli, +1 qubit, and the extra qubit is held only between the forward and reverse carry chains.

**Vent off-peak phases for free.** Where the phase is not the qubit binder, every vent is pure
savings. On the peak-binding phase the +1 qubit costs the other factor; vent there only if the
gate win beats the qubit loss at your exchange rate.

**Measured-fast adders on non-binding adders.** A coherent ripple adder costs ~2 CCX/bit; a
measured-fast adder (measurement-based carry clear) ~1. Convert the small, non-peak-setting adders;
leave the wide peak-setting adder coherent. Value-exact and peak-flat when placed right.

**Measurement-based uncompute of cleanup bits.** A scratch bit coherently *recomputed* only to
clear it costs CCX. Instead measure it in the X basis and replay the predicate as a classically
conditioned phase correction: 0 Toffoli, phase-exact. Hunt every place a bit is recomputed purely
to be cleared.

### Conditional / measured replay (average-executed metric only)

Wrap a block under a measurable predicate so its CCX only count on inputs where the predicate is
set; a predicate that is 0 on most inputs makes the block nearly free on average. Extended to whole
comparator paths: measure the comparison flag, replay the predicate classically as a CZ/CX tree
conditioned on the outcome, and the comparison's Toffoli collapses on most shots, peak flat.

**Hard constraint:** replay only works on **recomputed, self-uncomputing scratch**. It does **not**
work on:

- **data-controlled ops** (the metric counts the condition mask, not the data controls, so wrapping
  them changes nothing), and
- **live-qubit predicates** reused downstream (you cannot measure and discard them).

Mis-applying replay is the classic over-optimistic estimate.

### Data-dependent gate elision (executed metric)

Skip gates whose control is *known zero on this shot*. Conditional shifts in a binary-GCD path are
no-ops when their edge bit is 0; on the last few iterations of a converged loop a swap's control is
0 on all but rare inputs. Eliding them removes executed Toffoli; emitted count is unchanged.

### Fused folds and fast adds

Fusing adjacent stages removes redundant controls, duplicated cleanup and repeated carry work
(e.g. a modular double and a controlled double sharing one carry chain, value-identical). Usually
the first thing to try with a little qubit slack: low risk, real savings.

### Cross-block algebraic fusion: collapse add/negate chains

Look for adjacent modular stages separated because they belong to different semantic phases but
that telescope when composed. If the intermediate is not externally observed and the next phase
transforms it again, replace the chain with one equivalent operation:

- `t += 2Q; t = −t; t −= Q; t = −t` is exactly `t += 3Q`;
- `t = −t; t += Q` is exactly `t = Q − t`.

Each removed modular negate/add/subtract avoids a carry chain, a reduction fold and cleanup. It is
an exact identity over the modulus, not an approximation.

**Classical-constant folding** is the same idea when an operand is classical: fold `3·Q mod q`
entirely in the classical domain (0 Toffoli) and emit one exact mod-add. Check it does not raise
the peak via a transient register.

Checklist before trusting any fusion:

1. Prove the algebra in modular form, including underflow/overflow reduction behaviour.
2. Confirm the intermediate is not used as a control, measured, or needed by a later uncompute.
3. Implement behind a default-off switch; verify switch-off is byte-identical.
4. Run component self-tests for value, phase and ancilla cleanliness.
5. Re-measure both width and average-executed Toffoli (new scratch may appear briefly).
6. If the op stream changed, assume any searched seed is stale.

Fusion is a high-quality first move: depth-neutral, peak-neutral when scratch fits, stackable.
Do not combine it with risky truncation and then blame fusion for the failures; isolate it first.

### Witness-first / deferred-output dataflow

If a later uncompute or cancellation only needs a **witness relation**, build the witness directly
instead of materialising the final output early and cleaning it later. Example: when a slope
`λ = dy/dx` is live, `dy = λ·dx` lets you erase `dy` and reuse its register as scratch; build
`new_dy = λ·new_dx`, cancel `λ` via the ratio, and only then materialise `new_y`. A whole modular
multiply/add/uncompute detour disappears at fixed width. Math-exact once the ratio identity and
passenger restoration are proved; still needs full classical/phase/ancilla validation. See
`references/witness-first-dataflow.md`.

### Ancilla-free / folded majority

Replace a 3-CCX majority with a 2-CCX ancilla-free form, or use the folding identity
`maj(a,k,c) = c ⊕ ((a⊕c) & (k⊕c))` for controlled-constant carries. Peak-neutral, value-identical.

### Exact-adder swap (removing a truncation can REDUCE gates)

A top-cleaned truncated adder can cost *more* than an exact full-carry adder, because the
truncation needs carry-escape correction. Swapping back is value-exact, saves gates, and removes
hard inputs. Audit every truncated adder/comparator: if its correction overhead exceeds the bits
it saves, the exact variant is free.

### Truncated-suffix cleanup comparators and carry-truncation notches (support-exact)

Recompute an inter-window boundary carry from a *high suffix* rather than a full-width comparator;
drop one more high carry bit from a fold ripple. Gates down, peak flat, hard inputs up. Near the
cliff on a tuned base each dropped bit raises the hard-input rate steeply: cheap to *try*, low odds
once the base is mature.

**Comparator-window narrowing** is the fattest of these: a per-step comparator window that
multiplies across a long loop (hundreds of steps × passes) can yield a large cut from a one-table
edit. Generic lesson: a per-iteration width that multiplies across a long loop is the best
truncation target. Sweep one notch at a time.

### Skip provably redundant cleanup

A folded structure sometimes makes a final top-clean unnecessary. Dropping it removes its Toffoli,
but **only if genuinely redundant**; otherwise silent phase/classical dirt. The highest-risk move
here; pair with strong validation.

### Avoid full materialisation

Do not build a full-width intermediate when a window, the top bits, or a streamed/folded
contribution suffices. Fewer gates *and* fewer cleanup gates: a shared win with the width skill.

### Off-peak loosening (the dual move)

Once a phase falls off the qubit peak, *loosen* its width to buy Toffoli back for free. Shrinking
an off-peak phase is a pure-gate play; widening one is a free gate refund. Judge both on gates
alone.

### Per-step scheduling, and local peak-window trims

A constant width/precision set for the worst iteration emits cleanup the easy iterations do not
need; `width(step)` trims to each step's tolerance. For a one-qubit width drop, a local trim on the
narrow peak window can cost almost nothing in gates, while a global codec or branch rewrite taxes
every iteration: do not pay a circuit-wide tax when the surplus is localised.

### Carry-relief exchange and deeper post-passes

Spend top-clean coherent uncompute to avoid an extra live carry lane (peak-neutral), then spend the
recovered gates on one more iteration or a fuller body: a deliberate peak↔gate rebalance. And run
any sound constant-propagation / affine post-pass to a deeper fixed point: it drops provably
constant CCX for free.

## Step 4: cost the move

- **Depth first.** Vents and fusion are roughly non-Clifford-depth-neutral; recompute-heavy replay
  and aggressive uncompute may not be. Call out a count win that inflates reaction-floor depth.
- **Exchange rate.** Vents and some replays spend qubits to save gates. Off-peak the qubit is
  free; on-peak it is not. With a `qubits × Toffoli` score, compare products, not single factors.
- **Correctness.** Every move must be value-identical (or explicitly support-exact) and
  phase-clean. Validate with a classical / phase / ancilla decomposition, not just an output-value
  check: measurement-based moves fail in *phase*, which value checks miss.

## Step 5: re-measure and repeat

The hot spot migrates just like the qubit binder. Stop when it is the genuine arithmetic the result
depends on, or the next move costs more qubits/depth than the exchange rate allows. **Re-measure
both factors**: a gate win that quietly raised the peak (a vent on the wrong phase) may be a net
loss.

## Worked examples (shape only)

On a reversible point-addition circuit scored `peak_qubits × avg_executed_Toffoli`:

- ancilla-free majority and a fused double sharing one carry chain: structural cuts, peak-neutral;
- small reduction-fold adders flipped from coherent to measured-fast: about −1.4k executed
  Toffoli, peak-neutral (a textbook measured-uncompute win);
- a cleanup-compare window narrowed by two bits once the square was off the qubit peak: a few
  hundred Toffoli at 0 qubits (a pure-gate play on an off-peak phase);
- conversely a seven-qubit width step *spent* several thousand Toffoli: justified only because it
  cleared the exchange rate;
- a Karatsuba square on the dominant cost centre: the largest single cut of the lineage, from a
  small diff.

Each move matched the *kind* of gate at the hot spot, and the off-peak/on-peak status of the phase
decided whether a gate cut was free or cost width.

## Relationship to the other skills

`agentprivacy-peak-qubit-reduction` is the dual over the same objective: vents and replay spend
qubits to save gates; uncompute holes spend gates to save qubits. After *any* change re-measure
both. `agentprivacy-reversible-circuit-validation` owns correctness (vents, replay and skipped
cleanup all fail in phase first). `agentprivacy-benchmark-frontier-archaeology` decodes which gate
lever a competitor just pulled. The lever families above are cross-checked against a public,
commit-attributed catalogue (see `upstream`); re-screen every value against your own base.
