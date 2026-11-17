---
name: agentprivacy-wiki-cohere-sync
description: >
  Sync per-session answer pages from a source-of-truth FedWiki out to milestone
  subdomains with a coherence check that blocks rotten pages, and broker owner
  cookies so agents get delegated, host-scoped write permission without ever
  seeing the raw credential. Activates when distributing or updating FedWiki
  pages across a federation of subdomains (e.g. *.timeline.ide.earth) from a
  local source, when an agent must push to a FedWiki it owns without the cookie
  entering its context, when backing up live subdomains into a local farm twin,
  or when retargeting the sync to a new project. Kept by the Librarian 🗃️; the
  broker is the Gatekeeper's door inside it.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "wikis"
  alignment: "balanced"
  layer: "distribution"
  keeper: "librarian"
  authoring_persona: "chronicler"
  personas: "librarian (keeper — the source of truth, the per-session shelves, the faithful backup) · gatekeeper (the cookie broker: scoped grant, expiry refusal, the secret never handed over) · registry-keeper (the push-audit log) · ambassador (the MyTerms / IEEE P7012 seam the broker leaves open)"
  origin: "0xagentprivacy"
  author: "the Keeper"
  introduced: "2026-06-23"
  tooling: "sync.js · broker.js · pull.js · validate-creds.js · cookies.example.json (this folder)"
  related_skills: "agentprivacy-wiki-transcribe (upstream: video → transcript → answer pages), agentprivacy-wiki-to-pdf (downstream: answer pages → briefs), agentprivacy-wiki-sync, agentprivacy-wiki-page, agentprivacy-wiki-nextcloud-push, agentprivacy-guide-gatehouse"
  source_corpus: "a local FedWiki farm host holding compact <card>-<session> answer pages; the public *.timeline.ide.earth milestone subdomains as the worked instance"
  upstream: "none recorded"
---

# agentprivacy-wiki-cohere-sync

**🗃️🔗 Coherence-checked sync + the cookie broker**
Keeper: the Librarian 🗃️ · Door: the Gatekeeper 🗡️👤 · Authored by the Chronicler 🧙📖 · Category: wikis · Layer: distribution

> The shelf travels; the key stays home.

Two cooperating pieces:

- **`sync.js`** — the *what*: rewrite source-of-truth answer pages into the
  canonical per-subdomain shape, **coherence-check every page**, and push (or stage).
- **`broker.js`** — the *how it's allowed*: hold owner cookies on disk, hand
  agents **scoped** write access per host, keep the secret out of agent context.

The Librarian keeps the shelves coherent; the Gatekeeper decides who may write
to which shelf. An agent asks the broker to write a host — it never holds the
key that could write every host.

---

## The model

A FedWiki has no folders; a page's only address is its slug. The **source of
truth** is one local farm host (`<home>/.wiki/<source-host>/pages/`) holding
compact answer pages named `<card>-<session>` (e.g. `who-cares-agm-2027`). Each
**milestone subdomain** (`agm.timeline.ide.earth`, …) is "where the real wiki
lives per session" and carries that one session's five answers under the
**canonical hub slugs** (`who-cares`, `who-is-involved`, `what-changes`,
`proof--realness`, `becoming-real`) plus its video page and `welcome-visitors` hub.

`sync.js` transforms each source page into the subdomain shape:

```
[intro]       [[<label>]] <verb> [[<session video>]]? Below we summarise the discussion:
[## In brief] quote-free clarifying summary (optional — from <home>/.wiki/_summaries.json)
[body]        the two slots, VERBATIM from the source (header stripped)
[# See]       links the 5 hubs + the session video + transcript
```

**In brief:** keyed `"<card.src>-<session-slug>"` in `<home>/.wiki/_summaries.json`
(override with `SUMMARIES_FILE`). Inserted right under the intro so the concrete
answer leads the detailed prose. Optional and back-compatible: a missing file or
key → the page builds without it (a WARN, not a FAIL).

All text is **ASCII-normalised** (`asciify`) before push — the action endpoint
mojibakes UTF-8 multibyte chars (em-dash, accents), so they are folded to ASCII.

## Coherence check (FAIL blocks the push)

Catches the rot that creeps in when pages are hand-forked between sites:

- **foreign session label** — the page references another session's video (a
  real bug: one session's page pointing at a different session's video)
- **missing slot marker** — one of the two per-card slots absent (markers are
  defined per card in `CARDS`)
- **leftover hub list** — a `## Answers across the timeline` block that belongs
  only on the source hub, not on a per-session page (also a real bug)
- title mismatch / missing video link → FAIL; incomplete See block, thin body,
  or missing In brief → WARN

## Usage

```bash
cd <skill-dir>/agentprivacy-wiki-cohere-sync

# 1. dry-run: generate + check + stage (no auth). Inspect <home>/.wiki/_sync_staging/<sub>/
SESSION='AGM 2027' node sync.js
SESSION=all node sync.js

# 2a. push directly (cookie on the command line — ad-hoc only)
WIKI_SESSION='<wikiSession>' SESSION='AGM 2027' PUSH=1 node sync.js

# 2b. push via broker (PREFERRED — cookie stays on disk, host-scoped)
BROKER=1 PUSH=1 SESSION=all node sync.js
```

## The cookie broker (delegated permission)

**Why:** a FedWiki `wikiSession` is *farm-wide owner access*, all-or-nothing.
Pasting it into an agent's prompt leaks a live, multi-day credential. The broker
keeps the cookie on disk and exposes only a scoped push.

