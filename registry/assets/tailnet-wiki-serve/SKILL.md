---
name: tailnet-wiki-serve
description: Start the local ~/.wiki FedWiki farm and serve it on the tailscale tailnet, and SYNC the full farm roster onto *.mitch.private.fish hostnames — "review my local wikis and give them to the network". Use when the user says "start the wiki farm", "serve the wikis on tailscale/the tailnet", "share my local wikis", "sync the farm to the network", or asks what's currently shared. Covers start/status/sync/off/peers, the port + hostname door map, verification probes, and the encoding/startup gotchas.
---

# Tailnet Wiki Serve

One orchestrator puts the whole local FedWiki farm on the tailnet (tailnet-only, WireGuard-encrypted, never public; Funnel deliberately unused):

```powershell
powershell -ExecutionPolicy Bypass -File $env:USERPROFILE\.wiki\_tailnet_share.ps1 <action>
```

| action | what it does |
|---|---|
| `start` | farm (:3030) + host-rewrite proxy + tailscale serve maps + auto-sync. Idempotent, detached (survives sessions). |
| `sync` | **review the farm and give it to the network**: every populated `*.localhost` site → `<name>.mitch.private.fish` (dots→dashes), written to `~/.wiki/_tailnet_sites.json`. The proxy re-reads the file within ~2s — no restart. Prints the full roster. |
| `status` | farm/proxy up? + `tailscale serve status` |
| `off` | remove tailscale serve maps only (farm + proxy keep running) |
| `peers` | list tailnet devices + probe them for fedwikis (ports 80/3000/3030) |
| `grants` / `revoke` / `index` / `runtime` | VPKB pathway-grant lane (see ~/vpk) |

## Architecture (three doors)

1. **Pinned ts.net ports** — `tailscale serve` → proxy 313x → farm :3030 with Host rewritten: `mitchie.tail32e87c.ts.net` :80=guide 8081=skill 8082=tomes 8083=research 8084=atlas 8085=embassy.
2. **:80 front door** (proxy binds 0.0.0.0:80 through the TailnetTighten firewall hole; `tailscale serve` must NOT hold :80): Host-routed allowlist. Curated `ALIASES` in `_tailnet_proxy.js` (e.g. `skills.mitch.private.fish` → skillsync.localhost, `library.` → library.localhost) win over the synced map in `_tailnet_sites.json`; bare `*.mitch.private.fish` passes through (farm namespace); everything else 403. David's DNS points `mitch.private.fish` + wildcard at this machine's tailnet IP (100.70.51.53).
3. **VPKB grant lane** — `<site>-<token>.mitch.private.fish` on the same :80 door, checked first; synced names whose last dash-segment is 8–16 hex are SKIPPED to avoid shadowing it.

Farm launch canon: `%APPDATA%\npm\wiki.cmd --farm --port 3030 --security_type friends --data %USERPROFILE%\.wiki`.

## Verify (always do after start/sync)

```powershell
# tailnet lanes
Invoke-WebRequest http://mitchie.tail32e87c.ts.net/system/sitemap.json -UseBasicParsing
# a synced hostname
Invoke-WebRequest http://grimoire.mitch.private.fish/system/sitemap.json -UseBasicParsing
```

A sitemap returning 200 with a JSON page array = that door is live end-to-end.

## Gotchas

- `status` right after `start` can report `farm :3030 DOWN` — startup race; probe again after ~5s before diagnosing.
- `_tailnet_share.ps1` is UTF-8 **with BOM**; PS 5.1 reads BOM-less files as ANSI, and a mangled em-dash becomes a smart quote that terminates strings → parser errors. Keep new strings ASCII or re-save with BOM.
- After editing `_tailnet_proxy.js`: `node --check` it, then kill the PID listening on :3131 (`Get-NetTCPConnection -LocalPort 3131 -State Listen`) and run `start` again. Editing `_tailnet_sites.json` alone needs no restart.
- An unknown Host reaching the farm auto-creates an empty site dir — the proxy allowlist exists to prevent this; never point `tailscale serve` straight at :3030.
- New curated names (e.g. a marketing alias like `skills.` for `skillsync.`) go in `ALIASES` in `_tailnet_proxy.js`; the synced map handles everything mechanical.
