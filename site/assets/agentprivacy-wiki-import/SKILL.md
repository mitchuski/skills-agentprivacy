---
name: agentprivacy-wiki-import
description: >
  Importing a skill — or a whole set-of-skills page — published on a fedwiki (skill.localhost / skill.fedwiki.club) into the local agent. Pass a skill page to install one; pass a set-of-skills page to install every skill it links to. The install counterpart to exporting with agentprivacy-wiki-to-skill. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/claude-import-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-to-skill, agentprivacy-wiki-skill-library, agentprivacy-wiki-skill-anatomy"
---

# agentprivacy-wiki-import

The **import-claude-skill** skill — Import a skill — or a whole set of skills — published on a fedwiki (skill.localhost or skill.fedwiki.club) into the local agent. Pass a skill page to install one; pass a set-of-skills page to install every skill it links to. Fetches the real SKILL.md (and companion files) from each page's assets folder over HTTP. Targets Claude Code by default; the fedwiki page is a framework-neutral source.

## When it Triggers

Use when the user says "import a skill", "import this set of skills", "install a skill from the skill wiki", "pull <name> from skill.fedwiki.club", or "import-claude-skill".

## What it Does

- Inputs
- Single skill, or a set
- Procedure (single skill)
- Target framework (the babelfish seam)
- Importing a set

## See

- Claude Skills and Fedwiki Document Skill
- Claude Import Skill

---

**Upstream:** [`claude-import-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/claude-import-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
