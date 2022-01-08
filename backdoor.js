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
		let backdoor = ns.getServer(server).backdoorInstalled;
        let hacklevelreq = ns.getServerRequiredHackingLevel(server);

        if (backdoor == false && hacklevelreq <= ns.getHackingLevel()) {
            ns.print(server + "----Hack:" + hacklevelreq + "----Backdoor:" + backdoor);
        }
    }
    ns.tail("backdoor.js");
}