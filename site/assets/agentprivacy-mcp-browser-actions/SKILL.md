---
name: agentprivacy-mcp-browser-actions
description: "Prepare and integrate scoped MCP spell or sticker actions with a durable host ledger and actual artefact receipts."
metadata:
  version: "0.1.0"
  category: "role"
  status: "local-implementation-live-adapters-pending"
  cohort: "city-mcp-2026-09-08"
---

# agentprivacy-mcp-browser-actions

Call browser_action_prepare for an exact HTTPS origin/page, subject DID reference, registered target, spell.cast or sticker.place, content digest, stable operation ID and expiry within five minutes. This is a proposal, not permission or dispatch.

The trusted extension/host derives the real top-level context and obtains holder/delegation approval for that exact intent. Do not use page postMessage flags as identity; do not resolve targets as scripts, selectors or arbitrary URLs. Read agentprivacy-mcp/docs/BROWSER_ACTIONS.md before attaching live adapters.

Use lib/browser-action-runtime.mjs with an existing private ledger directory and host-owned authorize/execute/reconcile/verifyReceipt functions. Shared-directory locks prevent concurrent dispatch by cooperating local processes. Pending outcomes require reconciliation using the same operation ID. Changed intent under an existing ID is a conflict. Reverify retained results and validate original packets before journey folding. Save the returned bundle in actual private custody.

Expired pending operations need a separately authenticated historical-status workflow; issuing a new ID is not recovery. Locks do not coordinate distributed replicas. No public network endpoint is provided. Live extension/game dispatch and cryptographic receipts remain unconnected.

Validation: node --test test/browser-action.test.mjs test/browser-action-runtime.test.mjs. Fixtures establish local orchestration, not live VTA authority.

Related domain skill: [existing foundation](../agentprivacy-spell-encoding/SKILL.md). This workflow adds no personas or canonical vertex assignments.
