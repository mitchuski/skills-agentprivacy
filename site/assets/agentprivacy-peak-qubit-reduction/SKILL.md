---
name: agentprivacy-peak-qubit-reduction
description: >
  Reduce the peak (maximum simultaneous) qubit count, the "width", of a reversible or quantum
  circuit. Use whenever a circuit uses too many qubits/ancilla/scratch, when optimizing circuit
  width or a qubits-times-gates score, when an arithmetic or Shor-style circuit needs to fit a
  smaller machine, or when someone asks how to "shave qubits", "lower the qubit count", "reduce
  ancilla", "free scratch earlier", or "trade gates for qubits". Trigger even on informal
  phrasing ("this adder needs way fewer wires", "where's all my space going", "can I reuse that
  register"). Provides a left-to-right timeline analysis: find the tallest moment, inventory the
  qubits alive there, decide whether the peak is a single binder or a multi-phase plateau, and
  cut it with uncompute-early/recompute-later holes, live-range shortening, truncation,
  transcript compression, and coordinated co-binder reductions, priced by the qubit↔gate
  exchange rate. For the GATE axis use agentprivacy-toffoli-reduction; for correctness use
  agentprivacy-reversible-circuit-validation.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "operational"
  introduced: "2026-06-30"
  target_context: "circuit engineers and harness lanes shrinking reversible/quantum arithmetic (adders, multipliers, modular inversion, point addition) under a width or width×gates objective"
  related_skills:
    - role/agentprivacy-toffoli-reduction
    - role/agentprivacy-reversible-circuit-validation
    - role/agentprivacy-benchmark-frontier-archaeology
    - role/agentprivacy-quantum-defence
    - role/agentprivacy-cryptographic-durability
    - meta/agentprivacy-dual-agent-harness
  source_corpus: "developed on a public quantum-circuit benchmark (reversible elliptic-curve point addition, scored peak qubits × average executed Toffoli); worked examples are generalised from public accepted submissions; references/dynamic-width-state-machine.md distils a public submission analysis"
  upstream: "lever-family appendix adapted from github.com/benhuang2025/ecdsafail-challenge (ecdsafail-agent/peak_reduction_skill.md), by benhuang2025"
---

# Peak qubit reduction

A circuit's qubit cost is not how many qubits it *names*; it is the **most qubits alive at any
single instant**. Lay the computation out left-to-right in time and plot how many qubits are live
at each moment: you get a mountain range, and the **single tallest peak** is what you pay. This
skill is the playbook for finding that peak and shaving it down.

The whole discipline follows from two facts of reversible/quantum computing:

- **You cannot delete information.** A qubit holding a value cannot just be discarded; the only
  way to free it is to **uncompute**: run gates backward until it returns to a known |0⟩.
- **Width is a MAX over time, not a sum.** Lowering qubit usage somewhere that *is not* the peak
  does nothing for the width score. Only the tallest moment counts.

Together: the qubit prize comes from shrinking whatever is alive at *one specific instant*, and
every bit of "freeing" costs gates to uncompute and recompute. That trade is the heart of
everything below.

## The core loop

Each pass lowers the peak by one increment and usually moves it somewhere new.

1. **Measure**: get the live-qubits-vs-time profile; find the peak height and the phase that owns it (the *binder*).
2. **Inventory**: list the qubits alive at the binder instant.
3. **Classify**: label each (essential data / scratch / transcript-log / passenger / alias-candidate / truncatable).
4. **Brainstorm**: for each non-essential qubit at the peak, propose a shave (the moves below).
5. **Cost**: price the shave in gates, depth and correctness risk via the qubit↔gate exchange rate.
6. **Re-measure**: apply the cheapest safe shave; the peak moves to a new owner; repeat until a structural floor.

The mistake to avoid at every step: **optimizing a qubit that is not actually at the peak.** It
feels productive and changes nothing. Before proposing any shave, confirm the target is live at
the binder instant.

The second mistake is as costly: **treating a multi-phase plateau like a single peak.** If several
independent phases all reach the same height, lowering one can be a real local win while the
global number stays fixed. Then the unit of progress is "which plateau owners have been pushed
below the old height?", not "did the reported peak move?" Keep a co-binder ledger and build a
package of compatible reductions across all of them.

## Match the method to the lever's failure mode

Before reaching for a lever, know *how it can fail*; that decides whether you "tweak and iterate"
or "prove correct, then commit."

- **Graded-failure levers** (truncate a carry/compare width, drop a loop iteration, approximate a
  reduction). Correctness degrades *continuously*: a small, characterisable fraction of inputs go
  wrong, by a little. These usually reduce *gate* cost, and you can **iterate on the dirtiness**:
  measure per-input error, restore one bit, re-measure; and, when the input set is fixed, search
  for a seed that dodges the failures. Near-misses are progress.
- **Binary-failure levers** (free, overlap, stream, or hole a register to cut *peak width*).
  Correctness is **all-or-nothing**: the edit is value-exact on every input, or it corrupts phase
  or ancilla on essentially *every* input. There is **no near-miss ladder.** You must get it
  value-exact, **validate clean (classical/phase/ancilla all zero on random inputs) BEFORE any
  downstream search**, and only then proceed.

**The trap:** applying the graded playbook to a binary lever. A width cut that is not value-exact
yields all-dirty garbage, not near-misses; there is nothing to iterate toward.

**Corollary: when no parameter moves the target, the cost is allocation-bound.** If *every* knob
leaves the peak unchanged, the registers are declared full-width and the only remaining lever is a
**structural code change**, which is binary. Escalate deliberately: inventory the binder's live
set, make the *smallest* value-exact edit, validate, then re-measure. Stop turning knobs once they
have gone flat.

**A peak can be several independent binders, not one shared floor.** Two or ten *unrelated*
phases (an arithmetic core, a fold, a final ripple, a separate squaring) may each reach the peak,
sharing no register. One edit relieving one leaves the others at the peak. That is plateau
decomposition, not failure: lowering the number needs **coordinated edits to every co-equal
binder**. Budget for more than one edit.

**The deepest cuts usually end on a co-binder plateau.** Once the obvious owner is shaved, expect
several phases to tie. The next qubit then needs a package of small edits landing together: one
codec or live-range hole for the persistent floor, one streaming/recompute trick for the transient
apply path, one segment/notch change for a separate arithmetic phase, and selective repairs for
iterations made fragile by the cut.

## Step 1: measure, find the binder

You need a **live-qubit-vs-time trace**, not just a total count:

- If the framework tracks allocation/free events, instrument them: increment on alloc, decrement
  on free, and record the max with the *name of the phase* executing when it was hit. The phase
  name is the most useful output: it tells you what to attack.
- Otherwise walk the time-ordered op list maintaining a live-set; the peak is `max |live-set|`.

Deliverable: one line, **`peak = N at phase = <owner>`**.

> Re-run after *every* change. The peak is whack-a-mole: shave the owner and another phase
> becomes tallest. You are never "done with phase X", only "X is no longer the binder."

## Step 2: inventory the peak's live set

Freeze the circuit at the binder instant and list every qubit alive: what value it holds, where it
was allocated, and where it is next *used*. The gap between allocation and next use is the qubit's
**live range**; live ranges that merely *pass through* the peak untouched are your best targets.

## Step 3: classify each live qubit

| Class | What it is | Shrinkable? |
|---|---|---|
| **Essential data** | inputs/outputs the peak operation reads or writes | rarely: this is the real work |
| **Scratch** | temporaries (carries, partial products, comparison bits) | often: uncompute/recompute, truncate |
| **Transcript / log** | decisions recorded only to stay reversible | often: compress the log |
| **Passenger** | allocated before the peak, consumed after, *idle during* it | yes: move its live range out of the peak window |
| **Alias-candidate** | a restorable duplicate of a value already live | yes: borrow the original as dirty scratch |
| **Truncatable** | bits provably zero or not affecting the result | yes: do not keep those bits |

Most real wins come from the bottom four rows.

## Step 4: shaving moves

### Live-range hole: uncompute early, recompute later (the headline move)

If a qubit holds a value the **peak instant does not need**, free it *before* the peak and rebuild
it *after*, punching a hole in its live range across the peak window.

```
before:  ...====[VALUE held live across the peak]====...   <- counted at peak
after:   ...===]   (uncomputed)   [recompute]===...        <- absent at peak
                  ^^^^^^^^^^^^^^^^^
                  the peak instant falls in here
```

Emit the reverse of the gates that built the value (returning its qubits to |0⟩), run the
peak-owning phase with that headroom, then re-emit the forward gates for the later consumer. It
converts qubits into gates (and depth), so it wins only if the freed qubit was genuinely at the
peak and the cost is below your exchange rate. A cheap-to-recompute value held across a tall peak
is ideal; a value that took thousands of gates to build usually is not.

**The dual (keep-alive).** If the uncompute+recompute round trip *transiently allocates a wider
intermediate* than simply holding the value, do the opposite: keep it live and skip the round
trip. Choose by comparing two widths: recompute transient < holding footprint → hole; holding
footprint < recompute transient → keep alive.

### Live-range shortening / passenger relocation

A **passenger** rides through the peak doing nothing. Allocate it as late as possible and free it
as early as possible; if both first and last use sit outside the peak window, it vanishes from the
binder with no recompute. Always check for passengers first. A targeted case: a carry-in or
scratch bit held across a whole loop but used only at its edges can be allocated lazily inside the
boundary step and freed there.

### Truncation: keep only the bits that matter

Scratch often holds more bits than carry information: high words that are **provably zero** or
that **never influence the observed output**. Keep only the low *W* bits that matter.

**Range-bound a register to drop a guard bit.** A top guard (sign/overflow) bit exists only
because an *intermediate* could transiently leave `[0, 2^k)`. Prove the running value never leaves
range, often by **reordering** (apply additive terms before subtractive so partial sums never dip
negative; the final result is identical), then delete the guard bit: every phase holding it drops
by one.

**Per-step scheduling.** When a block runs in a loop, the safe width usually differs per
iteration. A constant width must be safe for the worst iteration, over-provisioning the rest. A
**per-step schedule** `width(step)` lets each iteration be exactly as tight as it tolerates, and
lets you trim *only the iteration(s) at the peak* without weakening the delicate ones.

**Danger:** dropping a bit that *did* matter silently corrupts the result. Truncation must be
provably safe on the inputs the circuit will actually see.

### Transcript / log compression

Reversibility forces the circuit to **record data-dependent decisions** ("did I subtract? did I
swap?") into fresh qubits, because by the time you undo a step the data that produced the decision
has changed. This transcript is often a large, long-lived slice of the peak live set.

It compresses exactly when it has **structure**: impossible or correlated decision patterns waste
space under a one-qubit-per-bit encoding. A denser encoding (bits only for reachable patterns)
stores the same information in fewer qubits.

**Hard constraint:** the codec must be **bijective**. You will uncompute the transcript later; if
two histories collide to one code, the information to reverse the circuit is destroyed. Lossy is
not an option. Ship a self-test proving collision-freedom over all reachable inputs. Bits you can
prove constant need not be stored at all.

**Finite-support tail codecs beat generic entropy arguments.** Isolate late/tail windows and
enumerate their exact reachable support. If a tail has 32 reachable patterns, encode them in five
code bits and stream the apply from the code instead of re-materialising the raw tail:

1. Identify a long-lived transcript slice still live at the binder.
2. Enumerate its reachable states for the narrow phase where it is used.
3. Build an explicit reversible encoder/decoder for only that support.
4. Stream each apply slot from the code, recomputing only the slot's local controls, then clear it.
5. Self-test bijection, support coverage, and phase-clean forward/reverse behaviour.

This is binary-failure: validate the codec first, then re-measure.

**In-place decode of a persistent block.** The persistent-register version of a live-range hole:
keep a multi-lane block alive *compressed*, decode it in place only for the phase that needs it,
and free the full-width form exactly across the peak.

### Dynamic-width state and passenger ghosting

When an iterative algorithm's state naturally shrinks (Euclidean/GCD-style inversion is the
classic case), treat its registers as time-varying objects, not fixed-width arrays: resize to the
proven live support each step, tear down terminal constants, and "ghost" passengers that can be
reconstructed algebraically later. Keep the exact structural pieces separate from support-gated
ones (thin schedules, caps, seed-dependent tails) before deciding a route is clean enough to
search. See `references/dynamic-width-state-machine.md`.

### Aliasing / dirty-scratch borrow

If you need scratch and a live register holds a value you can **restore before it is next
observed**, borrow it as dirty scratch: use it, then undo your changes. No new qubits enter the
live set. Be certain nothing reads that register (as data *or* control, phase included) between
borrow and restore. A specific form, **borrowed-carry fusion**: a truncated-carry adder that
would allocate a fresh carry vector borrows an adjacent live scratch block instead, freeing only
the owned suffix afterwards. Value-exact only if the borrowed qubits are genuinely in the state
you assume at that point.

### A headroom governor

Instead of shaving one ancilla at a time, define `headroom = target_q − active_qubits` and make
every transient-allocating primitive clamp its carry/chunk width to `min(scheduled_width,
headroom)`, so no local peak can exceed the ceiling. Lower the target by one to try to drop the
peak by one; the clamp body is unchanged. It generalises a static per-window carry cap into a
per-call clamp, and it trades gates for a hard cap, so price it (Step 5).

## Step 5: cost the shave, the qubit↔gate exchange rate

Every move buys qubits with gates (and usually depth). Decide *before* implementing:

- **Break-even.** If your score is `qubits × gates`, a qubit is worth about `gates_total /
  qubits_total` gates. Spend fewer gates per qubit than that and you win.
- **Price each layer separately.** The peak is usually a **persistent floor** plus a
  **transient**. Freeing the transient (which *looks* wasteful) is often the *expensive* qubit;
  compressing a long-lived transcript (which *looks* irreducible) is often the *cheap* one. When
  several layers are reducible, compute gates-per-qubit for each and take the cheap one,
  frequently **compress the log before you free the scratch**. On one circuit, freeing transient
  working registers cost ~10× break-even (a qubit record, a score loss) while compressing the
  persistent transcript cost under break-even (a score win): same −qubits, opposite verdicts.
- **Exchange rates are per-base.** The same clamp can cost over a thousand gates per qubit on one
  arithmetic base and a few dozen after a cheaper primitive lands. **Re-test shelved width levers
  after every arithmetic win.**
- **Run both tracks and compare products.** A drop that clears break-even at landing can still
  lose the product race to a pure gate grind at the old width. Never minimise qubit count in
  isolation.
- **Depth is the hidden tax.** Uncompute/recompute inflates depth. A `qubits × gates` score does
  not see it; error-corrected hardware does. Prefer depth-neutral reductions.
- **Entanglement risk.** Freeing a qubit that *looks* dead but is still entangled (used later as
  a control, or carrying a phase) injects a silent phase error that value checks miss. Confirm
  genuine disentanglement (uncomputed to |0⟩), not just "value unused."

## Step 6: re-measure and repeat

Apply the cheapest safe shave, re-run the trace, read the new binder, go again. Stop when the
binder is an irreducible floor (essential data of the peak operation) or every remaining shave
costs more than the exchange rate allows. Keep a short log of which phase owned the peak at each
height and which move dislodged it.

**Treat "we've hit the floor" as a hypothesis to disprove.** Before declaring a layer
irreducible, re-inventory and ask of each persistent register: is this *essential data*, or an
**encoding** not yet beaten? More than one published "floor" has fallen to a better encoding of
the *same* state. The reliable signal is a *measured* composition where every remaining live qubit
is essential data, not an analysis that concluded a layer "should be" irreducible.

### One-qubit frontier drops: localise before globalising

When the frontier needs **one** more qubit, bias hard toward localised peak-window moves before a
new global structure. A broad codec or branch-layout rewrite touching hundreds of steps can add
tens of thousands of gates and still lose the score. In one public case the winning one-qubit
drop tightened arithmetic padding and applied a −1 carry-layout trim **only inside the late peak
window** (plus small neighbouring schedule deltas), validating clean at a tiny gate cost; a
competing global streamed-transcript route reached the same width dirty and several percent
heavier in gates.

Rule: if the peak is a narrow late-window plateau, first try per-step carry layout,
padding/support shrink and adjacent schedule deltas on that window; escalate to global codecs only
after the local levers are exhausted.

## Plateau decomposition: lower every co-binder together

When many phases tie at the peak, **switch into plateau mode immediately**. Mature low-width
circuits rarely have one tall tower; they have a balanced skyline, and the next qubit comes from
coordinated pressure on every co-binder.

1. **List all plateau owners** from the detailed trace, in a ledger: phase, height, live-set
   suspects, knobs/code paths, correctness risk, gate-cost risk, status (`unmoved`, `locally
   lowered`, `regressed`, `combined`).
2. **Attack one peak family at a time.** A lever that drops its phase by one while the global peak
   stays is still valuable: mark it `locally lowered`, do not discard it.
3. **Classify the lever.** Prefer live-range holes, passenger relocation, transcript streaming,
   carry parking, source-as-carry suffixes and segment/notch changes aimed at qubits live at that
   phase. Distrust edits that lengthen boundary-carry lifetimes or widen a neighbour.
4. **Re-trace after every local win**: did the phase leave the plateau, did another join, did a
   taller spike appear elsewhere?
5. **Keep the package small and orthogonal**: one lever per family. Do not stack unproven edits on
   one phase before every co-binder has a local answer.
6. **Combine only compatible local wins**, then remeasure peak, emitted gates, average gates,
   score and validation dirt. If the combination fails, bisect by family.
7. **Self-test new arithmetic primitives before any search.** A plateau cut introducing a new
   reversible primitive is binary-failure.

**One local peak reduction is a lemma; the combined package is the theorem.**

Plateau progress report:

```text
current plateau height: <N>
owners:
- <phase A>: locally lowered by <lever>, now <N-1>, cost <delta gates>
- <phase B>: still binding at <N>, next lever <idea>
- <phase C>: locally lowered but regresses <neighbour phase>, needs repair
combined package:
- enabled: <lever list>
- measured peak: <N or N-1>
- emitted/avg gate delta: <delta>
- validation: <cls/pha/anc or pending>
```

### Example: a five-family plateau

A point-addition circuit at height N had tied owners: a modular square (forward/inverse), an
apply add/sub ripple, an apply final ripple, compressed-block double/halve, and special
overflow/underflow folds. One-family reductions:

| owner | lever | effect |
|---|---|---|
| modular square | smaller segment notch | N → N−1 |
| apply final ripple | low-width final-ripple variant | well below N |
| apply double / halve | fold carry parking + per-step map | N → N−1 |
| special folds | special-fold parking + per-step map | N → N−1 |
| non-final apply ripple | source-as-carry suffix for one carry lane | N → N−1 |

The non-final ripple was the hard one: naive chunk reshaping backfired (more chunks, more
boundary-carry liveness). The useful move used source wires as temporary suffix carries and
restored them, trading a live carry lane for gates: value-exact, so primitive self-tests first.
Combined, the route reached N−1 at higher gate count. The lesson is the workflow: isolate every
co-binder, prove a local reduction for each, reject fixes that create worse neighbours, combine,
then decide whether the gate cost and validation dirt justify going on.

## Worked lineage (shape only)

A reversible point-addition circuit scored `peak_qubits × Toffoli` walked down like this, each step
a different binder and a different move:

- binder = a scratch block in the inversion apply → **live-range hole** (free it during a shift
  sub-phase that did not use it) → −18, binder moves to the modular square;
- binder = the square → **truncation** (one segment notch) → −1, binder moves to a fold (a
  follow-up shrinking the now-off-peak square was *peak-neutral*, gates only);
- binder = the fold → **per-step scheduling** of the fold's carry truncation + a **denser
  transcript codec** with a bijectivity self-test → −7, binder moves to an apply ripple;
- binders = apply/fold plus square → **finite-support tail codec + streaming apply**, partial raw
  transcript release, selective compare repairs, deeper carry parking, square rebalance → −15.
  Ablations were diagnostic: disabling streaming raised the plateau by one; disabling the tail
  codec raised it by seven; reverting the square made it bind at the old height.

Every height was unlocked by attacking *that height's* binder with the move that fit it.

## Lever families (adapted catalogue)

Adapted from a public, commit-attributed lever catalogue (see `upstream`); stated here as
families, without any one codebase's knob names. Re-screen every value against your own base.

- **A · Free-and-recompute idle ancillae**: free controls that are dead across the wide region,
  recompute them value-exact from still-live registers (aim for CX-only or one self-uncomputed
  CCX). Recompute base controls first, then dependents.
- **B · Range-bound a register to drop a guard bit** (above).
- **C · Peak-bounded segmentation, land exactly, co-descend**: segment a wide op so its peak is a
  tunable width; make it the single global binder; push every other co-binder strictly below it;
  then tighten the bound until the peak lands exactly there.
- **D · Keep-alive instead of uncompute-recompute** (the dual of A, above).
- **E · Top-clean carry split**: replace streamed suffix bits with coherent top-clean carry
  positions in the materialised prefix: scratch flat, gates down (a peak-neutral gate win).
- **F · In-place decode of a persistent block** (above).
- **G · Borrowed-carry fusion** (above).

**Verification for every lever:** value/phase-exact lifetime changes must not alter the circuit's
function. After each: validation shows `qubits = N−1` with classical/phase/ancilla all zero, and
the peak trace shows the floor moved. Gate every lever behind a default-off switch with a
byte-identical base path; turn it on only once verified. `free` requires |0⟩; only reacquire what
you freed. If the op stream changes, any seed searched against the old stream is stale: re-search.

## Relationship to the other skills

`agentprivacy-toffoli-reduction` owns the gate axis; the two trade over the same product.
`agentprivacy-reversible-circuit-validation` owns correctness, and every width cut is a
binary-failure change it must clear. `agentprivacy-benchmark-frontier-archaeology` tells you which
binder a competitor just moved.
