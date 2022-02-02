import { spider, sortbyhacklevel } from "/libraries/spider.js";

/** @param {NS} ns **/
export async function main(ns) {
    let servers = spider(ns);

    servers.sort(sortbyhacklevel);
    
    await ns.write('serversbyhacklvl.json', JSON.stringify(servers), "a");
}