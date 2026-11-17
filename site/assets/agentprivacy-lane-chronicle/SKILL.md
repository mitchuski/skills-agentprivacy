---
name: agentprivacy-lane-chronicle
description: >
  Turn a dual-agent harness lane's work on a public board (a benchmark, a leaderboard, a standards thread) into a
  shareable chronicle: a research-note PDF and one-image PNG with exact figures, every submission and outcome, who in
  the field composed or cited the work, where the record stands, a closing tome proverb tagged with the City of Mages, a short note from the solver, and
  an account of the dual-agent harness. Use when someone asks to "visualise my contributions", "make a research
  note / chronicle of this lane", "share this with the solver group", "add a proverb at the end", or to keep such a
  note true after the board moves. Also drives the companions: figures exported for a Soul Sync letter and the
  matching holes of a City tome. Encodes the verification pass against the public record, the honesty rules for
  credit and counts, what to leave out before sharing, the page-layout fixes, and the render gotchas.
license: "CC BY-NC-SA 4.0 (SKILL.md, assets, references); scripts/ Apache-2.0 — see the repo LICENSE.md"
metadata:
  version: "0.1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "operational (first built for sig_mage on sig.golf, 2026-10-05)"
  related: "agentprivacy-chronicler (persona), agentprivacy-narrative-compression, agentprivacy-proverbiogenesis, agentprivacy-review-receipts; Claude Code skill agentprivacy-chronicle-reflect (voices and reflection between chronicle series)"
  proverb: "The crown lasts an afternoon. The stroke stays in the floor."
---

# Lane chronicle: a research note that can be shared

A **lane chronicle** is the outward face of one harness lane: what the lane contributed to a public board, shown
so a peer can check every number. It is a research note in form (abstract, figures, tables, sources) and a
chronicle in spirit (one telling of the days, ending in a proverb). The other voices of the same event (master
chronicle, Soul Sync letter, City tome) are reflections of it; for moving between voices use the
`agentprivacy-chronicle-reflect` discipline. This skill owns the *shareable note* and its figures.

Readers are other practitioners on the same board. Write for them: they know the scoring, they will check the
numbers, and they care who did what.

## 1. Gather from the record, not from memory

Sources, in order of authority:
1. **The public record**: the accepted submissions and their notes (on GitHub-backed boards, the pull requests and
   the merged commits). This is what peers can check, so it wins every conflict.
2. **The lane's running log** (`memory/log.md` or equivalent): timestamps, gates, exact numbers, what was built
   and what was killed.
3. **The submitted notes** of the lane's own entries (`submissions/*.submitted-*.md`).
4. **Layout / proof notes** for any figure drawn to scale.

Build a list of the lane's own entries first: for each, submission id, PR, lever, base commit, claimed score
components, outcome (promoted, or closed and why: "X promoted first", "Y carried it"). `scripts/citations.py`
pulls the field's side (see §4).

## 2. Structure

Use `assets/chronicle_template.html` (CSS tokens, light/dark, print rules already in place). Sections:

1. **Header**: kicker `A <lane> chronicle · research note · <board>`; a title that names the levers; byline with
   the solver handle and the harness label (`agentprivacy dual-agent harness (<lane> instance) in Claude Code`),
   and the date range.
2. **Abstract**: the score formula in one sentence, each lever with its effect, how many times promoted, how the
   field took it up, and where it stands. Date any count ("as of 5 October").
3. **Where each lever acts**: one figure mapping each lever onto the terms of the score.
4. **One section per lever**: a paragraph of mechanism, one figure (before/after, a byte map to scale, a flow),
   a caption carrying the submission ids, the score change and the promotion. Numbers in captions, not in prose.
5. **Summary table**: lever, acts on, mechanism, ΔC, own submissions (✓ = promoted), field.
6. **Timeline**: two columns, own entries vs field adoption, colour-coded (own promoted / adopted / overtaken).
7. **Submissions**: every PR the solver opened, linked, with base, claim and outcome.
8. **Where the field cites the work**: the citation figure from §4, with its method stated in the caption.
9. **Where it stands**: the record at the time of writing, what it still carries, and a thank-you to the solvers
   who composed the work in the open.
10. **Proverb**: `## Proverb`, one italic line, and a one-line tag naming the tome it comes from and `mages.city`
    (see §5). The City appears only as that tag.
11. **A note from one solver**: a short first-person address (see §6).
12. **The dual-agent harness**: the method, and why it suits automated research (see §6).
13. **Footer**: what the numbers are (certificate bounds, how they were checked), where the public record is, how
    the counts were made. No local paths.

## 3. Honesty rules (each one cost a correction the first time)

- **Every number traces to a source.** Re-read the log or the PR for each figure before it goes in. Recompute
  products (S × C) yourself; a mis-multiplied score is the commonest slip.
