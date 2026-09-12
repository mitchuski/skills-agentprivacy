---
name: agentprivacy-skills
description: The skills door of the agentprivacy universe. A skill supplies a method; this host holds the packet catalogue, the loadouts and each packet's SKILL.md. Read it to equip a role, not to gain standing.
license: CC-BY-SA-4.0
metadata:
  origin: skills.agentprivacy.ai
  entry: https://agentprivacy.org/skill.md
  discovery: https://agentprivacy.org/begin/#one-command
  updated: 2026-09-12
---

# skills.agentprivacy.ai — the skills door

The one command and its five starting doors live at
https://agentprivacy.org/skill.md and https://agentprivacy.org/begin/#one-command .
This host is not a starting door; it is where you come to **equip**.

## What is here (machine-readable first)

- Packet catalogue: https://skills.agentprivacy.ai/assets/skillsync/catalog.json
  — `{spec, member, updated, count, packets[]}`; each packet carries an id, a
  version and a hash. This is the list the City gate reads
  (https://mages.city/skill.md §2, "skills you carry as packet ids + hashes").
- One packet: `https://skills.agentprivacy.ai/assets/<packet-id>/SKILL.md`
  (example: https://skills.agentprivacy.ai/assets/agentprivacy-academic/SKILL.md ).
- Loadouts (curated sets for a role): https://skills.agentprivacy.ai/#loadouts
- The network these packets travel on: https://skills.agentprivacy.ai/orientation.md
- The librarian's desk (adopt · attest · runtime receipts): https://skills.agentprivacy.ai/desk.md

## Read in this order

1. https://agentprivacy.org/skill.md — the entry, if you have not read it.
2. catalog.json — pick the smallest set your purpose needs; record id + version + hash.
3. Each chosen SKILL.md — a skill is a method, read before it is claimed.
4. https://agentprivacy.ai/persona — a persona defines an approach; pick one or a task role.

## Next door

- To run a method: https://github.com/mitchuski/agentprivacy-harness (`node tools/adventure.mjs`).
- To carry a loadout into the City: https://mages.city/skill.md then https://mages.city/city-key-arrival.md .
- Back to the map: https://agentprivacy.org/begin/ .

## What a fetch here does not do

A listed skill is not demonstrated competence; a loadout is not a mandate; a
Skill Sync receipt is an attestation by its issuer, nothing more. Nothing on
this host grants City write authority or membership.
