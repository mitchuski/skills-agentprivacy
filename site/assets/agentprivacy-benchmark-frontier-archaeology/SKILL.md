---
name: agentprivacy-benchmark-frontier-archaeology
description: >
  Reverse-engineer a competitive optimization benchmark's advancing frontier: when a competitor or
  new SOTA submission beats your score and the winning entries are visible (a git history of
  accepted submissions, public leaderboard solutions, released configs), extract exactly which
  lever drove the improvement and whether it transfers to you. Use whenever "a new SOTA was
  submitted, analyse it", "diff the new leaderboard winner", "what did they change / what lever
  did they use", "reverse-engineer their improvement", "figure out what drove the score jump", or
  you need to learn from a competitor's accepted entry on a benchmark you are optimizing. Covers
  diffing consecutive winners, walking every intermediate submission (not just endpoints),
  re-measuring the metrics yourself, decomposing a multi-factor score delta, separating a
  transferable lever from a non-transferable search artifact, and tracking the moving bottleneck
  so you know the next target. For DOING the optimization on circuits, use
  agentprivacy-peak-qubit-reduction / agentprivacy-toffoli-reduction; this skill is the forensic
  analysis that feeds them.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "operational"
  introduced: "2026-06-30"
  target_context: "a solver (human or harness lane) on a public benchmark whose accepted entries are visible, learning from each frontier advance"
  related_skills:
    - role/agentprivacy-peak-qubit-reduction
    - role/agentprivacy-toffoli-reduction
    - role/agentprivacy-reversible-circuit-validation
    - meta/agentprivacy-dual-agent-harness
    - role/agentprivacy-lane-chronicle
  source_corpus: "developed on a public quantum-circuit benchmark (reversible elliptic-curve point addition, scored peak qubits × average executed Toffoli, accepted submissions public in git); the method is domain-neutral"
  upstream: "none recorded"
---

# Benchmark frontier archaeology

When you compete on a benchmark whose accepted submissions are visible (a git history of accepted
entries, public leaderboard solutions, released configs), every time the frontier advances you get
a free lesson, *if* you can extract what actually changed. This skill is the forensic procedure for
turning "they beat me by 0.1%" into "they pulled lever X, it transfers (or does not), and the next
target is Y."

The output you want from each advance is three things:

1. **The lever**: the single change that drove the improvement (not the noise around it).
2. **Whether it transfers**: a reusable knob or structural idea, or a one-off search artifact.
3. **The next target**: where the binding constraint moved, so you know where to push.

## The core loop

1. **Detect & sync** the new frontier; verify it is really better by re-measuring, not by trusting the headline.
2. **Diff consecutive winners**: every adjacent accepted pair, scoped to the editable/submitted paths.
3. **Isolate the lever(s)** in each step; filter formatting and noise.
4. **Re-measure the metrics yourself**: confirm you built the artifact you think you did.
5. **Decompose** the score delta across factors and across levers.
6. **Track the moving bottleneck**: where the binding constraint went → name the next target.
7. **Classify** each lever: transferable (knob/structural) vs non-transferable (search artifact).
8. **Record the mechanism and propagate** it into your own notes and skills so the knowledge compounds.

## Step 1: detect, sync, re-verify

Pull the new accepted submission onto a clean tree (stash your local diagnostics and
instrumentation first so they do not contaminate the diff). Then **re-measure the headline number
yourself.** A submission's claimed metric is a starting point, not ground truth; you need your own
measurement to decompose it. Watch for stale build caches: if the toolchain keys a build artifact
on source hash, an env-only change can silently measure the *old* artifact. Confirm a real rebuild
happened before trusting any number.

## Step 2: diff consecutive winners, and WALK THE INTERMEDIATES

This is the step everyone gets wrong, and the most important rule here:

> **Diff *adjacent* accepted submissions, never two non-adjacent endpoints.**

Competitions advance in small steps, and each accepted submission is usually *one* lever. Diff
submission N against N−5 and you bundle five independent levers into one blob and invent a false
causal story (attributing the width win to the knob that only cut gates, and so on). Enumerate
**every** accepted submission between your last-understood point and the new frontier, and diff
each adjacent pair (`diff <S_k> <S_{k+1}>`), scoped to the **editable/submitted paths** only
(ignore graders, harness and generated files). Eight intermediate submissions means eight diffs.
The extra work is exactly what stops you misreading the frontier.

(Hard-won example: diffing a winner one qubit lower directly against the earlier entry bundled
*two* separate submissions and produced a wrong "this one knob did both" story. Walking the single
intermediate submission showed the qubit drop and the gate trim were two different levers in two
different entries.)

## Step 3: isolate the lever in each step

Within each adjacent diff, separate signal from noise:

- **Config/knob changes**: the changed parameter values (the usual lever).
- **Structural code changes**: a new function, a replaced primitive, a changed schedule.
- **Noise**: formatting, comments, re-baked defaults, regenerated artifacts.

Most steps reduce to **one** real lever. If a single submission genuinely changed several coupled
things, note that explicitly; but your prior should be "one lever per accepted step," and a diff
that looks like five levers is usually one real change plus re-baked noise (or you skipped an
intermediate: go back to Step 2).

