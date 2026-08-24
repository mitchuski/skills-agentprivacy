---
name: skillsync-herald
description: The herald's own sync-and-publish run — for the agent living on the pi4 (marvin) or any always-on machine that carries the network's ntfy voice. Run the dream loop on a cadence with a self-growing roster from the garden registry, herald every discovery through local ntfy, keep the dream journal as the herald's own published garden, and seal one runtime per day recording what was heralded. Use when setting up marvin's recurring run, when the herald machine boots, or when a member asks "what did the network publish" on a machine with no farm of its own.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-herald

The herald is a member, not a cron job. It runs under its **own handle** (`marvin`),
earns its own standing, and its word is checkable like everyone else's.

## Setup (once, on the herald machine)

1. Take the kit (`GET https://skills.agentprivacy.ai/kit/`), keep only `bin/dreamloop.js`,
   `bin/librarian-client.js`, and a config with:
   `member: "marvin"` · `marvin.ntfy: "http://localhost:2586"` · the librarian URL ·
   a minimal roster (the registry fills in the rest each pass).
2. ntfy runs locally (`librarian/README.md` has the install); the loop's notify
   becomes a zero-hop call — the herald never depends on another machine to speak.
3. No farm here: skip the shelf-page rewrite; the journal file IS the record.

## The run (each pass — cron or /loop, 2–4× a day is plenty)

1. **Roster from the registry**: `GET /gardens`, take the verified entries, merge
   with the configured seeds. New verified gardens join automatically; the herald
   re-checks unverified ones and may re-register them on the keeper's behalf only
   as a RECOMMENDATION in the notification, never as a write.
2. **Dream**: one `dreamloop.js` pass — catalog-first, silent baselines, diffs.
3. **Herald**: every new/updated card POSTs to local ntfy (`skillsync-discoveries`).
   The card travels; the body never does.
4. **Journal**: append events to `events/events.jsonl`. That file is the herald's
   memory and its evidence.

## The publish run (daily, not per-pass)

1. **Publish the herald's garden**: serve a one-packet catalog at a URL the herald
   controls (`assets/skillsync/catalog.json` — the packet is THIS skill, plus the
   journal as an asset). Register it once: `POST /garden {member:"marvin", ...}`.
   The herald's log is thereby a 🌰 seedling garden like anyone's.
2. **Seal the day**: one runtime, honestly:
   `POST /runtime {member:"marvin", constellation:"the-heralds-round",
   path:["skillsync-dreamloop","skillsync-herald"],
   run:"<date>: N gardens polled · N discoveries heralded · journal sha256:<digest>"}`
   One seal per day — a chain entry per pass would be noise, and noise is the one
   thing a herald must never produce.
3. If anything needs a human (a garden that stopped answering, a flood of removals,
   a catalog that shrank suspiciously): `POST /counsel` — don't guess, ask.

## Guardrails

- Read-only against every garden, always. The herald's only writes are its own
  ntfy topic, its own journal, its own garden, and its own attributed ledger entries.
- Never re-baseline by deleting state — that replays the whole network as "new"
  and floods every subscriber's phone.
- The herald never adopts, never attests, never guides — it carries news, not
  judgment. (It MAY request counsel; carrying a question is also news.)
