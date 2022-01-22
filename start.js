/** @param {NS} ns **/
export async function main(ns) {
	ns.run("mcp.js");
	ns.run("/gangs/tasks.js");
	ns.run("pserv-controller.js");
}