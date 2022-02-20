import { getbesthackxp } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.run('coordinator.js', 1, getbesthackxp(ns));
}