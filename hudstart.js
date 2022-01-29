import { getpservcount, getpservram, getrootedcount, getrootedram, controlscriptsrunning } from "/libraries/hud.js";

/** @param {NS} ns **/
export async function main(ns) {
  ns.tail();
  ns.disableLog('ALL');


  while (true) {
    ns.print("-----Available Server Resources-----")
    ns.print("Total pservs:             " + getpservcount(ns));
    ns.print("Pserv 0 ram:              " + getpservram(ns));
    ns.print("Total hacked servers:     " + getrootedcount(ns));
    ns.print("Total hacked servers ram: " + getrootedram(ns) + " GB");
    ns.print("");
    ns.print("-----Running Processes-----")
    ns.print("Control scripts running:  " + controlscriptsrunning(ns));
    ns.print("");
    ns.print("-----Gang Info-----")
    ns.print("Wanted Level:             " + ns.gang.getGangInformation().wantedLevel);
    ns.print("Wanted Rate:              " + ns.gang.getGangInformation().wantedLevelGainRate);
    ns.print("Territory:                " + (ns.gang.getGangInformation().territory) * 100);

    ns.print(Math.floor(Math.random() * 1000));
    await ns.sleep(20);
    ns.clearLog();
  }
}