// build-wiki.js — project the registry + loadouts into the skillsync.localhost fedwiki
// site (the shared shelf), and stage club-export/ pages for skill.fedwiki.club.
// Follows the skill-fedwiki conventions: BIJECTION RULE (slug === asSlug(title), titles
// ASCII-clean, emoji in the card not the title), journal = single create with full story.
//   node bin/build-wiki.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'skillsync.config.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), 'utf8'));
const pagesDir = cfg.shelf.farm_pages;
const assetsDir = cfg.shelf.farm_assets;
const clubDir = path.join(ROOT, 'club-export');
fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(path.join(assetsDir, 'skillsync'), { recursive: true });
fs.mkdirSync(clubDir, { recursive: true });

const id = () => crypto.randomBytes(8).toString('hex');
const asSlug = t => t.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
const md = text => ({ type: 'markdown', id: id(), text });
const firstSentence = s => (s || '').split(/(?<=[.!?])\s/)[0] || '';

const writtenSlugs = new Set(); // every shelf page written this run — the prune set
function writePage(dir, title, storyTexts, extraItems) {
  const story = storyTexts.map(md).concat(extraItems || []);
  const page = { title, story, journal: [{ type: 'create', item: { title, story }, date: Date.now() }] };
  fs.writeFileSync(path.join(dir, asSlug(title)), JSON.stringify(page, null, 2));
  if (dir === pagesDir) writtenSlugs.add(asSlug(title));
  return asSlug(title);
}
const both = (title, texts, extra) => { writePage(pagesDir, title, texts, extra); writePage(clubDir, title, texts, extra); };

// --- per-skill pages: BARE titles ("Kyra", not "Card Kyra") ------------------
// The slug is derived from the title (bijection rule), and the shelf mixes skill
// pages with hub pages — so bare titles need a guard: a skill whose title would
// collide with a hub page (or another skill) keeps the old 'Card ' prefix.
const deckTitle = name => 'Deck ' + name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const loadouts = fs.readdirSync(path.join(ROOT, 'loadouts')).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'loadouts', f), 'utf8')));
const HUB_TITLES = ['Welcome Visitors', 'Skill Shelf', 'Loadout Deck', 'How Skill Sync Works', 'Leaderboard',
  'Librarian Desk', 'How Skill Sync Was Built', 'Using Skill Sync From Your Agent', 'Recent Discoveries',
  'Gardens And Governance', 'Skill Star Chart'].concat(loadouts.map(d => deckTitle(d.name)));
const reserved = new Set(HUB_TITLES.map(asSlug));
const pageTitle = {}; // packet name -> its shelf page title
for (const p of catalog.packets) {
  let t = p.title;
  if (reserved.has(asSlug(t))) t = 'Card ' + p.title;
  if (reserved.has(asSlug(t))) t = p.name; // still colliding: the unique name wins
  reserved.add(asSlug(t));
  pageTitle[p.name] = t;
}

// export the name -> slug map so the garden UI and the engine bridge link correctly,
// and publish the name -> page-title map into the farm assets so the skillsync
// PLUGIN can resolve its row links (bare titles + the collision-guarded exceptions)
fs.writeFileSync(path.join(ROOT, 'registry', 'page-slugs.json'),
  JSON.stringify(Object.fromEntries(catalog.packets.map(p => [p.name, asSlug(pageTitle[p.name])])), null, 2));
fs.writeFileSync(path.join(assetsDir, 'skillsync', 'page-titles.json'), JSON.stringify(pageTitle, null, 2));

