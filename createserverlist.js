import { spider } from "/libraries/spider.js";

/** @param {NS} ns **/
export async function main(ns) {
    let servers = spider(ns);

    const filteredservers = servers.filter(element => {
        // return element.name.includes('pserv-') === false && element.name.includes('darkweb') === false && element.name.includes('home') === false;
        return element.name.includes('darkweb') === false && element.name.includes('home') === false;
    });

    filteredservers.sort((a, b) => a.hackinglevel - b.hackinglevel);

    await ns.write('serversbyhacklvl.json', JSON.stringify(filteredservers), "w");
}