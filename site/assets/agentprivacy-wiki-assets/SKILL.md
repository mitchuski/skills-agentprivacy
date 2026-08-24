---
name: agentprivacy-wiki-assets
description: >
  Adding an `# Assets` section (an `# Assets` heading + an `assets` item referencing the page slug) to a federated wiki page, placed above the `# See` section. Activates when attaching downloadable companion files to a page. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-assets-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-page, agentprivacy-wiki-see-section, agentprivacy-wiki-document"
---

# agentprivacy-wiki-assets

The **fedwiki-assets** skill — Add an `# Assets` section to a federated wiki page — an `# Assets` heading followed by an `assets` item referencing the page slug, placed immediately above the `# See` section (or at the bottom). Optionally copy companion files into the page's assets folder.

## When it Triggers

Use when the user says "add an assets section", "attach this file to the page", "add the assets plugin", "give this page an assets folder", or asks to surface downloadable files on a wiki page.

## What it Does

- The Pattern
- Locating the page and its slug

## See

- Claude Skills and Fedwiki Document Skill
- Claude Import Skill

---

**Upstream:** [`fedwiki-assets-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/fedwiki-assets-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
