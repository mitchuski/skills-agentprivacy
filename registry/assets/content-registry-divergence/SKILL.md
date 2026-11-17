---
name: content-registry-divergence
description: Give every page of a federated wiki (or any published set of documents) a name its content alone determines — the canonical hash of its title and story items, without the edit journal or item ids — fold the pages into per-site roots, a federation root and a chained registry root, and detect divergence between the living source and its published record by comparing like with like. Use when a wiki or document site should be checkable page by page, when snapshots should form a chain of their own, or when an edit in a fork should become dated, hashable evidence instead of noise.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# Content registry and divergence

A wiki's history is usually a log of revisions you are asked to trust. Name each page by its content and the log
becomes checkable: anyone holding two hashes can tell whether a page moved, without either side showing the words.

## When it fires

- A published wiki, guide or document set should be verifiable page by page.
- Each publication (snapshot) should commit to the one before it.
- Someone edits their own copy and wants that edit to count as a signal against the published record.

## The method, as run

1. **Page name = the content alone.** The canonical-CBOR SHA-256 of `{title, story items without their ids}`.
   Re-saving changes nothing; changing a word changes the name.
2. **Fold.** Per site: sort `slug|name` entries and fold them pairwise (`sha256(a|b)`, an odd node promoted) to a
   site root. Sites fold the same way to a federation root. The registry root is the hash of the header: schema,
   snapshot date, federation root, counts and **the previous registry root**, so snapshots form a chain.
3. **Sealed pages enter as ciphertext**: the hash of the sealed blob, never the opened text.
4. **Two hashes per page.** The publisher rewrites pages (local links become public ones), so a published page can
   differ from its source when nobody edited it. Keep the published hash in the public registry and the source
   hash in a local record; divergence compares source to source. In the first run this removed every false edit
   (about a fifth of the pages) without weakening the check.
5. **Re-derive in the reader.** Port the canonical hash to the browser, hold it to the reference implementation on
   every page and root, then let a checker fetch a page, recompute its name, and walk site root → federation root
   → registry root. Serve the pages with an open CORS header so other sites can do the same.
6. **Verify every mint** from the published site alone before it ships.

## Gotchas the runs recorded

- A site list whose entries span several lines was silently skipped by a line-based reader; read structurally and
  count pages per site against the snapshot.
- A broken first mint is replaced, not chained after; the chain begins with a correct root.
- A browser port that spreads very large arrays overflows the stack; append instead.
- Null and false inside maps are easy to drop in a hand-written encoder; test them explicitly.

## Where it lives

`tools/kappa_registry.py` (mint, `--verify`, `--diverge`) in the wiki's snapshot repository; the browser checker
beside the seal reader on the community site. Related: [[evidence-scroll]], [[seal-notation]].
