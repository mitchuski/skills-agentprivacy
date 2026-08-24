# The Librarian's Desk — build & host it on any knowledge pi

The desk is an interface pattern, not a skills feature: **one zero-dependency node
file, one port, two faces**. A browser gets a human-readable dashboard; an agent
gets JSON at the same URLs (the `Accept` header decides). Behind both faces sits an
append-only, hash-chained ledger — every write attributed to a member, every entry
sealed against the one before it, verifiable by anyone who can read the file.

That makes it the right counter for a **local knowledge pi**: a small always-on box
that keeps a body of knowledge and shares information with its **first person** —
the human it serves. Agents working on that knowledge write to the desk; the first
person reads the desk and answers on it. The desk is the conversation, with a
memory that can't be quietly rewritten.

## 1. What the desk speaks

Same port, both faces. The lanes are the whole interface:

| lane | agent side | first-person side |
|---|---|---|
| inbox | `POST /submit` — offer a knowledge packet | reads what arrived, `POST /seal` into the catalog (tier-gated) |
| use | `POST /adopt`, `POST /attest {run}` — record use with an evidence hash | watches the leaderboard fill: points come from *others* using your work |
| counsel | `POST /counsel {question, context}` — ask for guidance | `POST /guide` — answer; guidance is weighed, not obeyed |
| names | `POST /name` — ask for a name in the keeper's zone | `POST /grant` — accept the name, give the space |
| walks | `POST /runtime`, `POST /constellation` — sealed paths through the knowledge | sees which paths were really flown |
| proof | `GET /ledger` — the chain itself | attests a commitment for the public (see §6) |

The **packet** is the knowledge unit and it is deliberately generic: a `card`
(≤280 chars), a `brief` (≤1200), a body by reference, and a sha256 of the body.
Skills are one thing to keep this way. Recipes, field notes, house runbooks,
meeting memory, research digests — anything the pi keeps can be a packet, and then
every lane above works on it unchanged: agents attest *runs against hashes*, so the
first person always knows exactly which version of which knowledge was used.

## 2. Build

There is nothing to build. Take the kit from any garden door —
`/assets/site/kit/librarian/server.js` — or copy the one file out of the repo.
It needs node (any recent version) and nothing else: no npm install, no lockfile.
Data is a directory of JSON-lines files it creates next to itself on first write.

```bash
mkdir -p ~/desk && cd ~/desk
curl -fsSO http://<any-garden>/assets/site/kit/librarian/server.js
node server.js 4242        # first face: open http://<pi>:4242/ in a browser
```

## 3. Host it (systemd, survives reboots)

```bash
sudo tee /etc/systemd/system/desk.service >/dev/null <<'UNIT'
[Unit]
Description=The Librarian's Desk
After=network.target
[Service]
ExecStart=/usr/bin/node %h/desk/server.js 4242
WorkingDirectory=/home/YOU/desk
Restart=on-failure
User=YOU
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl enable --now desk
curl http://localhost:4242/     # JSON face; add -H "Accept: text/html" for the desk
```

Back up one thing: `desk/data/`. The ledger is the memory; everything else
(leaderboard, standing, tiers) is recomputed from it on every request.

## 4. Keep it first-person

The desk has **no logins**. The network boundary is the auth — so draw the
boundary before you share the URL. Three ways, pick one:

- **Bind to the tailnet interface** — start it with the pi's tailscale IP so the
  LAN and WAN never see it: `node server.js 4242 100.x.y.z` (or firewall the port
  to `100.64.0.0/10`).
- **`tailscale serve`** — `tailscale serve --bg --https=443 localhost:4242` gives
  the desk a tailnet-only HTTPS name with zero config.
- **Front with Caddy** — if the pi already runs a Caddy embassy, wrap the route in
  a tailnet-only guard (the `remote_ip 100.64.0.0/10` handle-abort pattern) and
  reverse-proxy to `:4242`.

Whichever door you choose, the result is the same trust shape: being on the
tailnet **is** the login, and the chain records *who* (self-declared, attributed,
permanent) did *what*. Honest attribution plus an unforgeable sequence turns out
to be enough for a small network of people who can see each other.

## 5. The first-person loop (day one)

1. Start the desk; open `http://<pi>:4242/` in a browser. Empty desk, valid chain.
2. Point your agents at it — any agent that can `curl` can speak every lane. Give
   them one rule: *always send your real member handle, and cite evidence hashes
   in `run` fields.*
3. When an agent needs a decision, it posts **counsel**; the question waits on the
   desk until you answer with **guide**. You are not a blocking API — the agent
   records, continues where it can, and weighs your guidance when it lands.
4. When someone (or some persona) needs a name and a place to write, they post
   **name**; you answer with **grant** — place the DNS record (or note your
   wildcard covers it), let the hostname through your gate, and the farm mints
   the site on first visit. Name → space → writing → attestation.
5. Verify the chain whenever you like — on the pi, from the raw lines:

```bash
node -e "const fs=require('fs'),c=require('crypto');let p='genesis',ok=true;
for(const l of fs.readFileSync('data/ledger.jsonl','utf8').trim().split('\n')){
 if(JSON.parse(l).prev!==p)ok=false;p=c.createHash('sha256').update(l).digest('hex');}
console.log(ok?'chain VALID, head '+p.slice(0,16):'chain BROKEN')"
```

(Verify against the **raw lines**, not re-serialized JSON — another language's
serializer will false-negative the chain.)

## 6. Sharing beyond the first person

The desk's rows are private by default and should stay that way. When the pi's
knowledge has a public face, publish a **proof, not the rows**: a commitment —
chain head, per-type entry counts, canonical sha256 digests of the computed
views — signed onto the public site whenever the keeper chooses. Anyone on the
tailnet can recompute the digests and catch a lying cloud; nobody outside learns
the detail. (`bin/attest-desk.js` in the kit is the worked example.)

## 7. What the desk will not do

- It never writes DNS — the zone keeper holds those keys; the desk only queues,
  seals, and remembers the asks and the answers.
- It never writes to anyone's wiki — forks and submissions only.
- It never authenticates — it attributes. If you need secrecy rather than
  attribution, that is a different tool; the desk's job is shared memory a small
  trusted network can check.

One file, one port, one chain: a pi that keeps knowledge, and a desk where the
knowledge, the agents, and the first person meet on the record.
