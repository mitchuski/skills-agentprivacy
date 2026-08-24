---
name: wiki-to-pdf
description: Pull FedWiki timeline pages and render formal executive-brief PDFs - one brief per timeline plus a combined dossier whose "Unified Summary" layer is built from the In-brief summaries. Use when turning the *.timeline.ide.earth subdomain wikis (or any same-shaped FedWiki answer pages) into shareable, executive-style PDF documents.
---

# wiki-to-pdf

Turns the federated timeline wikis into formal PDF documents. Source of truth is the
**live** `*.timeline.ide.earth` subdomains, read over public GET (no cookie needed).

## What it produces (into `out/`, inside this skill dir)
- `<sub>-brief.pdf` - one executive brief per timeline (cover -> overview -> In-brief -> Key Points / Action Items -> the five questions in detail).
- `timeline-dossier.pdf` - combined dossier: **cover -> Contents -> Unified Summary (every In-brief, all 12 milestones) -> Milestones in Detail**.
- `model.json` - the pulled, parsed content model (re-render offline with `--model`).

The **Unified Summary** section is deliberate: it is the shared semantic core (each
milestone compressed to its five answers) from which the detailed sections - and any
community-specific retelling produced by the `understanding-compression` skill - expand.

## Run
```
python wiki_pdf.py                      # all 12 timelines + dossier -> out/
python wiki_pdf.py --sub agm            # one timeline brief
python wiki_pdf.py --no-dossier         # briefs only
python wiki_pdf.py --dump out/model.json   # pull + cache the model
python wiki_pdf.py --model out/model.json  # render from cache (no network)
```

## How it works
1. **Pull** - for each timeline: the video/primary page (title, date object, video URL,
   Overview, Key Points, Action Items) + the 5 question pages (`who-cares`,
   `who-is-involved`, `what-changes`, `proof--realness`, `becoming-real`).
2. **Parse** - FedWiki `story[]` items -> structured record. For each question page it
   separates the `## In brief` summary from the verbatim answer body and drops the
   navigation chrome (the intro line and `# See` block).
3. **Render** - ReportLab (Platypus). A minimal markdown->flowables converter handles
   headings, bullets, numbered lists, bold/italic/code, and `[[wiki links]]`.

## Config
The timeline family, chronological order, video-slug map, and question slugs are at the
top of `wiki_pdf.py` (`TIMELINES`, `QUESTIONS`). Add/replace a milestone there.

## Dependencies
- Python 3 + `reportlab` (`pip install reportlab`). No LaTeX / GTK / wkhtmltopdf needed.
- weasyprint is NOT used (its GTK libs are broken on this box); ReportLab is the engine.

## Notes / gotchas
- Dates are read from each video page's `date` story item and shown verbatim ("date object true").
- The combined dossier paginates one milestone per section; ~64 pp for the current 12.
- If a question page is missing/renamed, that answer renders as "(missing: ...)" rather
  than failing the whole run.
- Pairs with `fedwiki-cohere-sync` (which keeps the source pages coherent) and feeds
  `understanding-compression` (which re-expresses the Unified Summary per community).
