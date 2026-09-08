---
name: agentprivacy-namekeeper-write-contract
description: "Prepare and validate VTA-authorized Namekeeper wiki writes with exact scope, revision preconditions, idempotency and receipt reconciliation."
metadata:
  version: "0.1.0"
  category: "role"
  status: "local-implementation-live-adapters-pending"
---

# namekeeper write contract

Read mages_city/gate/permissions.mjs and the receiving adapter contract. Bind authentication to subject, audience, exact space and page, action, contentDigest, operationId and expectedRevision. Hash the exact UTF-8 body. Supply a new unpredictable operationId per intended change (16–128 ASCII letters, digits, underscores or hyphens); preserve it across retries. expectedRevision is explicit null for create-if-absent or sha256 followed by a colon and 64 lowercase hex digits for an authoritative revision.

Require verified identity binding and a separate current grant. Authenticate fresh proof on each attempt, including retries. Inside the receiving service's commit boundary, check authorization, compare the stored operation digest, check the expected revision, and commit page plus durable receipt together. A matching retry returns the original receipt; changed content under the same operation ID conflicts. Scope the deduplication key to authenticated subject and exact space.

Treat revision-conflict, operation-id-conflict and authorization-rejected as known refusals only when no effect occurred. Exceptions or missing receipts are unconfirmed: reconcile before retry. Gate allowed is an authorization result, not proof of execution. Revoked grants refuse retries; historical reconciliation needs its own authenticated path.

Run node --test bin/permissions.test.mjs bin/namekeeper-flow.test.mjs in mages_city. Current fixtures use synthetic identities and memory storage. Require real signature verification, consistent revision representation, cross-process atomicity and restart recovery before declaring a live FedWiki adapter ready. A Star display, DID string or operation ID alone grants no access.

Related: [Boundary enforcement](../agentprivacy-boundary-enforcement/SKILL.md), [Agent interop](../agentprivacy-agent-interop/SKILL.md).
