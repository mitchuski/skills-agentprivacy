---
name: fedwiki-cohere-sync
description: Sync per-session answer pages from a source-of-truth FedWiki out to milestone subdomains with a coherence check, and broker owner cookies so agents get delegated, host-scoped write permission without ever seeing the raw credential. Use when distributing/updating FedWiki pages across a federation of subdomains (e.g. *.timeline.ide.earth) from a local source, or when an agent needs to push to a FedWiki it owns without the cookie leaking into context.
---

# FedWiki coherence-checked sync + cookie broker

Two cooperating pieces:

- **`sync.js`** — the *what*: rewrite source-of-truth answer pages into the canonical per-subdomain shape, **coherence-check every page**, and push (or stage).
- **`broker.js`** — the *how it's allowed*: hold owner cookies on disk, hand agents **scoped** write access per host, keep the secret out of agent context.

## The model

A FedWiki has no folders; a page's only address is its slug. In this federation the **source of truth** is one local farm host (`~/.wiki/mitch.vision.localhost/pages/`) holding compact answer pages named `<card>-<session>` (e.g. `who-cares-agm-2027`). Each **milestone subdomain** (`agm.timeline.ide.earth`, …) is "where the real wiki lives per session" and should carry that one session's five answers under the **canonical hub slugs** (`who-cares`, `who-is-involved`, `what-changes`, `proof--realness`, `becoming-real`) plus its video page and `welcome-visitors` hub.

`sync.js` transforms each source page into the subdomain shape:
```
[intro]      [[<label>]] <verb> [[<session video>]]? Below we summarise the discussion:
[## In brief] quote-free clarifying summary (optional — from ~/.wiki/_summaries.json)
[body]       the two slots, VERBATIM from the source (header stripped)
[# See]      links the 5 hubs + the session video + transcript
```
**In brief:** keyed `"<card.src>-<session-slug>"` in `~/.wiki/_summaries.json` (override with `SUMMARIES_FILE`). Inserted right under the intro so the concrete answer leads the detailed prose. Optional + back-compatible: missing file/key → page builds without it (a WARN, not a FAIL). All text is **ASCII-normalised** (`asciify`) before push — the action endpoint mojibakes UTF-8 multibyte chars (em-dash/accents), so they are folded to ASCII.

## Coherence check (FAIL blocks the push)

Catches the rot that creeps in when pages are hand-forked between sites:
- **foreign session label** — page references another session's video (the real `tour` → "Deep Thought Realized" bug)
- **missing slot marker** — one of the two per-card slots absent (markers are defined per card in `CARDS`)
- **leftover hub list** — a `## Answers across the timeline` block that belongs only on the source hub, not a per-session page (the real `deep/becoming-real` bug)
- title mismatch / missing video link → FAIL; incomplete See block or thin body → WARN

## Usage

```bash
cd ~/.claude/skills/fedwiki-cohere-sync

# 1. dry-run: generate + check + stage (no auth). Inspect ~/.wiki/_sync_staging/<sub>/
SESSION='AGM 2027' node sync.js
SESSION=all node sync.js

# 2a. push directly (cookie on the command line — ad-hoc only)
WIKI_SESSION='<wikiSession>' SESSION='AGM 2027' PUSH=1 node sync.js

# 2b. push via broker (PREFERRED — cookie stays on disk, host-scoped)
BROKER=1 PUSH=1 SESSION=all node sync.js
```

## The cookie broker (delegated permission)

**Why:** a FedWiki `wikiSession` is *farm-wide owner access*, all-or-nothing. Pasting it into an agent's prompt leaks a live, multi-day credential. The broker keeps the cookie on disk and exposes only a scoped push.

**Setup (once):** copy `cookies.example.json` to `~/.wiki/.creds/cookies.json` (gitignored, chmod 600) and paste the `wikiSession` value(s). Expiry is **derived from the cookie string** (`…issuedMs.ttlMs.sig`), never hand-entered. Get the value from DevTools → Application → Cookies → `wikiSession`.

