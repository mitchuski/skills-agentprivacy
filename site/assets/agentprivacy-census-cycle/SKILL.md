---
name: agentprivacy-census-cycle
description: >
  Run the measure seat of a harness fleet as a census-gated knowledge base: every number in
  every record is a verbatim quote from a file on disk, a deterministic census re-reads every
  claim, and a gate (G0–G4c) refuses the build on one untraced claim or one unquoted number.
  Covers the claim shape, the gate, the dream cycle (bring the fleet corpus current after lanes
  have moved) and the universe cycle (read a whole suite of repositories as one corpus and
  report where what is told disagrees with what is sealed). Use when someone says "run the
  dream cycle", "census the fleet", "re-read the universe", "soul mage cycle", "every number
  needs a quote", "why did the census refuse", "add a lane / κ anchor to the record", "the
  gate is NO-GO after a week away", or wants a knowledge base whose numbers cannot drift from
  their sources. Encodes the recipe in the order that ran twice, the read-only seat pattern,
  and every refusal the census taught.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "draft_for_review"
  introduced: "2026-11-12"
  target_context: "an agent keeping a fleet's record (lanes, suites, κ anchors, repositories) current and checkable; soul_mage is the worked instance, its consumer pages are the lab's /harness/ pages"
  related_skills:
    - meta/agentprivacy-dual-agent-harness
    - meta/agentprivacy-kappa-evidence
    - meta/agentprivacy-chronicle-reflect
    - meta/agentprivacy-horizon-gate
  source_corpus: "soul_mage/{README.md, RESUME.md, harness.config.mjs, frontier.json, tools/{lib,census,gate,build,render}.mjs, tools/chain.py, chronicles/2026-11-06_the-row-that-moved.md, chronicles/2026-11-12_the-signs-behind-the-seals.md}; agentprivacy_master/docs/chronicles/{2026-11-06_the-universe-reads-itself.md, 2026-11-12_the-seals-outrun-the-signs.md}"
  upstream: "the dual-agent harness (engine/conform.mjs, tools/kappa.mjs: the κ law and conformance gate are imported, never copied) · kappa_evidence_mage (kappa.py, bundle.py: the chain's dCBOR + SHA-256 primitives)"
---

# Census cycle — a knowledge base where every number is a quote

`quote · trace · gate`

The measure seat reads every lane and writes into none. What it keeps is a set of **corpora**:
directories of JSON records about what other directories *recorded*. A corpus asserts that a
source **wrote a number down**, never that the number is right; correctness is the source's own
gate. Because the claim set is enumerable, the gate is a **census** (every claim probed), not a
draw: there is nothing to tune to, so the only winning move for any seat is to copy what the
file says, with its path.

Two cycles run on this machinery:

- **Dream cycle** — bring the fleet corpus current after lanes have moved: re-trace what left its
  file, record new lanes and κ anchors, re-date stale reads, re-seal, re-render.
- **Universe cycle** — widen the same method to a suite of core repositories, one record per
  repository, and write a report of **defects** (two files that disagree, both quoted) and
  **pathways** (open targets the files name). The finding both times: the sealed layer agreed
  with itself; nearly every defect was in the *told* layer (READMEs, indexes, status lines)
  lagging its seals. The report is a list of doors, not a list of faults; fixing a README is
  that repository's own voice and the keeper's call.

## 1 · The shapes

A **record** is one thing (a lane, a suite, a repository, a κ anchor). A **claim** is one number
or statement:

```json
{
  "id": "lane-3",
  "text": "the plain-language reading of the number",
  "source": "~/<lane>/frontier.json",
  "quote": "\"held_out_witnesses\": 9024",
  "kind": "disk",
  "read": "2026-11-12"
}
```

- `source` is `~/`-rooted, so the corpus is share-safe and resolves on whoever runs it. A path
  on another disk cannot be recorded; report it instead.
- `quote` is verbatim; the census compares whitespace-normalised (runs of whitespace → one
  space), so wrapped Markdown and JSON still match.
- `kind: memory` is allowed (the only trace is a session-memory file) but counts as **weak**;
  a record with no `disk` claim is withheld from every export.
- The record's `recorded` prose may only carry numbers that appear in its claims' `text` or
  `quote` (`numbersIn` extracts them; ISO dates and four-digit years are exempt, identifiers
  glued to letters such as `v0.4` or `K21` are names).

Layout: `harness.config.mjs` (corpora, consumers, `gate.N` = total claims), `frontier.json`
(keystone-only: metric = weak traces, best, per-corpus counts, the gate at zero),
`<corpus>/*.json` (record arrays) + `exclusions.json`, derived `<corpus>/index.json` (κ per
record) and `KB.md`, `exports/` (records minus claims), `runs/<id>/census.json`, `kappa/`
(the chain bundle and its sealed epochs), `chronicles/`.

## 2 · The gate, in order (`node tools/gate.mjs`; exit 1 on the first failure)

| step | what it refuses |
|---|---|
| G0 conform | the harness's own conformance check on this instance |
| G1 census | any untraced claim (file missing or quote gone) or unquoted number, every corpus |
| G1b bank size | `config.gate.N` ≠ census claim count (growing the bank is a visible edit) |
| G1c frontier | `frontier.json` not saying untraced 0, claims = count, best.metric = weak |
| G2 build | an excluded id or term reaching an export; seals κ per record and per index |
| G2b κ verify | any stored κ that does not re-derive under the shared κ law |
| G3 exports | a development hostname, secret-shaped string or home path in any export |
| G3b privacy | a private corpus with an export file, a consumer region, or a record id in any export |
| G4 render | a consumer page out of sync with its exports (`render.mjs --check`) |
| G4b chain | the record page's κ-chain not re-deriving, or a sealed name, path, stray κ, model name or result figure on the page |
| G4c seal | any address on a consumer page not in a sealed chain that re-derives |

