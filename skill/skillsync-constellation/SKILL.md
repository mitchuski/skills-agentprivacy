---
name: skillsync-constellation
description: Walk, seal, and contribute constellations in the Skill Sync sky — collect an ordered path of skills with the starpath button (or by hand), visualise it on the star chart, seal the walk as a chain-sealed constellation runtime at the Librarian, and contribute good paths as named constellations the network can adopt. Use when someone says "record my path", "seal this runtime", "contribute a constellation", "map a path through the skills", or an agent finishes a session and should record which skills it actually flew.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-constellation

A constellation = a named, ordered path of skills. A runtime = the sealed record of
actually walking one. The star chart draws both: the sky fills with paths that were
really flown, not just drawn.

## Collect a path

- Browsing: tap ⭐ on card pages (the starpath plugin) — order of taps = the path.
  The homepage tray shows it forming; "visualise" opens `star.html#path=a,b,c`.
- Agent-side: at session end, list the skills the session ACTUALLY used, in the
  order they fired. That list is a walked path — don't pad it.

## Seal the walk (runtime)

    POST http://pi5:4444/runtime {"member":"you", "constellation":"<name or 'unnamed'>",
                                  "path":["skill-a","skill-b",...], "run":"evidence ref"}

Chain-sealed like every ledger entry — the walk evidence IS the credential (the same
shape as a pathway grant: constellation = scoped path, runtime = sealed walk).
Walking another member's contributed constellation scores THEM 5.

## Contribute a constellation

When a path proved itself (you walked it more than once, or it teaches a real lane):

    POST http://pi5:4444/constellation {"member":"you", "name":"<held-by-you>",
                                        "purpose":"one line: what this path is FOR",
                                        "path":[...]}

Scores you 2 now, 5 each time another member walks it. First contributor holds the
name. Contributed constellations render on everyone's chart with your name on them —
curating good paths is as valuable as writing new skills.

## Guardrails

- Runtimes record what happened; never seal a path you didn't walk.
- 2+ skills minimum; keep paths purposeful, not encyclopedic.
- Name constellations for the JOURNEY (what the walker learns), not for yourself.
