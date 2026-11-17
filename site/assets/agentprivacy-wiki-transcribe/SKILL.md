---
name: agentprivacy-wiki-transcribe
description: >
  Transcribe video/audio assets hosted on a FedWiki (Smallest Federated Wiki)
  page using local whisper.cpp, then turn the transcripts into wiki pages. Use
  when pointed at a FedWiki page or assets folder (e.g.
  http://<wiki-host>/view/<page>) and asked for transcripts or subtitles.
  Enumerates the assets folder through the assets plugin's hidden list endpoint,
  streams each file over the network, extracts 16 kHz mono audio with ffmpeg,
  runs whisper.cpp (large-v3-turbo) to produce .txt/.srt/.vtt, and assembles
  video pages, answer pages, hub cards, an index and a workshop page. Local
  only — no audio leaves the machine. Kept by the Librarian 🗃️.
license: Apache-2.0
metadata:
  version: "1.0"
  category: "wikis"
  alignment: "mage"
  layer: "onboarding"
  keeper: "librarian"
  authoring_persona: "chronicler"
  personas: "librarian (keeper — the assets shelf, the page shapes, the hub that makes pages reachable) · chronicler (compression: transcript → summary → five answers) · witness (the record kept verbatim beside the summary)"
  origin: "0xagentprivacy"
  author: "the Keeper"
  introduced: "2026-06-21"
  tooling: "transcribe-assets.ps1 · make-wiki-page.ps1 · stage-wiki-pages.ps1 · attach-transcripts-as-assets.ps1 · build-index-page.ps1 · build-workshop-page.ps1 · build-answer-pages.js · build-hub-cards.js · push-page.js (this folder)"
  related_skills: "agentprivacy-wiki-cohere-sync (downstream: distributes the answer pages), agentprivacy-wiki-to-pdf, agentprivacy-wiki-assets, agentprivacy-wiki-page, agentprivacy-wiki-welcome"
  source_corpus: "a workshop wiki's assets folder of session videos; the *.timeline.ide.earth answer-page shape"
  upstream: "none recorded (uses whisper.cpp + ffmpeg as tools)"
---

# agentprivacy-wiki-transcribe

**🗃️🎙️ FedWiki video transcription — local, streamed, shelved**
Keeper: the Librarian 🗃️ · Authored by the Chronicler 🧙📖 · Category: wikis · Layer: onboarding

> The recording stays where it was; the words come home.

End-to-end flow: **FedWiki assets folder → list files → stream audio (ffmpeg) →
transcribe (whisper.cpp) → .txt/.srt/.vtt → wiki pages**. Everything runs on
your machine; nothing is uploaded to a transcription service.

## When to use

You're pointed at a FedWiki page or assets folder hosting videos and asked for
transcripts. FedWiki URLs look like `http://<host>/view/<page>/view/<page>`;
the videos live in an **assets** story item that names a folder (e.g.
`workshop-videos`).

## Prerequisites

- **whisper.cpp** built: `<whisper.cpp>/build/bin/Release/whisper-cli(.exe)`
- **Model**: `<whisper.cpp>/models/ggml-large-v3-turbo-q5_0.bin` (high accuracy, multilingual)
- **ffmpeg** on PATH (or pass `-Ffmpeg <full path>`)

Building whisper.cpp fresh needs CMake + a C++ compiler. On Windows, VS Build
Tools bundles both: `cmake -B build -G "Visual Studio 16 2019" -A x64` then
`cmake --build build --config Release`.

## How enumeration works (the key trick)

FedWiki's assets plugin renders the file list **client-side**, so the folder URL
just returns the SPA shell. The real listing endpoint — found by reading
`/plugins/assets/assets.js` — is:

```
GET {WikiBase}/plugin/assets/list?assets={folder}   ->   {"error":null,"files":[ ... ]}
```

Individual files are served (no auth) at `{WikiBase}/assets/{folder}/{filename}`.
Filenames may contain spaces/apostrophes (`Groundhog Day.mov`, `don't-panic.mov`)
so URL-encode each segment.

Note: the wiki may print asset URLs with hostname `public.localhost` (only
resolves on the host machine). Substitute the host you can actually reach.

## Run it

```powershell
& "<skill-dir>/agentprivacy-wiki-transcribe/transcribe-assets.ps1" `
    -WikiBase "http://<wiki-host>" `
    -AssetsFolder "workshop-videos"
```

Useful params: `-OutDir` (default `$env:USERPROFILE\transcripts`),
`-Exclude @("file.mov")`, `-Include @(...)`, `-KeepWav`, `-Language en|auto`,
`-Model <path>`, `-Cli <path>`, `-Ffmpeg <path>`, `-Threads 16`.

The script is **idempotent**: a video whose `<base>.txt` already exists is
skipped, so it resumes after interruption. It streams audio (never saves the
multi-GB video), deletes the temp WAV on success, and logs to
`<OutDir>/_batch_log.txt`. Run large batches in the background and tail the log —
transcription is CPU-bound, roughly real-time per video with the large model.

**Loop guard:** whisper can fall into a degenerate repetition loop (one line
repeated for the rest of the file). The script counts the longest run of
identical lines; at ≥30 it retries once with `-mc 0` (no prior-text context),
which breaks the feedback that sustains the loop.

## Manual single-file equivalent

```powershell
& ffmpeg -y -i "http://<wiki-host>/assets/workshop-videos/session_01.mov" -vn -ar 16000 -ac 1 -c:a pcm_s16le out.wav
& <whisper-cli> -m <model.bin> -f out.wav -t 16 -otxt -osrt -ovtt -of out
```

## From transcripts to pages

The summary (title, summary, key points, action items) is **agent work** — read
the transcript and write it into a `<base>.content.json`
(`{ title, videoUrl, caption, summary, keyPoints[], actionItems[], see[] }`).
The scripts do the mechanical JSON:

| Script | Does |
|---|---|
| `make-wiki-page.ps1` | Assemble a "Video Template"-shaped page: `video` item + Summary / Key points / Action items / See. Transcript either as a collapsed section after a `pagefold` (`-TranscriptFile`) or as a downloadable asset (`-TranscriptAsset`). Accepts `-FromJson`. |
| `stage-wiki-pages.ps1` | Copy every `*.page.json` to `wiki-pages/<slug>` (no extension — that IS the FedWiki page filename). |
| `attach-transcripts-as-assets.ps1` | Move transcripts out of the page JSON into `assets/<slug>/` (`<slug>.txt/.srt/.vtt`, self-describing downloads), regenerate pages with an `assets` item, re-seed. Keeps titles/slugs so links still resolve. |
| `build-index-page.ps1` | Write a `workshop-videos` hub linking every generated page, and patch `welcome-visitors` to link the hub — FedWiki navigation is link-driven; an unlinked page is unreachable. |
| `build-workshop-page.ps1` | A master page: session links, a "how it was made" note, and an `assets` item exposing every transcript, summary and page JSON (plus these scripts) for download. |
| `build-answer-pages.js` | The five question-answer pages per session (`<prefix>: <session>`), in the structured timeline shape. |
| `build-hub-cards.js` | The five Question-Card hub pages, reusing the canonical card text from a `<srcBase>` wiki and rewriting the "Answers across the timeline" list. |
| `push-page.js` | Push one page JSON via the fork action (`WIKI_BASE`, `WIKI_SESSION`/`WIKI_COOKIE`, `DRY=1`). For anything beyond an ad-hoc push, use the broker in `agentprivacy-wiki-cohere-sync` so the cookie never enters context. |

## Notes / gotchas

- whisper.cpp's built-in decoder reads WAV/MP3 but **not video containers** — hence ffmpeg.
- whisper wants 16 kHz mono PCM; `-ar 16000 -ac 1 -c:a pcm_s16le` produces exactly that.
- Non-English audio: `-Language auto` (the turbo model is multilingual).
- Faster at some accuracy cost: point `-Model` at `ggml-base.en.bin` or a `small` model.
- Write page JSON **UTF-8 without BOM** — FedWiki's `JSON.parse` rejects a BOM.
  On Windows PowerShell 5.1, read UTF-8 explicitly (`[IO.File]::ReadAllText(..., UTF8)`);
  `Get-Content` misreads BOM-less UTF-8 as ANSI and mojibakes em-dashes and quotes.
- Native tools write progress to stderr; under `$ErrorActionPreference = "Stop"`
  PS 5.1 turns that into a terminating error — switch to manual exit-code checks
  around ffmpeg/whisper (the script does).
- Transcripts of other people's sessions are *their* words: publish summaries and
  transcripts only on the wiki the recordings came from, or with the speakers' say.

---
**Verify:** [agentprivacy.ai](https://agentprivacy.ai) · kept by the Librarian 🗃️ in the Tower's Wikis
