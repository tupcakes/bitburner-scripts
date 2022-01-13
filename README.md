# bitburner-scripts

## Notes
Some scripts are from other repos. I've either modified them for my own purposes or juse used them as is. I'll add source repo commments to the files over time.

## Git pull
```
nano git-pull.js
```
Copy contents of file into new file and run.

## What to run
I've changed and tweaked this process frequently, so this is subject to change.

### Starting out
Generate a server list with create_serverlist.js.

Fire off earlygame/attack_local.js
It will automatically run early-hacking-template.js on all hosts against themselves.

Also run earlygame/early-run.js against n00dles or more low level servers.

If there isn't enough ram to run earlygame/early-run.js yet, just run early-hacking-template.js directly against one of the low level servers with as many threads as you can do from home.

### Increase ram on home
Once you have more ram on home (at least 32-64 GB), try runnning control.js against 1 or 2 low level servers. It's more effient than the starting out scripts.

### Buy more servers
Get more servers with at least 32 GB of ram each (more ram is better).

Run control.js against more low level servers. It should schedule weaken, grow, and hack jobs on the purchased servers, with control.js instances running on home.

### Late game
Run buy/servers.js 1024 or more ram. It will keep buying servers until the max is reached.

Run home-distributed.js. It will run control.js against all servers in server_list.txt.

Occiasionally replace all purchased servers with larger versions when money allows.

Profit.