//import { createexes } from "/libraries/utils.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL');
	//ns.enableLog('exec');
	ns.clearLog();
	ns.tail();
	
	const programs = [
		//"DeepscanV1.exe",
		//"DeepscanV2.exe",
		"AutoLink.exe",
		//"ServerProfiler.exe",
	];

	const cities = [
		"Aevum",
		"Volhaven",
		"Chongqing",
		"New Tokyo",
		"Ishima",
		"Sector-12",
	];

	while (true) {
		await ns.sleep(20);

		if (ns.isBusy() === false) {
			let randomprogram = programs[Math.floor(Math.random() * programs.length)];
			ns.print("Removing: " + randomprogram);
			ns.rm(randomprogram);
		}

		for (const program of programs) {
			if (ns.isBusy() === false) {
				ns.createProgram(program, false);
			}
		}
	}
}