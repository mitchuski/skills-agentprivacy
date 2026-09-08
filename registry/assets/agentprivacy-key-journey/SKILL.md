---
name: agentprivacy-key-journey
description: "Preserve original City Key journey evidence while importing, inspecting and idempotently folding artefacts or observed Trust Task documents."
metadata:
  version: "0.1.0"
  category: "role"
  status: "local-implementation-live-adapters-pending"
  cohort: "city-mcp-2026-09-08"
---

# agentprivacy-key-journey

Use the existing agentprivacy-mcp journey_start, journey_inspect and journey_fold tools. Resolve their input schema from tools/list. Supply a complete private bundle when the key commits to packets or prior journey steps. Never reconstruct missing originals from a graph projection.

Preserve unknown key fields, bearer identity, original task documents, packet roots/counts and lineage. A repeated exact fold must be a no-op; changed content under a reused task ID is a conflict. Treat catalog matching, signature verification, freshness, task qualification and issuer authority as separate findings. Recorded task documents are not verified credentials.

Keep full originals in private custody and export the bundle deliberately. A compact Star appearance is not a replacement key or a ZKP. Host action receipts remain private alongside the actual artefact; do not infer a saved VTA state merely from a returned bundle.

Implementation: agentprivacy-mcp/lib/journey.mjs, key.mjs, kappa.mjs; browser generators under scripts/. Validation: node --test test/journey.test.mjs test/browser-journey.test.mjs. Browser roundtrip tests require the existing master/Spellweb siblings.

Related domain skill: [existing foundation](../agentprivacy-understanding-as-key/SKILL.md). This workflow adds no personas or canonical vertex assignments.

## City and Star operating practice

For a browser carrier, preserve opaque extension fields including false, zero, null and empty values while rebuilding only the fields the surface owns. Importing key B must replace key A’s carried metadata, descriptions and traces. Guard asynchronous identity calculations so an older import cannot overwrite a newer one; immediate export must await the current identity. Test repeated no-op sync, A-to-B isolation and restricted export separately. Never widen a selected disclosure by copying the entire carrier into it.
