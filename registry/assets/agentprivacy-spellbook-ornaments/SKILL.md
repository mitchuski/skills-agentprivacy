---
name: agentprivacy-spellbook-ornaments
description: >
  Draw, extend, and render the engraving ornaments of the Privacymage Grimoire (Selene's
  Spellbook): the nine glyphs, the two figure engravings, and the promise-theoretic sparkle
  field. Use when adding or editing a glyph or engraving, building the ornament proof sheet, or
  keeping new poem art in the same hand. Encodes the three-grey palette, the line-weight law,
  polarity-as-promise (the `+`/`−` sparkle ratio), the new-glyph and new-engraving protocols, the
  cross-references to plant, and a function template. The generator is ReportLab/Python; the
  visual canon is the book's STYLE_GUIDE.md.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy / privacymage"
  status: "operational (glyphs reconstructed; figure engravings pending port)"
  introduced: "2026-05-30"
  target_context: "an agent extending the grimoire's book art in step with new poems; anyone drawing promise-theoretic ornaments in a restrained engraving hand"
  related_skills:
    - role/agentprivacy-grimoire-navigation
    - role/agentprivacy-proverbiogenesis
    - role/agentprivacy-spell-encoding
    - meta/agentprivacy-chronicle-reflect
  source_corpus: "the book repo (private): STYLE_GUIDE.md (§9 new ornament, §10 new engraving, §11 cross-references, §12 generator, §13 the two rules), art/chapbook_framework.py, art/engravings.py, art/build_ornament_proof.py, art/HANDOFF.md; chronicles/REFLECT_SELENES_SPELLBOOK_2026-05-30.md in this repo"
  upstream: "none recorded (the original generator was a claude.ai artifact; this is its local reconstruction from STYLE_GUIDE.md)"
  equation_term: "the right-hemispheric return: the metaphors, in three greys"
---

# Spellbook ornaments

> The work lives in two greys and the white of the page. Everything else is restraint.

The art generator of *Selene's Spellbook*, first built as a claude.ai artifact and reconstructed
locally so the ornaments can be rendered, edited and extended in step with the poems. It is the
executable form of the book's `STYLE_GUIDE.md`: the guide is the single visual source; this skill
executes it. New ornaments extend the guide (§9/§10); they never start a parallel style.

## Where everything lives (book repo, `art/`)

| file | what |
|---|---|
| `chapbook_framework.py` | palette, weights, fonts, **`_sparkle_field`**, the nine `draw_*_glyph` functions, the `GLYPHS` registry |
| `engravings.py` | the Mage and Crossed-Swords figures, the envoi bird |
| `build_ornament_proof.py` | the proof sheet: every implemented glyph at 12 / 9 / 5.5 mm |
| `HANDOFF.md` | how to drop in original artifact bodies and the EB Garamond fonts |
| `../STYLE_GUIDE.md` | **the canonical visual spec**; read it for any real work |

## State of the reconstruction

- Toolchain: Python 3 + ReportLab 4.x (+ PyMuPDF for rasterising references).
- Recovered exactly from the style guide: the palette (INK `#1a1a1a` / SILVER `#7a7a82` / GHOST
  `#444444`), the five line weights, and the sparkle mark + `_sparkle_field` (the meaning-bearing
  core).
- All nine glyphs reconstructed, traced from the bound ornament reference in the same three-grey
  hand, each with its canonical polarity ratio.
- Still stubbed: the two figure engravings (Mage front / Swords back). Reconstruct per §7/§10 or
  port the original artifact bodies.
- Without EB Garamond TTFs in `art/fonts/` the proof falls back to Times.
- The reconstruction is *in the same hand*, not byte-identical to the bound PDF. For an exact
  match, port the original artifact bodies over the reconstructed ones.

## The two rules above all (STYLE_GUIDE §13)

1. **Same line weight for same visual function.** If an orbit ellipse is 0.5 pt SILVER in one
   glyph, it is 0.5 pt SILVER in every glyph. The eye reads consistency as quality. When unsure
   of a new mark, copy the weight and colour of the closest existing equivalent.
2. **Polarity is meaning, not decoration.** The `+`/`−` sparkle ratio is a statement about the
   promise character of the work it surrounds, per Promise Theory:
   - `+` positive promise ("I will") → **vertical + horizontal** crossing: delegation,
     projection, kindling, planting.
   - `−` negative promise ("I will not") → **horizontal only**, the vertical refused: protection,
     refusal, keeping, boundary. *The line not drawn is the boundary kept.*
   - giving/kindling poem → 3+/1−; refusal/forgetting poem → 1+/3−; balanced exchange → 2+/2−.
     The Mage figure skews +6/−2; the Swords figure skews +2/−6.

## Common tasks

**Render the proof** (verify anything is working):

```sh
cd <book repo>/art
python build_ornament_proof.py        # -> ornament_proof.pdf
```

**Port a glyph from the original artifact**: open `chapbook_framework.py`, find the matching
`draw_*_glyph`, replace the reconstructed body with the artifact body, re-run the proof. One at a
time.

**Add a new glyph** (a revision or a new motif) per STYLE_GUIDE §9:

1. One central image; 3–5 composing elements; pick weight + colour per element.
2. Compose in a bounded radius `r`, asymmetrically (a centred glyph reads as a logo; an
   off-balanced one reads as a scene).
3. Choose the polarity ratio from the poem's promise character; place four sparkle marks at
   ~1.2–1.6 r via `_sparkle_field`.
4. Test at 12 / 9 / 5.5 mm; simplify if detail collapses at the smallest.
5. Append it to the `GLYPHS` registry so the proof picks it up.

**Add a new engraving** per STYLE_GUIDE §10: vertical anatomy anchors → width anchors → Bézier
parts, heavy INK silhouette + SILVER internal lines → narrative props → 8–12 polarity-skewed
sparkles.

**Map glyph → persona → concept.** Each ornament depicts a poem that voices a persona that carries
a concept. Keep that three-column map current when a glyph is added; it mirrors the poem ↔ concept
↔ doc ledger and the spellweb glyph ↔ poem nodes.

## Cross-references to honour (STYLE_GUIDE §11)

The Mage's staff bears a crescent (echoing the Selene/Tide moon); the hat carries a filled star
(the sparkle vocabulary, elevated); the Field glyph's staff-with-crescent echoes the Mage figure;
compass-centre dot, lattice vertices and the Selene-dot share one small-filled-INK-circle
vocabulary. When adding visuals, plant these quiet echoes.

## Function template

```python
def draw_my_glyph(c, cx, cy, r):
    """One line. For: <Roman numeral + title>. <polarity>."""
    c.saveState(); c.setLineCap(1)
    # 1 primary subject  : INK 0.7-0.9
    # 2 secondary        : INK/SILVER, layered
    # 3 ambient outline  : SILVER, lighter
    # 4 light/motion     : SILVER 0.35-0.5
    c.restoreState()
    _sparkle_field(c, [(sx1, sy1, sr1, '+'), (sx2, sy2, sr2, '-')])  # polarity = meaning
```

## Refusals

- No unpublished poem text enters this skill, its proofs, or a shared render; ornaments travel,
  verses wait for the book.
- No second style guide. A disagreement with STYLE_GUIDE.md is a change to STYLE_GUIDE.md.

*This skill is itself part of the grimoire. Extend it as you extend the work.* `(⚔️⊥⿻⊥🧙)😊`
