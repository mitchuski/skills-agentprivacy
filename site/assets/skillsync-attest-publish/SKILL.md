---
name: skillsync-attest-publish
description: The keeper's release rite for the skill garden — attest the librarian's desk into a hash-chain proof, rebuild every surface (registry, shelf, sky, site), audit for PII and leaks, review what changed, and publish to the public domain only when the keeper chooses. The cloud gets commitments; the tailnet keeps the detail. Use when the user says "publish the garden", "attest the desk", "push the skills site", "release the latest state", or when local skill-sync work has accumulated and should reach skills.agentprivacy.ai.
metadata:
  category: skillsync
  origin: skill-sync
  version: "0.1"
---

# skillsync-attest-publish

Publishing is a chosen act, not a side effect. The tailnet is always current; the
cloud updates when the keeper says so — and what it gets is **proof, not detail**
(`public_desk: "proof"` in the config).

## The rite (in order, from `~/skill sync`)

1. **Attest the desk** — `node bin/attest-desk.js`
   Seals the moment: chain head (commits to the whole ledger), entry counts by
   type, canonical sha256 digests of leaderboard / gardens / constellations /
   runtimes. Writes `registry/desk-proof.json`. Skipping this ships a STALE proof.
2. **Rebuild the surfaces** —
   `node bin/harvest.js && node bin/build-wiki.js && node bin/build-starchart.js && node bin/build-static.js`
   Harvest re-scans sources (leak scan + PII neutralization live here); the shelf,
   the sky and the site rebuild; proof mode strips desk rows and runtime detail
   from the public bake while the tailnet mirror keeps live-fetch detail.
3. **Audit before anything ships** — zero tolerance, word-boundary greps:
   PII terms (see pii.local.json) across `registry/assets site/ club-export` and
   the shelf pages; check harvest output for REFUSED entries — a refusal is the
   scanner working, read why. If `pii.local.json` was touched, RE-RUN the audit —
   a broken regex fails silent (it has happened).
4. **Review** — `git status` / `git diff --stat`; read the desk-bake line
   ("PROOF of N entries, attested ...") and confirm the timestamp is TODAY.
5. **Publish** — commit with a message that says what moved, `git push origin main`.
   Cloudflare auto-deploys `site/`. Verify one deep URL and the proof card render
   on the workers.dev domain after the deploy.

## What the two sides see afterward

- **Cloud (anyone):** the garden, the decks, the sky, the gardens roster with
  standing — and a 🔒 proof card: chain head + counts + digests. No rows, no walks.
- **Tailnet (members):** everything live — full leaderboard, runtimes on the
  chart, counsel, and the buttons. A member can recompute every digest in the
  published proof from the detail and catch a lying cloud.

## Guardrails

- Never publish desk ROWS to the cloud while `public_desk` is "proof" — flipping
  that flag is a keeper ruling, not a convenience.
- Never push with a stale or missing attestation in proof mode.
- The audit is not optional and runs AFTER the rebuild, on what will actually ship.