const KINDS = { persona: '\u{1F3AD}', skill: '\u{1F6E0}️', pattern: '\u{1F9EC}', agent: '\u{1F916}', ceremony: '\u{1F56F}️', plugin: '\u{1F50C}' };
for (const p of catalog.packets) {
  const title = pageTitle[p.name];
  const head = (p.emoji ? p.emoji + ' ' : '') + '**' + p.title + '** — ' + (KINDS[p.kind] || '') + ' ' + p.kind +
    (p.origin.tier ? ' · tier ' + p.origin.tier : '') + ' · ' + p.origin.universe + '/' + p.origin.category;
  const texts = [
    head,
    p.card,
    '**Brief**\n\n' + p.brief,
    'Full text: the SKILL.md asset below · packet hash `' + p.hash.slice(0, 16) + '` · published ' + p.published.slice(0, 10) +
    '\n\nFork this card to adopt — a fork is a countersignature. Then tell the librarian: `node bin/librarian-client.js adopt ' + p.name + '`',
    '**Doors:** [this skill in the garden](/assets/site/index.html#' + encodeURIComponent(p.name) + ') · [its star on the chart](/assets/site/star.html#star=' + encodeURIComponent(p.name) + ') · [[Skill Shelf]] · [[Welcome Visitors]]'
  ];
  const assetItem = { type: 'assets', id: id(), text: 'skillsync/' + p.name };
  // the like-shaped button: collect this skill into your star path as you browse
  const starpathItem = { type: 'starpath', id: id(), text: 'skill: ' + p.name };
  writePage(pagesDir, title, texts, [starpathItem, assetItem]);
  // stage the body asset
  const src = path.join(ROOT, 'registry', 'assets', p.name, 'SKILL.md');
  const dst = path.join(assetsDir, 'skillsync', p.name);
  fs.mkdirSync(dst, { recursive: true });
  fs.copyFileSync(src, path.join(dst, 'SKILL.md'));
}

const keepNames = new Set(catalog.packets.map(p => p.name));
const farmSkillAssets = path.join(assetsDir, 'skillsync');
for (const d of fs.readdirSync(farmSkillAssets)) {
  if (d.endsWith('.json')) continue; // the catalogs
  if (!keepNames.has(d)) { fs.rmSync(path.join(farmSkillAssets, d), { recursive: true }); console.log('pruned asset: ' + d); }
}

// --- shelf index ---
const byKind = {};
for (const p of catalog.packets) (byKind[p.kind] = byKind[p.kind] || []).push(p);
const shelfTexts = [
  '\u{1F4DA} **The Skill Shelf** — ' + catalog.count + ' packets from ' + catalog.member +
  ', harvested ' + catalog.updated.slice(0, 10) + '. Machine door: `assets/skillsync/catalog.json`. Start with a [[Loadout Deck]] rather than the whole shelf.'
];
for (const kind of Object.keys(byKind)) {
  const rows = byKind[kind].map(p => '- [[' + pageTitle[p.name] + ']] ' + (p.emoji || '') + ' — ' +
    firstSentence(p.card).slice(0, 110)).join('\n');
  shelfTexts.push('# ' + (KINDS[kind] || '') + ' ' + kind + ' (' + byKind[kind].length + ')\n\n' + rows);
}
writePage(pagesDir, 'Skill Shelf', shelfTexts);

// --- loadout pages + hub ---
const pk = Object.fromEntries(catalog.packets.map(p => [p.name, p]));
for (const d of loadouts) {
  const title = deckTitle(d.name);
  both(title, [
    d.emoji + ' **' + title + '**\n\n' + d.purpose,
    d.packets.map(n => { const p = pk[n]; return '- ' + (p ? '[[' + pageTitle[n] + ']] ' + (p.emoji || '') + ' — ' + p.card.slice(0, 100) : n); }).join('\n'),
    'To load this deck into an agent: fetch `assets/skillsync/catalog.json`, take the briefs for these ' + d.packets.length +
    ' names, and pull full bodies only for the ones the task actually fires. Cards first, bodies on demand.'
  ]);
}
both('Loadout Deck', [
  '\u{1F0CF} **Loadout Decks** — curated subsets of the shelf. The corpus is dense by design; a deck is how a fresh model (or a visiting agent) gets a working hand without drawing all ' + catalog.count + ' cards.',
  loadouts.map(d => '- [[' + deckTitle(d.name) + ']] ' + d.emoji + ' — ' + firstSentence(d.purpose)).join('\n')
]);

