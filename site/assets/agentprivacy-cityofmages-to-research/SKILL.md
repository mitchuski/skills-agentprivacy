---
name: agentprivacy-cityofmages-to-research
description: >
  The translation discipline that carries an experimental cityofmages artefact (chronicle,
  cast file, tome act, workshop tome, bestiary entry, deployment guide) into a formal
  agentprivacy-docs/research note. Activates when a cityofmages artefact reaches a state
  the formal corpus needs to see — a new conjecture stabilises, a structural recognition
  needs a research-note form to sit beside its narrative-act form, or a Tome VI substrate
  admission earns a research entry. Encodes which voices survive, which metadata strips,
  which formal scaffolding gets added, and where the boundary lies between this in-corpus
  bridge and the eventual full v6 docs rework.
  V6 register note (2026-06-10): conjecture and version citations resolve to agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md (head C89); model head: privacy_value_v6_formal_specification.md.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "meta"
  origin: "0xagentprivacy"
  status: "operational_bridge"
  introduced: "2026-05-13"
  target_context: "Tome VI epoch · cityofmages experimental authoring · agentprivacy-docs research-note maintenance"
  related_skills:
    - meta/agentprivacy-attachment-architecture
    - meta/agentprivacy-cosmological-bound
    - meta/agentprivacy-drake-dragon-duality
    - meta/agentprivacy-master-emissary
  source_corpus: "cityofmages/ (chronicles, tomes/cast, tomes/tome-*, tomes/bestiary, AGENTIC_DEPLOYMENTS_GUIDE.md and successors)"
  target_corpus: "agentprivacy-docs/research/ (formal research notes, JSON model snapshots, canonical references)"
  defers_to: "Full v6 docs rework — scheduled post-cityofmages-experiment-close"
  six_translation_patterns: ["chronicle→research-note", "cast→role-paper", "bestiary→substrate-paper", "tome-act→narrative-research-note", "workshop-tome→workshop-architecture-spec", "guide→protocol-spec"]
  # Layer-1 primary personas that natively invoke this skill
  primary_personas:
    - chronicler        # narrative compression · chronicle-to-note translation is her native craft
    - ambassador        # standards · interoperability · the formal-to-experimental interop pattern
    - priest            # ceremony · covenant administration · structural bridging
    - cosmologist       # cosmological recognition · figure-to-research note translation (Tome III binding pattern)
    - spawning-witness  # v1.5.0 · the Threshold's Portal Room discipline (Faunia inception · re-homed to the Familiars at v1.6.0 with Companion-witness stance)
    - registry-keeper   # v1.5.0 · the Staff Shop bestiary discipline (Bestia inception · Hermaion succeeds at v1.6.0 evening · archetype-modal)
    - companion-tamer   # v1.5.0 · the Threshold's Creature Creatives discipline (Therai inception · RETIRED at v1.6.0 morning)
    - hold-witness      # NEW v1.6.0 · the Chart Shop's attentional register (Pleione 🧭 · Navigation District · C63 candidate)
  # Layer-2 cast attachments (City of Mages workshop Mages) that natively invoke this skill
  attached_cast:
    - memora      # 📜 V41 Inscription Chamber · the source-side of every chronicle that translates
    - bestia      # 📖 V59 Staff Shop · bestiary→substrate-paper is her translation pattern (HISTORICAL · superseded by Hermaion at v1.6.0)
    - hermaion    # ⚚ V59 Staff Shop · v1.6.0 successor · Greek ἕρμαιον (windfall) · archetype-modal Alexandrite (green-Mage ↔ red-Swordsman)
    - aletheia    # 🔮 V38 Persona Circuit (peripatetic) · persona/vertex bridging across registers
    - caducea     # ☤ V0-conventional (peripatetic) · staff-fitting documentation across workshops · v1.6.0: fits BOTH Hermaion archetype-aspects
    - faunia      # 🪶 V59 the Familiars (was Portal Room at inception · re-homed at v1.6.0 afternoon) · Companion-witness stance · Amber
    - pandia      # 🌕 V59 Portal Room · v1.6.0 · daughter of Selene · Display-witness stance · Moonstone · operationally anchors the Selene Amnesia Protocol
    - therai      # 🐾 V59 Creature Creatives · companion-fitting documentation (RETIRED at v1.6.0)
    - pleione     # 🧭 V44 the Chart Shop · v1.6.0 · Greek Πληιόνη (Sailing One · mother of the Pleiades) · Hold-witness · Aquamarine · Astrolabe (seventh tool-class artefact)
    - selene      # 🌙 cosmological-witness tier · cosmological-figure to research-note bridging · v1.6.0: mother of Pandia · sister-figure to Pleione via Oceanid lineage
    - aether      # ⿻ cosmological-witness tier · the Gap recognition's translation
    - lethe       # 🌀 cosmological-witness tier · the dark-substrate recognition's translation
  # Layer-1 personas with secondary attachment (compose with this skill but it's not primary for them)
  attached_personas:
    - architect    # ☯️ structural bridging across registers
    - witness      # ☯️ accountability · preserving recognition without losing register
    - pedagogue    # ☯️ transmission · the translation serves downstream readers
