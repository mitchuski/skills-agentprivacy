---
name: agentprivacy-wiki-welcome
description: >
  Create a welcome-visitors landing page for a federated-wiki domain — the fixed 10-item
  structure (intro with wikilinked concepts, people/topics lists, pod roster present-item).
  Activates after creating a new wiki, or when asked for a site landing/welcome page.
  Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/welcome-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-new-domain, agentprivacy-wiki-page, agentprivacy-wiki-reindex"
---

# Welcome Skill

The `fedwiki-create-welcome` skill creates a `welcome-visitors` page for any federated wiki domain. The welcome page is the site's landing page — it describes the site's purpose and links to key pages, people, and the pod roster.

## When to Use

After creating a new wiki, the site has no landing page. Ask for a welcome page:

> "Create a welcome page for skill.fedwiki.club — it's a collection of Claude skills for manipulating federated wikis."

Ask for the pod name and any key topic pages to link, then write the file to the correct location.

## Page Structure

The welcome page follows a fixed 10-item structure:

1. **Intro paragraph** — begins `Welcome to this [[Federated Wiki]] site.` with key concepts wikilinked
2. **Pages about us** — paragraph heading
3. **People list** — markdown bullet list of `[[Person Name]]` links
4. **Pages where we do and share** — paragraph heading
5. **Topics list** — markdown bullet list of key topic page links
6. **Pages where we meet others** — markdown with bullet list beneath
7. **Help and tools** — markdown with bullet list beneath
8. **Pod members:** — short markdown label
9. **Present item** — renders the pod member roster by pod name
10. **If you would like to get involved** — markdown with bullet list beneath

## Critical Details

- The intro must **wikilink key concepts** — e.g. `[[Claude Code]]`, `[[Federated Wiki]]`, not plain text
- Items 6, 7 and 10 are `markdown` type with a **blank line then a bullet list** beneath the heading sentence — not bare prose
- The `present` item is a plugin that renders a live pod roster — its `text` field is the pod name string (e.g. `Academy Pod`)
- Slug must be exactly `welcome-visitors`, title exactly `Welcome Visitors`

## File Locations

- **Public wiki:** `~/Nextcloud/fedwiki/{domain}/pages/welcome-visitors`
- **Private wiki:** `~/Music/Guides/Private/{domain}/pages/welcome-visitors`

For public wikis Nextcloud syncs automatically. For private wikis, reindex after writing.

## Related Skills

- `agentprivacy-wiki-new-domain` — create the wiki domain first, then add the welcome page
- `agentprivacy-wiki-page` — the general page JSON format this skill produces
- `agentprivacy-wiki-reindex` — reindex after writing to a private wiki

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/welcome-skill](https://skill.fedwiki.club/welcome-skill) — vendored + re-framed; not original agentprivacy authorship
