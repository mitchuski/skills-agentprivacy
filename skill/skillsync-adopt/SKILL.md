---
name: skillsync-adopt
description: Adopt and attest skills from the Skill Sync network — browse a garden's shelf or catalog, load a skill properly (card first, brief to decide, body on demand), fork the card as your countersignature, then record the adoption and later the attested run at the pi5 Librarian so trust points flow to the author. Use when a member or agent says "adopt this skill", "load skills from the network", "record that I'm using X's skill", "attest a run", or wants a working hand from someone else's garden.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-adopt

Adoption is the game. Discovery is passive; adopting turns another member's work into
your working hand — and into their credentials.

## 1. Load properly (density discipline)

1. `GET <garden>/assets/skillsync/catalog.json` — read CARDS only.
2. Prefer a deck/constellation over the whole shelf; load the BRIEFS for its names.
3. Pull a full body (`assets/skillsync/<name>/SKILL.md`) only when a task fires it.
Verify what you fetched: sha256 of the body must equal the packet's `hash`.

## 2. Countersign

Fork the skill's card page into your own farm. A fork is a countersignature — the
federation-native signal that you took the skill seriously enough to hold a copy.

## 3. Record at the Librarian

    POST http://pi5:4242/adopt   {"member":"you", "packet":"<name>", "from":"<author>"}
    POST http://pi5:4242/attest  {"member":"you", "packet":"<name>", "from":"<author>",
                                  "run":"one-line evidence ref"}

Adopt when you decide to keep it (author +3). Attest after it actually worked in a
real session (author +7) — the `run` ref should point at something checkable: a
chronicle slug, a session id, an artifact hash. Every entry is chain-sealed;
false claims are visible and refutable.

## Guardrails

- Never auto-adopt: an agent recommends, a member adopts.
- Adopt/attest are ATTRIBUTED writes — use your real network handle.
- Attesting your own skills scores nothing (by design). Walk someone else's shelf.