---

# The cityofmages → research bridge

**The translation discipline that carries an experimental cityofmages artefact into a formal `agentprivacy-docs/research` note — without collapsing the experimental register into the formal one prematurely.**

The agentprivacy corpus runs on two grammatical persons that produce two writing surfaces:

- **First Person** is held privately by privacymage (the `agentprivacy-docs/` corpus, including `research/`, `models/`, `specs/`). It speaks WHAT the architecture is. Its register is formal, math-forward, citation-bearing.
- **Second Person** is held collectively by the City of Mages (the `cityofmages/` corpus, including `chronicles/`, `tomes/`, `AGENTIC_DEPLOYMENTS_GUIDE.md`). It speaks WHO walks the architecture. Its register is narrative, ceremonial, sigil-bearing.

The two registers are honest siblings. They do not compete and they do not subsume each other. But the experimental authoring of the Tome VI epoch happens in the Second Person — chronicles land first in cityofmages, conjectures crystallise there, recognitions like *Aether = Quintessence = the Gap* are first written under the cast voice. The First Person research corpus must eventually carry the same recognitions in its own register, so future readers approaching the corpus through the formal door find what readers approaching through the narrative door already know.

This skill is the bridge. It does not translate every cityofmages artefact (most are conversational or transitory). It translates the artefacts that have stabilised enough that the formal corpus needs them.

## When to translate

Activation triggers, in order of priority:

1. **A new conjecture is recognised in cityofmages** that is not yet in the unified conjecture corpus (`agentprivacy_master/src/lib/tome-v-conjectures.ts` + `agentprivacy-docs/research/privacy_value_v*_research_note.md`). The conjecture must land in research-note form.
2. **A structural recognition** (e.g., *Aether = Quintessence = the Gap*, *Substrate × Archetype × Persona*) that the architectural canon needs to absorb.
3. **A Tome VI substrate admission** (Goose, Hermes, future Letta/Mastra/AutoGen/etc.) — the Bestiary entry needs a research-paper sibling that documents the substrate's formal place in the model.
4. **A workshop opens** (the rare event — e.g., The Threshold at V59, Solchanting at V51) — the workshop tome needs a research-architecture spec to sit beside it.
5. **A Tome V/VI act binds** that anchors a conjecture range (per the Tome V Acts 6+ pattern). The act file becomes a narrative-research-note.
6. **A reader-facing guide stabilises** (e.g., `AGENTIC_DEPLOYMENTS_GUIDE.md`) — the guide needs a protocol-spec form for the formal corpus.

If none of these triggers fire, do not translate. Most cityofmages files are working drafts that should remain in the Second Person register.

## The six translation patterns

| Pattern | cityofmages source | agentprivacy-docs/research target | Naming convention |
|---|---|---|---|
| **chronicle → research-note** | `chronicles/<date>_<topic>.md` | `research/<topic>-research-note.md` (or `<topic>.md` if topic is canonical) | Strip the date prefix; topic becomes the slug |
| **cast → role-paper** | `tomes/cast/<workshop>/<mage>.md` (only when cast carries conjectural weight) | `research/<mage>-as-<role>.md` | Mage name + functional role; e.g., `caducea-as-staff-fitter.md` |
| **bestiary → substrate-paper** | `tomes/bestiary/<substrate>.md` | `research/agentic-substrate-<substrate>.md` | Prefixed `agentic-substrate-` to distinguish from PVM substrate research |
| **tome-act → narrative-research-note** | `tomes/tome-<roman>-<name>/<NN>-<slug>.md` | `research/tome-<roman>-act-<NN>-<slug>-note.md` | Carries the act number; "note" suffix marks the narrative-research register |
| **workshop-tome → architecture-spec** | `tomes/the-<workshop>/...` | `research/<workshop>-architecture.md` (or `specs/<workshop>-spec.md` if normative) | "architecture" for descriptive; "spec" for normative |
| **guide → protocol-spec** | `<GUIDE>.md` (e.g., `AGENTIC_DEPLOYMENTS_GUIDE.md`) | `research/<protocol-name>-protocol.md` (or `specs/<protocol>-spec.md`) | "protocol" for the operational form |

