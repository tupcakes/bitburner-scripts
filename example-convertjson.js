// example of how to convert data to json and then back again

/** @param {NS} ns **/
export async function main(ns) {

	let people = [];

	const person = new Object
	person.name = "mike";
	person.location = "home";
	person.description = "sysadmin";
	people.push(person);

    // convert object to json string
	let result = JSON.stringify(people);
	ns.tprint(result);

    // convert string back into object
    const obj = JSON.parse(result); 
    ns.print(obj[0].name);

}