---
name: agentprivacy-wiki-searching-plugins
description: >
  A strategy for finding a federated-wiki plugin — or proving one doesn't exist — across
  six cost-ordered channels (installed, local repos, farm search, npm, GitHub code search,
  catalog wikis). Activates when looking for a fedwiki plugin or confirming none exists.
  Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/searching-for-plugins.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-similarity-plugin, agentprivacy-wiki-create-plugin, agentprivacy-wiki-document-plugin"
---

# Searching for Plugins

A strategy for finding federated wiki plugins — or proving one doesn't exist. The key principle: don't grep page files — the farm has proper indexes, so search them.

## The Six Channels

1. **Installed plugins** — `ls` the wiki's `node_modules` for `wiki-plugin-*`
2. **Local repos** — `~/Code/wiki-plugins/`
3. **The farm's own knowledge** — the `wiki-search` CLI (below)
4. **npm** — the `wiki-plugin-{name}` convention plus description search
5. **GitHub** — repo search, then the decisive code search
6. **Plugin catalog wikis** — plugin.fedwiki.club, wiki.dbbs.co, wiki.ralfbarkow.ch sitemaps

## wiki-search — the Custom Local Search

`~/bin/wiki-search` combines both farm indexes in one command:

```bash
wiki-search "mermaid plugin"
wiki-search "diagram rendering" --limit 15
wiki-search "similarity" --domains 'plugin.*'
wiki-search "graphviz" --text-only
```

**Full-text** — loads the prebuilt MiniSearch indexes (one per domain) and runs a fuzzy/prefix word search across all of them. No servers needed; rebuild stale indexes with `node build.mjs` in the index directory.

**Semantic** — posts to the Farm API's `/search-report`, which embeds the query, scans every domain's vectors, drops stubs, and bundles forks. Finds pages *about* plugins even when they use different words.

The two are complementary: MiniSearch catches exact names ("graphviz"), semantic catches concepts ("diagram rendering"). Hits on `plugin.fedwiki.club` are the curated plugin documentation — treat those as authoritative.

## The Decisive GitHub Check

Every fedwiki client plugin must register itself with a line like `window.plugins.mermaid = {emit, bind}`. A GitHub code search for that string is therefore conclusive:

```bash
gh api 'search/code?q=%22window.plugins.NAME%22' \
  --jq '.items[].repository.full_name'
```

If this finds nothing, no public fedwiki plugin of that name exists — regardless of what repo-name searches suggest. Beware false friends: TiddlyWiki, Redmine, DokuWiki, and Obsidian all have plugin ecosystems with confusingly similar names.

## Reporting the Result

State which channels were checked. "No public plugin exists" is a valid, useful conclusion when supported by the registration-line code search. When nothing exists and a new plugin is wanted, the best scaffolding templates are `wiki-plugin-graphviz` (client-side rendering with clickable internal links) and `wiki-plugin-similarity` (DSL parsing, server routes, ghost pages).

## Related Skills

- `agentprivacy-wiki-similarity-plugin` — a worked scaffolding example
- `agentprivacy-wiki-create-plugin` — scaffold a new plugin when none exists
- `agentprivacy-wiki-document-plugin` — document a plugin on plugin.fedwiki.club

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/searching-for-plugins](https://skill.fedwiki.club/searching-for-plugins) — vendored + re-framed; not original agentprivacy authorship
