/** @param {NS} ns **/
export function getsleevecrimechance(ns, crimearg, sleevenumber) {
    let crime = ns.getCrimeStats(crimearg);
    let sleeveinfo = ns.sleeve.getInformation(sleevenumber);
    let sleeve = ns.sleeve.getSleeveStats(sleevenumber);

    let chance =
        crime.hacking_success_weight * sleeve.hacking +
        crime.strength_success_weight * sleeve.strength +
        crime.defense_success_weight * sleeve.defense +
        crime.dexterity_success_weight * sleeve.dexterity +
        crime.agility_success_weight * sleeve.agility +
        crime.charisma_success_weight * sleeve.charisma;
        //0.025 * sleeve.intelligence;  // int crime weight
    chance /= 975;  // maxskilllevel 975
    chance /= crime.difficulty;
    chance *= sleeveinfo.mult.crimeSuccess;  // this is reference by mult.crimeSuccess
    //chance *= calculateIntelligenceBonus(sleeve.intelligence);

    return Math.min(chance, 1);
}


/** @param {NS} ns **/
export function getcrimerisk(ns, sleevenumber) {
    import { crimes } from 'constants.js'    

    /** Calculate the risk value of all crimes */
    let choices = crimes.map((crime) => {
        let crimeStats = ns.getCrimeStats(crime); // Let us look at the important bits
        let crimeChance = getsleevecrimechance(ns, crime, sleevenumber); // We need to calculate if its worth it
        /** Using probabilty(odds) to calculate the "risk" to get the best reward
        * Risk Value = Money Earned * Odds of Success(P(A) / ~P(A)) / Time taken
        *
        * Larger risk values indicate a better choice
        */
        let crimeRiskValue =
            (crimeStats.money * Math.log10(crimeChance / (1 - crimeChance + Number.EPSILON))) /
            crimeStats.time;
        return [crime, crimeRiskValue];
    });
    return choices;
}


/** @param {NS} ns **/
export function getbestcrime(ns, choices) {
    let bestCrime = choices.reduce((prev, current) => {
        return prev[1] > current[1] ? prev : current;
    });
    return bestCrime;
}