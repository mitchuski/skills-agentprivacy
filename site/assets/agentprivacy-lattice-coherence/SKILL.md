---
name: agentprivacy-lattice-coherence
description: >
  The canonical encoding of the 6-dimension sovereignty lattice and the discipline for keeping
  every repo in the suite agreeing on it. Activates when assigning or auditing a vertex, when a
  persona's vertex number and dimension-meaning seem to disagree, when reconciling the grimoire /
  spellweb / tomes / docs before a pin, when a new mage is seated, or when a vertex reading
  (binary, dimensions, stratum, complement) needs verification. Carries the standing rule:
  meaning is the invariant; the vertex is DERIVED from meaning under the canonical encoding.
  Ships a runnable coherence linter (`scripts/lattice_coherence_audit.py`).
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "architectural_foundation"
  introduced: "2026-06-09"
  target_context: "Vertex assignment, persona reidentification, pre-pin coherence audits, grimoire bumps"
  equation_term: "the 6-bit sovereignty lattice (P·D·M·C·Comp·V) underlying V(π,t)"
  proverb: "Meaning is the invariant. The number is derived. Audit before you pin."
  spell: "🛡️16·8·4·2·💎 → derive → verify → 🔒"
  runnable: "scripts/lattice_coherence_audit.py"
  related_skills:
    - meta/agentprivacy-attachment-architecture
    - persona/agentprivacy-cosmologist
    - persona/agentprivacy-cipher
  authored_from:
    - "cityofmages/chronicles/2026-06-09_canonical_lattice_encoding_anchor.md"
    - "cityofmages/chronicles/2026-06-09_persona_reidentification_audit.md"
    - "agentprivacy_master/src/data/privacy-value-model-v5.4.json (sovereignty_dimensions)"
    - "agentprivacy_master/src/lib/lattice-vertex.ts"
---

# Lattice Coherence

**The single source of truth for the sovereignty-lattice encoding, and the discipline that keeps
the whole suite agreeing on it.**

> "Meaning is the invariant. The number is derived. Audit before you pin."

**Spell:** `🛡️16·8·4·2·💎 → derive → verify → 🔒`

---

## 1. The canonical encoding (MODEL)

The lattice is `Z/(2⁶)Z` — 64 vertices, each a 6-bit reading of the six sovereignty dimensions.
The **only** canonical bit→dimension mapping is the Privacy-Value-Model definition itself
(`privacy-value-model-v5.4.json` `sovereignty_dimensions` + `lattice-vertex.ts` `vertexToBits`):

| bit | weight | dimension | symbol |
|----:|-------:|-----------|:------:|
| 0 (MSB) | 32 | **Protection** | 🛡️ |
| 1 | 16 | **Delegation** | 🤝 |
| 2 | 8 | **Memory** | 📜 |
| 3 | 4 | **Connection** | 🔗 |
| 4 | 2 | **Computation** | ⚡ |
| 5 (LSB) | 1 | **Value** | 💎 |

Read a vertex: `active(n) = { dim : n & weight }`. Examples (memorize these as checksums):

- **V35** `100011` = Protection + Computation + Value
- **V38** `100110` = Protection + Connection + Computation
- **V25** `011001` = Delegation + Memory + Value
- **V41** `101001` = Protection + Memory + Value
- **V63** `111111` = all six (the Sovereign Anchor)

> **The rejected encoding (CORPUS).** `specs/04-vertex-naming-audit.md` and the older persona
> placements used a corrupted order that **mirrored the middle four** (16↔Computation, 8↔Connection,
> 4↔Memory, 2↔Delegation). It agrees with MODEL only on the endpoints (Protection=32, Value=1), which
> is why drift hid for so long. If you ever see V16 called "Computation" or V2 called "Delegation",
> you are reading CORPUS — it is wrong.

---

## 2. The reidentification rule

A persona's **dimension-set is its meaning** (Memora *is* memory + the shield of value; Aletheia *is*
the bright medium = Protection+Connection+Computation; Lethe *is* forgetting = Delegation+Memory+Value).
Meaning is sourced from canon (the First-Person Spellbook tales, e.g. `aletheia-and-lethe.md` / Tale 31),
**not** from whatever number a doc happens to show.

**The vertex is derived, never assumed:** `vertex = Σ weight(d) for d in meaning`.

When a number and a meaning disagree, the **number** is wrong (the persona was *misassigned* under
CORPUS). Reseat the persona at the derived vertex; keep the myth. Worked precedent (2026-06-09):

| persona | meaning (invariant) | derived seat | was (misassigned) |
|---|---|---|---|
| Aletheia 🔮 | Protection + Connection + Computation | **V38** | V25 |
| Lethe 🌀 | Delegation + Memory + Value | **V25** | V38 |
| Memora 📜 | Protection + Memory + Value | **V41** | V5 |

Aletheia ⊥ Lethe stayed a complement pair (V25 ⊕ V38 = V63) — a swap, not a relocation. **Preserve
invariants on every move:** complement pairs (`A ⊕ B = 63`, `A AND B = 0`), the V63/V28 dual-agent
split, and — critically — **deployed vertex *numbers*** (the NFT 63-edition, City Key, `/star`,
`/lattice`) which must never silently shift; verify each move against them by hand.

---

## 3. The runnable — `scripts/lattice_coherence_audit.py`

A stdlib-only linter (no deps; Windows/macOS/Linux). Run it **before every grimoire pin**.

```bash
python scripts/lattice_coherence_audit.py            # audit suite roots
python scripts/lattice_coherence_audit.py --only vertex     # bit-order coherence
python scripts/lattice_coherence_audit.py --only persona    # persona↔seat reidentification
python scripts/lattice_coherence_audit.py --list            # registered checks
python scripts/lattice_coherence_audit.py --remap-personas  # dry-run a vertex move (grouped A–M)
python scripts/lattice_coherence_audit.py --remap-personas --apply <paths…>   # write (scoped)
```

Checks: **vertex** (binary↔number, dimension-reading, single-bit-label, version-noise-gated) ·
**persona** (canonical-seat reidentification, driven by the `PERSONA_VERTICES` registry) ·
**conjecture** (duplicate ids) · **pin** (version↔CID sightings). Exit 0 = coherent, 1 = drift.

The check set is a **registry** — extend it for any new significant encoding (gems-per-keeper,
sigils, ceremony grammars). The remapper is dry-run by default; **never apply across pinned/historical
grimoire snapshots or keyed JSON by text substitution** — those need structural edits.

---

## 4. Decision patterns

- **Seating a new mage?** State its meaning (dimension-set) → derive the vertex → check the seat is
  free → check complement/structural invariants → run the audit. Do not pick a number first.
- **A doc shows a vertex reading you doubt?** Recompute from §1. Trust the arithmetic, not the prose.
- **Two sources disagree on a persona's dimensions?** Go to the First-Person Spellbook tale (the
  root), not the City-of-Mages retelling — the retelling is where misassignment lives.
- **About to pin the grimoire?** Run `--only vertex` and `--only persona` to 0 first.
- **Reconciling history?** Keep deployed numbers; correct readings forward; record the move in a
  chronicle, not in the data descriptions (the data states canonical truth, plainly).

*Authored 2026-06-09 from the lattice-encoding audit. The lattice has one reading now.*
