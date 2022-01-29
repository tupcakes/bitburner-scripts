/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	const programs = [
		"DeepscanV1.exe",
		"DeepscanV2.exe",
		"AutoLink.exe",
		"ServerProfiler.exe",
	];

	while (true) {
		await ns.sleep(20);

		if (ns.isBusy() === false) {
			let randomprogram = programs[Math.floor(Math.random() * programs.length)];
			ns.rm(randomprogram);
		}

		
	}
}