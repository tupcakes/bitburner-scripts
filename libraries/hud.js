/** @param {NS} ns **/
export function getpservcount(ns) {
	// get pserv count
	let pservs = ns.getPurchasedServers();
	if (pservs.length > 0) {
		return pservs.length;
	} else {
		return 0;
	}
}


/** @param {NS} ns **/
export function getpservram(ns) {
	// get pserv ram
	let pservs = ns.getPurchasedServers();
	if (pservs.length > 0) {
		return ns.getServerMaxRam(pservs[0]);
	} else {
		return 0;
	}
}


/** @param {NS} ns **/
export function getrootedcount(ns) {
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	let targetscount = 0;

	// get target count
	for (const target of targets) {
		if (ns.hasRootAccess(target.name) === true && ns.getServerMaxRam(target.name) > 0) {
			targetscount++;
		}
	}
	return targetscount;
}


/** @param {NS} ns **/
export function getrootedram(ns) {
	let targets = JSON.parse(ns.read("serversbyhacklvl.json.txt"));
	let targetsram = 0;

	// get target count and ram
	for (const target of targets) {
		if (ns.hasRootAccess(target.name) === true && ns.getServerMaxRam(target.name) > 0) {
			targetsram += ns.getServerMaxRam(target.name);
		}
	}
	return targetsram;
}


/** @param {NS} ns **/
export function controlscriptsrunning(ns) {
	let scripts = ns.ps('home');
	let i = 0;
	for (const script of scripts) {
		if (script.filename.includes('control.js') === true) {
			i++;
		}
	}
	return i;
}


/** @param {NS} ns **/
export function coordinatorscriptsrunning(ns) {
	let scripts = ns.ps('home');
	let i = 0;
	for (const script of scripts) {
		if (script.filename.includes('coordinator.js') === true) {
			i++;
		}
	}
	return i;
}


/** @param {NS} ns **/
export function cheeseintrunning(ns) {
	let running = ns.scriptRunning('cheeseint.js', 'home');
	if (running === true) {
		return true;
	} else {
		return false;
	}
}


/** @param {NS} ns **/
export function gangsrunning(ns) {
	let running = ns.scriptRunning('/gangs/tasks.js', 'home');
	if (running === true) {
		return true;
	} else {
		return false;
	}
}


/** @param {NS} ns **/
export function pservcontrollerrunning(ns) {
	let running = ns.scriptRunning('pserv-controller.js', 'home');
	if (running === true) {
		return true;
	} else {
		return false;
	}
}


/** @param {NS} ns **/
export function distsharerunning(ns) {
	let running = ns.scriptRunning('distributed-share.js', 'home');
	if (running === true) {
		return true;
	} else {
		return false;
	}
}


/** @param {NS} ns **/
export function mcprunning(ns) {
	let running = ns.scriptRunning('mcp.js', 'home');
	if (running === true) {
		return true;
	} else {
		return false;
	}
}