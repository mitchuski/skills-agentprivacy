---
name: agentprivacy-wiki-similarity-plugin
description: >
  The wiki-plugin-similarity package — adds semantic similarity search to a fedwiki farm via
  two item types (similarity search form, similar ambient panel) using in-browser cosine
  scoring over BGE embedding vectors. Activates when adding similarity/related-pages search
  to a fedwiki, or as a plugin scaffolding reference. Kept by the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/similarity-plugin.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-searching-plugins, agentprivacy-wiki-create-plugin, agentprivacy-wiki-ghost-pages"
---

# Similarity Plugin

This plugin adds semantic similarity search to a Federated Wiki farm. It ships two item types — **similarity** (an interactive search form) and **similar** (an ambient panel that automatically finds pages related to the one you are reading).

## Repositories

- **GitHub**: `Hitchhikers-Guide-to-the-Galaxy/wiki-plugin-similarity`
- **npm**: not yet published — install locally with `npm link` during development

## How It Works

Pages in the farm are pre-indexed as 384-dimensional embedding vectors using `BAAI/bge-small-en-v1.5` via the `fastembed` library. At query time the plugin loads these compact `semantic-vectors.json` index files directly in the browser and performs cosine similarity scoring in JavaScript — no round-trip to a remote search engine.

## Item Types

**similarity** — renders a search input. Type a query and the plugin embeds it, scans the loaded indices, and presents the top matching pages as scored links with domain attribution.

**similar** — renders silently on page load. It looks up the current page's pre-computed vector from the cached index (no embed call if the page is already indexed) and displays a *Similar Pages* link list ranked by cosine score.

## Domain DSL

The item's `text` field is a small configuration language. Write one entry per line:

```
*                        all indexed domains on this server
david.*                  glob pattern
david.hitchhikers.earth  explicit domain
# comment                ignored
---
SIMILAR: high            threshold preset  (high=0.78 / medium=0.68 / low=0.58)
THRESHOLD: 0.72          exact cosine threshold
LIMIT: 8                 max results (default 10)
```

Leave `text` empty to search the current domain at the default medium threshold.

## Server Component

The plugin's `server/server.js` registers three routes with the wiki's Express app at startup — no changes to wiki-server core required:

- `GET /system/indexed-domains.json?pattern=glob` — list domains with a built index
- `GET /system/semantic-vectors.json` — serve the vector index for the current domain
- `GET /system/embed?text=…` — proxy to a local FastAPI embedding service

The embedding service runs `fastembed` in-process and responds in ~5 ms on an M-series Mac using CoreML acceleration.

## See Also

- `agentprivacy-wiki-searching-plugins` — finding plugins (this is a scaffolding template)
- `agentprivacy-wiki-create-plugin` — scaffold a new plugin
- `agentprivacy-wiki-ghost-pages` — the ghost-page pattern this plugin's forms use

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/similarity-plugin](https://skill.fedwiki.club/similarity-plugin) — vendored + re-framed; not original agentprivacy authorship