**Grant an agent a scope** with `WIKI_GRANT` (comma list of host globs). The broker refuses any host outside the grant *even though the cookie could write it*:
```bash
node broker.js list                                    # owners, coverage, expiry — no secrets
node broker.js check --host agm.timeline.ide.earth     # may I write it? which owner? expired?
WIKI_GRANT='agm.timeline.ide.earth' node broker.js push --host agm.timeline.ide.earth --slug who-cares --file page.json
WIKI_GRANT='agm.timeline.ide.earth' node broker.js push-dir --host agm.timeline.ide.earth --dir ~/.wiki/_sync_staging/agm
```
Every brokered push appends host/slug/owner/time to `~/.wiki/.creds/push-audit.log`. Expired cookies refuse with a re-login message instead of silent 401s.

**Owner reality on this farm:** federated identity — any one owner cookie writes the whole `*.timeline.ide.earth` farm (logging into one TLD logs into the siblings). So one `mitch@timeline` entry covers all subdomains; scope per-agent with `WIKI_GRANT`, not with separate cookies.

## Cookie rotation & hygiene

A `wikiSession` is a bearer credential: whoever holds it has full owner write across the farm until it expires (TTL is in the cookie itself, e.g. `…604800000` = 7 days). Treat it like a password.

- **Storage:** only in `~/.wiki/.creds/cookies.json` (gitignored, chmod 600). Never commit it, never echo it into a command where it lands in shell history or a transcript, never paste it into an agent prompt — that's the whole reason the broker exists (the broker reads it from disk; agents call the broker).
- **When to rotate:** if the value was ever exposed in plaintext (a chat transcript, a log, a screen-share), or on a routine cadence. Rotation is at the owner's discretion — exposure doesn't force it, but a leaked cookie stays valid farm-wide until its TTL lapses.
- **How to rotate:** log out / log back in on any `*.timeline.ide.earth` site in the browser (DevTools → Application → Cookies → `wikiSession`), copy the new value, replace `cookie` in `~/.wiki/.creds/cookies.json`. The old token is invalidated by re-login. Confirm with `node broker.js list` (shows the new `expires=` with no secret printed). No code changes needed — the broker derives expiry from the new string.
- **Check before a big push:** `node broker.js list` — if a cookie shows `[EXPIRED]`, the broker refuses with a re-login message rather than emitting silent 401s.

## Faithful backup — `pull.js` (the inverse of sync)

Once the subdomains are seeded and editing happens **live on the timeline sites** (they become the source of truth), `pull.js` mirrors each subdomain DOWN into a local farm twin so the local side is an exact, browsable backup. Read-only on the remote (public GET) — no cookie/broker needed.
```bash
node pull.js                    # back up every subdomain + the base roster -> ~/.wiki/<sub>.timeline.localhost/pages/
SUBS=web,myspace node pull.js   # only these
NOBASE=1 node pull.js           # skip the base timeline.ide.earth roster
```
Direction matters: `sync.js` pushes local→timeline (overwrites, for seeding); once timeline is truth, **stop running `sync.js` against pages edited live** (it would clobber them) and use `pull.js` to keep the backup current.

**Ownership caveat:** the farm is not necessarily one owner. A given subdomain can be owned by a different identity (different `cookieSecret`) and will return **403** to a cookie that writes the rest of the farm — observed with `myspace.timeline.ide.earth`. `pull.js` still backs it up (reads are public); writing it needs that subdomain's own cookie.

## Retargeting to another project

Edit the CONFIG block at the top of `sync.js`: `SRC_HOST` (source farm host), `MAP` (session → subdomain + video title), `DOMAIN`, and `CARDS` (source prefix → slug/title/intro-verb/slot markers). The push mechanics, checks, and broker are project-agnostic.

## Slug rules (FedWiki asSlug)
`title.replace(/\s/g,'-').replace(/[^A-Za-z0-9-]/g,'').toLowerCase()` — whitespace → hyphen, everything else deleted. `&` drops leaving a double hyphen ("Proof & Realness" → `proof--realness`); `?:'`drop entirely.

## Related
- `fedwiki-transcribe` — upstream: video → transcript → AI summary → the source answer pages this skill distributes.
- Source generators in `~/.wiki/`: `_gen_cards.js` (hubs), `_sync_subdomains.js` (the original project-specific instance of this sync).
