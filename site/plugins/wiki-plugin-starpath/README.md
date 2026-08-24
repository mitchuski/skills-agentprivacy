# wiki-plugin-starpath

A like-shaped button for the skill space. Item type: starpath.

    skill: agentprivacy-kyra          # the skill this button collects
    chart: /assets/site/star.html     # visualise target
    librarian: http://pi5:4242        # where sealing posts (falls back to 127.0.0.1:4242)
    tray: full                        # full tray shows the ordered path + remove buttons

Tap on card pages as you browse; the path is per-browser (localStorage). Visualise opens
the star chart with #path=a,b,c drawn as an ad-hoc constellation; seal POSTs /runtime to
the Librarian (member handle remembered after first seal).

Install: copy this dir into wiki/node_modules and add to wiki package.json dependencies.