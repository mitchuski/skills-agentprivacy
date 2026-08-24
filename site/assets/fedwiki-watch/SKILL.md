---
name: fedwiki-watch
description: Observe external FedWiki / *.fish / fedwiki.club sites for changes and report what moved since last check. Use when the user wants to monitor the wikis they've used as sources (ide.earth federation, self.fish, skill.fedwiki.club, radio.myth.garden, neighbours like david/max/henry), see recent changes across the federation, get a digest of new/updated/removed pages, add a site to the watchlist, or set up recurring monitoring. Read-only — never writes to any wiki.
---

# fedwiki-watch

A change monitor for the external FedWiki federation the Keeper draws on as sources. Every
Smallest-Federated-Wiki site publishes `GET /system/sitemap.json` — a public, no-auth array of
`{slug, title, date, synopsis}` where `date` is the page's last-modified epoch-ms. This skill polls
that feed per site, diffs it against a stored snapshot, and reports what changed.

**Read-only.** It only issues public GETs. It never pushes, forks, or logs in — no cookies needed.
Distinct from `fedwiki-cohere-sync` (which *writes* pages) and `fedwiki-transcribe`.

## Files

- `roster.json` — the watchlist: `{name, url, group, owner}` per site. `owner:external` = other
  people's wikis (star-flagged, sorted first in the digest); `owner:mitch` = your own sites.
- `watch.mjs` — the runtime (zero deps, Node 18+ for global `fetch`).
- `state/<name>.json` — per-site snapshot (slug → title/date/synopsis). `state/last-run.json` — full last result.
- `reports/latest.md` + `reports/<timestamp>.md` — human digests.

## Run it

From the skill dir (`~/.claude/skills/fedwiki-watch`):

```
node watch.mjs                 # poll all sites, advance snapshots, write digest
node watch.mjs --json          # same + machine summary to stdout (parse this when driving as agent)
node watch.mjs --external      # only owner:external sites (the ones alerts really matter for)
node watch.mjs --site david.vision   # one site by name
node watch.mjs --dry           # detect + report, do NOT advance snapshots (safe preview)
node watch.mjs --detail        # also fetch each changed page's latest journal action
```

First run on any site **seeds a baseline** (records current state, flags nothing) — that's expected;
the second run onward is where changes surface.

## How the agent should use it

1. Run `node watch.mjs --json` and parse the result. `totals` gives counts; `sites[]` carries
   `new[]`, `updated[]`, `removed[]`, plus `status`/`seeded`.
2. Summarise for the user, **leading with `owner:external` changes** (david/max/henry/skill.fedwiki.club/
   radio.myth.garden/david.self.fish) — those are edits by others, the real signal. De-emphasise
   your own sites.
3. To show *what* changed on a page, GET `<site.url>/<slug>.json` and read the tail of `.journal`
   (or diff `.story`); `--detail` does a light version automatically.
4. `reports/latest.md` is the shareable digest.

## Manage the watchlist

Edit `roster.json`. All 21 seed entries verified live 2026-07-13. To discover more neighbours: read a
roster site's `welcome-visitors`/`recent-changes` page JSON, or any page's `journal[].site` /
story-item site references, and add the new hostnames. Removing a site: delete its `state/<name>.json`
too, or it lingers as a stale baseline.

## Recurring monitoring (optional, user-triggered)

Not scheduled by default. Options, cheapest first:
- **On demand** — just ask "check the fedwikis" and the agent runs it.
- **`/loop`** — `/loop 6h node watch.mjs --json` polls on an interval within a session.
- **`/schedule`** — a cron cloud agent that runs `watch.mjs` and messages the digest.
- **Windows Task Scheduler** — `node ~\.claude\skills\fedwiki-watch\watch.mjs`.

Because the feed is public and read-only, any cadence is safe; hourly is plenty (these wikis move slowly).
