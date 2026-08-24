---
name: fedwiki-transcribe
description: Transcribe video/audio assets hosted on a FedWiki (Smallest Federated Wiki) page using local whisper.cpp. Use when the user points to a FedWiki page or assets folder (e.g. http://david.local/.../workshop-videos) and wants the videos transcribed to text/subtitles. Enumerates the assets folder, streams each file over the network, extracts audio with ffmpeg, and runs whisper.cpp (large-v3-turbo) to produce .txt/.srt/.vtt.
---

# FedWiki video transcription

End-to-end flow: **FedWiki assets folder → list files → stream audio (ffmpeg) → transcribe (whisper.cpp) → .txt/.srt/.vtt**.

## When to use
The user references a FedWiki page or assets folder hosting videos and wants transcripts. FedWiki URLs look like `http://<host>/view/<page>/view/<page>`; the videos live in an **assets** story item that names a folder (e.g. `workshop-videos`).

## Prerequisites (already installed on this machine)
- **whisper.cpp** built: `~\whisper.cpp-master\build\bin\Release\whisper-cli.exe`
- **Model**: `~\whisper.cpp-master\models\ggml-large-v3-turbo-q5_0.bin` (high accuracy, multilingual)
- **ffmpeg**: `...\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-*-full_build\bin\ffmpeg.exe`

If building whisper.cpp fresh: it needs CMake + a C++ compiler. VS Build Tools 2019 bundles both —
`cmake -B build -G "Visual Studio 16 2019" -A x64` then `cmake --build build --config Release`.
(CMake is at `...\BuildTools\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe`.)

## How enumeration works (the key trick)
FedWiki's assets plugin renders the file list **client-side**, so the folder URL just returns the SPA
shell. The real listing endpoint — discovered from `/plugins/assets/assets.js` — is:

```
GET {WikiBase}/plugin/assets/list?assets={folder}   ->   {"error":null,"files":[ ... ]}
```

Individual files are served (no auth) at `{WikiBase}/assets/{folder}/{filename}`. Filenames may contain
spaces/apostrophes (`Groundhog Day.mov`, `don't-panic.mov`) so URL-encode each segment.

Note: the wiki may print asset URLs with hostname `public.localhost` (only resolves on the host machine).
Substitute the host you can actually reach (e.g. `david.local`).

## Run it
```powershell
& "~\.claude\skills\fedwiki-transcribe\transcribe-assets.ps1" `
    -WikiBase "http://david.local" `
    -AssetsFolder "workshop-videos"
```
Useful params: `-OutDir` (default `~\transcripts`), `-Exclude @("file.mov")`,
`-KeepWav`, `-Language en|auto`, `-Model <path>`, `-Threads 16`.

The script is **idempotent**: a video whose `<base>.txt` already exists is skipped, so it can be
resumed after interruption. It streams audio (does not save the multi-GB video), deletes the temp WAV
on success, and logs to `<OutDir>\_batch_log.txt`. Run it in the background for large batches and tail
the log — transcription is CPU-bound (no GPU here), roughly real-time per video with the large model.

## Manual single-file equivalent
```powershell
$ff="...\ffmpeg.exe"; $cli="...\whisper-cli.exe"; $m="...\ggml-large-v3-turbo-q5_0.bin"
& $ff -y -i "http://david.local/assets/workshop-videos/max_timeline_01.mov" -vn -ar 16000 -ac 1 -c:a pcm_s16le out.wav
& $cli -m $m -f out.wav -t 16 -otxt -osrt -ovtt -of out
```

## Notes / gotchas
- whisper.cpp's built-in miniaudio decodes WAV/MP3 directly but **not video containers** — hence ffmpeg.
- whisper wants 16 kHz mono PCM; the ffmpeg flags above produce exactly that.
- For non-English audio, pass `-Language auto` (the turbo model is multilingual).
- To speed up a large batch at some accuracy cost, point `-Model` at `ggml-base.en.bin` or a `small` model.
