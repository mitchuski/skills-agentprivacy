---
name: agentprivacy-wiki-document-plugin
description: >
  Publish documentation for a Federated Wiki plugin as wiki pages on plugin.fedwiki.club
  (the curated plugin-catalog wiki). Activates when documenting a fedwiki plugin or adding
  it to the catalog. The inverse of fedwiki-to-skill. Kept by the Librarian 🗃️ in the Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/document-wiki-plugin-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream .json was unreachable (HTTP 404) at materialization 2026-06-21; body reconstructed faithfully from the skill.fedwiki.club sitemap synopsis + cross-references (fedwiki-to-skill names this as its inverse; searching-for-plugins names plugin.fedwiki.club as the curated catalog). REFRESH via agentprivacy-wiki-to-skill when the upstream page is reachable."
  status: "reconstructed (upstream unreachable at materialization) — verify against the live page before relying on exact steps"
  related_skills: "agentprivacy-wiki-create-plugin, agentprivacy-wiki-publish-plugin, agentprivacy-wiki-page, agentprivacy-wiki-to-skill"
---

# Document Wiki Plugin Skill

> **Note:** the upstream page `document-wiki-plugin-skill` was unreachable (HTTP 404) when this skill was materialized on 2026-06-21. This body is reconstructed from the sitemap synopsis and cross-references (the `fedwiki-to-skill` page names this skill as its inverse; `searching-for-plugins` names `plugin.fedwiki.club` as the curated plugin-documentation catalog). Refresh it with `agentprivacy-wiki-to-skill` once the upstream page resolves.

The `document-wiki-plugin` skill publishes documentation for a Federated Wiki plugin as wiki pages on **`plugin.fedwiki.club`** — the curated catalog wiki where plugin docs are treated as authoritative. It is the inverse direction of `fedwiki-to-skill`: there a page *becomes* a skill; here a plugin *becomes* a documentation page.

## What It Produces

For a plugin `wiki-plugin-{name}`, write a documentation page (and any companion pages) to:

```
~/Nextcloud/fedwiki/plugin.fedwiki.club/pages/{plugin-doc-slug}
```

The doc page typically covers:
- **What it does** — the item type(s) it adds and the behaviour
- **Repositories** — GitHub repo + npm package (`wiki-plugin-{name}`)
- **How it works** — the rendering / data model, any DSL in `item.text`
- **Item types** — each new story item type and its fields
- **Server component** — routes registered, if any
- **See also** — links to related plugin pages

## Steps

1. Read the plugin's `README.md` and source (`client/{name}.js`, `server/server.js`).
2. Author the page JSON with `agentprivacy-wiki-page` conventions (markdown items, unique IDs, full create journal).
3. Write it to `plugin.fedwiki.club`'s `pages/` folder.
4. Sync/push (`agentprivacy-wiki-nextcloud-push` if the desktop client stalls) and reindex the remote.
5. Confirm the page resolves and is discoverable via `agentprivacy-wiki-searching-plugins` channel 6 (catalog wikis).

## Related Skills

- `agentprivacy-wiki-create-plugin` — build the plugin this skill documents
- `agentprivacy-wiki-publish-plugin` — the full release that includes doc publishing
- `agentprivacy-wiki-page` — the page JSON format the docs use
- `agentprivacy-wiki-to-skill` — the inverse direction (page → skill)

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer) · **reconstructed body — refresh from upstream when reachable**
**Upstream:** [skill.fedwiki.club/document-wiki-plugin-skill](https://skill.fedwiki.club/document-wiki-plugin-skill) — vendored + re-framed; not original agentprivacy authorship
