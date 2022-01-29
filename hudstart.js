import { getpservcount, getpservram, getrootedcount, getrootedram, controlscriptsrunning, coordinatorscriptsrunning, cheeseintrunning } from "/libraries/hud.js";

/** @param {NS} ns **/
export async function main(ns) {
  ns.tail();
  ns.disableLog('ALL');


  while (true) {
    ns.print("-----Available Server Resources-----")
    ns.print("Total pservs:                " + getpservcount(ns));
    ns.print("Pserv 0 ram:                 " + getpservram(ns));
    ns.print("Total hacked servers:        " + getrootedcount(ns));
    ns.print("Total hacked servers ram:    " + getrootedram(ns) + " GB");
    ns.print("");
    ns.print("-----Running Processes-----")
    ns.print("Control scripts running:     " + controlscriptsrunning(ns));
    ns.print("Coordinator scripts running: " + coordinatorscriptsrunning(ns));
    ns.print("Cheeseint running:           " + cheeseintrunning(ns));
    ns.print("");
    ns.print("-----Gang Info-----")
    ns.print("Wanted Level:                " + ns.gang.getGangInformation().wantedLevel.toFixed(2));
    ns.print("Wanted Rate:                 " + ns.gang.getGangInformation().wantedLevelGainRate.toFixed(2));
    ns.print("Territory:                   " + ((ns.gang.getGangInformation().territory) * 100).toFixed(2));

    ns.print(Math.floor(Math.random() * 1000));
    await ns.sleep(20);
    ns.clearLog();
  }
}