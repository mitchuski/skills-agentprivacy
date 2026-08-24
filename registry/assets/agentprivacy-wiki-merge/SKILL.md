---
name: agentprivacy-wiki-merge
description: >
  Analyze and clean up a superseded federated-wiki domain — categorize its pages
  (boilerplate / duplicate / minimal / unique), move unique content to the successor,
  trash the rest to a recycler, reindex, and delete the old domain. Activates when
  consolidating or retiring a wiki site. Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-merge-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-delete-site, agentprivacy-wiki-reindex, agentprivacy-wiki-nextcloud-push, agentprivacy-wiki-journal"
---

# Fedwiki Merge Skill

The `fedwiki-merge` skill analyses and cleans up a federated wiki that has been superseded by a newer domain. When a site is replaced (e.g. `david.ide.earth` → `david.vision.ide.earth`), the old site is a mix of pages already copied to the new site, standard boilerplate, and unique content worth keeping. The skill separates these and handles each appropriately, ending with a full delete of the old domain.

## Step 1 — Analyse

Dry run — prints a categorised report, no files touched:

```bash
fedwiki-merge-analyse david.ide.earth david.vision.ide.earth
```

Pages are placed into categories:

| Category | Meaning | Action |
|---|---|---|
| `BOILERPLATE` | Standard tool pages (changes-to-this-site, welcome-visitors, tools…) — checked first, regardless of date | Trash |
| `DUPLICATE_OLDER` | Same slug in new site; old version is older | Trash |
| `MINIMAL` | ≤ 1 item AND < 100 chars | Trash |
| `DUPLICATE_NEWER` | Same slug in new site; old version is newer | Review |
| `UNIQUE_CONTENT` | Only in old site, has real content | Move |

## Step 2 — Move Unique Pages

Moves all `UNIQUE_CONTENT` pages from the old site into the new site's `pages/` folder, pushes each to Nextcloud, and deletes each from the old site's remote. Pages already present in the new site are never overwritten.

```bash
fedwiki-merge-move david.ide.earth david.vision.ide.earth
# or a specific page:
fedwiki-merge-move david.ide.earth david.vision.ide.earth my-page
```

## Step 3 — Trash Safe Pages

Moves `BOILERPLATE`, `DUPLICATE_OLDER`, and `MINIMAL` pages to `{old-domain}/recycler/` and deletes them from the remote. The recycler is a local safety net — pages can be manually recovered from there.

```bash
fedwiki-merge-trash david.ide.earth david.vision.ide.earth
```

## Step 4 — Reindex

Rebuilds the sitemap and search index on both sites after the moves and deletions:

```bash
nextcloud-reindex david.vision.ide.earth
nextcloud-reindex david.ide.earth
```

## Step 5 — Delete the Old Site

Once the old site's `pages/` folder is empty, delete the whole domain:

```bash
fedwiki-delete-site david.ide.earth
# force even if pages remain:
fedwiki-delete-site david.ide.earth --force
```

## Scripts

- `~/bin/fedwiki-merge-analyse` — categorised report, dry run
- `~/bin/fedwiki-merge-move` — move unique content to new site
- `~/bin/fedwiki-merge-trash` — move safe pages to recycler
- `~/bin/fedwiki-delete-site` — delete entire domain locally and remotely

All scripts read credentials from `NC_USER` and `NC_PASSWORD` in the environment.

## Related Skills

- `agentprivacy-wiki-delete-site` — the final delete step
- `agentprivacy-wiki-reindex` — reindexing after bulk page changes
- `agentprivacy-wiki-nextcloud-push` — the WebDAV push used by merge-move
- `agentprivacy-wiki-journal` — strip accumulated journal history before merging

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-merge-skill](https://skill.fedwiki.club/fedwiki-merge-skill) — vendored + re-framed; not original agentprivacy authorship
