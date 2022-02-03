import { spider } from "/libraries/spider.js";

/** @param {NS} ns **/
export async function main(ns) {
    let servers = spider(ns);

    servers.sort((a, b) => a.hackinglevel - b.hackinglevel);
    
    await ns.write('serversbyhacklvl.json', JSON.stringify(servers), "a");
}