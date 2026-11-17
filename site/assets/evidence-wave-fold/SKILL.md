---
name: evidence-wave-fold
description: Fold a benchmark re-entry wave (many submissions across several tracks or families, each with a gate verdict) into one evidence lane whose rows are verdicts under gates, cross-referencing each family's own bundle by root, keeping refuted and rejected entries as rows beside the accepted ones, and drawing the wave as a tree where failed branches stay. Use when a solver lane submits in bulk to a judged board, when negatives need equal standing with wins, when a public page must show verdict counts and roots but no scores, or when someone asks what the lane binds and what it does not. Encodes the row kinds, the tally check, the gate before the mint, the superseded-not-edited rule and the public drawing rules.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# evidence-wave-fold

A wave is a week of submissions, not a single shot: several families, a sweep over round counts in each, a verdict per entry. Most lanes keep the wins and let the misses fall out of the record. This method keeps every verdict as a row, binds each row to the bytes it judged, and draws the whole thing as a tree that keeps its dead branches.

## When it fires

- A lane is about to submit, or has submitted, many entries to a judged board.
- A corrected package follows a refused or refuted one and the question is how the two relate on the record.
- A public page should show the wave without showing scores.
- A reader asks "did you try X?" and the answer is a negative result the lane already paid for.

## What the wave lane carries, and what it does not

It carries no package bytes. Each family's work is minted as a bundle of its own by the lane's evidence tool; the wave lane cross-references each such bundle by root. As blobs it carries: each bundle's run-root object bytes (their hash is the cited root, so the binding is a hash, not a claim), each bundle's lever-tally check (counts of positive, neutral and negative lever leaves), each submission's public note as kept in the lane (which must quote its bundle's root), the lane's earlier chronicles and the verdict list itself.

Rows: `wave-bundle-root` (one per bundle, submitted or not), `submission-verdict` (one per submission: id, gate outcome, judge reason, score) and `chronicle`. Checks: `rows/count/1`, a wave tally, and the lane's lattice-step check.

## The steps as run

1. **Keep the verdict list as a file.** One JSON line per submission with its outcome, the judge's reason, and `supersedes` or `corrected_by` links. A first build held back before submit is named `supersedes_unminted`.
2. **Gate before the mint.** Every cross-referenced bundle is re-verified with the lane's verifier. Any failure, any verdict whose bundle is missing, or any note that does not quote its bundle's root stops the mint.
3. **Mint the step.** `python tools/python/mint_hashsmash_wave.py --wave w1 [--step N] [--date YYYY-MM-DD] [--chain-entry]`. The step defaults to the next free one; `--chain-entry` appends the dated section to the chain file, copying the root from `root.json`.
4. **Verify twice**, as for any bundle; both verifiers must end `RESULT: OK`.
5. **Draw the tree.** `python tools/python/wave_tree.py` reads the newest step's record, the step graph and the verdict list and draws rounds on the x-axis, one row per family; each round node branches into its entries, each entry carrying its root (short), its verdict status and its lever leaves counted by kind. Refuted, rejected and superseded entries stay in the tree, linked to what replaced them. Deterministic: same inputs, same bytes.

## Rules the lane keeps

- **Negatives are leaves with equal standing.** A shut door is minted under the same root as the win, with its output file. Nobody pays for it twice and nobody can say it was not tried.
- **Superseded, never edited.** A VALIDATING row is superseded by a later step's row when the verdict arrives. A rejected row is corrected by a later submission's row. No row is rewritten.
- **The lane binds note to root and root to bytes. It does not bind judge to verdict.** Outcomes are copied from the board by the lane's own session and are not signed by the judge. Write that limit into the lane and into any paper that reads it.
- **A live lane moves the root.** A step minted and overwritten before anyone cites it is fine; after a citation, a new step.
- **Public drawing: roots, kinds, counts, status only.** No scores, no submission ids, no judge text, no measured quantities on a public page. The board's record carries the scores and a board check beats the page.
- **A note's next-steps line is a lever handed to the field while the race is live.** The rule became none at all.
- **Measure the organiser's intake on the final bytes before every submit.** One package failed intake by a few hundred bytes because a previous entry's section was stacked instead of replaced; the local check had not run that step.

Source: the lane's `tools/python/mint_hashsmash_wave.py` and `wave_tree.py`, the verdict list under `chain/`, and the wave chronicle of 19 October 2026. Repository path withheld until the lane's paper is released.