// --- protocol / join page (shelf + club) ---
both('How Skill Sync Works', [
  '\u{1F501} **How Skill Sync works** — a neutral protocol for sharing skills, spells, personas and agent files across the tailnet farms and the fedwiki club.',
  '# Publish\n\nPut a `skillsync/catalog.json` under your site assets (cards + briefs; full SKILL.md bodies as per-skill assets). One fedwiki card page per packet makes everything forkable.',
  '# Discover\n\nRun the dream loop on your own cadence: it polls the roster catalogs, diffs against yesterday, and marvin (the pi4 herald) pushes a ntfy notification for every new spell: who, what, the card.',
  "# Adopt\n\nFork the card into your farm (fork = countersignature), then record it with the pi5 librarian: adoptions land on a hash-chained ledger. No one ever writes to anyone else's wiki.",
  '# Grow\n\nPoints come from OTHERS using your work: discovered = 1, adopted = 3, attested run = 7, **constellation contributed = 2, your constellation walked by another member = 5**. Tiers: \u{1F6B6} Wanderer 0 · \u{1F44D} Hitchhiker 6 · \u{1F9ED} Guide 18 · \u{1F4DA} Librarian 42. At 42 you may seal submissions into the recommended catalog. See [[Leaderboard]] and [[Skill Star Chart]].',
  '# Contribute a constellation\n\nCollect skills into a path with the \u{2B50} starpath button as you browse the cards, then **contribute** it: a named, purposeful path offered to the network (`POST /constellation`). Your name holds the constellation; every other member who walks it (seals a runtime on it) scores you 5. Curating good paths through the library is as valuable as writing new skills.'
]);

// --- leaderboard seed (dreamloop/librarian refresh it) ---
both('Leaderboard', [
  '\u{1F3C6} **Leaderboard** — computed from the librarian ledger (pi5), never stored. Refreshed by the dream loop when the librarian is reachable.',
  '| member | published | adopted-by-others | attested | points | tier |\n|---|---|---|---|---|---|\n| mitch | ' + catalog.count + ' | 0 | 0 | ' + catalog.count + ' | \u{1F4DA} seeding |',
  'The seed row only counts publication. The game starts when the first *other* member adopts.'
]);

// --- the Librarian Desk (viewable interface pointer + the game) ---
both('Librarian Desk', [
  "\u{1F4DA} **The Librarian's Desk** — the network counter that turns use into credentials. It lives on pi5 and has two faces on ONE port: open it in a browser for the desk (leaderboard, inbox, ledger, chain-validity badge); speak JSON to the same URL from an agent.",
  '# Where\n\n- On the tailnet: `http://pi5:4242/` (once deployed; local preview: `http://127.0.0.1:4242/`)\n- Agents: `GET /catalog /inbox /ledger /leaderboard` · `POST /submit /adopt /attest /seal`',
  '# The game\n\nSubmit a packet and it lands in the inbox. Another member adopting it (fork the card, then `POST /adopt`) earns YOU 3 points; an attested run earns 7. Every write is an attributed, append-only entry on a hash chain — each entry carries the sha256 of the previous line, so anyone can recompute the whole history. At 42 points you reach Librarian tier and may seal inbox submissions into the recommended catalog.',
  'See [[How Skill Sync Works]] for the protocol and [[Leaderboard]] for the standings mirror on this shelf.'
]);

