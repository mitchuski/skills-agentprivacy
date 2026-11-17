---
name: agentprivacy-wiki-to-pdf
description: >
  Pull FedWiki timeline pages and render formal executive-brief PDFs — one
  brief per timeline plus a combined dossier whose "Unified Summary" layer is
  built from the In-brief summaries. Use when turning the *.timeline.ide.earth
  subdomain wikis (or any same-shaped FedWiki answer pages) into shareable,
  executive-style PDF documents, or when re-rendering offline from a cached
  model. ReportLab only — no LaTeX, GTK or browser engine. Kept by the
  Librarian 🗃️; the Unified Summary is the Chronicler's compression.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "wikis"
  alignment: "mage"
  layer: "distribution"
  keeper: "librarian"
  authoring_persona: "chronicler"
  personas: "librarian (keeper — pull the shelves, bind the dossier) · chronicler (the Unified Summary: every milestone compressed to its five answers) · ambassador (the executive register: briefs for people who will not open a wiki)"
  origin: "0xagentprivacy"
  author: "the Keeper"
  introduced: "2026-06-28"
  tooling: "wiki_pdf.py (this folder) · Python 3 + reportlab"
  related_skills: "agentprivacy-wiki-cohere-sync (keeps the source pages coherent), agentprivacy-wiki-transcribe (makes the answer pages), understanding-compression (re-expresses the Unified Summary per community)"
  source_corpus: "the public *.timeline.ide.earth milestone subdomains (video page + five question pages each)"
  upstream: "none recorded"
---

# agentprivacy-wiki-to-pdf

**🗃️📄 Wiki to PDF — the federation, bound for people who read on paper**
Keeper: the Librarian 🗃️ · Authored by the Chronicler 🧙📖 · Category: wikis · Layer: distribution

> One core, many bindings: the brief is the wiki folded small.

Turns the federated timeline wikis into formal PDF documents. Source of truth
is the **live** `*.timeline.ide.earth` subdomains, read over public GET (no
cookie needed).

## What it produces (into `out/` beside the script, or `--out`)

- `<sub>-brief.pdf` — one executive brief per timeline (cover → overview →
  In brief → Key Points / Action Items → the five questions in detail).
- `timeline-dossier.pdf` — combined dossier: **cover → Contents → Unified
  Summary (every In brief, all milestones) → Milestones in Detail**.
- `model.json` (with `--dump`) — the pulled, parsed content model, for offline
  re-render with `--model`.

The **Unified Summary** section is deliberate: it is the shared semantic core
(each milestone compressed to its five answers) from which the detailed
sections — and any community-specific retelling produced by
`understanding-compression` — expand.

## Run

```
python wiki_pdf.py                         # all timelines + dossier -> out/
python wiki_pdf.py --sub agm               # one timeline brief
python wiki_pdf.py --no-dossier            # briefs only
python wiki_pdf.py --dump out/model.json   # pull + cache the model, then render
python wiki_pdf.py --model out/model.json  # render from cache (no network)
python wiki_pdf.py --out <dir>             # write somewhere else
```

## How it works

1. **Pull** — for each timeline: the video / primary page (title, `date` item,
   video URL, Overview, Key Points, Action Items) + the five question pages
   (`who-cares`, `who-is-involved`, `what-changes`, `proof--realness`,
   `becoming-real`).
2. **Parse** — FedWiki `story[]` items → a structured record. For each question
   page it separates the `## In brief` summary from the verbatim answer body and
   drops the navigation chrome (the "Below we summarise" intro line and the
   `# See` block).
3. **Render** — ReportLab (Platypus). A minimal markdown → flowables converter
   handles headings, bullets, numbered lists, bold / italic / code, and
   `[[wiki links]]` (rendered as accent-colored text).

## Config

The timeline family, chronological order, video-slug map, and question slugs are
at the top of `wiki_pdf.py` (`TIMELINES`, `QUESTIONS`, `HOST`). Add or replace a
milestone there; retarget another federation by changing `HOST` and the lists.
Cover kicker / dossier titles are in `render_brief` / `render_dossier`.

## Dependencies

- Python 3 + `reportlab` (`pip install reportlab`). No LaTeX / GTK / wkhtmltopdf.
- weasyprint is deliberately not used — its GTK libraries are fragile on Windows;
  ReportLab is the engine.

## Notes / gotchas

- Dates are read from each video page's `date` story item and shown verbatim.
- The combined dossier paginates one milestone per section (~64 pp for 12).
- A missing or renamed question page renders as "(missing: …)" rather than
  failing the whole run.
- The PDFs carry other people's answers: share them where the timeline wikis are
  already shared, and keep `out/` out of any repo.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis
