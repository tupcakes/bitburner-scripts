/** @param {NS} ns **/
export function spider(ns) {
    // Return an array of all identifiable servers

    // Create a serversSeen array, containing only 'home' for now
    let serversSeen = [];
    const server = new Object
    server.name = 'home'
    server.hackinglevel = 0;
    server.maxmoney = 0;
    server.maxram = ns.getServerMaxRam('home');
    server.portsrequired = 0;
    serversSeen.push(server);

    // For every server we've seen so far, do a scan
    for (let i = 0; i < serversSeen.length; i++) {
        let thisScan = ns.scan(serversSeen[i].name);
        // Loop through results of the scan, and add any new servers
        for (let j = 0; j < thisScan.length; j++) {
            // If this server isn't in serversSeen, add it
            let index = serversSeen.findIndex((item) => item.name === thisScan[j]);
            if (index === -1) {
                const server = new Object
                server.name = thisScan[j]
                server.hackinglevel = ns.getServerRequiredHackingLevel(thisScan[j]);
                server.maxmoney = ns.getServerMaxMoney(thisScan[j]);
                server.maxram = ns.getServerMaxRam(thisScan[j]);
                server.portsrequired = ns.getServerNumPortsRequired(thisScan[j]);
                serversSeen.push(server);
            }
        }
    }
    return serversSeen;
}