/** @param {NS} ns **/
export async function main(ns) {
    let target = ns.args[0];

    let files = ns.ls('home', ".js");
	files.push('server_list.txt');

    for (let i = 0; i < files.length; i++) {
        ns.print(target + ": " + files[i]);
        await ns.scp(files[i], target);
        await ns.sleep(20);
    }
}