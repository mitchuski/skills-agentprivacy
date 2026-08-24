---
name: agentprivacy-wiki-delete-site
description: >
  Permanently remove a public federated-wiki domain — both the remote Nextcloud/WebDAV
  folder and the local ~/Nextcloud/fedwiki/{domain}/ folder. Activates when deleting or
  decommissioning a public wiki site. Destructive; checks pages/ is empty unless --force.
  Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-delete-site.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-merge, agentprivacy-wiki-reindex, agentprivacy-wiki-nextcloud-push"
---

# Fedwiki Delete Site

`fedwiki-delete-site` permanently removes a public federated wiki domain — both the remote folder on the Nextcloud/wiki server and the local `~/Nextcloud/fedwiki/{domain}/` folder. It uses WebDAV `DELETE` directly rather than relying on the Nextcloud sync client, which can be slow or prompt for confirmation on large deletions.

## Usage

```bash
fedwiki-delete-site david.ide.earth
```

By default the script checks that `pages/` is empty and exits with an error if any pages remain — use the merge skill's trash step first to clear them. To delete anyway:

```bash
fedwiki-delete-site david.ide.earth --force
```

## What It Does

1. Checks `pages/` is empty (or `--force` skips this)
2. WebDAV `DELETE` on `fedwiki/{domain}/` — recursive, removes everything including `status/`, `recycler/`, and any remaining files
3. `rm -rf` the local domain folder

HTTP 204 = deleted. HTTP 404 = already gone on the remote (local removal still proceeds).

## Only for Public Wikis

This script only works for public wikis in `~/Nextcloud/fedwiki/`. For private wikis in `~/Music/Guides/Private/` there is no remote to delete — just `rm -rf` the local folder directly.

## Safety

This is irreversible on the remote. Confirm the domain name carefully, and prefer the merge workflow (which moves unique content to a successor and trashes the rest to a recycler) before deleting.

## Related Skills

- `agentprivacy-wiki-merge` — full workflow ending with delete-site
- `agentprivacy-wiki-reindex` — reindex after bulk page changes before deleting
- `agentprivacy-wiki-nextcloud-push` — the WebDAV credentials used by this script

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-delete-site](https://skill.fedwiki.club/fedwiki-delete-site) — vendored + re-framed; not original agentprivacy authorship