**Setup (once):** copy `cookies.example.json` to `<home>/.wiki/.creds/cookies.json`
(gitignored, chmod 600) and paste the `wikiSession` value(s). Expiry is **derived
from the cookie string** (`…issuedMs.ttlMs.sig`), never hand-entered. Get the
value from DevTools → Application → Cookies → `wikiSession`. If the file won't
parse, `node validate-creds.js` prints the error with every long string masked.

**Grant an agent a scope** with `WIKI_GRANT` (comma list of host globs). The
broker refuses any host outside the grant *even though the cookie could write it*:

```bash
node broker.js list                                    # owners, coverage, expiry — no secrets
node broker.js check --host agm.timeline.ide.earth     # may I write it? which owner? expired?
WIKI_GRANT='agm.timeline.ide.earth' node broker.js push --host agm.timeline.ide.earth --slug who-cares --file page.json
WIKI_GRANT='agm.timeline.ide.earth' node broker.js push-dir --host agm.timeline.ide.earth --dir <home>/.wiki/_sync_staging/agm
WIKI_GRANT='agm.timeline.ide.earth' node broker.js upload-asset --host agm.timeline.ide.earth --folder <folder> --file <file>
```

Every brokered push appends host / slug / owner label / time to
`<home>/.wiki/.creds/push-audit.log`. Expired cookies refuse with a re-login
message instead of silent 401s.

**Owner reality on a federated farm:** with federated identity, one owner cookie
can write the whole `*.<domain>` farm (logging into one site logs into the
siblings). So one `owner@timeline` entry covers all subdomains; scope per-agent
with `WIKI_GRANT`, not with separate cookies.

**The MyTerms seam.** The broker is a miniature of the MyTerms (IEEE P7012)
pattern: the principal delegates a scoped capability rather than handing over
authority. `WIKI_GRANT` is the hand-rolled stand-in for a negotiated scope; the
owner cookie held off-agent is the principal's retained authority; the audit log
is the record the delegated action stayed in scope. What it does not yet do: gate
the delegation on a *signed agreement*. Keep the seam in `resolve()` / `granted()`
so the "is this delegation permitted?" check can swap from env-var to signed terms
without touching the push path.

## Cookie rotation & hygiene

A `wikiSession` is a bearer credential: whoever holds it has full owner write
across the farm until it expires (the TTL is in the cookie itself, e.g.
`…604800000` = 7 days). Treat it like a password.

- **Storage:** only in `<home>/.wiki/.creds/cookies.json` (gitignored, chmod 600).
  Never commit it, never echo it into a command where it lands in shell history
  or a transcript, never paste it into an agent prompt — that is the whole reason
  the broker exists (the broker reads it from disk; agents call the broker).
- **When to rotate:** if the value was ever exposed in plaintext (a chat
  transcript, a log, a screen-share), or on a routine cadence. Exposure doesn't
  force rotation, but a leaked cookie stays valid farm-wide until its TTL lapses.
- **How to rotate:** log out / log back in on any site of the farm in the
  browser, copy the new `wikiSession`, replace `cookie` in `cookies.json`. Re-login
  invalidates the old token. Confirm with `node broker.js list` (shows the new
  `expires=` with no secret printed). No code changes — expiry is derived from
  the new string.
- **Check before a big push:** `node broker.js list` — an `[EXPIRED]` cookie
  makes the broker refuse with a re-login message rather than emit silent 401s.

## Faithful backup — `pull.js` (the inverse of sync)

Once the subdomains are seeded and editing happens **live on the subdomain sites**
(they become the source of truth), `pull.js` mirrors each subdomain DOWN into a
local farm twin so the local side is an exact, browsable backup. Read-only on the
remote (public GET) — no cookie or broker needed.

```bash
node pull.js                    # every subdomain + the base roster -> <home>/.wiki/<sub>.timeline.localhost/pages/
SUBS=web,myspace node pull.js   # only these
NOBASE=1 node pull.js           # skip the base roster site
```

Direction matters: `sync.js` pushes local → subdomains (overwrites, for seeding);
once the subdomains are truth, **stop running `sync.js` against pages edited
live** (it would clobber them) and use `pull.js` to keep the backup current.

**Ownership caveat:** a farm is not necessarily one owner. A subdomain can be
owned by a different identity (different `cookieSecret`) and will return **403**
to a cookie that writes the rest of the farm. `pull.js` still backs it up (reads
are public); writing it needs that subdomain's own cookie.

## Retargeting to another project

Edit the CONFIG block at the top of `sync.js`: `SRC_HOST` (source farm host),
`SOURCE` (fork provenance label), `MAP` (session → subdomain + video title),
`DOMAIN`, and `CARDS` (source prefix → slug / title / intro verb / slot markers).
The push mechanics, checks, and broker are project-agnostic.

## Slug rules (FedWiki asSlug)

`title.replace(/\s/g,'-').replace(/[^A-Za-z0-9-]/g,'').toLowerCase()` —
whitespace → hyphen, everything else deleted. `&` drops leaving a double hyphen
("Proof & Realness" → `proof--realness`); `?`, `:`, `'` drop entirely.

## Files

- `sync.js` — build + coherence check + stage/push (CONFIG block at top).
- `broker.js` — `list | check | push | push-dir | upload-asset`; exports
  `{ resolve, pushPage, uploadAsset, cookieExpiry, granted }`.
- `pull.js` — faithful backup, remote → local twin.
- `validate-creds.js` — parse-check `cookies.json` without printing secrets.
- `cookies.example.json` — the creds shape (placeholders only).

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis; the broker is a Gatekeeper's door — the agent gets a capability, never the credential.
