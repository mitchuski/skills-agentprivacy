---
name: evidence-chain-face
description: Compose a "face of the evidence" — one public chain root chosen per vertex of the 64-vertex lattice, each root sitting at the vertex its own first six bits name — and fold it into a portable key (City Key) as an additive chains field with a sidecar, so the key's content address moves and its prior chain records the new step of the bearer's trajectory. Use when gathering many evidence chains onto one lattice, letting a person compose their own reading of them, or carrying chosen work roots inside an identity carrier without carrying the work.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# Evidence chain face

Many chains, one lattice. A root's vertex is its first six bits, read in the lattice's own order (most significant
first), so placement needs no table and every surface agrees. A face is a choice of one root per vertex; folding it
into the bearer's key appends a workflow hash chain to their trajectory.

## When it fires

- Several evidence chains should be seen together on the 64 states.
- A person wants to compose and keep their own selection of public work roots.
- A key carrier needs to name chosen evidence without holding it.

## The method, as run

1. **Gather** public roots from a published index (entry, step and work roots; ledgers); colour by chain; filter.
2. **Compose**: click a root to set its vertex; cycle a cell among the roots that land there. Show the face's own
   root, seal and vertex.
3. **The face record**: items `"<vertex>|<root>"`, root = a sorted pairwise Merkle (sha256(a|b), odd node promoted —
   the same rule the key already uses for its other digests), count. Refuse an item whose root does not sit at the
   vertex it claims.
4. **Fold into the key**, additively: the key gains `chains: { root, count }` (root over every folded face's root,
   oldest first), `focus` +1 at the face's vertices, and `prior` = the key's κ before the fold; re-stamp κ. The
   faces travel in a sidecar beside the key, never inside it. Leave the key's achievement field untouched.
5. **Refuse** the same face twice and a sidecar whose roots do not fold to the key's `chains.root`.
6. **Cross-check every implementation** (the site that composes, the library that folds, the reader that
   displays) against one pinned vector and against each other's κ.

## Gotchas

- Bit order is the whole contract: check it against the lattice's canonical definition before anything else.
- A key that is rebuilt from local progress on every export must store the faces and re-fold them each time.
- Readers that do not know the field must pass it through untouched; show it as a count and a root, not contents.
- Lever names and private findings never enter a face; only public hashes and public labels.

## Where it lives

A `chain-face` module beside the key library (with a conformance test), the composing page `star.html` on the
community site, and the key readers that display `chains`.
