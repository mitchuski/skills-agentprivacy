---
name: agentprivacy-wiki-compact-references
description: >
  Compacting a page's reference-item section by replacing forked reference items with compact `[[wikilink]]` bullets inside a `# See` markdown item. Activates when tidying a page heavy with forked reference items. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-compactreferences-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-see-section, agentprivacy-wiki-page, agentprivacy-wiki-journal"
---

# agentprivacy-wiki-compact-references

The **fedwiki-compact-references** skill — Compact the reference-item section of a federated wiki page by replacing forked reference items with compact `wikilink` bullets inside a `# See` markdown item. Only promotes references that have been forked to the origin site. Non-forked references remain as reference items.

## When it Triggers

Use when the user says "compact references", "tidy up the references", "convert references to see-links", or "compact the see section" on a wiki page.

## What it Does

- Variant A — Local File Access (preferred)
- Variant B — DevTools / Live Fetch (fallback)
- Common Steps
- Output to User
- Edge Cases

## See

- Claude Skills and Fedwiki Document Skill
- Claude Import Skill

---

**Upstream:** [`fedwiki-compactreferences-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/fedwiki-compactreferences-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
