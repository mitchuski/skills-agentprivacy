---
name: tile-from-page
description: Read a FedWiki page's content, semantically choose a glyph + color + category for it, and write a `tileglyph` navigation tile (the wiki-plugin-tileglyph item type) into a destination page — matching a Root Tiles registry for federation-wide consistency, or minting a new canonical entry. Use when turning pages/sites into colored glyph navigation tiles, building a tile wall / index, or extending the Root Tiles vocabulary.
---

# tile-from-page

The **authoring-time, semantic half** of the TileGlyph system. The plugin
(`wiki-plugin-tileglyph`, item type `tileglyph`) only *renders* tiles; it
cannot read content or call a skill in the browser. This skill is where an
agent reads a page, **decides** what glyph/color/category fit it, and writes
the tile. The mechanical disk work is in `tile.js`; the judgement is yours.

## When this runs

- "make a tile for [[X]]" / "turn these pages into tiles" / "build a tile wall"
- "add <page/site> to the Plugin Lab" / a navigation index of glyph tiles
- "extend the Root Tiles vocabulary"

## The model

- **Root Tiles** = a registry page (`root-tiles`) holding the canonical
  `category → { glyph, color }` map. It is the shared vocabulary; matching it
  keeps the same category looking identical across the federation.
- A tile either **matches** an existing category (inherits its glyph+color) or
  **mints** a new category (your chosen glyph+color is written back as canon).
- Tiles are written by **direct disk edit** to `~/.wiki/<host>/pages/<slug>`
  (NOT the action API — it mojibakes emoji). So this skill is main-thread,
  local-farm work.

## Workflow

1. **Read the source.** `node tile.js read <host> <source-slug>` → prints
   `{title, synopsis}`. Read it. (Or read the page file directly for more.)
2. **Check the registry.** `node tile.js registry <host>` → current
   `category → {glyph,color}` map.
3. **Decide** (the semantic step — see vocabulary below): pick `category`,
   and if the category is new, a `glyph`, `color`, `sparkle` polarity, `anim`.
4. **Write the tile.**
   ```
   node tile.js add <host> <dest-slug> --label "<Page Title>" \
     --category "<Category>" [--glyph 🌙] [--color "#3d7c47"] \
     [--anim float] [--sparkle "2+ 2-"] [--link "<target page>"]
   ```
   - If `--category` already exists in the registry and you omit `--glyph`/
     `--color`, the canonical ones are inherited automatically.
   - If the category is new, your `--glyph`/`--color` are written back as the
     new canonical Root Tiles entry.
5. **Report** what matched vs. what was minted (the `add` command prints this).

## The glyph vocabulary (how to choose)

Choose by **role/meaning**, in the Privacymage Grimoire hand — restrained, one
clear central image. Lean on the established cast canon for consistency:

| Category / cast | Glyph | Color | Note |
|---|---|---|---|
| Cosmological (Selene) | 🌙 | `#3d7c47` | the witness, the moon |
| Threshold (Pandia) | 🌕 | `#6a5acd` | the portal/display |
| Registry (Hermaion) | ⚚ | `#3d7c47` | the keeper |
| Navigation (Pleione) | 🧭 | `#2a7d8c` | the chart |
| Library (Archivist) | 📚 | `#8a6d3b` | the tower |
| Boundary (Swordsman) | ⚔️ | `#a23a3a` | the refuser |

- **color is identity** — reuse a cast's color for pages in that cast's domain;
  pick a new restrained hue only for a genuinely new grouping.
- **sparkle polarity is meaning, not decoration** (`N+ M-`): a page about
  *giving / projecting / kindling* skews positive (`3+ 1-`); a page about
  *refusing / keeping / boundaries* skews negative (`1+ 3-`); balanced → `2+ 2-`.
- **anim**: `float`/`pulse` for gentle/witnessing, `glow` for warded/boundary,
  `spin` for navigational, `none` for plain.
- Prefer a **single emoji** glyph; use a short multi-line ASCII block only when
  no emoji fits (leave `--glyph` off and edit the tile's `glyph:` block by hand).

## Files

- `tile.js` — read / registry / add (disk-level, registry-syncing).
- The plugin it feeds: `~/wiki-plugin-tileglyph` (item type `tileglyph`),
  served on the local farm host `plugin.localhost:3030`.

## Related

- `wiki-plugin-tileglyph` — the render-time plugin (the *what you see*).
- [[project_tileglyph_plugin]] memory — host ownership, build/link facts,
  and the pending PNG-embed export (soulbis star/lattice City Key pattern).
