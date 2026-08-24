---
name: agentprivacy-wiki-skill-vs-library
description: >
  The distinction between a prompt-based skill (probabilistic, judgment, slow) and an
  executable library (deterministic, fast, no LLM), and when to graduate a skill into a
  library. Activates when deciding skill-vs-code, designing an onboarding/automation
  pipeline, or judging whether a task needs an LLM. An onboarding-judgment skill kept by
  the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/skills-and-libraries.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-skill-anatomy, agentprivacy-wiki-page, agentprivacy-wiki-claude-ghost"
---

# Skills and Libraries

A **skill** is a text prompt — instructions, examples, and rules given to an LLM that shape how it behaves on a task. A **library** is executable code that runs directly, without LLM involvement. Both can accomplish the same outcome. The question of which to use, and when to graduate a skill into a library, is one of the core design decisions in an AI-augmented workflow.

## What a Skill Actually Is

A skill file (like `~/.claude/skills/fedwiki-page/SKILL.md`) contains no executable code. It is loaded into the LLM's context window and shapes the model's next output. When Claude creates a wiki page using the fedwiki-page skill, it is:

1. Reading the rules and examples in the skill file
2. Interpreting your natural language request
3. Generating JSON that follows those rules

The skill is probabilistic — Claude *understands* the pattern and applies judgment. It handles ambiguity, fills in missing details, and adapts to context. It is also slow (LLM inference time) and not guaranteed to produce identical output twice.

## What a Library Actually Is

A library function like `create_page(title, story_items)` runs deterministically. Given the same inputs it produces the same output, instantly, with no API call. The fedwiki pattern already has embryonic library code:

```python
def make_id():
    return uuid.uuid4().hex[:16]
```

This is a one-line library. A fuller `fedwiki.py` module could offer `make_page()`, `make_item()`, `make_journal()` — the entire JSON-building pattern extracted from the skill into importable functions.

## When They Do the Same Thing

The fedwiki-page skill and a hypothetical `fedwiki.py` library can both produce valid wiki page JSON. They overlap when:

- The task is **well-defined** — the output structure is known and fixed
- The inputs are **structured** — a title string and a list of content items
- There is **no judgment required** — no need to decide what the content should be

In this zone, the skill is over-engineered. You are using an LLM to do something a ten-line Python function could do faster, cheaper, and more reliably.

## When a Skill Is the Right Tool

Use a skill when the task requires **understanding and judgment**:

- **Natural language input** — "write a page about router models" requires Claude to decide content, structure, examples, and emphasis. No function can do this.
- **Ambiguity** — the user hasn't fully specified the output. The skill guides Claude to fill in the gaps sensibly.
- **One-off creative work** — pages written once by a human collaborating with Claude, not generated programmatically at scale.
- **Pattern is still evolving** — you are still learning what good output looks like. A skill is easy to edit; refactoring library code is harder.

## When to Graduate a Skill into a Library

Graduate a skill to a library when:

1. **The pattern has stabilised** — you know exactly what valid output looks like and the skill has stopped changing
2. **Volume** — you need to generate many pages programmatically (bulk import, API responses, data pipelines)
3. **Reliability matters** — a ghost page endpoint must always return valid JSON. A library guarantees structure; a skill might hallucinate a wrong ID or forget a field under load
4. **Composition** — you want to call the operation from other code, chain it with other functions, or test it with unit tests
5. **Speed** — library calls are microseconds; skill invocations are seconds

## The Right Division of Labour

| Task | Skill | Library |
|---|---|---|
| Decide what a page should say | ✅ | ✗ |
| Build valid page JSON from known content | ✗ | ✅ |
| Strip and rewrite a journal | ✅ (judgment on what to keep) | ✅ (if always strip-to-create) |
| Generate IDs | ✗ | ✅ |
| Write the file to disk | ✗ | ✅ |
| Reindex a wiki domain | ✗ | ✅ |
| Interpret a user's natural language request | ✅ | ✗ |

A well-designed system has skills calling library functions: Claude authors the content, the library assembles and stores it correctly.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/skills-and-libraries](https://skill.fedwiki.club/skills-and-libraries) — vendored + re-framed; not original agentprivacy authorship
