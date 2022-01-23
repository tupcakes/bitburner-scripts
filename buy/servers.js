/** @param {NS} ns **/
export async function main(ns) {
    let ram = ns.args[0];
    let i = 0;

    let files = ns.ls('home', ".js");
    files.push('server_list.txt');

    if (ns.getPurchasedServers().length == ns.getPurchasedServerLimit()) {
        ns.tprint("Already purchased max servers.");
        return;
    }

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            while (ns.serverExists("pserv-" + ram + "GB-" + i)) {
                i++;
            }
            let pserv = ns.purchaseServer("pserv-" + ram + "GB-" + i, ram);

            // copy scripts
            for (let i = 0; i < files.length; i++) {
                ns.print(pserv + ": " + files[i]);
                ns.rm(files[i], pserv);
                // get new copies
                await ns.scp(files[i], pserv);
                await ns.sleep(20);
            }

            i++;
        }
        await ns.sleep(1000);
    }
}