/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
	let file = ns.read("server_list.txt");
    let servers = file.split("\r\n"); //Parse servers using newline character
    
    for (let i = 0; i < servers.length; ++i) {
        //Parse each server into an array using split()
        let server = servers[i].split(",");
        
        // do stuff
        // if (ns.getServerMaxRam(server) == 0 && ns.getServerMaxMoney(server) > 0 && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
        //     ns.print(server + "--" + ns.getServerMaxRam(server) + "GB" + "--Hack:" + ns.getServerRequiredHackingLevel(server) + "--Money:" + ns.getServerMaxMoney(server));
        //     //ns.print('"' + server + '",');
        // }
        if (ns.getServerMaxRam(server) == 0 && ns.getServerMaxMoney(server) > 0) {
            ns.print('"' + server + '",');
        }
    }
}