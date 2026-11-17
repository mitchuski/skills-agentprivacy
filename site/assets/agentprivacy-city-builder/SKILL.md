---
name: agentprivacy-city-builder
description: >
  Stand up a Verifiable Trust Community on OpenVTC on your own machine as the community's
  core node — a VTA that mints and issues, a mediator, a DID host and the community itself,
  behind a tunnel, run as service units — with a keeper and an agent walking it together,
  the keeper typing every secret and the agent preparing, checking and recording. Use when
  someone wants to "build their own city", "set up a VTC", "deploy OpenVTC", "run a VTA /
  mediator / DID host / VTC", "connect Star Key" or "the VTA browser wallet", "issue
  invitations", "attach a community" to Mages City, or asks what the City did on 8–9 October
  2026 and what broke. Encodes the shape, the order of work with who types what and the
  done-when per phase, every gotcha met on the first walk with its fix, the community's
  shape (criteria, profile, description), the attach path, and the refusals. The kit is
  `deploy/vti/` in github.com/mitchuski/mages.city.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "operational_runbook"
  introduced: "2026-10-09"
  target_context: "a keeper + agent pair standing up a VTC on OpenVTC; Mages City is the worked example and the community to attach to"
  related_skills:
    - meta/agentprivacy-dual-agent-harness
    - meta/agentprivacy-chronicle-reflect
    - meta/agentprivacy-horizon-gate
  source_corpus: "mages.city deploy/vti/ (KEEPER_ACTIONS.md, CORE_NODE.md, DEPLOY.md, EDITION.md, core-node/), site/starkey.md, site/guide.md, docs/REFURBISH_PLAN_2026-10-07.md"
  upstream: "OpenVTC: openvtc.net · OpenVTC/verifiable-trust-infrastructure docs/03-vtc/ (getting-started, non-interactive-setup, bootstrap-runbook, join-criteria, admin-access, trust-registry) · OpenVTC/vti-setup sysop/explore/"
---

# City builder — a Verifiable Trust Community on your own machine

`machines qualify · humans admit · brokers release`

A **city** here is a Verifiable Trust Community (VTC) on OpenVTC whose issuing agent, mediator,
DID host and community daemon all run on the keeper's own machine, the **core node**, behind a
Cloudflare Tunnel, as systemd units. Mages City was stood up this way on 8 October 2026 by one
keeper and one agent in an evening, and administered from a Star Key wallet the night after. This
skill is that walk, generalised: the shape, the order, who types what, and every place it bit.

Two seats. **The keeper** types anything that mints a key, grants access, claims an install URL,
registers a passkey, approves a member, or deletes. **The agent** prepares files, reads logs,
checks health and records state. The agent never asks to see a mnemonic, a private key, a claim
code, an install URL or a bundle digest. It only ever needs the public DIDs and the output of
health checks.

## 1 · The shape

| piece | upstream binary | port | public host | what it is |
|---|---|---|---|---|
| DID host | `did-hosting-daemon` | 8534 | `dids.<zone>` | serves `did:webvh` logs for the VTA, the mediator and the community at `/<path>/did.jsonl` |
| mediator | `mediator` (+ `mediator-setup`) | 7037 | `mediator.<zone>` | the inbox every agent reaches the city through; DIDComm v2 + TSP; store = valkey |
| VTA | `vta` (+ `pnm` operator CLI) | 8100 | `vta.<zone>` | the city's own Verifiable Trust Agent: it mints the community's DID and issues every credential |
| VTC | `vtc` (+ `cnm`, `openvtc` clients) | 8200 | `vtc.<zone>` | the community: public site, join, admin console, status lists |

- **Node:** a Linux the keeper controls. The worked example is a second WSL2 distro on a separate
  disk (`D:`), so a solver or build VM beside it can never fill the node's disk. Ubuntu 26.04 is
  what upstream's explore stream tested on.
