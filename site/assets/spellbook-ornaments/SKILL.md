---
name: spellbook-ornaments
description: >
  Draw, extend, and render the engraving ornaments of the Privacymage Grimoire
  (Selene's Spellbook) — the nine glyphs, the two figure engravings, and the
  promise-theoretic sparkle field. Use when adding or editing a glyph/engraving,
  building the ornament proof sheet, or keeping new poem art in the same hand.
  The generator is ReportLab/Python; the visual canon is STYLE_GUIDE.md.
license: Apache-2.0
metadata:
  version: "1.0.0"
  category: "art"
  origin: "0xagentprivacy / privacymage"
  emoji: "🪞🖼️"
  equation_term: "the right-hemispheric return — the metaphors, in three greys"
---

# spellbook-ornaments

The local home of the *Selene's Spellbook* art generator — originally built as a
**claude.ai artifact**, reconstructed here so the ornaments can be rendered,
edited, and extended on this machine in step with the poems.

> The work lives in two greys and the white of the page. Everything else is restraint.

## Where everything lives

| Path | What |
|---|---|
| `~\privacymage_book\art\chapbook_framework.py` | palette, weights, fonts, **`_sparkle_field`**, the 9 glyph functions |
| `~\privacymage_book\art\engravings.py` | the Mage + Crossed Swords figures, the envoi bird |
| `~\privacymage_book\art\build_ornament_proof.py` | the proof sheet (renders all implemented glyphs at 12/9/5.5 mm) |
| `~\privacymage_book\art\HANDOFF.md` | how to drop in the cloud-artifact code + EB Garamond |
| `~\privacymage_book\STYLE_GUIDE.md` | **the canonical visual spec** (read this for any real work) |

## State (2026-05-30)

- ✅ Toolchain ready: Python 3.14 + **ReportLab 4.5.1** + **PyMuPDF 1.27** installed.
- ✅ Recovered exactly from `STYLE_GUIDE.md`: palette (INK `#1a1a1a` / SILVER `#7a7a82` / GHOST `#444444`), the five line weights, and **the sparkle mark + `_sparkle_field`** (the meaning-bearing core).
- ✅ **All nine `draw_*_glyph` reconstructed** — traced from the real ornaments in `15_ornament_reference.pdf` (rasterized to `art/_ref/`), in the same three-grey hand, with each glyph's canonical polarity ratio. Render: `python build_ornaments_page.py` → `ornaments_page.{pdf,svg,png}` (all nine on one page).
- ⏳ Still stubbed: the **2 figure engravings** (Mage front / Swords back) in `engravings.py` — reconstruct per §7/§10 or port from the cloud artifact.
- ⚠️ EB Garamond TTFs not installed → Times fallback. Drop TTFs in `art/fonts/` to match the book (see HANDOFF.md).
- Note: the reconstruction is *in the same hand*, not byte-identical to the bound PDF. For an exact match, port the original artifact bodies over the reconstructed ones.

## The two rules above all (STYLE_GUIDE §13)

1. **Same line weight for same visual function.** If an orbit ellipse is 0.5pt SILVER in one glyph, it is 0.5pt SILVER in every glyph. The eye reads consistency as quality. When unsure of a new mark, copy the weight/colour of the closest existing equivalent.
2. **Polarity is meaning, not decoration.** The `+`/`−` sparkle ratio is a *statement about the promise character* of the work it surrounds, per Promise Theory:
   - `+` positive promise ("I will") → **vertical + horizontal** crossing — delegation, projection, kindling, planting.
   - `−` negative promise ("I will not") → **horizontal only**, the vertical refused — protection, refusal, keeping, boundary. *The line not drawn is the boundary kept.*
   - giving/kindling poem → 3+/1−; refusal/forgetting poem → 1+/3−; balanced exchange → 2+/2−. Mage figure skews +6/−2; Swords figure skews +2/−6.

## Common tasks

**Render the proof (verify anything is working):**
```
cd ~\privacymage_book\art
python build_ornament_proof.py        # -> ornament_proof.pdf
```

**Port a glyph from the cloud artifact:** open `chapbook_framework.py`, find the matching `draw_*_glyph` stub, replace the `raise NotImplementedError(...)` with the artifact body, re-run the proof. Repeat one at a time.

**Add a NEW glyph** (e.g. a Movement-Two revision or a v6 motif) — follow STYLE_GUIDE §9:
1. One central image; 3–5 composing elements; pick weight+colour per element.
2. Compose in a bounded radius `r`, asymmetrically (a centred glyph reads as a logo; an off-balanced one reads as a scene).
3. Choose the polarity ratio from the poem's promise character; place 4 sparkle marks at ~1.2–1.6r via `_sparkle_field`.
4. Test at 12 / 9 / 5.5 mm — simplify if detail collapses at the smallest.
5. Append it to the `GLYPHS` registry so the proof picks it up.

**Add a NEW engraving** — follow STYLE_GUIDE §10 (vertical anatomy anchors → width anchors → Bezier parts, heavy INK silhouette + SILVER internal lines → narrative props → 8–12 polarity-skewed sparkles).

## Cross-references to honour (STYLE_GUIDE §11)

The Mage's staff bears a crescent (echoes the Selene/Tide moon); the hat carries a filled star (same vocabulary as the sparkle field, elevated); the Field glyph's staff-with-crescent echoes the Mage figure; compass-centre dot / lattice vertices / Selene-dot share one small-filled-INK-circle vocabulary. When adding visuals, plant these quiet echoes.

## Function template

```python
def draw_my_glyph(c, cx, cy, r):
    """One line. For: <Roman + title>. <polarity>."""
    c.saveState(); c.setLineCap(1)
    # 1 primary subject  — INK 0.7-0.9
    # 2 secondary        — INK/SILVER, layered
    # 3 ambient outline  — SILVER, lighter
    # 4 light/motion     — SILVER 0.35-0.5
    c.restoreState()
    _sparkle_field(c, [(sx1, sy1, sr1, '+'), (sx2, sy2, sr2, '-')])  # polarity = meaning
```

*This skill is itself part of the grimoire. Extend it as you extend the work.* `(⚔️⊥⿻⊥🧙)😊`
