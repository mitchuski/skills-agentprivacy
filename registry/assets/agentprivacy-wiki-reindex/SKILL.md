---
name: agentprivacy-wiki-reindex
description: >
  Rebuild the sitemap and search index for a local federated-wiki domain after writing
  page JSON to disk directly (the server caches status/ indexes and won't notice file
  writes). Activates after creating/editing/bulk-importing pages, or when the page list or
  search looks stale. Merges the reindex-fedwiki-skill variant. Kept by the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-reindex-skill.json"
  upstream_also: "https://skill.fedwiki.club/reindex-fedwiki-skill.json (earlier variant · merged)"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-page, agentprivacy-wiki-new-domain, agentprivacy-wiki-nextcloud-push, agentprivacy-wiki-merge"
---

# Fedwiki Reindex Skill

The `fedwiki-reindex` skill rebuilds the sitemap and search index for a local federated wiki domain. It is needed because the wiki server caches these indexes in each domain's `status/` folder and does not detect when Claude Code writes page JSON files directly to disk.

## Why It's Needed

When a page is created or edited through the wiki browser UI, the server updates its index automatically. When Claude writes a page file directly to `~/Music/Guides/Private/{domain}/pages/`, the server doesn't know — two cached files in the `status/` folder go stale:

- `sitemap.json` — the page list used for navigation and federation neighbourhood
- `site-index.json` — the full-text search index

## How It Works

Delete the stale index files from `status/`, then `curl` the sitemap endpoint to trigger the server to rebuild them immediately.

```bash
FARM="$HOME/Music/Guides/Private"
DOMAIN="localhost"

rm -f "$FARM/$DOMAIN/status/sitemap.json"
rm -f "$FARM/$DOMAIN/status/site-index.json"
curl -s "http://$DOMAIN/system/sitemap.json" > /dev/null
echo "Reindexed $DOMAIN"
```

## When to Use

- After Claude creates or edits page JSON files directly on disk
- After bulk import of pages
- When the wiki's page list or search results appear incomplete or stale

## Public Wikis — nextcloud-reindex

For public wikis in `~/Nextcloud/fedwiki/`, the remote server needs its index rebuilt separately using `nextcloud-reindex`. This deletes the index files via WebDAV and triggers a rebuild on the remote server:

```bash
nextcloud-reindex skill.fedwiki.club
```

This is needed after bulk page changes — e.g. after running the merge skill's move/trash steps.

## Related Skills

- `agentprivacy-wiki-page` — always reindex after writing pages to a private wiki
- `agentprivacy-wiki-new-domain` — create a new wiki domain
- `agentprivacy-wiki-nextcloud-push` — push public wiki pages when sync is stuck
- `agentprivacy-wiki-merge` — uses nextcloud-reindex after bulk page moves

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-reindex-skill](https://skill.fedwiki.club/fedwiki-reindex-skill) (+ reindex-fedwiki-skill, merged) — vendored + re-framed; not original agentprivacy authorship
