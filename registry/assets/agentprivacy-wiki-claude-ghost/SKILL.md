---
name: agentprivacy-wiki-claude-ghost
description: >
  A ghost page whose content is written live by Claude via the Anthropic API, inserted
  between a wiki form submission and the page-JSON response. Activates when building a
  Claude-authored ghost endpoint, a /claude-ghost FastAPI handler, or live LLM page
  generation in a fedwiki. Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/claude-ghost-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-ghost-pages, agentprivacy-wiki-page, agentprivacy-wiki-skill-vs-library"
---

# Claude Ghost Skill

A **Claude ghost page** is a ghost page whose content is written by Claude in response to a user's query. A ghost page appears in the wiki lineup but is never stored on disk. This extends the pattern by inserting the Anthropic API call between the form submission and the page JSON response.

## How It Works

1. User types a topic in an `html` item form and submits
2. The wiki POSTs `{"query": "..."}` to the FastAPI endpoint
3. FastAPI calls `claude-opus-4-8` with a system prompt instructing it to return page JSON
4. Claude returns a complete wiki page as JSON (title + markdown story items)
5. FastAPI parses and returns the JSON
6. The wiki calls `wiki.showResult()` — the Claude-authored page appears in the lineup

## html Item Pattern

Add an `html` item pointing to the `/claude-ghost` endpoint:

```json
{
  "type": "html",
  "id": "a1b2c3d4e5f60001",
  "text": "<form action=\"http://api.localhost/claude-ghost\" method=\"POST\">\n  <input name=\"query\" placeholder=\"ask Claude anything…\">\n  <button type=\"submit\">Ask Claude</button>\n</form>"
}
```

## FastAPI Endpoint

```python
import anthropic, json, re

@app.post("/claude-ghost")
def claude_ghost(params: dict):
    query = params.get("query", "").strip() or "wiki"
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=2048,
        thinking={"type": "adaptive"},
        system=(
            "You write federated wiki pages. "
            "Return ONLY valid JSON: "
            '{"title": "...", "story": [{"type": "markdown", "id": "16hexchars", "text": "..."}]}. '
            "Generate 4-6 story items. IDs must be random 16 hex chars. "
            "No prose outside the JSON. No markdown fences."
        ),
        messages=[{"role": "user", "content": f"Write a wiki page about: {query}"}]
    )
    text = next(
        (block.text for block in message.content if hasattr(block, "text")),
        "{}"
    )
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return json.loads(match.group()) if match else {
        "title": f"Claude: {query}",
        "story": [{"type": "markdown", "id": make_id(), "text": f"*No response for: {query}*"}]
    }
```

Note: Thinking blocks in the response have no `.text` attribute — the `hasattr(block, "text")` check skips them and extracts only the text content block.

## Page JSON from Claude

Claude is instructed to return only raw JSON — no markdown fences, no prose. The system prompt specifies:
- `title`: a short descriptive title
- `story`: array of `markdown` items with random 16-char hex `id`s
- 4–6 items covering the topic substantively

The endpoint uses regex to extract the JSON in case Claude wraps it in any extra whitespace.

## Requirements

- `anthropic` Python package installed (`pip install anthropic`)
- `ANTHROPIC_API_KEY` set in the environment where FastAPI runs
- Fast Caddy routing `api.localhost` → FastAPI `:8000`
- CORS middleware on FastAPI (`allow_origins=["*"]`)

## Related Skills

- `agentprivacy-wiki-ghost-pages` — the base ghost page pattern (no Claude)
- `agentprivacy-wiki-page` — creating stored pages
- `agentprivacy-wiki-skill-vs-library` — when to make the page-structure a deterministic library

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer) · model id current as of skill authoring; confirm the latest Claude model when deploying
**Upstream:** [skill.fedwiki.club/claude-ghost-skill](https://skill.fedwiki.club/claude-ghost-skill) — vendored + re-framed; not original agentprivacy authorship
