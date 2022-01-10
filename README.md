# bitburner-scripts

## Notes
Some scripts are from other repos. I've either modified them for my own purposes or juse used them as is. I'll add source repo commments to the files over time.

## Git pull
```
nano git-pull.js
```
Copy contents of file into new file and run.

## What to run
I always run earlygame/attack_local.js as it will run early-hacking-template.js on every server with money and ram against itself.

Early on I run earlygame/early-hack-template.js against n00dles for some quick money/levels in combination with some low level crimes and Hacknet nodes.

Once home has more ram, I run earlygame/early-run.js against a low level server.

When I can start buying pservs, I run control.js against joesguns. Have at least two pservs with at least 64GB.

If early-run.js or control.js are running against a server, that server will be excluded from attack_local.js running early-hacking-template.js on it.