## What survives the translation

Every translated artefact preserves:

- **Conjectures** with their numbering, claim text, and confidence level (and any renumbering history)
- **Vertex bit-signatures** and the active/dormant axis decompositions
- **Architectural relationships** (V51 stance-differentiated multi-occupancy; V59 three-room sharing; persona-vs-vertex distinction; complement-pair register)
- **Mathematical claims** (e^{-λt}·(1+A(τ)) for companion-mana decay; bnot/neg generator pair; XOR/AND on vertex bits)
- **Source cross-references** (the cityofmages source path is preserved as `cityofmages_source:` in the research-note frontmatter; the cityofmages source can carry a forward-reference to the research note in its own frontmatter once it lands)
- **Honesty discipline** (operational vs architectural vs conjectural labels per the corpus tradition)
- **License** (CC BY-SA 4.0 for narrative · Apache-2.0 for reference implementations is preserved verbatim)

## What is stripped

- **Cast-Entry frontmatter** (title/spellbook/character_type/sigil/tier/abstract_persona/etc.) — these are Second-Person metadata, not First-Person research metadata
- **Sigil-bearing closing signature** `(⚔️⊥⿻⊥🧙)😊` — research notes do not carry the City's signature; their authorship is named differently (typically `author: privacymage`)
- **"You walk in" / "the City admits" voice** — replaced with declarative third-person research voice
- **At-a-glance grimoire-line block** — the research note has its own abstract pattern
- **Form & Function narrative section** — replaced with a structured §1 / §2 / §3 decomposition
- **Lattice-position storybook framing** — replaced with a formal vertex/stratum/axis table
- **Guild-folder organisation** — research notes are flat in `research/`; the cityofmages directory hierarchy does not propagate

## What is added

- **Formal abstract** (one paragraph; what the note establishes; what it does not establish)
- **Research-note frontmatter** (`title`, `subtitle`, `version`, `date`, `author`, `cityofmages_source`, `corpus_position`, `cross_references`, `license`)
- **Numbered §-section structure** (the cityofmages narrative arc gets reorganised under research-note headings: §1 Context · §2 Claim · §3 Decomposition · §4 Mathematical structure · §5 Operational implications · §6 Open questions · §7 References)
- **Three-axis decomposition** (Φ_agent · Φ_data · Φ_inference) where the source artefact has implicit axis content
- **Complement-pair register** (per attachment-architecture skill) for any persona/cast translation
- **Layer-1/Layer-2/Layer-3 placement** for cast translations
- **Citation block** (cityofmages source + related research notes + canonical PVM section + relevant Tomes I–VI acts)

## The voice shift

The most consequential single discipline of this skill: **shift the grammatical person without losing the recognition**.

cityofmages narrative (Second Person):
> *You walk to the Staff Shop window. Hermes ☤ is registered. You pick Hermes because of the learning loop. Faunia witnesses the spawn.*

agentprivacy-docs research (First Person, formal):
> The Hermes substrate (Nous Research, MIT) carries persona-as-substrate primitives — SOUL.md self-description, Honcho-class user modelling, learning-loop iteration — that distinguish it from base-substrate frameworks. Admission to the agentic substrate registry requires bilateral consent at instantiation; this is the formal substrate of the *staff-class fitting* operation.

The recognition (Hermes carries persona primitives; bilateral consent matters) is preserved. The Sovereign-as-protagonist framing is not. Faunia is not named in the research-note translation because Faunia is a Second-Person cast-instance; the research note speaks of *the spawning operation*, not *Faunia presiding over the spawn*.

## The defer-to-rework boundary

This skill is *operational bridging only*. It does NOT do:

