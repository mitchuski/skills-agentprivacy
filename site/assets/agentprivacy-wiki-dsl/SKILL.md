---
name: agentprivacy-wiki-dsl
description: >
  The line-oriented DSL convention for Federated Wiki plugin item text: the UPPERCASE first word is a command, lowercase is data, with an optional YAML-style colon. Read before writing or parsing plugin item text. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-dsl-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-create-plugin, agentprivacy-wiki-page, agentprivacy-wiki-document-plugin"
---

# agentprivacy-wiki-dsl

**Fedwiki DSL Skill** captures the line-oriented DSL convention for Federated Wiki plugin item text: the **UPPERCASE first word is a command**, lowercase is data, with an optional YAML-style colon. It lives at `~/.claude/skills/fedwiki-dsl/`. Read it before writing a plugin's text parser.

When authoring or reviewing a plugin that parses its item `text`, when deciding how a plugin item should read, or on *"wiki DSL"*, *"plugin markup"*, *"command keywords"*, *"capitalised command"*, or *"optional colon"*.

Parse the item `text` **line by line**; the **first word** classifies the line:

- **UPPERCASE ⇒ a command / directive** — the keyword names an action or field; the rest of the line is its space-separated arguments. Stock examples: `frame` (`HEIGHT 400`, `SOURCE topic`), `method` (`CALC`, `AVERAGE`, `LOOKUP`), `map` (`LOCATE`, `OVERLAY`), `reduce` (`FOLD`, `SLIDE`).
- **lowercase (or non-keyword) ⇒ literal data / content / value** — passed through, not interpreted.

So capitalisation carries meaning: a command is shouted in CAPS, data is quiet. Document a plugin's commands in CAPS on its about page.

## The optional colon (YAML-style)

A single **trailing colon on the keyword is optional and equivalent**: `HEIGHT 400` ≡ `HEIGHT: 400`. Strip one trailing colon before matching; never require it. Match by the UPPERCASE form (be forgiving of input case, but treat UPPERCASE as canonical in every example and default), keep a single command table as the source of truth, and reserve the post-keyword arguments for parameters even when a command takes none today. `wiki-plugin-family` (`SISTERS`, `PARENT`, `CHILDREN`, `FARM`, `NEIGHBOURHOOD`, `SNAPSHOT`) is a worked example.

## See

Fedwiki CreatePlugin Skill — references this when scaffolding a plugin's text parser. Fedwiki Page Skill — the page-JSON structure plugins produce.

---

**Upstream:** [`fedwiki-dsl-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/fedwiki-dsl-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
