---
name: skillsync-dreamloop
description: Run the Skill Sync dream loop — discover new skills/spells/personas published across the tailnet fedwiki farms and the fedwiki.club roster, notify via marvin's ntfy, refresh the Recent Discoveries shelf page, and (when asked) recommend discoveries for adoption or record adoptions with the pi5 librarian. Use when the user says "run the dream loop", "any new skills on the farms?", "check the skill roster", "what did the network publish", or wants recurring skill discovery (pair with /loop). Read-only against every remote farm.
---

# skillsync-dreamloop

The agent side of the Skill Sync system at `~\skill sync\` (see its
`README.md` and `SPEC.md` for the protocol). One dream = one pass:

    cd "~\skill sync"
    node bin/dreamloop.js          # poll roster -> diff -> events -> ntfy -> shelf page

## What a pass does

1. Reads `skillsync.config.json` (roster of farms, marvin/ntfy, pi5/librarian).
2. For each roster member, GETs `assets/skillsync/catalog.json` (machine door) or
   falls back to `system/sitemap.json` filtered to skill-shaped slugs.
3. Diffs against `state/<member>.json`. First sight of a member = silent baseline.
4. Appends `new-skill` / `updated-skill` / `removed` events to `events/events.jsonl`,
   POSTs new/updated cards to ntfy at `marvin.ntfy`/`marvin.topic` (best-effort — an
   unreachable marvin is recorded per-event, never fatal).
5. Rewrites the `Recent Discoveries` page on `skillsync.localhost`.

## Dreaming (the agent layer on top)

After the mechanical pass, ACT on what surfaced:

- **Report** the pass table (member → via/rows/events) and any events, with cards.
- **Recommend, never auto-adopt**: if a discovery matches current work (check the
  event card against what the user has been doing), suggest it — adoption is the
  user's move: `node bin/librarian-client.js adopt <name> --from <author>`.
- If the farm at :3030 is down, pages can't refresh — start it via
  `~/.wiki/_tailnet_share.ps1` conventions (wiki.cmd --farm --port 3030) and rerun.
- To watch continuously, run `/loop` around this skill on a 20–30 min cadence, or
  slower — the farms move at human speed.

## Guardrails

- READ-ONLY against every remote farm. Writes touch only: local `state/`, `events/`,
  the local shelf page, ntfy POSTs, and the librarian when the user asks.
- Never re-baseline by deleting `state/` files casually — that replays every packet
  as "new" and floods ntfy subscribers.
- New roster members: add to `skillsync.config.json → roster` (owner: "external"),
  run once for the silent baseline.