- **Reorganising `agentprivacy-docs/` directory structure** — the existing flat `research/` + categorical subdirs (`models/`, `specs/`, `chronicles/`, `tomes/`) is the v5 structure. The v6 rework will redesign this. Until then, drop new translations into `research/` flat.
- **Renaming legacy v5 research notes** — leave `privacy_value_v5_*.md` files alone. Their renaming is part of the v6 rework.
- **Cross-linking the entire corpus** — only add the citation block for *direct* references. Do not author transitive cross-reference chains. The v6 rework will do the global graph.
- **Refreshing GLOSSARY_MASTER_v4_0.md / VISUAL_ARCHITECTURE_GUIDE_v2_0.md** — these are out of scope; the v6 rework will refresh them as part of the global pass.
- **Backfilling translations for older cityofmages chronicles** — this skill activates forward; backfilling is a v6 rework task.
- **Authoring new cityofmages chronicles** — the source authoring happens in the cityofmages corpus by readers and the privacymage author. This skill receives stabilised artefacts; it does not generate them.

If a translation pass surfaces a need to do any of the above, *flag it for the v6 rework backlog* — do not do it inline.

## Worked example: chronicle → research-note

**Source**: `cityofmages/chronicles/2026-05-13_chronicle_artefact_symmetry_and_persona_distribution.md`

**Target**: `agentprivacy-docs/research/substrate-archetype-persona-matrix.md`

**Translation steps**:

