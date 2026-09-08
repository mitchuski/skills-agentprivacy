---
name: agentprivacy-city-mage-runtime
description: "Prepare and resume the City dual-agent harness instance with private City Key evidence and durable checkpoints."
metadata:
  version: "0.1.0"
  category: "role"
  status: "local-implementation-live-adapters-pending"
  cohort: "city-mcp-2026-09-08"
---

# agentprivacy-city-mage-runtime

Work in the existing mages_city/harness/city_mage instance of dual-agent-harness, not the superseded extraction. Read runtime.json and README.md before operating. Use bootstrap.mjs --help for explicit key/bundle, private state directory, subject reference and HTTPS audience arguments.

Prefer the existing deployed VTA and key. A subject reference is not proof of control. Local preparation validates/preserves evidence and pins entry-kit sources; it does not mint a service-discovery receipt. Changed evidence/context/sources require an explicit new preparation without discarding the old instance.

Resume through setup.mjs with host-owned adapters and verification. Persist pending operations before effects; use revision comparison and reconcile uncertain outcomes rather than blindly repeating. Never derive executable adapters from keys. Retained crash locks require inspection after the writer has stopped. Keep storage outside source/public/sync folders; local files are not encrypted VTA memory.

Run node harness/city_mage/run.mjs from the City repo. Preserve failed and successful run evidence and operational chronicles. The baseline is offline, not an actual paired run or service deployment. Real VTA/delegation/MyTerms/task/access/memory adapters remain incomplete.

Related domain skill: [existing foundation](../agentprivacy-agent-interop/SKILL.md). This workflow adds no personas or canonical vertex assignments.

## City and Star operating practice

Include the offline agent admission rehearsal in setup checks, then test adapter conflicts, identical retries, changed retries, revocation and restart recovery separately. Record fixture-only, browser-observed and live-service evidence as separate statuses. A passed intake validator cannot issue credentials or award a City name.
