/** @param {NS} ns **/
export async function main(ns) {
	let loop = true

	// makes the script require just over 32 GB ram
	// document.addEventListener('keypress', ({ key }) => {
	// 	if (key === 'Enter') {
	// 		loop = false
	// 	}
	// })

	ns.stopAction();
	while (loop) {
		ns.commitCrime('Homicide');
		ns.print(ns.heart.break());
		await ns.sleep(3500);
	}
}