---
name: agentprivacy-wiki-nextcloud-push
description: >
  Upload a federated-wiki page file directly to the remote Nextcloud server via WebDAV when
  the desktop sync client fails or deletes newly written files. Activates when a public
  wiki page is written locally but never reaches the live site (broken links / stuck sync).
  Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/nextcloud-push.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-page, agentprivacy-wiki-reindex, agentprivacy-wiki-merge"
---

# Nextcloud Push

`nextcloud-push` is a shell script at `~/bin/nextcloud-push` that uploads a single file from the local Nextcloud folder directly to the remote Nextcloud server via WebDAV. It was created to solve a recurring problem: the Nextcloud desktop sync client occasionally fails to upload new wiki page files written by Claude Code, leaving links broken on the live site.

## The Problem It Solves

When Claude Code writes a new page file to `~/Nextcloud/fedwiki/{domain}/pages/`, the Nextcloud desktop client should detect the new file and upload it automatically. This works most of the time. But the sync client has a bug: it occasionally reports `An unexpected error occurred` even when the server returns HTTP 201 (success), and marks the file as stuck in an error backoff state.

Worse, for newly created wikis whose `pages/` folder has never been synced before, the client may delete newly written files entirely — treating them as "deleted on the remote" rather than "new uploads".

The result: pages written by Claude appear locally but never reach the server, so links on the live site return 404.

## How It Works

The script bypasses the desktop client entirely and uploads the file directly using a WebDAV `PUT` request via `curl`. Before uploading, it walks the remote directory path and issues `MKCOL` requests to create any missing parent directories — necessary for new wikis whose folder structure doesn't yet exist on the server.

Authentication uses a Nextcloud **App Password** (not the login password), stored in the `NC_PASSWORD` environment variable.

```bash
# Push a single page file to the remote server:
nextcloud-push ~/Nextcloud/fedwiki/skill.fedwiki.club/pages/journal-skill

# Push all pages in a wiki at once:
for page in ~/Nextcloud/fedwiki/skill.fedwiki.club/pages/*; do
  nextcloud-push "$page"
done
```

## Setup

The script lives at `~/bin/nextcloud-push` and is already executable. Two environment variables control it:

- `NC_USER` — Nextcloud username
- `NC_PASSWORD` — a Nextcloud App Password generated in the Nextcloud security settings

Add both to your shell profile so they are available in every terminal session and to Claude Code:

```bash
export NC_USER="your-username"
export NC_PASSWORD="your-app-password-here"
```

HTTP 201 means a new file was created. HTTP 204 means an existing file was updated. Both are success.

## Why Browsing the Web UI Also Fixes It

Browsing to the Nextcloud web UI and navigating into a folder causes the server to emit a push notification via the Nextcloud Notify Push service. The desktop sync client is subscribed to these notifications and wakes from its backoff state when it receives one — which is why navigating to the folder in a browser sometimes triggers an otherwise-stuck sync. `nextcloud-push` is simply a faster, more reliable version of that same effect.

## Related Skills

- `agentprivacy-wiki-page` — how pages are written to the Nextcloud folder
- `agentprivacy-wiki-reindex` — rebuild indexes after pages land
- `agentprivacy-wiki-merge` — uses this WebDAV push during bulk moves

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/nextcloud-push](https://skill.fedwiki.club/nextcloud-push) — vendored + re-framed; not original agentprivacy authorship
