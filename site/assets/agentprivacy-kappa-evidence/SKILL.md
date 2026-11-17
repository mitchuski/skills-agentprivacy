---
name: agentprivacy-kappa-evidence
description: >
  Mint and verify κ-addressed evidence bundles: a run's rows, checks, blobs and typed edges
  sealed as canonical dCBOR + SHA-256 objects under one run root, with a merkle root over every
  leaf, check facts the verifier recomputes from the rows under a named rule, and a leak scan.
  Use when someone says "mint the evidence", "seal this run", "κ root for the note", "verify the
  bundle", "verify the chain", "write a mint adapter for this lane", "add a check rule", "why
  does verify_bundle fail", or needs an evidence root a third party can re-derive from the bundle
  alone. Encodes the bundle layout, the schema registry discipline (permanent integer keys),
  the adapter pattern (snapshot → mint from the snapshot alone → verify), the lever-ledger with
  negative leaves, chain links between steps, and the gotchas that broke verifies.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "draft_for_review"
  introduced: "2026-11-12"
  target_context: "a harness lane (solver, formal, census) that must hand a reviewer an evidence root and a bundle that re-derives it; kappa_evidence_mage is the reference implementation and the lane-neutral verifier"
  related_skills:
    - privacy-layer/agentprivacy-content-addressing
    - meta/agentprivacy-dual-agent-harness
    - meta/agentprivacy-census-cycle
    - meta/agentprivacy-board-submission-discipline
  source_corpus: "kappa_evidence_mage/{README.md, SCHEMA.md, kappa.py, bundle.py, verify_bundle.py, verify_chain.py, test_kappa.py, mint_pareto_wave.py, chronicles/2026-10-08_p1-passes-and-the-label-was-in-the-root.md, out/r32/root.json}"
  upstream: "kappa-registry @ 2af8656 (kappa-core: kappa label, Edge struct, merkle.rs leaf/node rule) · bc-dcbor-rust @ 2e5b901 (canonical dCBOR, dcbor-derive) — mirrored and tested against, never edited"
---

# κ evidence — a bundle that re-derives its own root

`same bytes · same κ · same root`

A **κ** is `sha256:<hex>` over bytes: raw bytes for a blob, canonical dCBOR for an object or an
edge. A **bundle** seals a run: every row it rests on, every check computed from those rows, the
source files as blobs, and typed edges between them, under one **run root**. A reviewer given the
bundle and the verifier re-derives the root and every check from the bytes alone, trusting
nothing but SHA-256. The root goes into the submission note, the chronicle, the census anchor.

## 1 · The bundle

```
<bundle>/objects/<hex>.cbor   canonical dCBOR; file name = its κ hex
<bundle>/blobs/<hex>.bin      raw bytes (κ over the bytes, no wrapping)
<bundle>/edges/<hex>.cbor     Edge records {0 source, 1 target, 2 relation, 3 asserter, [4 value_kappa], [5 metadata]}
<bundle>/root.json            root κ, status, lane, minted_on, merkle root + leaf count, counts, names (metadata, not hashed)
<bundle>/graph.json           everything decoded, for readers
<bundle>/REPORT.md
```

Rules every bundle obeys (the verifier enforces each):

- a file's name is its content's κ; objects and edges re-encode byte-identically (canonical);
- every ledger row carries an `evidence-provenance` edge to a blob in the same bundle;
- a `check/1` (or `summary/1`) is recomputed from its ledger's rows under its **named rule** and
  must equal the stored facts **byte for byte as dCBOR** (not language equality: `True == 1`
  in Python, but `f5` ≠ `01`);
