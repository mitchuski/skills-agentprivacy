---
name: agentprivacy-wiki-journal
description: >
  Strip the accumulated edit/fork history from a federated-wiki page's journal, replacing
  it with a single clean create entry while preserving title and story. Activates on
  "strip the journal", "clean the journal", "reset the journal", "remove fork history",
  or "make this page look freshly created". Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/journal-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-page, agentprivacy-wiki-reindex, agentprivacy-wiki-welcome"
---

# Fedwiki Journal Skill

The `fedwiki-journal` skill removes accumulated edit history from a federated wiki page. It preserves the page's `title` and `story` content while replacing the entire `journal` array with a single `create` entry — making the page look freshly created.

## Why Journals Accumulate

Every edit made through the wiki UI appends an entry to the `journal` array. When pages are forked between sites, they carry their complete history along with them. A page like *Changes to this Site* may have been forked through half a dozen sites over many years, dragging a long attribution chain with it.

Stripping the journal is valuable when:
- Creating template copies of a page
- Removing irrelevant attribution chains from remote sources
- Preparing a page for clean publication

## What the Skill Does

It keeps `title` and `story` unchanged and replaces the journal with a single `create` entry containing the current timestamp and certificate:

```json
"journal": [{
  "type": "create",
  "item": {
    "title": "Page Title",
    "story": [ /* the complete, unchanged story array — every item, same order */ ]
  },
  "date": 1781004226000,
  "certificate": "from marvin"
}]
```

The `date` uses Unix milliseconds. The `item.story` must be the **complete** story array (every item, identical order) — exactly as in the create-journal rule of the page skill.

## Trigger Phrases

- "Strip the journal from X"
- "Clean the journal on this page"
- "Reset the journal for X"
- "Make this page look freshly created"
- "Remove the fork history from X"

## File Locations

- **Public wiki:** `~/Nextcloud/fedwiki/{domain}/pages/{slug}`
- **Private wiki:** `~/Music/Guides/Private/{domain}/pages/{slug}`

Private wiki edits require running the reindex skill afterward so the server picks up the change.

## Related Skills

- `agentprivacy-wiki-page` — the full page JSON format
- `agentprivacy-wiki-reindex` — reindex after editing a private wiki
- `agentprivacy-wiki-welcome` — create the landing page

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/journal-skill](https://skill.fedwiki.club/journal-skill) — vendored + re-framed; not original agentprivacy authorship