// --- the build chronicle (how this was made) ---
both('How Skill Sync Was Built', [
  '\u{1F4DC} **How Skill Sync was built** — 2026-08-24, one session, in `~/skill sync` on the keeper’s machine. This page is the working record; fork it if you build your own.',
  '# The problem\n\nThe agentprivacy corpus had grown past easy sharing: 167 universe skills, 20+ workbench skills, personas, patterns, the dual-agent harness. Dense by design — but a fresh model, or a collaborator agent on the tailnet, had no way to pick a working hand. And skills lived in git repos and private directories: no neutral place to publish, discover, or adopt.',
  '# The shape\n\nThree zoom levels per skill (card 280 chars, brief 1200, full body as an asset) so an agent loads only what the task fires. A harvest walks the sources and mints one JSON packet per SKILL.md, sha256-hashed. A leak scan runs before anything is packaged — it caught one real credential on the first pass and refused that packet (a friend-secret that was already on the rotation list).',
  '# The pieces, in build order\n\n- **harvest** — 186 packets from two source trees; a name collision surfaced (the working copy of a skill vs the corpus copy) and the rule became: later source supersedes.\n- **the shelf** — this fedwiki site, generated: card pages (forkable), the [[Skill Shelf]] index, five [[Loadout Deck]]s, and the machine door `assets/skillsync/catalog.json`.\n- **the dream loop** — polls the roster farms (catalog first, sitemap fallback), first sight = silent baseline, then diffs become events. Proven with a mock notifier before touching the real one.\n- **the librarian** — zero-dependency node service; the hash chain was verified end-to-end (submit, adopt by a second member, attest by a third, recompute the chain, and the seal endpoint correctly refused a member below 42 points).\n- **the plugin** — a `skillsync` fedwiki item that renders catalog freshness on any page.',
  '# Machines\n\n- **the keeper’s machine** (this farm) — source of truth, harvest + shelf + dream loop\n- **marvin (02-pi4)** — the herald: ntfy notifications when the network publishes\n- **pi5** — the [[Librarian Desk]]\n\nEverything is plain JSON over HTTP inside the tailnet; nothing writes to anyone else’s wiki, ever. Contribution is a fork, and a fork is a countersignature.'
]);

// --- community usage page (agents pointing at this space) ---
both('Using Skill Sync From Your Agent', [
  '\u{1F916} **Using Skill Sync from your agent** — recipes for the community. Everything below is GET/POST against tailnet URLs; no credentials, no SDK.',
  '# Read the shelf\n\n1. `GET <shelf>/assets/skillsync/catalog.json` — every packet as a card (name, kind, emoji, card, hash, published)\n2. Pick a deck first: [[Loadout Deck]] lists five curated hands. Load the briefs from `catalog-full.json` for just those names.\n3. Pull a full body only when the task fires: `GET <shelf>/assets/skillsync/<name>/SKILL.md`',
  '# Prepare a fresh model\n\nPaste it the **first-contact** deck: seven briefs ≈ a page of text, instead of 186 skills. The deck page explains the order. This is the whole reason the system exists.',
  '# Watch for new skills\n\nRun your own dream loop against this shelf (the `skillsync-dreamloop` skill shows the shape: diff the catalog by `hash`, treat first sight as baseline), or subscribe your phone to marvin: ntfy server `http://02-pi4:2586`, topic `skillsync-discoveries`.',
  '# Publish your own\n\nPut a `skillsync/catalog.json` under YOUR site assets with the same packet shape ([[How Skill Sync Works]] has the spec) and ask the keeper to add your farm to the roster. Your skills then appear in everyone’s [[Recent Discoveries]] and notifications.',
  '# Adopt and grow\n\nFork the card page into your farm, then record it at the [[Librarian Desk]]: `POST http://pi5:4242/adopt {"member":"you","packet":"<name>","from":"<author>"}`. Attest a real run with `POST /attest` (+ a one-line trace ref). Points go to the AUTHOR — the game rewards making skills others keep.'
]);

// --- the star chart page ---
both('Skill Star Chart', [
  '✨ **The Skill Star Chart** — the whole library drawn as a sky. Every star a skill; lines are real relations (frontmatter kinship, body mentions, deck neighbourhood); each [[Loadout Deck]] traces a constellation.',
  '# View it\n\n- Tailnet: `http://skills.mitch.private.fish/assets/site/star.html`\n- Local farm: `http://skillsync.localhost:3030/assets/site/star.html`\n- Public (once deployed): `https://skills.agentprivacy.ai/star.html`',
  '# Constellation runtimes\n\nWhen an agent actually walks a path of skills through a working session, it records the walk at the [[Librarian Desk]]: `POST /runtime` with the constellation name, the ordered path, and a one-line evidence ref. The entry lands on the same hash chain as adoptions — **the walk evidence is the credential**. Recorded runtimes appear on the chart, so the sky fills with the paths that were really flown, not just the ones that were drawn.',
  'This is the same shape as the star-chart pathway grants in the VPKB lane: a constellation = a scoped path through a space, and a runtime = the sealed record of walking it.'
]);

