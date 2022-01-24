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
Generate a server list with create_serverlist.js. You might need to remove home.

Fire off earlygame/attack_local.js
It will automatically run early-hacking-template.js on all hosts against themselves. If there is enough ram, run mcp.js instead.

Run earlygame/coordinator.js n00dles or against another low level server you have root on.

If there isn't enough ram to run earlygame/coordinator.js yet, just run early-hacking-template.js directly against one of the low level servers with as many threads as you can do from home.

Buy more ram for home as soon as possible.

### Buy more servers
Get at leat two servers with at least 32 GB of ram each (more ram is better).

Run control.js against more low level servers. It should schedule weaken, grow, and hack jobs on the purchased servers, with control.js instances running on home.

### Late game
Run buy/servers.js 1024 or more ram. It will keep buying servers until the max is reached.

Run pserv-controller.js. It will run control.js against all servers in server_list.txt, but limited to how many pservs are available

Occiasionally replace all purchased servers with larger versions when money allows.

Profit.


## My Order
- BN 1 - All
- BN 2 - 2.1
- BN 4 - All
- BN ?