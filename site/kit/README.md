# Skill Sync — a neutral home for sharing skills, spells, personas & agent files

**What this is.** The agentprivacy corpus (167 skills in `agentprivacy-skills-v5`, 21+
working skills in `~/.claude/skills`, chronicle skills, the dual-agent harness) is dense.
A fresh model — or a collaborator's agent on the tailnet — can't easily pick what to load.
Skill Sync gives every skill a **neutral packet** (card → brief → full body, three zoom
levels), a **shared fedwiki shelf** reachable over the tailnet and loadable onto the Pi4s,
a **dream loop** that discovers new skills across the public tailscale farms, **ntfy
notifications** from marvin when something new lands, and a **pi5 librarian** that takes
submissions and records adoptions — game-of-42 style: trust grows by use, credentials are
adoption receipts.

This directory is standalone and neutral on purpose (same posture as `~/vpk`): the
universe lore stays *inside* the packets; the envelope, protocol and shelf are plain.

## The pieces

| piece | file | what it does |
|---|---|---|
| Packet spec + protocol | `SPEC.md` | packet format, discovery/announce/adopt protocol, trust ladder |
| Config / roster | `skillsync.config.json` | sources, farm roster, marvin (ntfy), pi5 (librarian), member id |
| Harvest | `bin/harvest.js` | sources → `registry/packets/*.json` + `registry/catalog.json` |
| Shelf builder | `bin/build-wiki.js` | registry + loadouts → `~/.wiki/skillsync.localhost` fedwiki site + `club-export/` pages for skill.fedwiki.club |
| Dream loop | `bin/dreamloop.js` | one pass: poll roster farms, diff, log events, notify ntfy, refresh Recent Discoveries page |
| Librarian client | `bin/librarian-client.js` | submit / adopt / leaderboard against pi5 |
| Librarian server | `librarian/server.js` | zero-dep node service for pi5 (inbox, hash-chained adoption ledger, leaderboard) |
| Loadouts | `loadouts/*.json` | curated starter decks — the density fix for new models |
| FedWiki plugin | `plugin/wiki-plugin-skillsync/` | `skillsync` item type: shows catalog freshness + new-since-last-visit on any wiki page |
| Claude skill | `skill/skillsync-dreamloop/SKILL.md` | the dream loop as an agent skill (install: copy to `~/.claude/skills/`) |

## Run order (local, safe)

```powershell
node "bin/harvest.js"        # build the registry from the corpus
node "bin/build-wiki.js"     # project it into the local farm + club-export
node "bin/dreamloop.js"      # one discovery pass over the roster (read-only)
```

The farm serves `skillsync.localhost` once the wiki farm is running (port 3030).

## Machines & roles

- **this machine (mitchie)** — source of truth: harvest + shelf build + dream loop.
- **marvin (02-pi4)** — the herald. Runs [ntfy](https://ntfy.sh) (self-hosted); the dream
  loop POSTs to `http://02-pi4:2586/<topic>` when a new skill/spell appears anywhere on
  the roster. Install: see `librarian/README.md`.
- **pi5** — the librarian. Runs `librarian/server.js`: members submit packets, adopt each
  other's skills, and the leaderboard ranks by adoption (not publication). Pi write model
  follows the embassy canon where it can: adoption is a countersignature.
- **pi4s / embassies** — can carry a read-only copy of the shelf (fedwiki export or the
  static `catalog.json` + packets).

## Doors

1. **Tailnet lane — OPEN (2026-08-24, on Mitch's ask)**: `http://skills.mitch.private.fish`
   serves the shelf to the community over the existing :80 front door (alias added to
   `~/.wiki/_tailnet_proxy.js` ALIASES; allowlist re-verified — other hosts still refused).
   Agents point at `http://skills.mitch.private.fish/assets/skillsync/catalog.json`.
2. **skill.fedwiki.club** — `club-export/` holds forkable pages; pushing them into the
   club space (or asking David) is a keeper act. Nothing written externally.
3. **pi5 deploy** — `librarian/server.js` + README are ready; scp + systemd unit = Mitch.
4. **marvin ntfy install** — one docker/apt step on 02-pi4; config already points there.
5. **git** — this directory is not a repo yet; `git init` + any push = Mitch.
