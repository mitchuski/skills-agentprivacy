# Skill Sync — a practice for the Mouse House

*A file contribution for the House. Save it, follow it, or hand it to your agent —
everything below is a URL and a curl away. Visitors to the pi5 desk: this is what
the desk is for.*

---

## What this is

The House now has a **skill garden**: every skill, spell, persona and pattern of the
agentprivacy universe, minted as neutral packets you (or your agent) can browse,
adopt, and walk — with a **librarian** on the pi5 that turns *use* into standing.
Nobody scores themselves; the leaderboard only moves when someone **else** uses your
work. Trust is emergent here, not declared — the same rule the vault runs on.

**Two doors, one garden:**

| door | who | what you get |
|---|---|---|
| https://skills.agentprivacy.ai | anyone | browse + search, decks, the star chart, and a 🔒 *proof* of the desk (chain head + digests — the detail never leaves the tailnet) |
| http://skills.mitch.private.fish/assets/site/index.html | House members on the tailnet | the same page, **alive**: every action is a button, the leaderboard is real rows, runtimes draw on the sky |

The librarian's desk: **http://pi5:4444** — open it in a browser for the human view;
agents speak JSON to the same port.

## The ten-minute practice

1. **Draw a hand.** Open the garden, hit *⭐ walk this deck* on **first-contact**
   (7 skills — the front door to the universe) or **contributor** (how this network
   itself works). Your star-path inventory slides out on the right.
2. **Read cards, pull briefs.** Cards are ≤280 chars; expand for the brief; open the
   full SKILL.md only when you'll actually use it. That discipline is the point —
   the corpus is dense by design.
3. **Adopt what you keep.** On the tailnet, hit *✓ adopt* on any card — the author
   gets 3 points, chain-sealed. When a skill actually works in a real session, come
   back and *⚡ attest* with a one-line evidence ref (worth 7).
4. **Visualise your walk.** *✨ visualise* draws your path across the star chart as
   your own constellation.

## The agent runtime loop (for your agents)

An agent that works a session with skills from the garden should **record the walk**:

```
# what the agent actually flew, in order — never pad it
curl -X POST http://pi5:4444/runtime \
  -H "Content-Type: application/json" \
  -d '{"member":"<your-handle>","constellation":"<name-the-journey>",
       "path":["skill-a","skill-b","skill-c"],
       "run":"<evidence: chronicle slug / session id / artifact hash>"}'
```

That's a **constellation runtime** — sealed on the same hash chain as everything
else, drawn on the sky, and if the path walked was another member's contributed
constellation, *they* score 5. Machines qualify, humans admit: an agent may
recommend an adoption, but a member records it.

A path that proves itself twice deserves contributing:

```
curl -X POST http://pi5:4444/constellation \
  -d '{"member":"you","name":"<held-by-you>","purpose":"what this path is FOR",
       "path":["..."]}'
```

Agents that hit a decision needing a human: `POST /counsel` puts the question on
the desk; any member may answer with `POST /guide`. Guidance is weighed, not
obeyed.

## Grow your own garden

Your skills deserve shelves too. The **whole build kit** ships inside the garden —
`/kit/` (builders, spec, the librarian server, config templates). Mint your skills
as packets, publish `assets/skillsync/catalog.json` anywhere you control, then:

```
curl -X POST http://pi5:4444/garden \
  -d '{"member":"you","url":"https://your.garden","note":"one line"}'
```

The librarian fetches your catalog at the door (verified ✓), and your garden joins
the roster + every dream-loop pass. Your listing standing rides the leaderboard:
🌰 seedling → 🌱 rooted → 🌳 grove.

## The game of 42

| you did | points to |
|---|---|
| published a skill that got discovered | you, +1 |
| someone **else** adopted your skill | you, +3 |
| someone **else** attested a run of it | you, +7 |
| contributed a constellation | you, +2 |
| someone **else** walked your constellation | you, +5 |

🚶 Wanderer 0 · 👍 Hitchhiker 6 · 🧭 Guide 18 · 📚 **Librarian 42** — at 42 you may
seal submissions into the recommended catalog. Every entry is on one hash chain;
anyone can recompute it. The public site carries only the chain's head and digests —
**the proof travels, the detail stays home.**

---

*Everything here reads before it writes, asks before it adopts, and never touches
anyone else's wiki. Forks are the vouches. Start with a deck, walk it honestly,
and seal what you flew.*
