---
name: wiki-plugin-starpath
description: Install and use the starpath fedwiki plugin — the like-shaped ⭐ button that lets a wiki visitor (human or agent) collect an ordered path of skills as they browse card pages, visualise the walk on the star chart, seal it as a constellation runtime at the Librarian, or contribute it as a named constellation. Use when adding the starpath button to a fedwiki farm, putting a path tray on a homepage, or wiring walk-collection into a skill garden.
metadata:
  category: plugins
  origin: skill-sync
  version: "0.1"
---

# wiki-plugin-starpath

A fedwiki item type (`starpath`) for walking the skill space. The path is per-browser
(localStorage), ordered by tap order, and flows into the trust game: visualise →
seal runtime → contribute constellation.

## Install (any fedwiki farm)

1. Copy the plugin dir (`client/starpath.js` + `package.json`) into your wiki's
   `node_modules/wiki-plugin-starpath/`. The code ships in this garden at
   `site/plugins/wiki-plugin-starpath/`.
2. Register it: add `"wiki-plugin-starpath": "0.1.0"` to the **wiki package's own**
   `package.json` dependencies — the server routes `/plugins/<name>/` from that list,
   not from what sits in node_modules.
3. Restart the farm; verify `GET /plugins/starpath/starpath.js` returns 200.

## Use

Add a `starpath` item to any page. Item text (all optional except skill on cards):

    skill: <packet-name>     the skill this button collects (card pages)
    chart: /assets/site/star.html
    librarian: http://pi5:4242
    tray: full               homepage tray: path list + visualise/seal/contribute

Card pages get the ☆ button; a page with no `skill:` renders the tray. Sealing and
contributing POST to the librarian (CORS preflight required — the reference
librarian handles OPTIONS); member handle is asked once and remembered.

## Notes

- Generated card pages can carry the item automatically (see the reference
  `build-wiki.js`: one `starpath` item per card, `tray: full` on the welcome page).
- The visualise link passes the walk as `star.html#path=a,b,c` — any chart that
  reads the hash can draw it.
