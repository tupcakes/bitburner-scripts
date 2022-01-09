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

Once I have about 128 GB ram on the home node or pserv-0, I run earlygame/early-run.js against n00dles (or foodnstuff if I have a pserv-0 with enough ram).

If early-run.js is running against a server, that server will be excluded from attack_local.js running early-hacking-template.js on it.