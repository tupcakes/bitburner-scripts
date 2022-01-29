/** @param {NS} ns **/
export async function main(ns) {
	const programs = [
		"DeepscanV1.exe",
		"DeepscanV2.exe",
		"AutoLink.exe",
		"ServerProfiler.exe",
	];

	while (true) {
		await ns.sleep(20);

		const randomprogram = programs[Math.floor(Math.random() * programs.length)];

		if (ns.isBusy() === false) {
			ns.rm(randomprogram);
		}
	}
}