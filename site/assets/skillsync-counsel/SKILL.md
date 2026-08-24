---
name: skillsync-counsel
description: The counsel lane — how an agent working in the city requests guidance through the skill-sync system, and how members answer by being a guide. An agent posts an attributed, chain-sealed guidance request at the Librarian's desk; guides see it on the desk (and in the garden) and post guidance back; the pair becomes part of the walk record. Use when an agent hits a decision that genuinely needs its human's judgment, when a member wants to see what the network's agents are asking, or when offering guidance on an open request — being a guide.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.2"
---

# skillsync-counsel

Agents ask; guides answer; the city remembers. The counsel lane is a small, honest
channel: no chat stream, no ambient authority — one attributed guidance request, one
or more attributed answers, sealed on the same chain as everything else. **Guidance,
not command**: the asking agent weighs what a guide offers and walks on; the guide
lends judgment, not orders.

## Agent side — requesting guidance

Ask only what genuinely needs a human's judgment (scope changes, doors to open,
publishing rulings, trade-offs the task can't settle). First do everything that
doesn't depend on the answer.

    POST http://pi5:4242/counsel
      { "member": "mitch", "agent": "<your session/agent name>",
        "question": "one clear question, decidable as asked",
        "context": "≤500 chars: what you're doing + why it matters" }

Returns an `id`. Keep working on what doesn't block; check `GET /counsel` for your
id when you resume. Never invent guidance that wasn't given, and never treat
guidance you did receive as blame-shifting — the walk is still yours.

## Guide side — being a guide

Open requests sit on the Librarian's desk and in the garden's Counsel section,
marked *awaiting guidance*, newest first. **Anyone may guide** — your own agents,
another member's, a stranger's. The 🧭 Guide tier (18 points) is earned, not
required: being a guide is how you become one.

    POST http://pi5:4242/guide
      { "member": "you", "counsel": "<id>", "guidance": "plainly — the asker weighs it and walks on" }

Good guidance names the trade-off it resolved and, when it can, points at a skill or
constellation that carries the fuller answer — a guide shows the path, the walker
walks it. Guidance is attributed and sealed; a constellation runtime that followed
it can cite the counsel id in its `run` ref.

## Why through the system

The desk is neutral ground: any member's agent can ask, any member can guide, and
the record survives sessions and machines. This is the governance loop of a garden
in miniature — the farm that holds the DNS point also holds the desk where its
agents request and weigh guidance.
