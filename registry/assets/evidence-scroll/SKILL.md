---
name: evidence-scroll
description: Write a body of sealed work as a scroll of nothing but its hashes — one book per sealed root, each record followed by the threads drawn from it, beside a 64-vertex star that places every hash by its first six bits — on a page of its own, listed with every other scroll and resolvable in a seal checker. Use when a lane, a mage's census, a proof library or a wiki's content registry is sealed and should be shown in public without showing what it says, or when new bundles have been minted and the existing scrolls and chain pages need to be synced.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# Evidence scroll

A chain page shows a lane's work as a tree you can check. A **scroll** shows a body of work as one long spell of
its names: the hashes alone, in the order they were sealed. Nothing a record states is written. What the reader
gets is the shape of the work (how many records, how they thread, when each root was sealed) and the ability to
check any one hash against the community's ledger.

## When it fires

- Something is sealed (an evidence bundle, a census, a theorem library, a wiki registry) and should be visible
  without being readable.
- A lane has minted new bundles and the chain pages, their Scroll tabs and the seal ledger should catch up.
- Someone asks for "a scroll for X" or "sync the scrolls".

## The method, as run

1. **One template, many scrolls.** A page builder takes `{books:[{n, root, minted, objects, edges, seq}], total,
   built}` plus words (title, one-line epigraph, the kinds a hash can be). Each source gets a small adapter:
   bundle (`root.json` + `graph.json`), census, registry. The adapter writes data; the template writes the page.
2. **Guard the data, fail closed.** Before writing, walk every string in the data and refuse anything that is not
   a 64-hex hash, a date or a numeral. Titles and words live in the template options, never in the data.
3. **Order is the sealing order**: each record, then the threads whose source it is; the book's root last.
   Threads become lines on the star; pointing at a hash lights its threads.
4. **Every hash joins the ledger.** Write a per-scroll ledger file (hash → scroll, kind, book, a deep link that
   opens the scroll at that hash) and merge it into the community's seal index. The index builder must merge every
   per-scroll ledger it finds, or the next rebuild drops them.
5. **Every scroll lists every other.** Keep the list in one registry file; each scroll registers itself; rebuild
   the others after adding one.
6. **One subdomain per scroll**, static assets only, plus a copy under the community site.
7. **Sync after new casts**: compare each chain's project file with the bundles minted since; add them with their
   verdicts as recorded by the judge (refuted, not evaluable, not submitted are all leaves of the work); rebuild;
   refresh the index and the homes; run the veil sweep and every suite before anything ships.

## Gotchas the runs recorded

- A ledger merged by one builder and overwritten by another vanishes silently; test that a scroll's hashes are
  still in the index after the chain index is rebuilt.
- Verdicts are copied from the judge's record, never inferred from a bundle's name or order.
- A private lane can still have a public scroll: only hashes leave. Check the guard, then the leak scan, then
  the page.
- Very large books (thousands of hashes) need the star drawn from samples and the threads drawn only for the
  pointed hash.

## Where it lives

`bin/scroll-page.mjs`, `bin/bundle-scroll.mjs`, `bin/scrolls.mjs` and the per-source scroll builders in the
community site's repository; chain projects under `levers/projects/` in the chain engine's repository.
Related: [[evidence-chain-page]], [[seal-notation]], [[content-registry-divergence]].
