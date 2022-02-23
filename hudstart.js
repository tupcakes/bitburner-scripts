import { getpservcount, getpservram, getrootedcount, getrootedram, controlscriptsrunning, coordinatorscriptsrunning, cheeseintrunning, gangsrunning, pservcontrollerrunning, distsharerunning, mcprunning, stockvalue, stockpositions } from "/libraries/hud.js";
import { gettime } from '/libraries/utils.js'



/** @param {NS} ns **/
export async function main(ns) {
    let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});
    
    const doc = eval("document"); // only doing eval for the HUD
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = [];
            const values = [];

            // visual check if script running
            //headers.push(Math.floor(Math.random() * 1000));
            headers.push(gettime());
            values.push("----------");

            headers.push("Resources");
            values.push("----------");
            // home ram
            let homeramavailable = ns.getServerMaxRam('home') - ns.getServerUsedRam('home');
            headers.push("Home ram avail/total:");
            values.push(homeramavailable.toFixed(2) + "/" + ns.getServerMaxRam('home') + " GB");

            // pserv count
            headers.push("Total pservs:");
            values.push(getpservcount(ns));

            // Servers with root
            headers.push("Servers with root:");
            values.push(getrootedcount(ns));

            // Usable ram
            headers.push("Usable Ram:");
            values.push(getrootedram(ns) + " GB");


            headers.push("Processes");
            values.push("----------");
            // 
            headers.push("MCP:");
            values.push(mcprunning(ns));

            //
            headers.push("Gang control:");
            values.push(gangsrunning(ns));

            if (stockvalue(ns)) {
                headers.push("Stocks");
                values.push("----------");
                //
                headers.push("Invested:");
                values.push(dollarUS.format(stockvalue(ns).invested));

                headers.push("Worth:");
                values.push(dollarUS.format(stockvalue(ns).worth));


                headers.push("Long Stocks:");
                values.push(stockpositions(ns).long);

                headers.push("Short Stocks:");
                values.push(stockpositions(ns).short);
            }


            if (ns.gang.inGang() === true) {
                headers.push("Gang");
                values.push("----------");
                //
                headers.push("Wanted Level/Penalty:");
                values.push(ns.gang.getGangInformation().wantedLevel.toFixed(2) + "/" + ((1 - ns.gang.getGangInformation().wantedPenalty) * 100).toFixed(2));

                //
                headers.push("Wanted Rate:");
                values.push(ns.gang.getGangInformation().wantedLevelGainRate.toFixed(2));

                //
                headers.push("Territory:");
                values.push(((ns.gang.getGangInformation().territory) * 100).toFixed(2));
            } else {
                headers.push("Gang");
                values.push("----------");
                
                headers.push("Karma:");
                values.push(ns.heart.break().toFixed(2));
            }


            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}