## Step 4: re-measure the metrics yourself

For each step, build/run the artifact and record the metrics *independently*: the headline score
plus its sub-components. Two tricks recur:

- **Recover sub-metrics by exact arithmetic.** If the score is a product (`factor_A × factor_B`)
  and you can measure one factor, the other often falls out as an exact division. If the division
  is *not* exact, your assumption about the formula or your measurement is wrong; stop and
  reconcile.
- **Instrument the binding constraint directly** if the toolchain supports it (a peak/hot-spot
  trace), so you see not just *that* the metric changed but *which part of the artifact* now
  dominates it.

## Step 5: decompose the score delta

A single lever can move several sub-metrics at once, especially in a multi-factor objective.
Attribute the change **per factor**:

- A knob that drops one unit of factor A while *raising* factor B: separate those and compute the
  **effective exchange rate** (units of B spent per unit of A gained) to judge whether it was a
  real win or a near-wash that only looked good because the product moved.
- A follow-up may be **factor-neutral on one axis**: it shaves B at zero cost to A (e.g.
  shrinking a component that no longer binds). Recognise these as *pure* single-factor plays; they
  tell you that component had gone slack.

Watch for **reversed or loosened knobs.** A new winner sometimes *undoes* an earlier tightening,
loosening a component once it stops being the bottleneck to buy back the other factor for free.
If you assume the frontier only ever tightens, you will misread a loosening as a regression. The
direction of a knob change only means something relative to whether that component currently
binds.

## Step 6: track the moving bottleneck → the next target

In any constrained optimization the **binding constraint migrates** as it is attacked: shave the
component that dominates and a different one becomes dominant. Build the **migration chain**
across the submissions: "at score S1 the binder was phase P1; lever L moved it to P2 at S2; …".
The current binder is **your next target**, and the chain often reveals the competitor's strategy
(walking the bottleneck, one lever per entry). This is the most actionable output: not "they
changed knob X" but "the constraint is now at Y, so that is where the next lever has to land."

## Step 7: transferable lever vs search artifact

- **Transferable**: a knob value or a structural change (a fused stage, a denser encoding, a
  per-step schedule). These port to your own line directly.
- **Non-transferable search artifact**: a value valid only *because it was searched for against
  their exact configuration*: a hunted seed/nonce, a fitted constant, a data order that happens to
  dodge a failure on their setup. Re-using it on your (different) configuration will not reproduce
  the win and may silently break correctness. When an entry is "structural change + re-hunted
  artifact," **only the structural change transfers**; re-run the search against your own config.

This split separates "I learned their technique" from "I copied a number that will not work for
me."

## Step 8: record the mechanism and propagate

Per advance, write down: the lever, the measured per-factor effect, the bottleneck it exposed, and
the transferable/artifact split; then fold it into your own optimization notes and skills. A
decoded frontier that is not written down is a lesson you will pay for twice. In a dual-agent
harness this record is also what the evidence chain seals: the decoded lever is a claim, its
re-measurement is the witness.

## Scope and ethics

This is for benchmarks whose winning entries are **legitimately visible**: an open submission
history, public leaderboard solutions, released artifacts, read as a participant learning from
the published state of the art. It is the competition analogue of reading a published paper's
method. It is *not* a method for obtaining private or access-controlled submissions. Credit what
you learn: when a transferred lever lands in your own entry, the note names whose entry taught it.

## Worked example (shape only)

A reversible point-addition benchmark scored `peak_qubits × avg_executed_Toffoli`, advancing over
a few accepted submissions by 18, then 1, then 7 qubits:

- **Sync + re-measure:** each winner synced; qubits re-derived from a peak trace and `avg_Toffoli`
  by exact division of the score by the qubit count (the division being exact confirmed formula
  and measurement).
- **Walk intermediates:** the one-qubit step looked like "one knob did everything" endpoint to
  endpoint; walking the single intermediate entry split it into *two* levers: a segment notch
  that cost the qubit (and a few dozen Toffoli) and a separate cleanup-compare trim that cut
  hundreds of Toffoli at **zero** qubits.
- **Decompose + exchange rate:** the seven-qubit step *spent* several thousand Toffoli to buy the
  qubits; decomposing showed it cleared the qubit↔gate exchange rate: a real win, not a wash.
- **Migration chain → next target:** the binder moved scratch block → modular square → fold →
  apply ripple; that last phase was the named next target.
- **Transferable vs artifact:** each advance was a structural knob (a live-range hole, a per-step
  schedule, a denser transcript codec) **plus** a re-hunted nonce. The knobs transfer; the nonce
  must be re-hunted against your own config.
- **Loosened knob caught:** a later winner *raised* a segment knob it had lowered before, because
  that component had gone off the peak: a loosening, not a regression.

## Relationship to the other skills

Archaeology is the **intake** stage: it tells you which lever to pull and where the bottleneck is,
then hands off to `agentprivacy-peak-qubit-reduction` (width levers),
`agentprivacy-toffoli-reduction` (gate levers), and `agentprivacy-reversible-circuit-validation`
(confirm any re-hunted artifact is actually clean on your config). For a benchmark's own operating
details (sync commands, knob catalogue, search tooling), use the benchmark's published skills or
docs.
