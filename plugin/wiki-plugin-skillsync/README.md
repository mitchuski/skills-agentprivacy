# wiki-plugin-skillsync

A FedWiki item type `skillsync` — drop it on any page to show a live panel over a
skillsync catalog: packet count, harvest date, newest packets, and a highlight of
anything new since this browser last looked (localStorage; degrades gracefully).

Item text (all lines optional):

    catalog: /assets/skillsync/catalog.json
    member: mitch
    days: 7
    limit: 8

Point `catalog:` at another farm over the tailnet to watch THEIR shelf from YOUR page
(e.g. `http://mitchie.tail32e87c.ts.net:8081/assets/skillsync/catalog.json`).

## Install (local farm)

    cd %APPDATA%\npm\node_modules\wiki\node_modules
    xcopy /E /I "%USERPROFILE%\skill sync\plugin\wiki-plugin-skillsync" wiki-plugin-skillsync
    # restart the farm; add a "skillsync" item via the page JSON or the factory

No build step — the client is plain JS at `client/skillsync.js`.

## Test

    node -e "const {parse,render}=require('./client/skillsync.js');const c=parse('days: 7');console.log(render(c,{member:'t',count:1,updated:'2026-08-24',packets:[{name:'x',title:'X',kind:'skill',card:'hello',published:new Date().toISOString()}]},new Set()).slice(0,120))"