- **Ingress:** one named tunnel; four proxied DNS records → `127.0.0.1:<port>`. TLS terminates at
  the edge, so no nginx, no certbot; the services run "No SSL (TLS-terminating proxy)".
- **Process model:** four units `vti-dids` → `vti-mediator` → `vti-vta` → `vti-vtc`, in that
  order, `WorkingDirectory=~/vti/<svc>` where each wizard wrote its `config.toml`; replaces
  upstream's `nohup … &`. Plus `valkey-server` and `cloudflared`.
- **Binaries:** the prebuilt Linux x86-64 builds upstream publishes (`download.firstperson.dev`),
  no checksums or signatures upstream; the kit's installer records its own SHA-256 pin so drift is
  visible, and its updater snapshots everything with a one-line rollback.
- **Secrets posture (explore stream, not hardened):** VTA seed in the config-file backend; the
  mediator's key file passphrase-encrypted, passphrase in a root-owned `EnvironmentFile` (mode
  0600); the DID host plaintext with explicit acknowledgement. The VTA's DID is portable, so the
  issuing agent can move to a hardened host later without changing identity.

The kit: `github.com/mitchuski/mages.city` → `deploy/vti/` — `CORE_NODE.md` (runbook),
`KEEPER_ACTIONS.md` (the checklist with every gotcha beside its step), `DEPLOY.md` (community
order), `EDITION.md` (acceptance), `core-node/{install-binaries.sh, update-binaries.sh,
migrate-config.sh, check.sh, cloudflared.yml, wslconfig.example, systemd/vti-*.service}`,
`vtc/{vtc-setup.toml, join-criteria.json, website/index.html}`.

## 2 · The order of work · who types · done when

Phase 0 is decisions (host, one or two administrators, DID hosting, no trust registry at first).
Everything after is a keeper keyboard with an agent reading beside it.

