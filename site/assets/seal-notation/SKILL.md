---
name: seal-notation
description: Write 32-byte hashes (sha-256 κ, BLAKE3 labels, Merkle roots, keys) as seals — one 26-character word from five scripts with an arithmetic check, via the pinned Sigil encoding — on web pages, in a spellbook-style listing, behind a page-wide toggle, and in a paste-and-check reader that says where a hash sits in a community's record. Use when hashes must be read, compared, copied or photographed by people, when a page should offer "show hashes as seals", or when building a seal reader or lookup.
metadata:
  category: method
  origin: an agentprivacy research lane, October 2026
  version: "0.1"
---

# Seal notation

A truncated hex hash has no check and can be imitated cheaply. A **seal** is the whole 32 bytes as one word of 26
characters, no two alike, selected whole by a double-click, with a check: one misread or changed character, or two
swapped, cannot decode. The algorithm stays beside it (sha-256 unless marked).

## When it fires

- A page shows hashes people compare by eye.
- Someone asks for "the hashes as sigils/seals", a toggle, a spellbook listing, or a "paste a hash, find it" page.

## The method, as run

1. **Vendor and pin** the encoder (Sigil, Apache-2.0/MIT) at a named commit with its fonts (Noto Ethiopic and
   Canadian Aboriginal, OFL) and its test vectors. Never load it live.
2. **Conformance first**: the upstream vectors (good encode/decode, bad decode with its error kind), your own roots
   round-tripping, every single-character change caught, and every seal on every built page decoding back to the
   hash it was written from.
3. **Display**: seals at reading size; in tight cards the first eight characters with the whole seal in the hover.
   Keep the hex one hover away.
4. **A page-wide toggle** (a glyph button, persisted): short hashes flip in place; full hex in text is rewritten by a
   text walker that skips inputs, scripts and already-sealed spans; an observer re-seals content drawn later.
5. **A spellbook listing**: the chain written as text, each step sealed by its root, each entry a collapsible spell
   with its seal, each leaf a line; correction lines note how many characters two seals share (by chance only).
6. **A reader**: paste a hash or a seal → the other form, the check verdict, the hexagram; a second field compares
   two with shared characters marked; a lookup over a published seal index says where the hash sits and opens it.

## Gotchas

- Hash outputs, keys and random identifiers are written as they are; structured data must be hashed (or jumbled)
  first, or a forger can keep the ends and change the middle.
- The decoder needs the byte length in advance (32); a missing character is a length error, not a silent pass.
- Fonts add ~0.5 MB; test Canadian syllabics coverage on mobile before deploying.
- Index only public hashes; a Merkle leaf that is not in the index should be reported as "check it on the chain's
  page", never as "unknown".

## Where it lives

`levers/vendor/sigil/` (pinned encoder, fonts, vectors, NOTICE), `levers/pb3_grimoire.js` (toggle and listing),
`levers/pb3_sigil_test.mjs`, and a `seal.html` reader on the community site (also its own subdomain), whose
checker takes a hash or a seal on either side, opens one door per chain the hash belongs to, and, for a page of a
content registry, re-derives the page and its roots in the browser (see [[content-registry-divergence]]). Every
scroll's hashes resolve there too ([[evidence-scroll]]).
