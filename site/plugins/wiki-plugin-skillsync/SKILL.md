---
name: wiki-plugin-skillsync
description: Install and use the skillsync fedwiki plugin — a live panel any wiki page can carry showing a skill garden's catalog freshness, the newest packets, and what's new since this browser last visited. Point it at your own garden's catalog or at another farm's over the tailnet to watch their shelf from your page. Use when adding a skills panel to a fedwiki homepage, watching a sibling garden, or surfacing recent skill discoveries inside a wiki.
metadata:
  category: plugins
  origin: skill-sync
  version: "0.1"
---

# wiki-plugin-skillsync

A fedwiki item type (`skillsync`) — the garden's pulse on a wiki page: packet count,
harvest date, newest packets in a window, and a highlight of everything new since
this browser last looked (localStorage seen-set; degrades gracefully).

## Install (any fedwiki farm)

1. Copy the plugin dir (`client/skillsync.js` + `package.json`) into your wiki's
   `node_modules/wiki-plugin-skillsync/`. Code ships in this garden at
   `site/plugins/wiki-plugin-skillsync/`.
2. Add `"wiki-plugin-skillsync": "0.1.0"` to the wiki package's own `package.json`
   dependencies (the server routes plugins from that list).
3. Restart the farm; verify `GET /plugins/skillsync/skillsync.js` returns 200.

## Use

Add a `skillsync` item to any page. Item text (all lines optional):

    catalog: /assets/skillsync/catalog.json    same-site path or full URL
    member: mitch                              panel label
    days: 7                                    the "recent" window
    limit: 8                                   max rows

Point `catalog:` at another farm's catalog over the tailnet to watch THEIR shelf from
YOUR page — that is the neighbourly form of the dream loop: passive, visible, mutual.
Clicking a row follows the internal `[[Card <Title>]]` link when the page exists.
