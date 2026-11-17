---
name: agentprivacy-wiki-tailnet-serve
description: >
  Start a local FedWiki farm and serve it on a Tailscale tailnet — private,
  WireGuard-encrypted, never public — and SYNC the full farm roster onto
  per-site hostnames under a private DNS zone: "review my local wikis and give
  them to the network". Use when asked to start the wiki farm, serve the wikis
  on the tailnet, share local wikis with peers, sync the farm to the network,
  or report what is currently shared. Covers start/status/sync/off/peers, the
  three-door architecture (pinned ts.net ports, a Host-routed front door, an
  optional token-grant lane), verification probes, and the encoding/startup
  gotchas. Kept by the Librarian 🗃️; the front-door allowlist is the
  Sentinel's wall.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "wikis"
  alignment: "balanced"
  layer: "distribution"
  keeper: "librarian"
  authoring_persona: "chronicler"
  personas: "librarian (keeper — the roster: which shelves go to the network) · sentinel (the Host allowlist, the 403 for everything else, Funnel left off) · netkeeper (the tailnet mesh, peers, private DNS) · gatekeeper (the token-grant lane)"
  origin: "0xagentprivacy"
  author: "the Keeper"
  introduced: "2026-08-25"
  tooling: "an orchestrator script beside the farm (<home>/.wiki/_tailnet_share.ps1), a Host-rewrite proxy (_tailnet_proxy.js), a synced site map (_tailnet_sites.json) — not shipped in this folder; the method below is enough to rebuild them"
  related_skills: "agentprivacy-wiki-sync (what the farm holds), agentprivacy-wiki-new-domain, agentprivacy-wiki-reindex, agentprivacy-skillsync-dreamloop (reads the shared farms), agentprivacy-wiki-watch"
  source_corpus: "a Windows host running the wiki farm under tailscale serve, shared with a small tailnet of peers"
  upstream: "none recorded"
---

# agentprivacy-wiki-tailnet-serve

**🗃️🕸️ Tailnet Wiki Serve — the farm, given to the network you chose**
Keeper: the Librarian 🗃️ · Wall: the Sentinel 🗡️🛡️ · Authored by the Chronicler 🧙📖 · Category: wikis · Layer: distribution

> Shared is not published: the tailnet is a room with a door, not a street.

One orchestrator puts the whole local FedWiki farm on the tailnet —
tailnet-only, WireGuard-encrypted, never public. **Tailscale Funnel is
deliberately unused.**

```powershell
powershell -ExecutionPolicy Bypass -File <home>\.wiki\_tailnet_share.ps1 <action>
```

| action | what it does |
|---|---|
| `start` | farm (:3030) + Host-rewrite proxy + `tailscale serve` maps + auto-sync. Idempotent, detached (survives sessions). |
| `sync` | **review the farm and give it to the network**: every populated `*.localhost` site → `<name>.<private-zone>` (dots → dashes), written to `<home>/.wiki/_tailnet_sites.json`. The proxy re-reads the file within ~2 s — no restart. Prints the full roster. |
| `status` | farm/proxy up? + `tailscale serve status` |
| `off` | remove `tailscale serve` maps only (farm + proxy keep running) |
| `peers` | list tailnet devices + probe them for fedwikis (ports 80 / 3000 / 3030) |
| `grants` / `revoke` / `index` / `runtime` | the optional token-grant lane (door 3) |

`<private-zone>` is a DNS zone that resolves only inside your tailnet (a peer's
DNS, or Tailscale split-DNS, pointing the zone + wildcard at this machine's
tailnet IP). Never a public zone.

## Architecture (three doors)

1. **Pinned ts.net ports** — `tailscale serve` → proxy (313x) → farm :3030 with
   the Host header rewritten, one pinned port per flagship site on
   `<machine>.<tailnet>.ts.net`, e.g. `:80`=guide `:8081`=skill `:8082`=tomes
   `:8083`=research `:8084`=atlas `:8085`=embassy.
2. **:80 front door** — the proxy binds `0.0.0.0:80` through a firewall rule
   scoped to the tailnet interface (`tailscale serve` must NOT hold :80). A
   Host-routed **allowlist**: curated `ALIASES` in `_tailnet_proxy.js` (e.g.
   `skills.<private-zone>` → `skillsync.localhost`, `library.` → `library.localhost`)
   win over the synced map in `_tailnet_sites.json`; bare `*.<private-zone>`
   passes through (the farm namespace); everything else gets **403**.
3. **Token-grant lane (optional)** — `<site>-<token>.<private-zone>` on the same
   :80 door, checked first, for per-pathway grants that can be revoked. Synced
   names whose last dash-segment is 8–16 hex are **skipped** so they can never
   shadow a grant.

Farm launch canon (wiki npm package):
`wiki --farm --port 3030 --security_type friends --data <home>/.wiki`

## Verify (always, after start or sync)

```powershell
# a pinned tailnet lane
Invoke-WebRequest http://<machine>.<tailnet>.ts.net/system/sitemap.json -UseBasicParsing
# a synced hostname
Invoke-WebRequest http://<site>.<private-zone>/system/sitemap.json -UseBasicParsing
```

A sitemap returning 200 with a JSON page array = that door is live end-to-end.
Probe from a second tailnet device too — a probe from the host itself can pass
through loopback and prove nothing about the network.

## Gotchas

- `status` right after `start` can report `farm :3030 DOWN` — a startup race;
  probe again after ~5 s before diagnosing.
- On Windows PowerShell 5.1, keep the orchestrator **UTF-8 with BOM**: PS 5.1
  reads BOM-less files as ANSI, and a mangled em-dash becomes a smart quote that
  terminates strings → parser errors. Keep new strings ASCII or re-save with BOM.
- After editing the proxy: `node --check` it, kill the PID listening on the
  proxy port (`Get-NetTCPConnection -LocalPort <port> -State Listen`), then
  `start` again. Editing `_tailnet_sites.json` alone needs no restart.
- **An unknown Host reaching the farm auto-creates an empty site dir** — the
  proxy allowlist exists to prevent exactly this. Never point `tailscale serve`
  straight at :3030.
- New curated names (e.g. a friendly alias like `skills.` for `skillsync.`) go in
  `ALIASES`; the synced map handles everything mechanical.
- Sharing to the tailnet still shares: run the leak/coverage audit
  (`agentprivacy-wiki-sync` gates) before `sync` puts a new site in front of peers.

## Share-safe note

This twin names no machine, tailnet, IP or zone. Your own values — machine name,
tailnet suffix, tailnet IP, private zone — live only in the local orchestrator
and its JSON, never in a published skill.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis
