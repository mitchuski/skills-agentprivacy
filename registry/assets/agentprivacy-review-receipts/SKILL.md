---
name: agentprivacy-review-receipts
description: "Bind review acknowledgment to exact content and destination, preserve review receipts, and distinguish copied text from reported or verified publication."
metadata:
  version: "0.1.0"
  category: "role"
  status: "local-implementation-live-adapters-pending"
---

# review receipts

Resolve the current draft body, title, destination, proverb, ledger reference, prerequisites and relevant upstream snapshot before review. Bind acknowledgment to that exact revision; any change invalidates the acknowledgment. Export the reviewed body and revision identifier in a receipt.

Track review, copying, reported publication and independently checked publication separately. A supplied publication URL is reported evidence until checked against the exact repository, target thread and comment anchor. Preserve immutable approval snapshots; do not reconstruct an absent historical snapshot from today's ledger.

Verify generated specification prose by regenerating and comparing the actual marked sections as well as the source digest. Retain successful per-repository watermarks when a refresh fails. Test changed content, changed destination, incorrect publication URLs and historical snapshot stability.

An acknowledgment means the person reviewed this version. It does not establish comprehension, a bilateral MyTerms agreement, credential issuance or permission to publish. Read the installed DTG reader's board/review.test.mjs and conformance/test.mjs before adapting its contract; implementation paths vary by checkout.

Related: [Consent infrastructure](../agentprivacy-consent-infrastructure/SKILL.md), [Policy governance](../agentprivacy-policy-governance/SKILL.md).
