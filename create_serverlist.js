/** @param {NS} ns **/
export async function main(ns) {
	let foundnodes = [];
	let stack = [];
	let origin = ns.getHostname();
	stack.push(origin);

	while (stack.length > 0) {
		let node = stack.pop();
		if (foundnodes.includes(node)) {
			//Do nothing => "continue"
		} else {
			foundnodes.push(node);

			let nextNodes = ns.scan(node);
			for (let i = 0; i < nextNodes.length; ++i) {
				stack.push(nextNodes[i]);
			}
		}
	}

	for (let i = 0; i < foundnodes.length; i++) {
		ns.tprint(foundnodes[i]);
		await ns.write("server_list.txt", foundnodes[i], "a");
		if (foundnodes[foundnodes.length - 1] != foundnodes[i]) {
			await ns.write("server_list.txt", "\r\n", "a");
		}
	}
}