The door (commit, push, deploy) is not in the gate. It is the keeper's.

## 3 · The cycle, as it ran

1. **Census first, touch nothing.** `node tools/census.mjs`. Expect a NO-GO after time away:
   a source regenerated (quote gone), sources changed under quotes that still hold (stale),
   a chain that no longer re-derives because its epoch moved on paper only. Write down the
   arrival state; it is the chronicle's opening line.
2. **Re-trace the untraced.** Open the source's *own* record of itself (frontier, RESUME,
   LATEST, root.json, status line) — never a page that cites it, never memory. Copy the line.
   A rendering that cites the knowledge base can never be cited back into it.
3. **Add records through read-only seats.** Fan out one seat per family of lanes or
   repositories. Each seat reads and writes **only JSON to a scratch area**, never into a corpus
   or a lane. Give each the claim shape, the `~/` rule and the "verbatim or nothing" rule.
4. **Verify anchors before sealing.** A κ anchor (a lane's evidence root shown on the record
   page) enters only after the main thread re-runs that bundle's verifier and gets OK; the
   anchor's status line is the verifier's output, never typed. Check the anchor's tease for
   scores or sealed figures.
5. **Merge by id.** A small merge script replaces records by id, keeps any field a seat dropped
   (seats trim history to fit a claim cap; put it back), appends new records.
6. **Bump stale reads.** For each stale claim, confirm the quote, update `read`. The frontier
   does not move for this.
7. **Gate N and the frontier.** Set `gate.N` in the config and `gate.claims` in
   `frontier.json` to the new count. The frontier's metric moves only when a weak claim gains
   disk evidence.
8. **Build.** `node tools/build.mjs` — index κ per corpus, digests, exports.
9. **Chain once.** Fix every source first, then mint the chain a single time
   (`python tools/chain.py`). The chain is append-only by epoch: a mint whose root differs
   seals the previous bundle as an epoch forever.
10. **Render.** `node tools/render.mjs --write` rewrites only the marked regions
    (`<!-- soul:<name> --> … <!-- /soul:<name> -->`); hand-written prose around them stays.
11. **Gate.** `node tools/gate.mjs` must print GO.
12. **Consumer verify.** Run the consumer site's own gate (and any address-map regeneration it
    needs) — the measure seat's GO does not certify the pages' other checks.
13. **Chronicle.** Verdict first: records, claims, untraced, unquoted, stale, weak, index κ,
    chain root and the root it succeeds; what the census refused and why; what is left for
    the keeper. Uncommitted; the keeper reads first.

For a universe cycle, step 3 is "one seat per family of repositories", and the cycle also
writes a report beside the corpus: defects, pathways, git state per repository. Git state lives
in the report, never in a record.

## 4 · Gotchas the census taught

- **Seats paraphrase.** On the first universe pass the census refused 5 of 126 quotes (~4%)
  as paraphrases or elisions. Correct them by re-copying from the file; never loosen the match.
- **Git output is not a file.** Eight numbers on that pass were dirty counts and merge heads
  from git commands; no file says them, so no claim can carry them. Put git state in the report.
- **Never quote what this auditor renders or changes.** Learned twice: the auditor's record of
  itself quoted its own claim count (moved by running the cycle), and a consumer page's render
  stamp (rewritten mid-cycle by step 10). Quote the stable prefix of a stamp, or a line the
  cycle cannot move.
- **The date mask has a hole.** `numbersIn` masks ISO dates on word boundaries, but an
  underscore is a word character: in `upload_2026-10-25` the `10` and `25` read as numbers and
  go unquoted. Keep dates glued to names out of `recorded` prose.
- **An anchor's lane/board must not be a substring of its shown name.** The page shows the
  label, the chain seals the board, and the veil check reads them as one name; a board value
  "research package" inside the label "research package p12" failed G4b. Rename the board.
- **Two mints = a stray epoch.** Minting the chain, finding a source to fix, and minting again
  sealed an intermediate epoch minutes old, kept forever by the append-only rule.
- **A private corpus is the wrong privacy for public names.** G3b treats a private corpus's
  record ids as secrets; a corpus of repository names would flag the fleet's own exports. Make
  such a corpus an export with no consumer page instead.
- **Private corpora never leave.** Index and digest only, untracked by git until the keeper
  rules; no export, no consumer region, no id in any export.
- **A status label is not a number a file wrote.** Keep verifier status words out of prose
  unless a claim quotes them.
- **Stale is not untraced.** Stale means the file changed after `read` but still contains the
  quote; re-read and re-date. Untraced is a failure.
- **Paths off home cannot be recorded.** A lane store on a second disk is reported in the
  cycle report with its counts, not entered as claims.

## 5 · Refusals

- No number without a quote; no quote from memory when the file exists; no inferred number.
- The measure seat writes into no lane and corrects no README; it reports.
- No consumer page is deployed and nothing is committed by the seat; the door is the keeper's.
- No result figure, model name or sealed content on a veiled page — the pages carry addresses.
