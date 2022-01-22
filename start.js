/** @param {NS} ns **/
export async function main(ns) {
	ns.run("mcp.js");
	ns.run("/gangs/tasks.js");

	await ns.sleep(10000);
	//ns.run("coordinator.js", 1, "n00dles");
}