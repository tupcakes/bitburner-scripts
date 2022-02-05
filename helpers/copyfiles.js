/** @param {NS} ns **/
export async function main(ns) {
    let target = ns.args[0];

    let files = ns.ls('home', ".js");
	files.push('serversbyhacklvl.json.txt');

    for (let i = 0; i < files.length; i++) {
        ns.print(target + ": " + files[i]);
        await ns.scp(files[i], target);
        await ns.sleep(20);
    }
}