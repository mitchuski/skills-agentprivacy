---
name: agentprivacy-wiki-watch
emoji: 🛰️
category: wikis
description: Observe the external FedWiki federation you draw on as sources (ide.earth, self.fish, skill.fedwiki.club, radio.myth.garden, neighbour vision wikis) and report what pages moved since last check. Use to monitor other people's wikis for changes, get a digest of new/updated/removed pages, add a site to the watchlist, or set up recurring monitoring. Read-only — never writes to any wiki.
---

# Wiki Watch 🛰️

A change monitor for the external FedWiki federation the agentprivacy work draws on as **sources**.
Every Smallest-Federated-Wiki site publishes `GET /system/sitemap.json` — a public, no-auth array of
`{slug, title, date, synopsis}` where `date` is each page's last-modified epoch-ms. This skill polls
that feed per site, diffs it against a stored snapshot, and reports what changed.

**Read-only.** Public GETs only — it never pushes, forks, or logs in, so no cookies are needed. It is
the *observe* counterpart to `agentprivacy-wiki-resync` (project) and the fedwiki-cohere-sync skill
(*write*). The live twin runs from `~/.claude/skills/fedwiki-watch/`.

## Files

- `roster.json` — the watchlist: `{name, url, group, owner}` per site. `owner:external` = other
  people's wikis (star-flagged, sorted first); `owner:mitch` = your own sites.
- `watch.mjs` — the runtime (zero dependencies, Node 18+ for global `fetch`).
- `state/<name>.json` — per-site snapshot; `state/last-run.json` — full last result.
- `reports/latest.md` + `reports/<timestamp>.md` — human digests.

## Run it

```
node watch.mjs                 # poll all sites, advance snapshots, write digest
node watch.mjs --json          # + machine summary to stdout (parse when driving as an agent)
node watch.mjs --external      # only owner:external sites (where alerts really matter)
node watch.mjs --site david.vision   # one site by name
node watch.mjs --dry           # detect + report, do NOT advance snapshots (safe preview)
node watch.mjs --detail        # also fetch each changed page's latest journal action
```

First run on any site **seeds a baseline** (records current state, flags nothing) — expected; the
second run onward is where changes surface.

## How to use the output

1. Run `node watch.mjs --json`, parse it. `totals` gives counts; `sites[]` carries `new[]`,
   `updated[]`, `removed[]`, `status`, `seeded`.
2. Summarise **external changes first** (david/max/henry, skill.fedwiki.club, radio.myth.garden,
   david.self.fish) — edits by others are the real signal.
3. To show *what* changed on a page, GET `<site.url>/<slug>.json` and read the tail of `.journal`
   (`--detail` does a light version automatically).

## Watchlist & scheduling

Edit `roster.json` to add/remove sites; discover neighbours from a roster site's
`welcome-visitors`/`recent-changes` page JSON. Not scheduled by default — run on demand, or wire
`/loop`, `/schedule`, or Windows Task Scheduler. The feed is public and read-only, so any cadence is
safe; hourly is plenty (these wikis move slowly). 21 seed sites verified live 2026-07-13.
