---
name: agentprivacy-wiki-to-skill
description: >
  The fork desk / inclusion engine — converts a federated-wiki page into a Claude Code
  SKILL.md. Activates when materializing a fedwiki skill, exporting a wiki page to
  ~/.claude/skills, or pulling a skill from skill.fedwiki.club into a repo. This is the
  git-less clone: the wiki stays source of truth, the SKILL.md is a fork (a copy that
  remembers its origin). The Librarian's 🗃️ core forking act in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-to-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-page, agentprivacy-wiki-skill-library, agentprivacy-wiki-document-plugin, agentprivacy-wiki-create-plugin"
---

# Fedwiki To Skill

The **fedwiki-to-skill** skill converts a federated wiki page (page-json) into a Claude Code `SKILL.md` file. Author a skill as an ordinary wiki page, then export it to `~/.claude/skills/{slug}/SKILL.md` where Claude Code can load and invoke it. It is the inverse direction of the document-plugin skill — here the page itself *becomes* the skill.

## How It Works

A fedwiki page has a `title` and a `story` array of items, each with a `type` and a `text`. The converter maps each item type to markdown:

- `markdown` → kept as-is (already markdown)
- `paragraph` → plain text paragraph
- `code` → fenced code block
- `html` → wrapped HTML block
- `reference`, `roster`, `assets` → omitted (navigation/structure, not instructions)

The page `title` derives the skill **name** (lowercase, hyphenated slug), used for the `name:` frontmatter field and the top `# Heading` of the body.

## Skill Frontmatter

Every `SKILL.md` opens with YAML frontmatter. The `description` is the critical field — Claude Code uses it to decide *when* to auto-invoke the skill, so it must name the trigger phrases.

```markdown
---
name: skill-name
description: One or two sentences describing WHEN to trigger — include the user phrases that should activate it.
---
```

Pull the description from the first `paragraph` or `markdown` item if it reads like a purpose statement; otherwise ask the user to supply one.

## Output Location

Personal skills (available in all projects):
```
~/.claude/skills/{skill-name}/SKILL.md
```

Project skills (current project only):
```
.claude/skills/{skill-name}/SKILL.md
```

Default to `~/.claude/skills/` unless the user specifies otherwise.

## Conversion Steps

1. **Read the source** — a page-json path, or a slug + domain located under `~/Music/Guides/Private/{domain}/pages/{slug}` (local) or `~/Nextcloud/fedwiki/{domain}/pages/{slug}` (public).
2. **Extract** the `title` and `story`.
3. **Build frontmatter** — `name` from the slug, `description` from the first descriptive item (ask if unclear).
4. **Convert story items** following the mapping above, with a blank line between items.
5. **Write** to `~/.claude/skills/{slug}/SKILL.md`, creating the directory if needed.
6. **Confirm** — show the output path and the first lines of the generated file.

## What to Watch Out For

- **`reference` items are navigation** — omit unless the user wants them kept as "see also" notes.
- **`assets` and `roster` items** — always omit; they are structural wiki UI elements.
- **Escaped characters** — fedwiki `text` fields may carry escaped newlines or quotes; unescape them when writing markdown.
- **Wikilinks `[[Page Name]]`** — won't resolve inside a skill; convert to plain text or backticked names.
- **Long pages** — many items make a large skill; consider splitting into focused skills.
- **Missing description** — prompt the user before writing if no clear purpose statement exists.
- **Existing skill** — if the target `SKILL.md` already exists, show a diff and ask before overwriting.

## Note for the agentprivacy guide/ layer

When materializing into `agentprivacy-skills/.../guide/`, the agentprivacy framing adds: full metadata frontmatter (`category: guide`, `layer: onboarding`, `keeper: librarian`), an `upstream:` provenance field, and a body footer crediting the source page. The skills are *vendored + re-framed* — the wiki remains the source of truth; the materialized file is a fork that carries its lineage.

## Related Skills

- `agentprivacy-wiki-page` — create the page-json this skill consumes
- `agentprivacy-wiki-skill-library` — the convention that "…Skill" pages are a forkable library
- `agentprivacy-wiki-document-plugin` — document a plugin instead of exporting a skill
- `agentprivacy-wiki-create-plugin` — scaffold a new fedwiki plugin

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-to-skill](https://skill.fedwiki.club/fedwiki-to-skill) — vendored + re-framed; not original agentprivacy authorship
