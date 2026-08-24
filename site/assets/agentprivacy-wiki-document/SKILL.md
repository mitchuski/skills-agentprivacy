---
name: agentprivacy-wiki-document
description: >
  Creating a help page on the wiki for a Claude Code skill — describing what it does and when it fires — and publishing the skill's own SKILL.md as a downloadable asset. The skill-side parallel to documenting a wiki plugin. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-document-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-document-plugin, agentprivacy-wiki-assets, agentprivacy-wiki-to-skill"
---

# agentprivacy-wiki-document

The **fedwiki-document-skill** skill creates a help page on this wiki for a Claude Code skill — describing what it does and when it fires — and publishes the skill's own `SKILL.md` as a downloadable file in the page's assets folder. It is the skill-side parallel of Fedwiki DocumentPlugin Skill.

## When it Triggers

"document this skill", "create a skill help page", "publish a skill to skill.fedwiki.club", "add a skill to the skill wiki" — or after authoring or editing a skill that should be shared publicly.

## What it Produces

- A page here at `skill.fedwiki.club/{slug}` describing the skill in prose.
- An `# Assets` section carrying the **real `SKILL.md`** (and any README), so a reader can read or install the exact source — not just the summary.

## Naming Convention

A skill-help page is titled in three words — `<Class> <CamelCaseName> Skill` — so the trailing **Skill** marks it as a skill page, the first word is its **class** (set), and the camelCase middle is its short name.

- **Class** — first word (`Fedwiki`); groups skills into sets.
- **CamelCaseName** — the skill's name, multi-word collapsed to camelCase (`new-wiki` → `NewWiki`).
- Slug = the lowercased title (`fedwiki-newwiki-skill`); the **install dir** comes from the SKILL.md `name:` frontmatter (`fedwiki-new-wiki`), not the slug — which is what makes the camelCase title safe.

## Assets — the Real Source

The page is the description; the assets folder is the source of truth. After writing the page, the Fedwiki Assets Skill adds the `# Assets` section and the skill's `SKILL.md` is **copied** (never symlinked — Nextcloud does not sync symlinks, and the source lives outside the Nextcloud tree) into `assets/{slug}/`. Because the copy is a snapshot, the skill re-copies it on every run to keep the public file current.

## See

- Fedwiki Assets Skill and Fedwiki Page Skill
- Fedwiki DocumentPlugin Skill and Fedwiki To Skill

---

**Upstream:** [`fedwiki-document-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/fedwiki-document-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
