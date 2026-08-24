---
name: agentprivacy-wiki-page
description: >
  Authoring federated-wiki page JSON (story items, IDs, the create journal, and the
  reindex step) for the agentprivacy skill library. Activates when creating or editing
  fedwiki pages, publishing a skill to skill.fedwiki.club, or building page-json by hand.
  Part of the git-less onboarding/distribution layer kept by the Librarian 🗃️ in the
  Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-page-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-journal, agentprivacy-wiki-ghost-pages, agentprivacy-wiki-claude-ghost, agentprivacy-wiki-to-skill"
---

# Fedwiki Page Skill

The **fedwiki-page** skill creates federated wiki page JSON files. Pages are stored as JSON files (no extension) in a wiki domain's `pages/` folder. This skill covers file locations, story item types, ID generation, journal format, and the reindex step.

## File Locations

Two separate wiki systems — write to the correct one:

**Local/private wikis** (served on port 3000):
```
~/Music/Guides/Private/{wiki-domain}/pages/{page-slug}
```

**Public wikis** (synced via Nextcloud to remote server):
```
~/Nextcloud/fedwiki/{wiki-domain}/pages/{page-slug}
```

The local server does NOT read from `~/Nextcloud/fedwiki/`. Page slug = title lowercased with spaces as hyphens.

## Story Item Types

Default to **`markdown`** for all prose, headings, and formatted text. Use `code` for shell commands and config snippets. Use `paragraph` sparingly — only for plain sentences needing no markup.

```json
{"type": "markdown", "id": "a1b2c3d4e5f60001", "text": "**Bold**, `code`, [[Wiki Link]]"}
{"type": "code",     "id": "a1b2c3d4e5f60002", "text": "wiki-start"}
{"type": "paragraph","id": "a1b2c3d4e5f60003", "text": "Plain sentence."}
{"type": "assets",   "id": "a1b2c3d4e5f60099", "text": "page-slug"}
```

Story order: opening markdown → section headings → content → `# Assets` heading + assets item at the bottom.

## IDs

Each item needs a unique 16-character hex ID. Generate with:
```bash
python3 -c "import uuid; print(uuid.uuid4().hex[:16])"
```

Never reuse IDs within a page or across pages in the same wiki.

## Journal — Critical Rule

The `journal` must contain a `create` entry whose `item.story` is the **complete story array** — every item, identical to the top-level `story`, in the same order. Never use `"story": []` and never include only the first item. This is what allows rewinding to the creation state.

```json
"journal": [{
  "type": "create",
  "item": {
    "title": "Page Title",
    "story": [
      {"type": "markdown", "id": "a1b2c3d4e5f60001", "text": "Opening item."},
      {"type": "markdown", "id": "a1b2c3d4e5f60002", "text": "## Section"},
      {"type": "markdown", "id": "a1b2c3d4e5f60003", "text": "Every item — same order as top-level story."}
    ]
  },
  "date": 1781004226000,
  "certificate": "from marvin"
}]
```

`certificate: "from marvin"` identifies the creating agent. `date` is current Unix timestamp in milliseconds.

## After Saving — Reindex

After writing any page file to disk, delete the cached sitemap so the wiki server rebuilds it:

```bash
FARM="$HOME/Music/Guides/Private"
DOMAIN="localhost"
rm -f "$FARM/$DOMAIN/status/sitemap.json"
rm -f "$FARM/$DOMAIN/status/site-index.json"
curl -s "http://$DOMAIN/system/sitemap.json" > /dev/null
echo "Reindexed $DOMAIN"
```

The wiki server must be running for the `curl` step to trigger a rebuild.

## Checklist

- [ ] Slug matches title (lowercase, hyphenated)
- [ ] Correct `pages/` folder (local vs public wiki)
- [ ] All IDs unique 16-char hex
- [ ] Default item type is `markdown` not `paragraph`
- [ ] Backtick markup on paths and commands in markdown items
- [ ] Journal `create` entry contains the **full** story array
- [ ] `"certificate": "from marvin"` on the create entry
- [ ] Reindexed after saving

## Related Skills

- `agentprivacy-wiki-journal` — strip a page journal down to a clean create entry
- `agentprivacy-wiki-ghost-pages` — generate pages dynamically without storing them
- `agentprivacy-wiki-claude-ghost` — Claude-powered ghost pages via FastAPI
- `agentprivacy-wiki-to-skill` — export this page into a Claude `SKILL.md`

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-page-skill](https://skill.fedwiki.club/fedwiki-page-skill) — vendored + re-framed; not original agentprivacy authorship