- the merkle root (run-root field 4) is over every object, blob and edge κ except the root and
  its own edges, as a sorted **set** (a blob whose bytes equal an object's dCBOR shares its κ);
- named ledgers and checks are reachable from the root by `composed-of`;
- no private string (user paths, home dirs, host names) in any object, edge or blob.

Relations used: composed-of, derived-from, evidence-provenance, section-of, refers-to.

## 2 · Shapes are a registry

Every object is a dCBOR map with small **permanent integer keys**; changing a key number changes
every κ ever minted with it. `SCHEMA.md` is the registry: a new shape (or a new check rule) is
written there first, with its keys and facts, before any bundle uses it. Optional keys are
omitted when absent, never null. The core shapes: `run-root/1` (lane, date, sorted name→κ
pairs, merkle root, status, asserter, upstream pins, extra lane facts with a dual-label axis,
optional field 9 = previous step's root), `ledger/1`, `record/1` (a generic row: seq, kind,
text-keyed fields, lane), `check/1` (ledger κ, rule name, facts), plus lane shapes (`call/1`,
`images/1`, harness proposal/gap/verdict, `sources/1`, `transform/1`).

## 3 · The adapter pattern (how a lane mints)

1. **Snapshot.** Copy the package, the organizer's check output, the lever ledger and every
   evidence file the ledger names into `input/<tag>/`, and write `SHA256SUMS.txt`. The mint
   reads the snapshot only, never the live lane.
2. **Mint** through the shared helper (`bundle.py`): `put_blob` each file; `record(...)` one row
   per ledger line with provenance to its source blob; `ledger(...)`; `check(...)` with the
   rule name and the facts you computed; `root(composed, extra, prev)`; `write(out)`.
3. **The lever ledger is the evidence chain, not just the result.** One `record/1` leaf per
   lever with status positive / neutral / negative, `refers-to` edges to its evidence blobs, and
   a lever-tally check. Failed trials, NO-GO paths, critic reports and process misses are leaves.
4. **Verify** (§4). Only an OK verify produces a root you may quote.
5. **Chain** step bundles with `--prev` (run-root field 9 = previous root κ) when a lane moves
   in steps; a root without field 9 encodes exactly as before.

## 4 · Verify

```bash
cd kappa_evidence_mage
python test_kappa.py                         # golden vectors copied from the upstream test suites; expect FAILURES: 0
python verify_bundle.py out/<tag>            # one bundle; last line: RESULT: OK | status of every kappa: <status>
python verify_chain.py [--expect-head <κ>] out/<lane-dir>   # ordered steps: each verifies, each prev = the root before, contiguous, head = last
```

`verify_bundle.py` re-hashes every file, walks `composed-of` from the root, recomputes every
check under its rule, recomputes every dual label, checks gap seeds against their proposal canon
blob and image blobs against their declared layout hashes, recomputes the merkle root, and runs
the leak scan. A root signature, when present, is reported (ed25519 is checked by the harness's
JS verifier). A second, independent encoder (the harness's JS dCBOR) agrees on a fixed struct
vector, so a byte-level slip in one shows as a disagreement.

## 5 · Gotchas that broke verifies

- **Run it from the mage directory, without `python -I`.** `verify_bundle.py` does a bare
  `import kappa`; isolated mode drops the script's directory from the path and the import fails
  (`ModuleNotFoundError: No module named 'kappa'`). Its bundle argument is relative to that
  directory too. (`verify_chain.py` inserts its own directory; `verify_bundle.py` does not.)
- **Some bundles need lane-specific verifiers.** A rule the lane-neutral table does not know is
  a FAIL ("unknown rule"), not a pass. In a registry sweep, 47 bundles failed here only because
  their rules lived in a sibling mirror verifier, and passed there; two needed an external
  verifier binary named by an environment variable (`FLASHPROVE_CP_VERIFY`) and fail without it.
  Keep one rule table where possible; name the verifier that passes each bundle.
- **Status strings come from the verifier, never typed.** The status label is field 5 of the
  run root, so it is *inside* the root κ: "flip the label" means "mint again", and the merkle
  root does not move while the root κ does. Quote the status from the verifier's RESULT line.
- **Text blobs are hashed as git stores them.** LF line endings, user paths and host names
  redacted, and the bundle directory marked `-text` in `.gitattributes`. Without it a checkout
  with newline conversion rewrites every blob and every verify fails after clone.
- **A stale constant is a finding, not noise.** The images check failed on a layout file that
  still declared the base hashes after a patch; the generator was fixed, the snapshot
  re-exported and re-minted, and the superseded root kept on record, not cited.
- **Encoding quirks are upstream's, mirrored on purpose.** `Vec<u8>` fields encode as an array
  of unsigned integers (not a byte string); `None` fields are omitted (not null). An encoder
  that "fixes" either computes different edge and anchor κs.
- **Long tracked paths** need `core.longpaths` on some clones.

## 6 · Refusals

- No root is quoted that did not verify OK on this machine.
- The vendored upstream clone is never edited; the encoder is a mirror tested against its vectors.
- `out/` and `input/` stay local; only roots and verifier output travel unless the keeper rules.
- No asserter key is invented: unsigned edges carry a placeholder asserter (`unsigned:<lane>`).
