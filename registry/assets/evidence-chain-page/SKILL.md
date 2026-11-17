---
name: evidence-chain-page
description: Turn any directory of content-addressed evidence bundles (root.json + graph.json per bundle) into a public chain page that re-derives every root in the reader's browser, draws the chain as a tree on a 64-vertex lattice, writes it out as seals, plays it as sound, and veils what each try found behind a members' build. Use when a research lane, benchmark lane or agent run has minted bundles and needs a page people can check without being asked to trust it, or when adding a new lane to an existing family of chain pages.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# Evidence chain page

You have bundles; you want a page a stranger can check. The page is a **reader of the work, never part of it**: it
names the root it was generated from and re-derives everything below that root on load.

## When it fires

- A lane has minted one bundle per entry, step or package (one `root.json` + `graph.json` each).
- Someone asks "show this work", "give this lane a page", "add this chain to the others".
- An existing engine builds several chains and a new lane should join without a code change.

## The method, as run

1. **One project file per chain.** Identity (name, domain, owner, status, asserter), the chain source (a list of
   bundle tags, or a glob over a bundle directory that may live outside the store), the axis word ("round",
   "step", "entry") and optional public labels and verdicts per entry. Board adapter, second hash axis and sound
   module are optional; a chain without them still builds.
2. **Order and link the entries from the bundles themselves.** Mint order or the bundle's own round field; a
   corrected entry links to what replaced it; a step that commits to the verified root before it links "succeeded
   by" from that prior commitment. Never invent a link the roots do not state.
3. **Build four pages from one engine**: local, public, members' ("revealed"), open (the deploy). The members'
   builds carry the bundles beside the page and the lever names; public and open carry each lever as its **kind**
   (held, measured and set aside, no-go) and its hash only.
4. **Five readings, one tab each, and a dock.** Tree (the entries on one axis, verdict colour, a hexagram per root,
   leaf counts by kind, the steps that sealed it in a row, other families folded to one line each, a fold that
   hashes leaves in pairs to the stated root with "change one byte"); Star (every root placed by its first six
   bits on the lattice, full width, an orbit toggle; the picked leaf's walk drawn across it); Grimoire (the chain
   written in seals); Scroll (the chain as one long spell of its hashes beside the star, see
   [[evidence-scroll]]); Sound (one beat per entry, the fold heard). A small docked star draws the picked path
   from any tab except the Scroll. The pick lives in the URL.
5. **Re-derive on load**: every entry's leaves fold to its stated Merkle root; the chain ledger κ re-derives from
   the entry roots; every seal decodes back to its hash.
6. **Publish the index** of the chains (name, lane, counts, verdicts, ledger seal, doors) and a seal index (every
   public hash → where it sits) for the community's front page and its seal reader. The index builder merges every
   scroll's own ledger, or rebuilding the chains drops them.
7. **One problem, one subdomain.** Each chain is a quest with a home of its own, copied from the **public** build
   (never the members'), with a leak scan and a veil sweep (every members' lever name searched for in every public
   page) before it ships.
8. **Keep it current.** When a lane casts again, add the new bundles to its project file with the verdicts the
   judge recorded (refuted and not-evaluable casts are leaves too), rebuild, and re-run every suite.

## Gotchas the runs recorded

- **A leaf click must start its walk, not toggle the last one.** Only the play buttons toggle.
- **Entries of another chain drawn on this page open on their own chain's page**, on that entry; otherwise clicks
  silently do nothing because their leaves are not here.
- **Never auto-scroll** to a reading; two competing scrolls read as the page jumping. Give each reading a page.
- **Huge folds** (thousands of leaves): draw the picked path's edges always and the rest only below a width cap;
  sample leaf points on the lattice but always keep the levers and the picked leaf.
- **Equivalence check before you ship an engine change**: the existing chains' data must come out byte-identical
  (mask only the generator κ and per-build salts).
- **A step chain's pages grow with its steps**; trim the public build before deploying a long one.
- Leak-scan every page and copied file for local paths before anything leaves the machine.
- **The open build is not a halfway veil.** It once carried earlier-work trees with raw lever names; make the open
  build equal the public one and keep names only on the members' build.
- Entry titles on a public chain can leak what a try found; title public entries by their place on the axis.

## Where it lives

The engine is a site builder plus one page template; chain pages for twelve lanes were built from it in one run and live as ten homes.
Look for `levers/chain_site.py`, `levers/projects/*.json`, `levers/pb3_page.html` and the suites
`levers/pb3_*_test.mjs` in the lane's repository.