- **Re-check claims against the current record before sharing.** Statements like "in the current line" decay
  within hours on a live board: fetch the record and confirm (e.g. read the record's claim and the scheme constants)
  before keeping them. Say what the record carries, and say when a lever survives only as someone else's variant.
- **Keyword counts are counts of naming, not of carrying.** If a citation count comes from matching PR
  descriptions, write "name it", not "carry it", and state the method and the snapshot time.
- **Credit precisely.** Name the solvers whose work each entry built on; say "coauthor" only where the PR lists it;
  quote the field's own words where they credit the lane. Use they/them for every solver.
- **A simplified identity must still be the proved one.** When a figure states a formula from a proof, copy the
  proved form (e.g. `top cost + 69 + credit = 1,086`), not a rearrangement that is not what the kernel checked.
- **Overtaken is a result.** Closed submissions stay in the table with the reason; adoption by others is shown
  next to them, not instead of them.

## 4. The field's side: `scripts/citations.py`

`python scripts/citations.py --repo OWNER/REPO --login SOLVER --levers levers.json --out citations.json` lists every
PR whose description names the solver (excluding the solver's own), classifies each by lever with the regexes in
`levers.json` (`{"E8": "root.?children|PR ?#?212\\b", ...}`), flags coauthor lines, and writes a snapshot JSON plus
a summary (PRs, merged, solvers per lever). Keep the snapshot file next to the note so the counts are regenerable;
draw the citation figure from it (merged vs open/closed bars, solver names under each bar).

## 5. The proverb

Close with the proverb of the companion City tome, in the tomes' own format: a `## Proverb` heading, one italic
line, and its source (`from <tome>, a tome of the City of Mages`). If no tome exists yet, write the hole or act
first (§7) and take its closing line. Keep the board's own vocabulary (on a golf-scored board "crown" and "stroke"
already carry the image; do not stack more).

## 6. After the proverb: the address and the harness (keep these accurate)

- **The City is a tag, not a section.** Under the proverb: `from <tome>, a tome of the City of Mages · mages.city`.
  Do not describe the City at length in a note shared with a board: the connection works better left organic, with
  an invitation rather than a pitch. If it must be described anywhere, the keeper's words: the City of Mages is meant
  to become a **verifiable trust community**, and its tomes are **early writings of how the agentprivacy work is
  getting there** (never "a knowledge directory").
- **A note from one solver** (first person, short): this is one solver's view of a shared course; other solvers will
  have told these days differently, and their own submission notes are the fuller record; the template behind the
  note is an open skill (`agentprivacy-lane-chronicle` in agentprivacy-skills) the author is happy to share; anyone
  who wants their work on the course told as a tale is welcome, since the City has room for more tomes.
- **The dual-agent harness** (`github.com/mitchuski/agentprivacy-harness`): *one proposes, one breaks, neither writes
  the exam.* The Mage seat proposes levers, writes the code and the proofs; the Swordsman seat reads the contract,
  checks the security argument and the worst-case bound, and holds the only key to the local gate. Why that suits
  automated research on a public board, with one concrete example from the lane for each:
  kills are results; nothing ships on a model's say-so (the local gate); prices before proofs (exact pricing against
  the record's own formulas before any build); lanes in parallel, apart (separate agents build and check, each lane
  keeps a running log). End with the honesty line: the separation is a discipline, not a claim of independent minds;
  the security belongs to the kernel and the official validator; the harness brings the habit of never marking its
  own card.

## 7. Before sharing: what to leave out

- **Unsubmitted levers** (in progress, priced but unbuilt). A shared note hands them to the field; the keeper
  decides when. Mention at most that work continues.
- **Side lanes and negative results** unless the keeper asks for them (they dilute a contribution note; they belong
  in the lane's research files).
- **Private shared work** of others, chat participants' names, local file paths, credentials, internal ids.
- On boards whose lane rules say so, the note is shared by the keeper through their own channel; the agent does not
  post it (e.g. no GitHub Discussions posts on sig.golf).

## 8. Render and check

- `python scripts/render.py note.html --out stem` writes `stem.pdf` (A4, light theme forced) and `stem.png` (the
  whole page as one tall image, trimmed) with headless Edge or Chrome. It refuses to report success if the PDF was
  not rewritten: on Windows a PDF open in a viewer cannot be overwritten, and the browser fails silently. Close the
  viewer or write a new name, and remove stale copies so only one PDF circulates.
- `python scripts/export_figures.py note.html OUT_DIR` saves each `<figure data-name="...">` as its own PNG (for a
  Soul Sync letter, slides, a chat).
- **Look at every page** (`pdftoppm -r 40 -png note.pdf p` and tile them). Fix orphans by wrapping a heading with its
  table or figure in `<div style="break-inside:avoid">`; avoid forced page breaks, which leave half-empty pages; if one
  block spills onto a last page, tighten the print font or figure padding slightly before cutting content.
- Keep the generator script with the note so the next board move is one edit and one rebuild.

## 9. Companions

- **Soul Sync letter**: the same levers told in the mage's voice (first person, no git mechanics as beats, caveats
  folded into prose, no em-dashes, a seal line), with the exported figures, added to the blog reader's shelf.
- **City tome**: one hole or act per lever, second person, Soulbis ⚔️ and Soulbae 🧙 in third person, the keeper's
  margin listing what is operational and what is fiction. The tome's closing line becomes the note's proverb.
- Nothing is committed, pushed or published by the agent; the keeper signs and shares.

## Worked example

`references/sig_mage-2026-10-05.md`: the sig_mage chronicle on sig.golf (four levers, ten submissions, 90 citing
PRs), with every correction made between the first draft and the shared version.
