import { spider } from "/libraries/spider.js";

/** @param {NS} ns **/
export async function main(ns) {
    let servers = spider(ns);

    const filteredservers = servers.filter(element => {
        // return element.name.includes('darkweb') === false && element.name.includes('home') === false;
        return element.name.includes('darkweb') === false;
    });

    // filteredservers.sort((a, b) => a.hackinglevel - b.hackinglevel);
    filteredservers.sort((a, b) => a.portsrequired - b.portsrequired);

    await ns.write('serversbyhacklvl.json', JSON.stringify(filteredservers), "w");
}