// --- gardens & governance (the unified KB story) ---
both('Gardens And Governance', [
  '\u{1F3DB} **Gardens and governance** — skills, spells, and **plugins**, one packet system, one unified knowledge base per garden: private and public faces of the same fedwiki farm.',
  "# The farm governs its DNS point\n\nA garden is a fedwiki farm that holds a namespace and rules it: which sites exist under it, which are public (a deployed subdomain like skills.agentprivacy.ai), which are tailnet-only (hostname lanes on the farm's front door), and which are granted — a scoped path opened to one named peer for a while. The DNS point is the governance boundary: publishing, granting, and revoking are all acts of the farm's keeper, recorded where the community can see them.",
  '# One packet system, three kinds\n\n- **skills/spells** — SKILL.md packets: card · brief · body · hash\n- **patterns** — methods and harness shapes\n- **plugins** — fedwiki item types (like [[Wiki Plugin Starpath]] and [[Wiki Plugin Skillsync]]): the packet is the install-and-use skill, the code ships at `site/plugins/<name>/`. Adopting a plugin = installing it on YOUR farm and recording the adoption — then your garden gains the interface, not just the content.',
  '# Agents in the city\n\nAgents work inside this space and take human guidance through it: the **counsel lane** at the [[Librarian Desk]]. An agent posts an attributed guidance request (`POST /counsel`); any member may **be a guide** and answer (`POST /guide`); both sides are chain-sealed. Guidance, not command — the asking agent weighs it and walks on, and the \u{1F9ED} Guide tier is earned by exactly this. See [[Skillsync Counsel]]. The desk is neutral ground: any garden\u{2019}s agent can ask, any member can guide, and the record survives sessions.'
]);

// --- recent discoveries seed ---
writePage(pagesDir, 'Recent Discoveries', [
  '\u{1F319} **Recent Discoveries** — what the dream loop found across the roster farms. Rewritten on every pass; history in `events/events.jsonl`.',
  '(no passes recorded yet — run `node bin/dreamloop.js`)'
]);

// --- welcome ---
writePage(pagesDir, 'Welcome Visitors', [
  '\u{1F9ED} **Skill Sync** — the neutral shelf for skills, spells, personas and agent files, shared over the tailnet and mirrored toward the fedwiki club.',
  '- [[Skill Shelf]] — all ' + catalog.count + ' packets\n- [[Loadout Deck]] — start here: curated decks\n- [[Using Skill Sync From Your Agent]] — point your agent at this space\n- [[How Skill Sync Works]] — publish · discover · adopt · grow\n- [[Gardens And Governance]] — plugins · DNS governance · the counsel lane\n- [[Skill Star Chart]] — the library as a sky; constellation runtimes\n- [[Librarian Desk]] — the viewable counter on pi5\n- [[How Skill Sync Was Built]] — the working record\n- [[Recent Discoveries]] — the dream loop journal\n- [[Leaderboard]] — the game of 42',
  'Full-length skill pages live on the sibling site skill.localhost (tailnet lane 8081). This site is the light shelf: cards, briefs, decks, and the machine door `assets/skillsync/catalog.json`.'
], [
  { type: 'skillsync', id: id(), text: 'catalog: /assets/skillsync/catalog.json\nmember: mitch\ndays: 14\nlimit: 6' },
  // homepage star-path tray: your collected walk + the door to the visualisation
  { type: 'starpath', id: id(), text: 'tray: full' }
]);

// --- machine door: publish the catalogs into site assets ---
fs.copyFileSync(path.join(ROOT, 'registry', 'catalog.json'), path.join(assetsDir, 'skillsync', 'catalog.json'));
fs.copyFileSync(path.join(ROOT, 'registry', 'catalog-full.json'), path.join(assetsDir, 'skillsync', 'catalog-full.json'));

console.log('shelf pages: ' + fs.readdirSync(pagesDir).length + '  club-export pages: ' + fs.readdirSync(clubDir).length);

// prune: the shelf is fully generated — any page not written this run is stale
for (const f of fs.readdirSync(pagesDir)) {
  if (!writtenSlugs.has(f)) { fs.unlinkSync(path.join(pagesDir, f)); console.log('pruned page: ' + f); }
}
