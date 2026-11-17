---
name: evidence-leaf-disclosure
description: Disclose one leaf of a sealed evidence bundle to a named party, at the discloser's chosen moment, as a bundle of its own that carries the leaf bytes, the Merkle inclusion path, the sealed roots and the recipient, so the recipient re-derives inclusion without receiving anything else. Use when a sealed root was published earlier and one document, result or record now needs to be shown to one reader; when a reviewer asks "show me that leaf"; when deciding what a disclosure reveals about its siblings; or when a disclosure itself must be verifiable and dated. Encodes the disclosure record, what it reveals and does not, the second-disclosure question, and the verifier's checks.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# evidence-leaf-disclosure

The root was shown earlier. Now one leaf is told, to a named party, when the holder chooses. The move exists so that sealing is not the same as hiding forever, and telling one thing is not the same as telling everything.

## When it fires

- A bundle's root has been quoted publicly and a reader with standing asks for one leaf.
- A result must reach a reviewer, a partner or a judge without the rest of the lane's work.
- The holder wants the act of disclosing to be itself on the record, dated and checkable.

## What the recipient receives

A small bundle of its own: the leaf's bytes as a blob; a `disclosure/1` record carrying the sealed root's address, the sealed Merkle root, the leaf's address, the proof path (one sibling hash per level), the recipient and the date, and an optional note; one ledger; one check; its own run root. The recipient runs the same verifier as for any bundle. It recomputes the inclusion proof against the sealed Merkle root and the leaf bytes against the leaf address, and ends `RESULT: OK` or not.

## The step as run

    python tools/python/mint_disclosure.py --bundle <sealed step dir> --leaf <name as in root.json, or its address> --to <recipient> [--out <dir>] [--date YYYY-MM-DD] [--note <text>]
    python tools/python/verify_bundle.py <out dir>
    node tools/js/kappa_evidence.mjs verify <out dir>

Then chronicle the disclosure: who, which leaf, when, and the disclosure bundle's own root. The chronicle becomes a leaf of the lane's next step, so the act of telling is in the tree.

## What a disclosure reveals, stated once

- The leaf's bytes.
- The path hashes: one sibling per level. These are hashes, not leaves. They say nothing about what the siblings contain.
- The sealed Merkle root and the sealed root's address.

## What it does not reveal, and the second disclosure

It does not reveal the sealed run-root object. That object lists every named leaf's address and the second-axis label of every leaf, so anyone holding it knows the names and addresses of all siblings, though not their bytes. The recipient can verify inclusion against the Merkle root hex alone. Tying that hex to the root's address requires the root object, which is a second, separate disclosure the holder may or may not make. Decide that before you send the first one, and say in the note which you are making.

## Rules the lane keeps

- A disclosure is to a named party. "Public" is a party too, but name it.
- Never disclose from a bundle that has not been verified today by both verifiers.
- The leaf name in the request is matched against `root.json`; an address also works. Do not retype either.
- A disclosure of a leaf whose bytes were redacted (home paths, host names) discloses the redacted bytes; that is the leaf.

Source: the lane's `tools/python/mint_disclosure.py` and the `disclosure/1` entry in `SCHEMA.md`; the first disclosure is chronicled in the lane under 17 October 2026. Repository path withheld until the lane's paper is released.
