---
name: agentprivacy-wiki-offline-check
description: >
  Reviewing a fedwiki plugin, FastAPI endpoint, script, or skill for Offline Edit Mode correctness — what breaks or misleads when wiki-local diverts the public domains to the local mirror. Part of the git-less onboarding/distribution layer kept by the
  Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/fedwiki-offlinecheck-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream authorship; only the wikis/ framing, the Librarian keeper-layer, and agentprivacy metadata are ours"
  related_skills: "agentprivacy-wiki-create-plugin, agentprivacy-wiki-new-domain, agentprivacy-wiki-nextcloud-push"
---

# agentprivacy-wiki-offline-check

The **fedwiki-offline-check** skill — Review a fedwiki plugin, FastAPI endpoint, script, or skill for Offline Edit Mode correctness — what breaks or misleads when wiki-local diverts the public domains to the local mirror.

## When it Triggers

Use when creating or changing any plugin/endpoint/script that touches a public wiki domain, the Nextcloud server, or remote indexes, or when the user asks "does this work offline", "offline check", or "check offline implications".

## What it Does

- Detecting offline mode
- The Checklist
- Guard pattern (shell)
- Reporting

## See

- Claude Skills and Fedwiki Document Skill
- Claude Import Skill

---

**Upstream:** [`fedwiki-offlinecheck-skill`](https://skill.fedwiki.club/view/welcome-visitors/view/fedwiki-offlinecheck-skill) — vendored + re-framed (owner: Anon / 'from marvin', skill.fedwiki.club). The wiki page remains the source of truth; this SKILL.md is a fork carrying its lineage.

**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · [skill.fedwiki.club](https://skill.fedwiki.club)
