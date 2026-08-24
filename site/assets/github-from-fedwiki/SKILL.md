---
name: github-from-fedwiki
description: Mirror a federated wiki site to a GitHub wiki, translating fedwiki page JSON into GitHub-flavoured markdown. Use when the user says "mirror this wiki to GitHub", "create a GitHub wiki from the fedwiki", "export the wiki site to a GitHub wiki", "sync legacy.h2g2.localhost to the repo wiki", "translate fedwiki markdown to GitHub markdown", or wants a repo's GitHub wiki generated from a fedwiki site's pages.
---

# GitHub from Fedwiki

Mirrors a federated wiki site (a farm domain folder of page JSON) into a
GitHub wiki (the `{repo}.wiki.git` git repo), translating fedwiki markdown
into GitHub-flavoured markdown. One fedwiki page → one wiki page;
`welcome-visitors` → `Home`. The mirror is **one-way**: re-running overwrites
GitHub-side edits.

## Inputs

- **Source site**: a farm domain, e.g. `legacy.h2g2.localhost`. Resolve its
  farm dir per `fedwiki-page` (private `~/Music/Guides/Private/{domain}`,
  public `~/Nextcloud/fedwiki/{domain}`).
- **Target repo**: `owner/repo` on GitHub. The wiki lives at
  `https://github.com/{owner}/{repo}.wiki.git`.

## Audience check — before anything else

A `*.localhost` fedwiki is private. Confirm the target repo's visibility
matches the content's sensitivity (`gh api repos/{owner}/{repo} --jq
.private`). Mirroring a private research site to a **public** repo wiki is a
publish step — stop and ask. Never mirror pages containing secret values;
after generating, grep the output for known-sensitive strings just as
`fedwiki-page` verification does.

## Workflow

1. **Check the wiki repo exists.** `git ls-remote
   https://github.com/{owner}/{repo}.wiki.git` — GitHub only creates the
   wiki repo when its first page is saved. Verify `has_wiki` is true
   (`gh api repos/{owner}/{repo} --jq .has_wiki`; enable with
   `gh api -X PATCH repos/{owner}/{repo} -f has_wiki=true` if not). If
   `ls-remote` still fails, the wiki is uninitialised: create the Home page
   once through the web UI (`https://github.com/{owner}/{repo}/wiki` →
   *Create the first page* → Save) — with the user's go-ahead, the browser
   pane can do this — then re-run `ls-remote`.
2. **Clone** the wiki repo into the session scratchpad (never into the
   source farm).
3. **Translate** every page with the bundled script:

   ```bash
   python3 ~/.claude/skills/github-from-fedwiki/scripts/fedwiki-to-gfm.py \
     ~/Music/Guides/Private/{domain} {wiki-clone-dir}
   ```

   The script maps (details in the script header):
   - page title → `Title-With-Hyphens.md`; `welcome-visitors` → `Home.md`
   - `[[Page Name]]` stays as-is — GitHub wikis (Gollum) resolve the same
     double-bracket syntax by title
   - fedwiki external links `[https://url label]` → GFM `[label](url)`
   - `code` items → fenced blocks with language; `paragraph`/`html` pass through
   - `timeline` items → a ` ```mermaid ` gantt block (GitHub renders Mermaid)
   - task-list checkpoints `- [ ]` / `- [x]` pass through (native GFM)
   - `# Assets` sections and `assets` items are dropped (no assets plugin on
     GitHub); single-`#` fedwiki section headings (`# See`, `# Links`)
     become `##`
   - `journal[0].provenance` → an italic footer line on each page
   - generates `_Sidebar.md` listing every page (Home first)
4. **Commit and push.** Standard commit message
   `Mirror {domain} fedwiki site` + the Claude Co-Authored-By trailer. This
   publishes to everyone who can see the repo — for a first push or a public
   repo, confirm with the user before pushing.
5. **Verify**: `gh api repos/{owner}/{repo}/pages` is not for wikis — instead
   open `https://github.com/{owner}/{repo}/wiki` (browser pane) and check
   Home renders, sidebar lists pages, `[[links]]` resolve, mermaid draws.
6. **Report** the wiki URL and note the one-way rule: edits belong on the
   fedwiki; re-run this skill to re-mirror.

## Repo mode — when there is no wiki tab

**GitHub wikis on private repos are a paid feature.** On a free-plan org or
account, `has_wiki` cannot be enabled on a private repo (the PATCH silently
returns `false`). Check the plan with `gh api orgs/{org} --jq .plan.name`.
Do NOT solve this by making the repo public — that is a publish decision for
the user, and mirrored private research often names live-site weaknesses.

Instead mirror into the **repo itself** with `--mode repo`: pages become
markdown files at the repo root, `welcome-visitors` becomes `README.md` (the
repo front page), and `[[Page Name]]` is rewritten to a relative
`[Page Name](Page-Name.md)` link because plain repo markdown has no `[[...]]`
support. Task lists and mermaid render identically. No `_Sidebar.md`.

Also use repo mode when the user has no push access to the target repo's
wiki: org members can usually create a fresh repo (creator gets admin) —
check `gh api repos/{owner}/{repo} --jq .permissions` early, and
`gh api orgs/{org} --jq .members_can_create_repositories`.

## Gotchas

- The wiki git repo does not exist until the first page is saved via the web
  UI — a bare `git push` cannot create it (step 1).
- Wiki write access follows repo write access — issues need only read, so
  "I could file an issue" does not imply "I can push wiki pages".
- Gollum resolves `[[Page Name]]` case-insensitively to `Page-Name.md`;
  fedwiki slugs do the same via lowercasing, so titles that collide only by
  case would collide on GitHub too (fine in practice — fedwiki forbids them).
- `[[Singular]]s` suffix links (the `plural-wiki-link` convention) render on
  GitHub as `Singular` + a trailing `s` outside the link — acceptable, same
  as fedwiki.
- Mermaid gantt milestones need a duration (`0d`); the translator handles it.
- Wiki pages on private repos are visible to everyone with repo read access —
  the audience check above is the only gate.

## See

- `fedwiki-page` — the source JSON format this reads.
- `fedwiki-plan` — timeline/checkpoint conventions the translator maps.
- `obsidian-to-fedwiki` / `fedwiki-to-tiddlywiki` — sibling converters.
