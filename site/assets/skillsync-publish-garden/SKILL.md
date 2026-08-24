---
name: skillsync-publish-garden
description: Stand up your own skill garden and join the Skill Sync network — package your skills as neutral packets (card / brief / body), publish a skillsync catalog on your site or fedwiki farm, and get onto the roster so dream loops discover you and marvin announces your work. Use when a member says "publish my skills", "join skill sync", "set up my garden", "make my skills discoverable", or is bringing a new fedwiki farm universe of skills into the space.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-publish-garden

Publishing = putting a catalog where the roster can GET it. No registration, no push
access, no account. Full protocol: SPEC.md in the skill sync home.

## 1. Mint packets

One skill/spell/persona = one packet, three zoom levels:
- `card` (≤280 chars, MANDATORY — it's what a discovery notification carries)
- `brief` (≤1200 — enough to decide to load it)
- full body as an asset (`assets/skillsync/<name>/SKILL.md`), sha256-hashed

If your skills are SKILL.md files, the reference harvester does this mechanically
(`bin/harvest.js` — includes a leak scan and PII neutralization; run BOTH before
anything ships. A packet that names you everywhere will follow you everywhere).

## 2. Publish the catalog

Put `assets/skillsync/catalog.json` on any site you control:
`{ member, updated, count, packets: [cards...] }` — plus one forkable page per packet
if you're on a fedwiki (fork = countersignature; it's how adoption starts).

## 3. Join the roster

Ask any rostered member to add your garden: `{ member, url, owner: "external" }` in
their `skillsync.config.json`. Their next dream-loop pass baselines you silently;
after that, every new skill you publish notifies the network.

## Gotchas

- Cards travel far — write the trigger conditions into them, not just what it is.
- Never put credentials in bodies; the harvester's leak scan refuses, but write clean.
- Publishing volume scores 1 point per packet; the game is adoption (3) and attested
  use (7) — publish the skills that RAN, not everything you have.
