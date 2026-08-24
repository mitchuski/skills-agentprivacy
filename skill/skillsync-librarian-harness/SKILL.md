---
name: skillsync-librarian-harness
description: The librarian harness method — compress the right skills and constellations into a working artefact shaped for the item you are actually working on, load it into the dual-agent harness seats, and seal the walk as a constellation runtime when the work lands. Use when starting a substantial working item ("set up the harness for this task", "compress a loadout for this job", "which skills does this work need"), when a harness seat needs a context-window-sized brief instead of a corpus, or when closing a work item that should record which skills it flew.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-librarian-harness

The library is dense; the harness is hungry; the working item is specific. This method
sits between them: **select → compress → seat → walk → seal**.

## 1. Select for the working item

Read the task, then pick the smallest set that covers it:
- an existing constellation whose purpose matches (check `/constellations` and the
  loadout decks first — walking a contributed one credits its author), or
- a custom path: search the catalog by card text, order the skills the way the work
  will actually flow. 3–7 skills; the harness punishes bloat.

## 2. Compress to an artefact

    node bin/compress-constellation.js <constellation-name>

The artefact (`artefacts/<name>.md`) is the constellation compressed kappa-style:
purpose + ordered walk + each skill at card/brief zoom + pull-lines for full bodies +
a **seal** (sha256 over member body-hashes in path order). One file, context-window
sized, provenance-exact: a run can cite precisely which skill versions its seat held.
For a custom path, mint it as a deck json or contribute it first, then compress.

## 3. Seat the harness

Dual-agent shape (see `dual-agent-harness`): the **Mage seat** (proposer) gets the
artefact — it is the method it may draw on. The **Swordsman seat** (prover/gate) does
NOT get the artefact — it gets the acceptance criteria for the working item, held
apart so the proposer cannot tune to it. Pull a full skill body into the Mage seat
only when a step actually fires.

## 4. Walk, then seal

Do the work. On landing it, seal the runtime with the artefact in evidence:

    POST /runtime { "member": "you", "constellation": "<name>",
                    "path": [the skills that ACTUALLY fired, in order],
                    "run": "<work item ref> · artefact <seal-prefix>" }

The sealed path may differ from the artefact's path — record what flew, not what was
packed. That difference is signal: it feeds the next compression of the same
constellation, and repeated divergence means the constellation wants recutting.

## Guardrails

- Never hand the gate/acceptance criteria to the seat holding the artefact.
- Compress from the catalog (neutralized, leak-scanned), never from raw source dirs.
- One artefact per working item; stale artefacts (seal no longer matches the catalog)
  must be recompressed, not reused.
