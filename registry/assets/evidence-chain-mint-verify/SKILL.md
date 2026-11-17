---
name: evidence-chain-mint-verify
description: Mint a lane's documents and run records as a content-addressed evidence bundle (one record per leaf, a ledger, recomputable checks, a run root with a Merkle root and a second hash axis) and re-derive it from the root with two independent verifiers. Use when a research lane, a solver lane or a document pipeline needs its work to travel as addresses that a stranger re-derives, when a chronicle should become a leaf of the next step, when a label or a leaf changes and the question is "re-mint or overwrite", or when a note must quote a root it cannot retype. Encodes the leaves file, the step discipline, the two-verifier rule, the two-roots-not-one-overwrite rule and the gotchas the lane recorded.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# evidence-chain-mint-verify

A measurement, a document or a run leaves the room as a decimal in a note. The decimal travels; nothing binds it to the bytes it came from. This method gives the bytes an address and gives the lane a root, so that whatever is quoted later can be re-derived by whoever holds the bundle, and whoever holds only the root can tell whether a bundle is the one that was cited.

## When it fires

- A lane is about to publish a note, a submission or a chronicle that quotes a number.
- A document pipeline wants every step of its own work to be checkable after the fact.
- A leaf changed, or a status label changed, and someone proposes editing the published root.
- Two implementations of the verifier exist and nobody has checked they agree today.

## The shapes, in one paragraph

Every object is a canonical dCBOR map with small integer keys that never change; the file name is the SHA-256 of the object's own bytes. A bundle is `objects/`, `blobs/` (raw bytes, hashed as stored), `edges/` (typed links), `root.json` (metadata, never hashed), `graph.json` (everything decoded) and a `REPORT.md`. One `record/1` per leaf, one `ledger/1` whose rows are the records, one or more `check/1` objects recomputed from the rows under a named rule, a `sources/1` listing, and a `run-root/1` that names every leaf, carries a provisional Merkle root over every object, blob and edge address, and since 11 October a second label axis (BLAKE3 over the same bytes) beside every SHA-256 address. The registry of shapes lives in the lane's `SCHEMA.md`; a new shape is added there first, with permanent keys, before any bundle uses it.

## The steps as actually run

1. **Name the leaves.** A leaves file (`path<TAB>role`, repo-relative) lists every document that is a leaf at this step. Renders (PDF, HTML) are never leaves; the chronicle of this step is not a leaf until the next step.
2. **Hash as git stores.** Text leaves are hashed with LF line endings and with user paths and host names redacted. Mark the bundle directory `-text` in `.gitattributes` so a checkout never rewrites the bytes.
3. **Mint the step.** `python tools/python/mint_chain.py --step N [--date YYYY-MM-DD]` writes `evidence/r<N>/`. The step number is explicit; the date is explicit. A live lane moves the root between two mints, which is why both flags exist.
4. **Verify twice.** `python tools/python/verify_bundle.py evidence/r<N>` and `node tools/js/kappa_evidence.mjs verify evidence/r<N>` must both end `RESULT: OK`. One passing verifier is not a pass.
5. **Quote the root, never retype it.** The chain file (`EVIDENCE_CHAIN.md`) gets a dated section whose root line is copied from `root.json`. Notes, chronicles and submission texts quote that line. The previous step's root is written as superseded, kept, not cited.
6. **Chronicle the step.** The chronicle opens with the verdict and the evidence root. At the next mint it becomes a leaf.
7. **Fold after every change.** Any changed leaf means a new step. The old root is never edited.

## Rules the lane learned by breaking them

- **Two roots, not one overwrite.** The status label sat inside the root's preimage. When the label changed from unverified to verified after the upstream check passed, the root changed with it. The rule that followed: re-mint and keep both roots, the first one marked superseded. A correction leaves two roots and the second names the first.
- **The first pass catches stale layouts.** Minting a lane kit before use found a layout file the kit had outgrown. Mint before you build on something, not after.
- **Both verifiers drift unless held on a fixed vector.** The JavaScript verifier rejected every bundle on two new rules until it was patched; the ledger line claiming both clean was written before the fix landed and became true within the session. Keep a test vector both implementations must match, and run both before claiming clean.
- **A first mint overwritten before anyone cites it is fine; after a citation it never is.** A step that carried fourteen bundles was re-minted with more because a live lane had moved in between. Once a root is quoted anywhere, it is superseded by a later step, not replaced.
- **The verifier trusts nothing but SHA-256.** It re-hashes file names from content, checks canonical encoding, walks every `composed-of` edge, requires an `evidence-provenance` edge from every row to a blob in the same bundle, recomputes every check under its named rule and matches the Merkle root. Expect it to fail on a leak scan if a home path survived redaction.
- **On Windows `python3` may be a stub.** Call `python`. Keep every heredoc that writes a leaf under about 8 KB.

## What a stranger can and cannot do with the root

With the root alone: tell whether a bundle offered later is the one that was cited. With the bundle: re-derive every address and every check. With neither: nothing, which is the point. Disclosure of a single leaf with its inclusion proof is a separate method (see the disclosure skill).

Source: the lane's `tools/python/` (`mint_chain.py`, `verify_bundle.py`, `SCHEMA.md`) and `tools/js/kappa_evidence.mjs`; the chain file at `evidence/EVIDENCE_CHAIN.md`. Repository path withheld until the lane's paper is released.
