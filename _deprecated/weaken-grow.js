/** @param {NS} ns **/
export async function main(ns) {
    let target = ns.args[0];
    ns.disableLog('ALL');
    ns.clearLog();

    let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    
    while (true) {
        if (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target) && ns.getServerMoneyAvailable == ns.getServerMaxMoney(target)) {
            return;
        }
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            ns.print("");
            ns.print("Running weaken");
            ns.print("");
            await ns.weaken(target);
        }
        if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print("");
            ns.print("Running grow");
            ns.print("");
            await ns.grow(target);
        }
        await ns.sleep(500);
    }
}