# Deploying the network pieces — marvin (02-pi4) and pi5

Nothing here has been deployed. These are the exact steps for when Mitch opens the doors.

## marvin — the herald (02-pi4): ntfy

[ntfy](https://ntfy.sh) is the "notify" open-source pub-sub notifier. Self-hosted on
marvin so discovery notifications never leave the tailnet.

```bash
# on 02-pi4 (Debian/Raspbian)
sudo mkdir -p /etc/ntfy /var/cache/ntfy
curl -fsSL https://github.com/binwiederhier/ntfy/releases/latest/download/ntfy_arm64.deb -o /tmp/ntfy.deb   # pi4 = arm64; use armv7 if 32-bit OS
sudo dpkg -i /tmp/ntfy.deb
sudo tee /etc/ntfy/server.yml >/dev/null <<'YML'
base-url: "http://02-pi4:2586"
listen-http: ":2586"
cache-file: /var/cache/ntfy/cache.db
behind-proxy: false
YML
sudo systemctl enable --now ntfy
curl -d "herald online" http://localhost:2586/skillsync-discoveries   # smoke test
```

Subscribe from any device on the tailnet: ntfy app → server `http://02-pi4:2586`,
topic `skillsync-discoveries`. The dream loop already points there
(`skillsync.config.json → marvin`).

Note: 02-pi4 currently serves a host-routed wiki-ish service on :80 (answers
`{"error":"unknown site"}`); ntfy on :2586 doesn't collide. If tailnet ACLs/firewall
are default-deny on the pi, open TCP 2586 to the tailnet.

## pi5 — the librarian

```bash
# from this machine
scp "librarian/server.js" opn@pi5:~/skillsync-librarian/server.js

# on pi5
sudo tee /etc/systemd/system/skillsync-librarian.service >/dev/null <<'UNIT'
[Unit]
Description=Skill Sync librarian
After=network.target
[Service]
ExecStart=/usr/bin/node /home/opn/skillsync-librarian/server.js 4242
WorkingDirectory=/home/opn/skillsync-librarian
Restart=on-failure
User=opn
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl enable --now skillsync-librarian
curl http://localhost:4242/    # smoke test
```

pi5 fronts :80/:443 with Caddy already; either open TCP 4242 to the tailnet, or add a
Caddy route (`handle_path /librarian/* { reverse_proxy localhost:4242 }`) and change
`librarian.url` in `skillsync.config.json` accordingly.

Data lives in `~/skillsync-librarian/data/` — `ledger.jsonl` is the hash chain
(each entry's `prev` = sha256 of the previous line; verify with any client). Back it up;
it IS the credential history.

## Write model

- GET/HEAD are open to the tailnet (tailnet = the auth boundary, same as the embassy).
- POST /submit, /adopt, /attest are open tailnet writes *by design*: every write is
  attributed, append-only, and chain-sealed — a false claim is visible and refutable,
  which is the trust-task posture (walk evidence over gatekeeping).
- POST /seal is gated by the leaderboard itself: 42 points = Librarian tier.