| # | phase | keeper types | agent does | done when |
|---|---|---|---|---|
| 1 | the node's distro | `wsl --install <distro> --name <node> --location D:\wsl\<node>`; create the user; `systemd=true` in `/etc/wsl.conf`; terminate, relaunch | checks `systemctl is-system-running` | `running`, no failed units |
| 2 | binaries | `bash install-binaries.sh` (valkey + the seven binaries + libpcsclite) | reads the versions and the pin | every tool answers; pin written |
| 3 | tunnel + DNS | `cloudflared tunnel login` (browser) · `tunnel create` · delete stale records in the dashboard · `tunnel route dns` ×4 · install `config.yml` + credentials · `service install` | probes the four hosts from outside | all four answer **502** via the edge (nothing listens yet, and that is correct) |
| 4 | the VTA | `vta setup` with upstream's prompt table (`yourdomain` → your zone; all three services incl. TSP; new `did:webvh` for VTA and mediator at `dids.<zone>/vta` and `/mediator`) | records the two public DIDs | `Setup complete` prints VTA DID (1b) and mediator DID (1c); the mnemonic (1a) stays with the keeper |
| 5a | PNM | `pnm setup` ("connect to an existing non-TEE VTA") → `vta import-did --did <printed did:key> --role admin --label <you>` (Option A, reversible) | — | `DID imported … Role: admin` |
| 5b | mediator | `mediator-setup` headless, file keys **with a passphrase**, "pick up pre-provisioned mediator (offline export)", context `mediator`; in a second terminal `vta contexts reprovision --id mediator --recipient bootstrap-request.json --out bundle.armor`; back in the wizard: bundle path + digest; TSP + DIDComm; No SSL; fresh JWT key; open network; CORS any; Redis default; new admin did:key | — | `conf/mediator.toml` written |
| 5c | DID host | `did-hosting-daemon setup` offline phase 1 (public URL `https://dids.<zone>`, mediator DID 1c, plaintext `y`, generate operator did:key = 4a); second terminal: `vta contexts create --id webvh --admin-expires 1h --admin-did <4a>` → `vta bootstrap provision-integration --request bootstrap-request.json --out bundle.armor`; then `did-hosting-daemon setup-offline-complete --bundle <path> --expect-digest <hex> --state setup-offline-state.toml` | — | `Daemon DID:` printed (4c); note the admin may **roll over** to a new did:key — invite that one |
| 5d | units + logs | install the units; `invite --role admin --did <daemon admin>` **with the daemon stopped**; `enable --now vti-dids`; enrol the passkey at the URL; upload the VTA and mediator `did.jsonl` in the host's manager; `enable --now vti-mediator` (wait a minute) then `vti-vta`; `pnm did-mgmt servers add --id did-hosting-daemon --did <4c>`; `pnm health`; `pnm --transport rest backup export --output ~/vti/vta-backup.vtabak` | confirms the three logs resolve from the public internet | `pnm health` green on REST + DIDComm (+ TSP); logs resolve; backup file exists |
| 6 | the community | `vtc setup` (base URL, VTA DID 1b, a context id of your own, no registry, the VTA's mediator, TSP + DIDComm); other terminal: `pnm contexts create --id <ctx> --name "<Name>" --admin-did <printed did:key> --admin-expires 1h [--admin-handoff]`; back: `y`, DID hosting = did-hosting-daemon, path `vtc`, seed in config, **no** to displaying the admin private key; `enable --now vti-vtc`; open the install URL within 15 min, claim code, passkey; sign in at `/admin/` **before adding any other admin** | writes the DID into the front; checks `/health`, `/v1/community/public-profile`, `/v1/community/did-qr.svg` | the public profile answers with the community DID and both transports `serviceable` |
| 7 | profile + wallet | name, description, logo URL, public URL, contact in the console; single-administrator mode on the host if every admin is you; a Star Key wallet (see §4) | records seats and DIDs | the console session belongs to the wallet's identity |
| 8 | the rest | `cnm community add "<Name>" --vtc-did <DID>` → grant → `continue`; register criteria; `website.root_dir`; first synthetic admission + revocation | validates criteria against the pinned spec; records versions in `EDITION.md` | EDITION stages 1–6 recorded |

Acceptance (`EDITION.md`): establish → bootstrap → admit one synthetic participant → verify the
credential independently (issuer, subject, proof, expiry, status; altered/expired/revoked refuse)
→ attach presentation → revoke and recover → optional Star integration. Record versions, synthetic
identities, expected and observed results, redacted failures. A 200 is transport, not identity.

## 3 · Every gotcha met on the first walk, with its fix

1. **Two distros, one VM, one UID.** A new WSL distro shares the VM with the existing one; a user
   with UID 1000 collides with the other distro's UID-1000 session cgroup (`user@1000.service:
   Failed to spawn executor: Device or resource busy`, systemd `degraded`). Fix: `usermod -u 1001`
   + `groupmod -g 1001` + `chown -R`, mask `getty@tty1`, terminate, relaunch → `running`.
2. **Three binaries have no `--version`** (`pnm`, `mediator`, `mediator-setup`); probe with
   `--help` instead. Not a fault.
3. **The `openvtc` client needs `libpcsclite1`** (smart-card library) on a minimal image.
4. **`invite` opens the store directly.** The DID host's `invite` fails `FjallError: Locked` while
   the daemon runs — stop the unit first — **and** a phase-1 `setup` wizard left open in another
   terminal holds the same lock. Kill it.
5. **vta 0.23.4 stores the mnemonic** in the seed backend instead of showing it; take the
   encrypted backup after the first admin connects, and the backup descriptor flow is REST-only:
   `pnm --transport rest backup export`.
6. **pnm rotates the admin key on first connect** (`acl/swap`); the imported did:key is replaced
   by a long-term one. Anything still signing as the old key (a TSP sender for a minute) is refused
   "DID not in ACL" until it catches up. Expected.
7. **A tagged release can change the config schema.** The 8 Oct release refused the retired
   `trust_xff = …` in the VTA and VTC (`TOML parse error`) — it became
   `trust_xff_cidrs = ["127.0.0.1/32"]`, the tunnel being the one proxy on the box — and the DID
   host demanded `[secrets] backend = "plaintext"` **and** `confirm_plaintext = true`. Snapshot
   before updating (`update-binaries.sh`), migrate (`migrate-config.sh`), roll back in one line.
8. **A new DID host build cannot open the old one's secrets** (new store at
   `./config.secrets.plaintext`; the old kept them inside its store; the sealed bundle needs the
   old bootstrap key). Either keep the old host binary on its snapshot state, or re-provision the
   host on the new build (fresh sealed bundle, re-upload the three logs, re-register with the
   VTA). The hosted DIDs do not change; only the host's own does.
9. **A VTA that boots before its DID host answers skips messaging** ("self-readiness gate timed
   out; a later restart reconnects"): `/health` is 200 but every wallet or pnm frame times out.
   Restart `vti-vta` once the host is up.
10. **A mediator restart stales every session** — the VTC's socket (`closed by the mediator`),
    pnm's ("replies are not reaching this client — reconnect the session"), the wallet's. Restart
    `vti-vta` and `vti-vtc`; run pnm with `--transport rest` meanwhile.
11. **Older pnm, newer flags.** A 2 Sept pnm has no `--capabilities`, `--handoff`,
    `--admin-handoff`; drop them, the flows still complete. The 8 Oct pnm has them.
12. **A wallet older or newer than the VTA may not share a TSP dialect** (`couldn't unpack TSP
    message: missing G ciphertext frame`). Either pin the wallet to DIDComm/REST (extension
    Options → Prefer TSP off) or bring the node to the release the wallet was built against.
13. **The wallet's context must exist** at the VTA (`pnm contexts create --id <ctx> --name
    "<Ctx>"`) or its provisioning answers 422.
14. **A community DID minted by an older build advertises `VTCRest` without `/v1`** and a client
    that trusts the DID document gets **405** on sign-in. Fix: edit the DID document at the VTA
    (`pnm did-mgmt dids edit --did <vtc> --document <edited json>`, endpoint `https://<vtc>/v1`).
    If the DID host cannot take the VTA's push, export the two-entry log (`pnm did-mgmt dids
    get-log <did>`), upload it by hand in the host's manager, and **restart the host** so its
    serving plane re-reads the store.
15. **"Sign in as a VTA identity" presents the agent's `did:webvh`, not the wallet's `did:key`.**
    The agent's DID needs its own community-admin entry, or sign-in answers 401 "session not
    found". Keep the wallet's did:key entry too; it signs documents and approvals.
16. **One person, several identifiers → single-administrator mode.** Without it an online
    community-admin grant to your own second DID is refused (nobody else can consent). Set
    `[acl] single_admin_mode = true` in the VTC's `config.toml` on the host and restart; it is
    host-only by design and every waived consent is audited at Critical.
17. **The install URL answers 502 until the unit is started**, and it lives 15 minutes; `vtc admin
    invite --did <admin>` re-mints it with the daemon stopped.
18. **A box that sleeps is not a node**; a WSL VM stops when its last terminal closes unless
    `.wslconfig` says `vmIdleTimeout=-1`; a disk file that lives on a nearly full drive is the real
    capacity limit, not what the guest reports.

## 4 · Star Key — the wallet as the keeper's seat, or a member's

Star Key is the agentprivacy fork of OpenVTC's browser wallet. The wallet never holds a signing
key; the agent mints every sign-in token. Load `packages/extension/dist` unpacked; setup opens.

- **The keeper's wallet:** paste the city's VTA DID; choose *Manage the whole agent* (+ *own
  identity*); name a context (the City used `swordsman`); run the printed `pnm acl create --did
  <temp did:key> --role admin … --expires 1h [--handoff]` at the VTA; Continue → the VTA mints the
  wallet's long-term key through its admin template and the temporary entry is replaced by its
  successor (VTI-ACL-056); lock with a passkey; enable the wallet on the console's site; **Sign in
  as a VTA identity** (needs the agent's DID on the VTC ACL, §3.15) → **Set up signing with your
  wallet** → a console key delegated to the agent's identity, signed by the wallet.
- **A member's wallet:** their own VTA (a farm or self-hosted), *Work inside one context*, one
  persona, and an invitation.

## 5 · The community's shape

- **Criteria, in order:** `invited` (automatic: an invitation credential the community issued) ·
  `arena-evidence` (review: an applicant attaches a chronicle whose `Evidence root:` names a
  κ-bundle a fellow mage re-derives) · `review` (review: everyone else). Remove upstream's default
  `member-credential` until a trust registry exists. A criterion that requires nothing goes last.
  Validate `vtc/join-criteria.json` against the spec at the pinned revision before registering.
- **Profile:** name, description, logo URL, public URL, contact. The description's shape the City
  settled on: the inscription `(⚔️ ⊥ ⿻ ⊥ 🧙) 😊`, the thesis (*Privacy is value*), who the
  community is for and what it does together, the stack in one clause (words κ in a registry,
  spells with their mages, mana on the edges), the law (*machines qualify, humans admit, brokers
  release*), and a closing in the City's own voice.
- **Invitations:** issued from the console to the DID an applicant gives (a Verifiable Invitation
  Credential, delivered to their agent); the applicant joins by the community DID in `openvtc`
  (Communities → `j`) or Keyring (scan the DID QR at `/v1/community/did-qr.svg`); the `invited`
  door admits at once. The conversation before the invitation is the admission.
- **What a member holds:** a membership credential (bounded, renewable), a role credential, a slot
  on the public status list (`GET /v1/status-lists/revocation`, unauthenticated). Nothing is
  published without `publishConsent`.

## 6 · Attaching to Mages City (and the three gifts)

Mages City (`did:webvh:QmQ8GMNCTui2H9gjxQWByS1ScsWkByaeQHYnzhcET1UPne:dids.mages.city:vtc`,
live since 8 October 2026) offers three things a new city can take:

1. **Attach.** Set your community's `registry_did` to the City's trust registry (at setup in the
   TOML, or later with `pnm did-mgmt dids edit` + `cnm did-log install` if you serve your own
   log). Ask for recognition (a reviewed trust task; the City lists you). Recognise back with a
   join criterion using `credentialIssuers: recognised`, and enable cross-community roles
   (`cross_community_roles.rego`, `POST /v1/auth/recognise`) only as far as you mean it.
   Recognition is revocable from either side; no community is listed as attached before it has
   run both ways. (Specified; opens with the City's registry.)
2. **A trust graph you can copy.** This skill and the kit are the City's own path; keep your policy,
   take the flow.
3. **The practice, told under mana.** The autoresearch arena (the dual-agent harness, rules
   A1–A40, the instances' words) is told to communities the City holds a relationship credential
   with. The names fold rides the same credentials: membership = rung 1 (brokered TXT under your
   name), two-way relationships = rung 2 (point your name), a witnessed sealed run = rung 3 (your
   own subtree, NS delegation).

## 7 · Refusals

- Never put a mnemonic, a bundle digest, an enrolment or install URL, a claim code, a passkey or a
  private key in chat, in a file an agent reads, in a repo, or in a screenshot. The agent needs
  public DIDs and health output, nothing else.
- A documented URL is not a deployed one; a 200 is transport, not identity; a page is never the
  authority — the daemon's join manifest and the status list are.
- The keeper commits, pushes, submits, deletes, and runs every wizard. The agent prepares and
  records. Nothing from a city's tree goes upstream; contributions are one clean branch per
  problem from current upstream.
- No public sign-up, no provisioning of members' VTAs, no "claimed score" flags, no orchestrator
  named before they hold mana with the seats beside them.
- The explore stream is not hardened, and the kit says so on every page it touches.
