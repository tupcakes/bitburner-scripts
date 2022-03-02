import { spider } from "/libraries/spider.js";

/** @param {NS} ns **/
export async function main(ns) {
    let servers = spider(ns);

    let filteredservers = servers.filter(element => {
        //return element.name.includes('darkweb') === false && element.name.includes('home') === false;
        return element.name.includes('darkweb') === false;
    });

    // filteredservers.sort((a, b) => a.hackinglevel - b.hackinglevel);
    filteredservers.sort((a, b) => a.portsrequired - b.portsrequired);


    // Move all player owned servers to end of array
    let playerservers = [];
    playerservers = filteredservers.filter(s => s.name.includes('pserv-'));
    playerservers = playerservers.concat(filteredservers.filter(s => s.name.includes('home')));
    playerservers = playerservers.concat(filteredservers.filter(s => s.name.includes('hacknet-node-')));

    for (let i = 0; i < filteredservers.length; i++) {
        filteredservers.splice(filteredservers.indexOf('pserv-'));
        filteredservers = filteredservers.filter(item => item.name !== 'home');
        filteredservers.splice(filteredservers.indexOf('hacknet-node-'));
    }

    filteredservers = filteredservers.concat(playerservers);

    await ns.write('serversbyhacklvl.json', JSON.stringify(filteredservers), "w");
}