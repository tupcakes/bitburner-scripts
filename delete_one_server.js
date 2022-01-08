/** @param {NS} ns **/
export async function main(ns) {
    var server = ns.args[0];
    ns.deleteServer(server);
}