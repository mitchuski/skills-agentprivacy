---
name: agentprivacy-chronicle-reflect
description: >
  Reflect chronicles between the suite's voices — the framework-voice master series,
  repo-local collaborator chronicles (e.g. dtgwg-zkp-mage/chronicles/), spellweb DREAM
  records (KG voice), cityofmages cargo-lap dreams, agentprivacy-docs family-B chronicles,
  and tome acts — one event, many tellings, same invariant core. Use when writing a new
  chronicle, publishing chronicles into a public repo for collaborators (with runtime-trace
  headers), running a dream-loop sync across the suite, adding a voice/destination, or
  auditing that a reflection still compresses back to its source. Encodes the type registry,
  the provenance-header format, the signed-before-public gate, path translation and leak
  scan, and the per-repo publication rules (pushes = the Keeper; dtgwg-zkp-mage pushes ride the
  G.1 proverb rite).
license: Apache-2.0
---

# Chronicle reflection — one event, many tellings, one invariant

A **chronicle** is the narrative working record of a significant day: what moved, in what
order, and why the ordering is the method. The suite keeps several chronicle *voices*, and a
chronicle travels between them by **reflection**: rewritten to match the destination's
register while compressing back to the same facts. The discipline is
[[understanding-compression]]'s: every re-expression must compress to the SAME invariant; a
divergence between a reflection and its source is a defect in the reflection, never a fork of
the record.

**Source of truth = the master series.** All other copies state their provenance and point
home.

## The type registry

| type | location | voice / register | notes |
|---|---|---|---|
| **master** | `~/agentprivacy_master/docs/chronicles/YYYY-MM-DD_slug.md` | framework voice; scope block; numbered sections; "Why this is interesting" bullets; closes `*Uncommitted, as ever — the First Person's read comes first.*` until signed | SOURCE OF TRUTH. Arc chronicles name one **inversion** each |
| **repo-local (collaborator)** | `<public repo>/chronicles/` (first instance: `~/dtgwg-cred-spec-main_mage/chronicles/` → github.com/mitchuski/dtgwg-zkp-mage) | body verbatim from master; **provenance header** + **runtime traces** prepended; paths repo-relative | the evidence-first public telling; see procedure below |
| **spellweb DREAM** | `~/spellweb/chronicles/DREAM-YYYY-MM-DD.md` | KG voice; node/edge framing; signature line (e.g. `⚔️📊⊥🧙🕸️\|😊`) | minted during dream loops |
| **cityofmages dream** | `~/cityofmages/` DREAM files | City cargo-lap ledger; workshop/tome vocabulary | City binding rules apply |
| **agentprivacy-docs** | `~/agentprivacy-docs/chronicles/` + INDEX.md row | family-B ROOT chronicles — canon vocab OK; NEVER the pipeline chronicles dir (that needs role/first-person approval + GR-4 register) | add the INDEX row |
| **tome act** | `~/cityofmages/tomes/` | act inscription; bound by the Keeper only | reflection PROPOSES, binding is human |
| **fedwiki/kb page** | via the repo's `tools/build-kb.mjs` manifest → `kb/` → dtg.localhost | KB carrier rules (manifest-first, secrets gate) | manifest the chronicle in build-kb.mjs, don't hand-copy |

## Gates (in order)

1. **Write master first.** No reflection precedes its source.
2. **First Person's read.** Master chronicles stay uncommitted until the Keeper reads them; the
   **signed** state (a signature line replacing/extending the closing italic) is required
   before a load-bearing chronicle reflects into a PUBLIC repo. Record signed-status honestly
   in the reflection header ("Signed by the First Person: yes / not yet").
3. **Leak scan before public.** Grep the reflected copies for: `C:\`, `Users\`, `~/`, tokens,
   cookies, `secret[:=]`, gate sigils/proverbs (Gatehouse tokens are secrets; G.1 rite
   proverbs are fresh-per-push challenges and are NOT secrets, but don't pre-publish an
   unserved one). The reflection script must FAIL CLOSED on any untranslated home path.
4. **Push = the Keeper.** Reflections land on disk; publication is his act. For `dtgwg-zkp-mage`
   the push additionally rides the **G.1 publication rite** (`registry/ACCEPTANCE-FLOW.md`):
   serve a fresh proverb naming what this push means → his spoken/typed activation opens the
   gate.

## Repo-local reflection procedure (the collaborator type)

Use a deterministic script (pattern: `reflect-chronicles.mjs` — see the 2026-08-14 worked
example in the dtgwg session records), not hand-copying:

1. **Select** the arc-relevant chronicles (for dtgwg-zkp-mage: the ZK-arc series only).
2. **Translate paths**, longest-first, home-dir → repo-relative, ONLY where the artefact
   exists in the destination repo; otherwise gloss (e.g. "the KG-voice dream record
   (maintainer's private suite)"). Throw on any surviving `~/`.
3. **Prepend the provenance header** after the title line:
   - what a chronicle is + voice + "master copy is the source of truth; adapted only in
     header and paths" + signed status;
   - **Runtime traces:** bullet list — the suites (`node test.mjs` tallies), registry
     entries, issues/discussions, and documents that carry this chronicle's claims. Traces
     are the point: a collaborator should be able to RUN the narrative.
4. **Index README** in `chronicles/`: what chronicles are (telling vs evidence), the arc
   table (date · chronicle · inversion · evidence spine), and a short description of this
   reflection system so the provenance is legible without the skill.
5. **Leak scan** (gate 3), then hand to the publication gate (gate 4).
6. If the repo has a KB/manifest system, note the new dir in its exclusion or manifest list
   deliberately — never let a manifest-first builder discover it as an unexplained surprise.

## Reflection INTO other voices (dream loops)

When the Keeper asks for a dream-loop sync: master → spellweb DREAM (retell as KG nodes/edges
minted, with signature line), → cityofmages (cargo lap: what the City's ledger gains),
→ agentprivacy-docs (family-B + INDEX row). Each retelling compresses back to the master's
facts — check by listing the master's load-bearing claims and finding each in the retelling.
Tome acts and City bindings are PROPOSED only. Subagents cannot write `~/.wiki` (main thread
only) — fedwiki projection goes through the repo's own KB tooling instead.

## Adding a destination type

Extend the type-registry table (here and in the repo README if collaborator-facing), define
its register in one line, state its gate (who approves, who pushes), and reflect ONE existing
chronicle as the worked example before batching.

## Worked example (first run, 2026-08-14)

Six ZK-arc masters (07-16 dream-cycle → 08-14 seat-follows-the-run) reflected into
`dtgwg-cred-spec-main_mage/chronicles/` + README index; only 08-14 was signed (recorded
honestly per-file); zero untranslated paths (script threw otherwise); leak scan clean;
published through the inaugural G.1 rite. The arc table's "inversion" column came straight
from the masters' own closing sections — the reflection invented nothing.
