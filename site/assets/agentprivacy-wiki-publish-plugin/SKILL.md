---
name: agentprivacy-wiki-publish-plugin
description: >
  End-to-end release of a Federated Wiki plugin update — docs, version bump, GitHub
  commit/tag, npm publish, and help/catalog pages. Activates when shipping a new version of
  a fedwiki plugin. Kept by the Librarian 🗃️ in the Tower's Wikis.
license: Apache-2.0
metadata:
  version: "5.5"
  category: "wikis"
  layer: "onboarding"
  keeper: "librarian"
  origin: "0xagentprivacy (guide-layer framing)"
  upstream: "https://skill.fedwiki.club/publish-plugin-update-skill.json"
  upstream_author: "Anon / 'from marvin' (skill.fedwiki.club)"
  provenance: "vendored + re-framed — upstream .json was unreachable (HTTP 404) at materialization 2026-06-21; body reconstructed faithfully from the skill.fedwiki.club sitemap synopsis ('End-to-end plugin release: docs, versioning, GitHub, npm, and help pages') + cross-references. REFRESH via agentprivacy-wiki-to-skill when the upstream page is reachable."
  status: "reconstructed (upstream unreachable at materialization) — verify against the live page before relying on exact commands"
  related_skills: "agentprivacy-wiki-create-plugin, agentprivacy-wiki-document-plugin, agentprivacy-wiki-searching-plugins"
---

# Publish Plugin Update Skill

> **Note:** the upstream page `publish-plugin-update-skill` was unreachable (HTTP 404) when this skill was materialized on 2026-06-21. This body is reconstructed from the sitemap synopsis ("End-to-end plugin release: docs, versioning, GitHub, npm, and help pages") and cross-references. Refresh it with `agentprivacy-wiki-to-skill` once the upstream page resolves.

The `publish-plugin-update` skill runs the end-to-end release of a Federated Wiki plugin update — covering documentation, versioning, GitHub, npm, and the help/catalog pages, so a new version is shipped and discoverable in one pass.

## The Release Pipeline

1. **Docs** — update the plugin's `README.md` and refresh its catalog page on `plugin.fedwiki.club` (`agentprivacy-wiki-document-plugin`).
2. **Version** — bump the version in `package.json` (`npm version patch|minor|major`), following semver.
3. **GitHub** — commit the changes, tag the release, and push (commit + tag + push origin). Create a GitHub release if the project uses them.
4. **npm** — `npm publish` the `wiki-plugin-{name}` package (ensure you are logged in and the version is new).
5. **Help pages** — update any in-wiki help/about pages for the plugin (e.g. an `About {Name} Plugin` page) so users see the new behaviour.
6. **Verify discoverability** — confirm the new version is found via `agentprivacy-wiki-searching-plugins` (npm channel + catalog wikis).

## Checklist

- [ ] README + catalog doc updated
- [ ] `package.json` version bumped (semver)
- [ ] Committed, tagged, pushed to GitHub
- [ ] `npm publish` succeeded (new version live)
- [ ] Help/about pages updated in the wiki
- [ ] New version discoverable (npm + plugin.fedwiki.club)

## Related Skills

- `agentprivacy-wiki-create-plugin` — scaffold the plugin this releases
- `agentprivacy-wiki-document-plugin` — the doc-publishing step
- `agentprivacy-wiki-searching-plugins` — verify the release is discoverable

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis (the git-less onboarding layer) · **reconstructed body — refresh from upstream when reachable**
**Upstream:** [skill.fedwiki.club/publish-plugin-update-skill](https://skill.fedwiki.club/publish-plugin-update-skill) — vendored + re-framed; not original agentprivacy authorship
