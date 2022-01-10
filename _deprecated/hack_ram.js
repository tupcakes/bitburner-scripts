/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
    let file = ns.read("server_list.txt");
    let servers = file.split("\r\n"); //Parse servers using newline character

    for (let i = 0; i < servers.length; ++i) {
        //Parse each server into an array using split()
        let server = JSON.stringify(servers[i].split(",")).replace('["', '').replace('"]', '');

        let ServerRequiredHackingLevel = ns.getServerRequiredHackingLevel(server);
        let HackingLevel = ns.getHackingLevel(server);
        let ServerMaxMoney = ns.getServerMaxMoney(server);
        let ServerMaxRam = ns.getServerMaxRam(server);
        let RootAccess = ns.hasRootAccess(server);

        // do stuff
        if (ServerMaxRam > 0 && ServerMaxMoney > 0 && ServerRequiredHackingLevel <= HackingLevel) {
            ns.print(server + "--" + ServerMaxRam + "GB" + "--Hack:" + ServerRequiredHackingLevel + "--Money:" + ServerMaxMoney);
            if (RootAccess == false) {
                ns.run("get_root.js");
            } else if (ServerRequiredHackingLevel <= HackingLevel) {
                ns.print("Hacking: " + server);
                ns.run("run.js", 1, server);
            } else {
                continue;
            }
        }
    }
}