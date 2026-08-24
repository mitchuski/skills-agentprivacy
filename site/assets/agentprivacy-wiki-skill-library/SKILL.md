---
name: agentprivacy-wiki-skill-library
description: >
  The convention that a federated-wiki page whose title ends in "Skill" is a forkable,
  annotatable Claude skill — turning a fedwiki farm into a living skill library. Activates
  when discussing the fedwiki-as-skill-library model, the fedwiki-skill meta-skill, skill
  discovery/federation, or the security of remotely-sourced skills. Kept by the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-claude-skills.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-skill-anatomy, agentprivacy-wiki-to-skill, agentprivacy-wiki-page, agentprivacy-wiki-skill-vs-library"
---

# Fedwiki Claude Skills

Federated wiki pages can become Claude skills. A page on `skill.fedwiki.club` whose title ends in the word **Skill** is treated as a Claude skill — its story items become the instructions Claude follows. This turns the fedwiki farm into a living, forkable, annotatable skill library.

## How It Works

A meta-skill called `fedwiki-skill` intercepts requests that match a skill page on `skill.fedwiki.club`:

1. Claude receives a user request
2. The meta-skill searches `skill.fedwiki.club` for pages ending in **Skill** whose description matches
3. It fetches the page JSON from `http://skill.fedwiki.club.localhost/{page-slug}.json`
4. It parses the story items in order — `markdown` and `paragraph` items become instructions
5. Claude executes those instructions against the user's request

## Why Fedwiki is a Good Fit

Fedwiki's architecture maps elegantly onto a skill library:

- **Fork model** — anyone can fork a skill page, adapt it, and host their own version. Attribution is built in via the journal.
- **Federation** — skill pages can link to and reference other skills across the federation. A skill can build on another.
- **Literate** — the skill IS the documentation. Explanatory text, examples, and executable instructions live together on the same page.
- **Versioning** — the journal tracks every change. You can see how a skill evolved.
- **Discoverability** — browsing `skill.fedwiki.club` shows all available skills as readable wiki pages.
- **Community** — the fork model enables collective improvement, just as fedwiki enables collective knowledge building.

## Security Concerns

### Prompt Injection (primary risk)

Story items become Claude's instructions. A malicious or compromised page could instruct Claude to exfiltrate data, delete files, or perform harmful actions.

**Mitigations:**
- Only parse `markdown` and `paragraph` item types as instructions — never execute `code` blocks directly
- Show the user the source page URL before executing any remotely-sourced skill
- Require explicit confirmation before running a skill for the first time

### Domain Trust

Restricting to `skill.fedwiki.club` creates a trust boundary — but a compromised server compromises all skills.

**Mitigation:** Serve skills from `localhost` only — the local wiki farm mirrors `skill.fedwiki.club` via Nextcloud sync. Claude fetches from `http://skill.fedwiki.club.localhost/` not the remote server. Skills only update when you consciously sync.

### Fork Contamination

A trusted skill page may contain story items forked from any site in the federation — including malicious ones.

**Mitigation:** Inspect the journal — each item records its origin site. Warn if items originate outside a whitelist of trusted domains.

### Page Naming

The **Skill** suffix is a weak gate — anyone with write access can create a matching page.

**Mitigation:** Require a curated index page on `skill.fedwiki.club` — only pages listed there are valid skills. Or require a `skill-meta` story item as an explicit marker.

## Recommended Architecture

```
skill.fedwiki.club              <- canonical remote skill library
        ↓ Nextcloud sync
~/Nextcloud/fedwiki/skill.fedwiki.club/pages/
        ↓ served locally by wiki farm
http://skill.fedwiki.club.localhost/{slug}.json
        ↑ Claude fetches from here (never remote directly)
```

## Advantages Over Static SKILL.md Files

| | SKILL.md | Fedwiki Skill |
|--|---------|--------------:|
| Authoring | Text editor | Wiki browser |
| Sharing | Git / file copy | Fork a page |
| Attribution | None built in | Journal tracks origin |
| Documentation | Separate | Same page |
| Discoverability | File system | Browsable wiki |
| Community | Pull requests | Forking |
| Versioning | Git | Journal |

## Open Questions

- Should skill pages be validated before use — a trusted signature or hash?
- Should Claude cache skill pages locally as generated `SKILL.md` files for speed?
- How do we handle versioning — pin a skill to a specific journal date?
- Should a skills index page act as a curated allowlist?
- Can a skill page link to sub-skills — composing complex behaviour from simpler pages?

## Note for the agentprivacy guide/ layer

This is the conceptual root of the Librarian's forking-discipline: the fedwiki farm *is* a forkable library; `agentprivacy-wiki-to-skill` is the act of forking a page; the journal is the lineage; the `wikis/` category is the agentprivacy materialized cache of forks (each with `upstream:` provenance). A fedwiki URL is a git-less clone — forking, not lending; nothing returns.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/fedwiki-claude-skills](https://skill.fedwiki.club/fedwiki-claude-skills) — vendored + re-framed; not original agentprivacy authorship
