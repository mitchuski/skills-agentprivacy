---
name: agentprivacy-wiki-new-domain
description: >
  Create a new federated-wiki domain — either a local/private wiki (served on localhost) or
  a public Nextcloud-synced wiki. Activates when standing up a new wiki site/domain.
  Merges the new-wiki-skill variant. Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-new-wiki-skill.json"
  upstream_also: "https://skill.fedwiki.club/new-wiki-skill.json (earlier variant · merged)"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream .json was unreachable (HTTP 404) at materialization 2026-06-21; body reconstructed faithfully from the skill.fedwiki.club sitemap synopsis + cross-references in sibling skill pages (reindex, welcome). REFRESH via agentprivacy-wiki-to-skill when the upstream page is reachable."
  status: "reconstructed (upstream unreachable at materialization) — verify against the live page before relying on exact commands"
  related_skills: "agentprivacy-wiki-welcome, agentprivacy-wiki-reindex, agentprivacy-wiki-page, agentprivacy-wiki-nextcloud-push"
---

# Fedwiki New Wiki Skill

> **Note:** the upstream page `fedwiki-new-wiki-skill` (and its earlier variant `new-wiki-skill`) was unreachable (HTTP 404) when this skill was materialized on 2026-06-21. This body is reconstructed from the sitemap synopsis and the cross-references in sibling skills (reindex, welcome, nextcloud-push). Refresh it with `agentprivacy-wiki-to-skill` once the upstream page resolves.

The `fedwiki-new-wiki` skill creates a new federated wiki **domain** — a fresh site with its own `pages/` and `status/` folders. A domain is either *local/private* (served on localhost, never synced off-machine) or *public* (synced to a remote server via Nextcloud).

## Two Kinds of Wiki

**Local / private** — lives under:
```
~/Music/Guides/Private/{domain}/
```
Served by the local wiki farm on port 3000. Never leaves the machine. Use for drafts, private notes, and skill development.

**Public** — lives under:
```
~/Nextcloud/fedwiki/{domain}/
```
Synced to the remote Nextcloud/wiki server, so the site is reachable on the public web. Use for anything meant to be browsed or federated.

## What "Creating a Domain" Means

A wiki domain is a directory with this minimal shape:

```
{domain}/
  pages/          # one JSON file per page (no extension)
  status/         # server-maintained sitemap.json + site-index.json (built on demand)
```

To create a new domain:

1. **Choose the kind** (private vs public) — this picks the parent folder above.
2. **Choose the domain name** — the site's host-style identifier (e.g. `skill.fedwiki.club`, `mynotes.localhost`).
3. **Create the folder** with an empty `pages/` directory.
4. **Add a landing page** — use `agentprivacy-wiki-welcome` to write the `welcome-visitors` page (the site has no landing page until you do).
5. **Reindex (private)** — run `agentprivacy-wiki-reindex` so the local server builds the sitemap/search index. (Public wikis index on the remote after sync.)
6. **Push (public, if sync stalls)** — if the Nextcloud desktop client doesn't upload the new folder, use `agentprivacy-wiki-nextcloud-push` to WebDAV-`PUT` the pages and `MKCOL` the new directories.

## Checklist

- [ ] Picked private (`~/Music/Guides/Private/`) vs public (`~/Nextcloud/fedwiki/`)
- [ ] Created `{domain}/pages/`
- [ ] Wrote a `welcome-visitors` landing page
- [ ] Reindexed (private) or confirmed remote sync (public)
- [ ] First page resolves in the browser

## Related Skills

- `agentprivacy-wiki-welcome` — create the landing page for the new domain
- `agentprivacy-wiki-reindex` — build the local index after creating pages
- `agentprivacy-wiki-page` — the page JSON format
- `agentprivacy-wiki-nextcloud-push` — force-upload a public wiki when sync stalls

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer) · **reconstructed body — refresh from upstream when reachable**
**Upstream:** [skill.fedwiki.club/fedwiki-new-wiki-skill](https://skill.fedwiki.club/fedwiki-new-wiki-skill) (+ new-wiki-skill, merged) — vendored + re-framed; not original agentprivacy authorship