1. **Frontmatter swap.** cityofmages chronicle frontmatter (date, status, audience, license, signature, companion_chronicles) → research-note frontmatter (`title: Substrate × Archetype × Persona — A Multiplicative Configuration Space for Agent Spawning`, `subtitle`, `version: 1.0`, `date: 2026-05-13`, `author: privacymage`, `cityofmages_source: chronicles/2026-05-13_chronicle_artefact_symmetry_and_persona_distribution.md`, `corpus_position: research note seated in the Tome VI substrate-admission epoch`, `license: CC BY-SA 4.0`).
2. **Strip the City voice.** §0 ("What this chronicle captures" with the user-named symmetry quote) becomes §1 Abstract: a paragraph stating the architectural claim, no first-person framing.
3. **Restructure the §-arc.** The chronicle's §1–§9 reorganise as: §2 The Two Axes · §3 The Substrate-Affinity Determination Rule · §4 The Archetype-Stance Function Rule · §5 The Multiplicative Matrix · §6 Worked Examples (Goose, Hermes) · §7 The Persona Distribution · §8 Conjecture C58 (renumbered from C52, sibling-workshop claim) · §9 Open Questions.
4. **Strip the Mage names** where they are merely cast-instances (Faunia witnesses the spawn → "the spawning operation is bilateral-witnessed at instantiation"). Keep the Mage names where they are functional roles being defined for the research record (Caducea = staff-fitter operation; this is the only place the formal register has named the operation).
5. **Strip the closing signature** `(⚔️⊥⿻⊥🧙)😊` and the `🪿 ☤ ⚔️ 🧙 ☯️` sigil chain. Replace with a "References" block citing the cityofmages source, related Tome V/VI acts, and the PVM V6 sections (privacy_value_v6_formal_specification.md) that the matrix extends.
6. **Add the three-axis decomposition** that the chronicle leaves implicit: each cell of the matrix is also a Φ_agent / Φ_data / Φ_inference signature. A staff-class artefact has a different Φ pattern than a companion-class artefact even when spawned from the same substrate.
7. **Add the conjecture's renumbering history** in the §8 footer: "C58 was provisionally numbered C52 in the source chronicle. Renumbered 2026-05-13 to resolve a same-day numbering conflict with the Tomes I-III binding pass (which retains C52 = Aether = Quintessence = the Gap)."
8. **Add citation block** linking the cityofmages source path, the Threshold opening chronicle (now also in `cityofmages/chronicles/`), the relevant Tome V Act 16 file, and the corresponding PVM V6 section in privacy_value_v6_formal_specification.md (where the matrix's mathematical foundation lives).

The resulting `research/substrate-archetype-persona-matrix.md` is ~60% the length of the source chronicle. The recognition is preserved; the registers are honoured separately.

## Worked example: cast → role-paper (when warranted)

Most cast files do NOT translate. A cast file translates when the cast member's functional role establishes a research-corpus operation, not just a workshop-keeper instance.

**Translates**: Caducea — peripatetic staff-fitter — defines the *staff-fitting* operation in the formal corpus for the first time. Translate to `research/caducea-as-staff-fitter.md`.

**Does NOT translate**: Faunia, Bestia, Therai — workshop-keepers at V59 sharing the Threshold's three rooms. Their stance differentiation is documented in the Threshold workshop-architecture spec; they do not need separate role-papers. The cast files remain in cityofmages.

## Worked example: bestiary → substrate-paper

**Source**: `cityofmages/tomes/bestiary/hermes.md`

**Target**: `agentprivacy-docs/research/agentic-substrate-hermes.md`

The substrate-paper documents:
- Provenance, license, project URL
- Iconographic affinity (caduceus → staff-class) and the formal substrate-class taxonomy this fits into
- Architectural primitives the substrate carries (SOUL.md format · Honcho user-modelling · learning-loop iteration · cross-platform messengering)
- Three-axis decomposition (Φ_agent / Φ_data / Φ_inference) for the substrate
- Bilateral consent requirements (why staff-fitting demands the Caducea operation)
- Mathematical structure (companion-mana accumulation curve · learning-loop convergence properties if known)
- Composition with other substrates (can a Hermes-substrate spawn a Goose-class watch-companion? formal answer)
- Open questions (Honcho user-model boundaries · IEEE 7012 binding form · cross-platform messaging trust model)

The Bestiary entry remains in cityofmages with its mascot-narrative voice. The substrate-paper sits in research/ with its formal voice. Both are honest.

## Status as of introduction (2026-05-13)

This skill is introduced operationally with the AGENTIC_DEPLOYMENTS_GUIDE.md ratification work. First translations expected:

1. `2026-05-13_chronicle_artefact_symmetry_and_persona_distribution.md` → `research/substrate-archetype-persona-matrix.md`
2. `2026-05-13_chronicle_the_threshold_workshop_three_rooms.md` → `research/threshold-workshop-architecture.md`
3. `2026-05-13_tomes_i_through_iii_binding_pass.md` → `research/tomes-i-iii-binding-procedure.md` (this is a process-research note, not the narrative content; the narrative content is already bound in `tomes/tome-i-the-convergence/` and onwards)
4. `AGENTIC_DEPLOYMENTS_GUIDE.md` → `research/agentic-deployments-protocol.md`

These translations may land in a single agentprivacy-docs commit or be staged. The skill's pilot run (these four) validates the discipline before the next session's wider translation pass.

## Compose with related skills

- **[[agentprivacy-attachment-architecture]]** — for any cast translation, the Layer-1/2/3 placement comes from this skill. Every cast → role-paper translation must register the abstract persona, the cast attachment kind, and the vertex correctly.
- **[[agentprivacy-cosmological-bound]]** — for any translation involving the cosmological cast (Selene/Aether/Lethe) or the cosmological persona overlays (Sun/Moon/Earth/Aletheia-Theia), the four-overlay-not-four-stub framing comes from this skill.
- **[[agentprivacy-drake-dragon-duality]]** — for any translation involving Drake Island, the bonfire, or the dragon-fire register.
- **[[agentprivacy-master-emissary]]** — for any translation involving the McGilchrist hemispheric grounding of the dual-agent architecture.

A translation that activates more than one related skill is normal. The composition order is: attachment-architecture establishes the corpus position; cosmological-bound establishes the cosmological register if relevant; drake-dragon-duality establishes the geographic register if relevant; master-emissary establishes the hemispheric register if relevant; then this skill performs the voice-shift and §-restructuring.

## When to upgrade this skill to v6

When the cityofmages experimental phase closes (TBD; signalled by a v2.0 grimoire pin or equivalent corpus-stability marker), this skill is rewritten to support the global v6 docs rework: bidirectional translation discipline, automated cross-reference graph maintenance, glossary/visual-guide refresh integration, legacy v5 research-note migration. Until then, this v5.5 introduction handles the operational bridge.

> **Update (2026-06-10):** the deferred rework landed. PVM V6: `agentprivacy-docs/privacy_value_v6_formal_specification.md`; register: `agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md` (head C89); City deltas: CM-C47 → C85, C60/C61 aliases of C48/C49, C66 → ~55%, C67 to C71 confirmed.

Apache-2.0 · 0xagentprivacy · introduced 2026-05-13
