---
name: agentprivacy-cryptographic-durability
description: >
  The post-quantum migration frame: how to reason about a primitive's durability — the
  time-distance to the quantum dawn — without overclaiming. Activates when discussing PQC
  migration timelines, Mosca's inequality, harvest-now-decrypt-later, quantum resource
  estimation (Toffoli × qubits, ecdsa.fail), crypto-agility, or whether a key/curve/protocol
  is "safe." Carries the honest framing: resource estimation is a durability signal, not an
  attack, and nothing is "fully post-quantum safe." In the City of Mages this is the Horizon
  District's knowledge (Eos 🌅 · Dokimé 🪨 · Poros 🛤️).
  V6 register note (2026-06-10): conjecture and version citations resolve to
  agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md (head C89); model head:
  privacy_value_v6_formal_specification.md.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "role"
  origin: "0xagentprivacy"
  status: "working_paper"
  introduced: "2026-06-09"
  target_context: "PQC migration planning, durability assessment, quantum threat-modelling, resource-estimate interpretation"
  equation_term: "the e^(−λt) decay term of V(π,t) read as a quantum-horizon time-constant for cryptographic π; Mosca's X + Y > Z"
  proverb: "The dawn is not an attack; it is a time you can measure."
  spell: "🌅 measure → 🪨 assay → 🛤️ cross"
  related_skills:
    - role/agentprivacy-quantum-defence
    - persona/agentprivacy-quantum-sentinel
    - role/agentprivacy-threat-adversarial
    - meta/agentprivacy-horizon-gate
    - meta/agentprivacy-lattice-coherence
  city_of_mages: "the Horizon District (V35) — Eos 🌅 Horizon-witness · Dokimé 🪨 Assay-witness · Poros 🛤️ Migration-witness"
  honest_framing: "Resource estimation is a durability signal, not an attack. No claim that ECDSA is practically broken; no claim that any system is fully post-quantum safe."
---

# Cryptographic Durability

**How long until the dawn — and how to stay crossable when it comes.**

> "The dawn is not an attack; it is a time you can measure."

**Spell:** `🌅 measure → 🪨 assay → 🛤️ cross`

---

## 1. The frame: durability is a measurement, not a verdict

A quantum resource estimate (e.g. ecdsa.fail: the cheapest reversible circuit for one secp256k1
point-addition, scored Toffoli × peak-qubits) is **not a capability and not a weapon.** It is a
*measurement of durability* — a sharper read on the time-distance to the dawn that breaks a primitive.
Sharpening it shortens uncertainty, not security. When asked "is this curve/key/protocol safe?", never
answer with a binary; answer with a **horizon and its error bars**, and refuse both false comfort and
false alarm.

**Never claim** a primitive is "broken," that an attack is practical today, or that anything is "fully
post-quantum safe." Keep roles distinct: ecdsa.fail / Eigen Labs (the arena) · Google Quantum AI (cost
targets) · Schrottenloher & Proos–Zalka (circuits) · SigmaPrime (review) · Michele Mosca (the inequality).

## 2. The reckoning: Mosca's inequality

`X + Y > Z` ⟶ **already lost.**
- **X** = how long the secret must stay confidential (shelf-life).
- **Y** = how long migration takes (inventory → cross → re-key).
- **Z** = time until a cryptographically-relevant quantum machine arrives.

If `X + Y > Z`, you are already late — the secret you are protecting now will still need protecting when
the machine arrives, and you will not have finished migrating. This is the durability question made
arithmetic. The **harvest-now-decrypt-later** adversary is the X-side made concrete: data captured today
is decrypted when Z arrives, so confidentiality with a long shelf-life is already exposed.

## 3. Fast-clock vs slow-clock (the threat is not monolithic)

- **Fast-clock** machines (error correction in microseconds) threaten **on-spend / in-flight** secrets —
  derive a key while a transaction sits in the mempool.
- **Slow-clock** machines threaten only **at-rest** secrets — public keys exposed on a ledger for years
  (dormant wallets, reused addresses). The mitigation differs: at-rest exposure wants *don't reuse /
  don't expose*, in-flight wants *short windows + PQC signatures*.

## 4. Crypto-agility done right (the path, not the wall)

Durability is set not by a primitive's current strength but by the ability to **re-key to a
post-quantum successor before `Z < X + Y`** (C70). Crypto-agility is *not* swapping one algorithm for
another — it is keeping trust continuous while everything underneath changes. The trust graph uses its
primitives the way a river uses its banks. Practical posture: hybrid encapsulation (a PQC KEM wrapped
around a classical one) buys time; the migration is admitted only when **every dependent has actually
crossed** — no silent stragglers.

## 5. Conjecture anchors

- **C61** (alias of C49, register lock 2026-06-10) Behavioural Mosca (the inequality at behavioural-data scale) · **C67** Cryptographic Mosca for
  the Substrate (extends C61 to the cryptographic primitive itself).
- **C60** (alias of C48) Reconstruct-Later / harvest-now-decrypt-later · **C13** bilateral witness as a quantum-resistant
  primitive.
- **C68** the resource-estimate as durability signal (not attack) · **C70** crypto-agility as migration
  readiness · **C69** the held-out gate (see `meta/agentprivacy-horizon-gate`).

## 6. Decision patterns

- **"Is X safe?"** → give a horizon with error bars (Mosca X+Y>Z), not a yes/no. Name fast/slow-clock.
- **Planning a migration?** → inventory dependents, choose PQC successors, sequence re-keying, verify no
  stragglers; report Y honestly.
- **Reading a resource estimate?** → it shortens the *estimate's* uncertainty, not the system's security.
  Treat a 2× saving as a 2× sharper horizon, nothing more.
- **Tempted to alarm or reassure?** → do neither beyond what the witnesses support.

*Authored 2026-06-09 from the ecdsa.fail / Last Premine work. The river keeps flowing; the banks can change.*
