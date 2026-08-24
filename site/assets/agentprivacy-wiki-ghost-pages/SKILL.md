---
name: agentprivacy-wiki-ghost-pages
description: >
  Server-generated federated-wiki pages that appear in the lineup but are never stored on
  disk — produced dynamically from an html-item form submission. Activates when building a
  ghost page, an html form story item, or a FastAPI handler returning page JSON. Kept by
  the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/ghost-pages-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the guide/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-claude-ghost, agentprivacy-wiki-page, agentprivacy-wiki-journal"
---

# Ghost Pages Skill

A ghost page appears in the wiki lineup but is never stored on disk. It is generated dynamically by a server and returned as page JSON in response to a form submission from an `html` story item. The wiki displays it in the lineup just like any stored page.

## The Mechanism

The `wiki-plugin-html` handles form submission inside an `html` item:

1. User submits the form
2. Plugin serialises all named inputs as a flat JSON object
3. POSTs (or GETs) to the form `action` URL
4. Expects **page JSON** back from the server
5. Calls `wiki.showResult()` — the page appears to the right in the lineup

The server never writes anything to disk. The page exists only in the browser.

## html Item Pattern

Add an `html` story item containing a standard HTML form:

```json
{
  "type": "html",
  "id": "a1b2c3d4e5f60001",
  "text": "<form action=\"http://api.localhost/ghost\" method=\"POST\">\n  <input name=\"query\" placeholder=\"enter anything…\">\n  <button type=\"submit\">Generate</button>\n</form>"
}
```

Key rules:
- `action` is the full URL of the server endpoint
- `method` is `POST` (default) or `GET`
- All `name`d inputs are collected and sent as a flat JSON object
- Double-quotes inside the JSON `text` field must be escaped as `\"`
- The html plugin sanitises with DOMPurify — standard form elements are always permitted

## FastAPI Handler

The endpoint receives form params as a plain `dict` and returns page JSON:

```python
import uuid

def make_id():
    return uuid.uuid4().hex[:16]

@app.post("/ghost")
def ghost(params: dict):
    query = params.get("query", "").strip()
    return {
        "title": f"Result: {query}",
        "story": [
            {
                "type": "paragraph",
                "id": make_id(),
                "text": f"Generated from: {query}"
            }
        ]
    }
```

Minimum valid page JSON: a dict with `title` and `story`. No `journal` is needed for ghost pages.

## Named Buttons

Multiple submit buttons with `name` and `value` let one form trigger different behaviours:

```html
<form action="http://api.localhost/ghost" method="POST">
  <button type="submit" name="action" value="summarise">Summarise</button>
  <button type="submit" name="action" value="expand">Expand</button>
</form>
```

FastAPI receives `{"action": "summarise"}` or `{"action": "expand"}`.

## Ghost Pages Can Reference Real Pages

Return `reference` items in the story to point back to real wiki pages the user can fork:

```python
{
    "type": "reference",
    "id": make_id(),
    "site": "localhost",
    "slug": "fast-caddy",
    "title": "Fast Caddy",
    "text": "Optional synopsis"
}
```

## Requirements

- Fast Caddy — Caddy routing `api.localhost` to FastAPI on `:8000`
- FastAPI — running with `uvicorn main:app --port 8000 --reload`
- CORS middleware enabled on FastAPI (`allow_origins=["*"]`)

## Related Skills

- `agentprivacy-wiki-claude-ghost` — ghost pages whose body is written live by Claude
- `agentprivacy-wiki-page` — creating stored pages
- `agentprivacy-wiki-journal` — cleaning page history

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer)
**Upstream:** [skill.fedwiki.club/ghost-pages-skill](https://skill.fedwiki.club/ghost-pages-skill) — vendored + re-framed; not original agentprivacy authorship
