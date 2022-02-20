import {solveContract} from "/contracts/solve-contract.js"

/** @param {NS} ns **/
export async function main(ns) {
	await dfs(ns, null, "home", trySolveContracts, 0);
}

/** @param {NS} ns **/
async function dfs(ns, parent, current, f, depth, ...args) {
	var hosts = ns.scan(current);
	if (parent != null) {
		const index = hosts.indexOf(parent);
		if (index > -1) {
			hosts.splice(index, 1);
		}
	}

	await f(ns, current, depth, ...args);

	for (let index = 0, len = hosts.length; index < len; ++index) {
		const host = hosts[index];
		await dfs(ns, current, host, f, depth+1, ...args);
	}
}

/** @param {NS} ns **/
async function trySolveContracts(ns, host, depth) {
	var contracts = ns.ls(host, "cct");
	for (var contract of contracts) {
		solveContract(ns, host, contract, 0);
	}
}