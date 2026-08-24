---
name: agentprivacy-wiki-create-plugin
description: >
  Scaffold a new Federated Wiki plugin package from scratch — the wiki-plugin-{name} layout,
  the client registration line (window.plugins.NAME = {emit, bind}), and an optional
  server/server.js for routes. Activates when building a new fedwiki plugin. Kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/create-wiki-plugin-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream .json was unreachable (HTTP 404) at materialization 2026-06-21; body reconstructed faithfully from the skill.fedwiki.club sitemap synopsis + cross-references in the searching-for-plugins and similarity-plugin pages. REFRESH via agentprivacy-wiki-to-skill when the upstream page is reachable."
  status: "reconstructed (upstream unreachable at materialization) — verify against the live page before relying on exact scaffolding"
  related_skills: "agentprivacy-wiki-document-plugin, agentprivacy-wiki-publish-plugin, agentprivacy-wiki-searching-plugins, agentprivacy-wiki-similarity-plugin"
---

# Create Wiki Plugin Skill

> **Note:** the upstream page `create-wiki-plugin-skill` was unreachable (HTTP 404) when this skill was materialized on 2026-06-21. This body is reconstructed from the sitemap synopsis and the cross-references in `searching-for-plugins` and `similarity-plugin`. Refresh it with `agentprivacy-wiki-to-skill` once the upstream page resolves.

The `create-wiki-plugin` skill scaffolds a new Federated Wiki plugin package from scratch. A fedwiki plugin is an npm package named `wiki-plugin-{name}` that adds a new **story item type** (and optionally server routes) to the wiki.

## Package Layout

```
wiki-plugin-{name}/
  package.json            # name: "wiki-plugin-{name}"
  client/{name}.js        # the client plugin — registers the item type
  server/server.js        # optional — registers Express routes at startup
  index.js                # entry that exposes client/server
  README.md
```

## The Client Registration Line

Every fedwiki client plugin registers itself on the global `window.plugins` object. This is the decisive marker (a GitHub code search for it proves a plugin exists):

```js
window.plugins.{name} = {
  emit: (div, item) => { /* render item.text into div */ },
  bind: (div, item) => { /* attach click/handlers after emit */ }
};
```

- `emit` renders the item into the page (parse `item.text`, build DOM).
- `bind` wires up interactivity after `emit` (clicks, form submits, internal links).

## Optional Server Component

If the plugin needs routes (search, embeddings, ghost-page endpoints), add `server/server.js` that registers with the wiki's Express app at startup — no changes to wiki-server core:

```js
module.exports = (app) => {
  app.get('/system/{name}.json', (req, res) => { /* ... */ });
};
```

## Good Scaffolding Templates

Per the searching-for-plugins skill, the two best templates to copy from:
- **`wiki-plugin-graphviz`** — client-side rendering with clickable internal links (a clean client-only plugin)
- **`wiki-plugin-similarity`** — DSL parsing in `item.text`, server routes, and ghost pages (a full client+server plugin)

## Steps

1. Confirm the plugin doesn't already exist (`agentprivacy-wiki-searching-plugins`).
2. Copy a template (graphviz for client-only, similarity for client+server).
3. Rename the package to `wiki-plugin-{name}`; update the `window.plugins.{name}` registration.
4. Implement `emit`/`bind` for the new item type.
5. Add `server/server.js` if routes are needed.
6. `npm link` into a local wiki farm to test.
7. Document it (`agentprivacy-wiki-document-plugin`) and release it (`agentprivacy-wiki-publish-plugin`).

## Related Skills

- `agentprivacy-wiki-document-plugin` — publish the plugin's docs on plugin.fedwiki.club
- `agentprivacy-wiki-publish-plugin` — end-to-end release (version/GitHub/npm/help)
- `agentprivacy-wiki-searching-plugins` — confirm none exists first; find templates
- `agentprivacy-wiki-similarity-plugin` — a full client+server worked example

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer) · **reconstructed body — refresh from upstream when reachable**
**Upstream:** [skill.fedwiki.club/create-wiki-plugin-skill](https://skill.fedwiki.club/create-wiki-plugin-skill) — vendored + re-framed; not original agentprivacy authorship
