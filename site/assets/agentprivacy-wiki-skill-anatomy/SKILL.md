---
name: agentprivacy-wiki-skill-anatomy
description: >
  What a Claude Code skill is — the SKILL.md folder format, frontmatter, storage location,
  and how skills are invoked (auto via description, or explicitly via /skill-name).
  Activates when explaining skills to a newcomer, authoring a new skill, or onboarding an
  agent into the skill model. The conceptual entry to the Librarian's 🗃️ Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/claude-skills.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-skill-vs-library, agentprivacy-wiki-skill-library, agentprivacy-wiki-to-skill, agentprivacy-wiki-page"
---

# Claude Skills

Claude Code skills are markdown files that teach Claude how to perform specific tasks — reusable, invocable instructions that extend Claude's behaviour without modifying its core settings.

## What is a Skill?

A skill is a folder containing a `SKILL.md` file. The frontmatter declares the skill's name and description. The body contains instructions, examples, patterns and checklists that Claude follows when the skill is invoked.

## Where Skills are Stored

Skills live in `~/.claude/skills/`. Each skill is a named subfolder:

```
~/.claude/skills/
    fedwiki-page/
        SKILL.md
    another-skill/
        SKILL.md
        references/
        assets/
        scripts/
```

## Skill Structure

A minimal `SKILL.md` looks like this:

```
---
name: my-skill
description: What this skill does and when to trigger it.
---

# Instructions

Step by step guidance for Claude...
```

The `description` field is the primary triggering mechanism — Claude reads it to decide whether to use the skill for a given request. A good description is specific about both what the skill does and when it should trigger.

## Invoking a Skill

Skills can be invoked in two ways:
- **Automatically** — Claude reads the description and decides the skill applies to the current request
- **Explicitly** — by typing `/skill-name` in the prompt

## Creating a Skill

Create a new folder under `~/.claude/skills/` and write a `SKILL.md` file inside it. The `/skill-creator` skill can help design, test and optimise new skills iteratively with evals.

The fedwiki-page skill on this wiki is an example — it captures the patterns for creating fedwiki page JSON files and is stored at `~/.claude/skills/fedwiki-page/SKILL.md`.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/claude-skills](https://skill.fedwiki.club/claude-skills) — vendored + re-framed; not original agentprivacy authorship
