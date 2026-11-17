---
name: agentprivacy-board-submission-discipline
description: >
  Prepare an entry for an AI-judged public benchmark board the way a harness lane does it:
  label every figure by how it was obtained, gate the package, run critic rounds (including a
  seat that plays the judge) before filing, make every step between measured figures measured
  or proved, never declare a bound below its true value, mint and verify the evidence bundle
  BEFORE submit so the note carries the κ root, name the harness once, hold an entry that will
  not reach the frontier, and keep every negative as a leaf. Use when someone says "prepare the
  submission", "ready to file?", "write the note", "pre-submit checklist", "the judge returned
  it not evaluable / refuted", "should we file or hold", "critic this package", or is about to
  run a board CLI's submit. Board-neutral: it encodes the order of work and the refusals, not
  any board's scores.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "draft_for_review"
  introduced: "2026-11-12"
  target_context: "a harness lane filing claims to a public board whose AI judge scores claims on its own runners and returns valid / refuted / not evaluable, with human review after; notes and archives are public on filing and cannot be edited"
  related_skills:
    - meta/agentprivacy-kappa-evidence
    - meta/agentprivacy-dual-agent-harness
    - meta/agentprivacy-horizon-gate
    - meta/agentprivacy-chronicle-reflect
  source_corpus: "agentprivacy_master/docs/chronicles/2026-11-12_the-ceiling-belonged-to-the-fibre.md (signed by the First Person); a lane's build and measure seat reports for one package (method only: labels, gate, open risks, critic fixes, refiles)"
  upstream: "the board's own CLI skill for command shape (e.g. the yukon-cli skill: benchmark show, submit with a dependencies file, note file, model and harness flags, claimed score where the track prefilters) — third-party, cited not copied; the board's judge prompts and README are the authority on what a claim must contain"
---

# Board submission discipline

`measure · gate · critic · mint · file`

A public board with an AI judge reads the claim, the proof and the organizer's own check reports,
not your intent. Everything filed is public at once and cannot be edited. A failed or returned
entry still publishes the lever. So the lane does all its doubting *before* filing, and files
only what it would defend line by line.

## 1 · Label every figure

Every number in a build or measure report carries how it was obtained:

| label | meaning |
|---|---|
| RUN | measured here, on the shipped program, with the command that produced it |
| ARITH | computed from RUN or READ numbers, the arithmetic shown |
| READ | read from a named file (organizer output, an earlier report) |
| EST | an estimate or a model — never the basis of a declared bound |

Each seat declares its **write area** at the top of its report; earlier builds are read-only to
it. Run the program in the organizer's own form (for example an isolated interpreter reading
the request on stdin), several passes, and report every reading against the limit, not the best.

## 2 · Gate the package

Build a gate script that checks the package as the judge will read it, and print its count
(N checks, N PASS, 0 FAIL). What the gate held on the worked lane:

- a routine-by-routine diff against the previous build, every change documented in the proof;
- every printed bound sentence in proof and claim registered and **recomputed from the printed
  digits**;
- measured rows measured on *this* program, not carried from the last one;
- organizer seeds re-run to their asserted sums; organizer intake reported ready, with the
  package hash recorded;
- the note checked for size and for forbidden lines (§5).

A NO-GO from a gate you built is a NO-GO. If the gate is wrong, fix the gate and re-run it;
never override it in prose. A package handed to minting is frozen: critic fixes that are text
only leave the program hash unchanged, and the report says so.

## 3 · Doubt it before the judge does

- **Declared bounds are never understated.** Recompute every declared bound (time, memory
  including code under the proof's *own* encoding rule, preprocessing, success probability) from
  the shipped files and show in the proof that it is ≥ the true value. One definitely understated
  bound is a fatal finding on its own.
- **Every step between measured figures is measured or proved.** The pattern of returns: a judge
  accepts a measured figure, even a participant-run one, and rejects any step between figures
  that is neither measured nor proved (a dependence assumed, an ordering priced as uniform, a
  moment reduced implicitly). Each return named one such step.
- **Hypotheses are falsifiable, are the premise the claim actually uses, and are met by the
  organizer's counts.** Any organizer count at |z| ≥ 2 is stated plainly, with pre-declared
  organizer-seeded replicates or pooling, never beside a "consistent with" sentence. Post-hoc
  replicates do not rescue it. Where counts only weakly support a premise, re-price
  conservatively: a valid near-top entry beats a not-evaluable one.
- **Write an "open risks a critic should attack" list** in the build report, numbered. It is the
  critic's starting brief and the honest record of what is model, not measurement.
- **Critic rounds before filing.** One or more critics read the package cold. On the worked lane
  one round stopped a version that would have been refuted on four accounting defects.
- **A judge-emulation seat** applies the board's judge prompts literally across every dossier
  and names each unsupported step. Replace each named step with a measurement or a proof; do not
  defend it. End with a **fresh critic** that has read none of the prior rounds.
- **When the gain is large, hunt for the error that would make it too good first.** And when an
  exhaustive check says "this is the ceiling", ask which constant the check fixed that the
  problem does not.

## 4 · Mint, then file

Order of the last mile, every time:

1. organizer check PASS → gate GO → critic and judge-emulation fixes re-run → gate GO again;
2. snapshot + mint + verify the evidence bundle (see `agentprivacy-kappa-evidence`), lever
   ledger included, negatives as leaves;
3. write the root (`sha256:…`), the merkle root and leaf count into the note;
4. greps on the note: expect a hit for `sha256:`; expect **no** `Model:` / `Harness:` header
   lines and no second naming of the harness in the body;
5. dependencies file: every earlier submission whose material you reused, with a rationale that
   says exactly what is reused (and what is not); credit by citation;
6. the keeper's word, then the board CLI's submit with the model and harness as **flags**.

A lane that minted after submitting has to write the root somewhere else; the note cannot be
edited. Mint first.

## 5 · The note

- The board CLI prepends `Model:` and `Harness:` from its flags; the body carries neither. The
  harness label is short (`agentprivacy dual-agent harness`), named once, via the flag. When
  work ran under more than one model, the model flag names each (check the CLI accepts it).
- Lean, just over the board's minimum size, filled with what lets another solver reproduce it:
  commands and expected output, how each figure was measured, limitations, the κ root.
- **No next-steps line, ever,** not even a bookkeeping one: in a live race it points the field
  at your next lever.
- Public and permanent: no private paths, hosts, tokens or personal data.

## 6 · Hold, refile, keep the negatives

- **Hold an entry that will not reach the frontier.** Gate it, mint it, record its root, and
  spend the hours on the larger lever instead. A held entry is still a sealed leaf.
- **A return is a premise, not a verdict on the lever.** Read the judge's reasoning, find the one
  step it named, fix that step across the whole dossier, re-gate, re-mint, refile on the keeper's
  word. Do not put a valid entry back before the judge to tighten a figure; hold the tightening
  for the next lever.
- **Negatives count.** A solid reconstruction near the top is worth filing; every non-paying
  lever, refuted entry and NO-GO path becomes a negative leaf in the ledger. Never inflate a
  claim to reach a margin.
- **No polling.** Query the board when a step needs it (a submit, a verdict the keeper asks for),
  not in background loops.

## 7 · Refusals

- No filing without a GO gate, a verified bundle and the keeper's word.
- No figure in a note or chronicle that was not RUN, READ or ARITH from those.
- No score, entry or competitor named in shared method material; boards move, methods hold.
