/** @param {NS} ns **/
export function getdivisions(ns) {
	let corp = ns.corporation.getCorporation();
	let divisions = [];

	for (let i = 0; i < corp.divisions.length; ++i) {
		divisions.push(ns.corporation.getDivision(corp.divisions[i].name));
	}
	return divisions;
}


/** @param {NS} ns **/
export function getproducts(ns, divisionarg) {
	let division = ns.corporation.getDivision(divisionarg);
	let products = [];

	for (let i = 0; i < division.products.length; ++i) {
		if (division.products[i]) {
			products.push(ns.corporation.getProduct(divisionarg, division.products[i]));
		}
	}
	return products;
}


/** @param {NS} ns **/
export function getemployees(ns, divisionarg, cityarg) {
	let employeeslist = ns.corporation.getOffice(divisionarg, cityarg).employees;
	let employees = [];
	for (let i = 0; i < employeeslist.length; i++) {
		employees.push(ns.corporation.getEmployee(divisionarg, cityarg, employeeslist[i]));
	}
	return employees;
}


/** @param {NS} ns **/
export async function assignemployees(ns, divisionarg, cityarg, employeesarg) {
	let researchemployees = Math.floor(employeesarg.length * .4);
	let operationsemployees = Math.floor(employeesarg.length * .15);
	let remainder = employeesarg.length - ((Math.floor(employeesarg.length * .15) * 4) + Math.floor(employeesarg.length * .4));
	let jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development"];


	for (const employee of employeesarg) {
		if (employee.pos !== 'Unassigned') {
			await ns.corporation.assignJob(divisionarg, cityarg, employee.name, 'Unassigned')
		}
	}


	// assign to jobs
	await ns.corporation.setAutoJobAssignment(divisionarg, cityarg, 'Operations', operationsemployees);
	await ns.corporation.setAutoJobAssignment(divisionarg, cityarg, 'Engineer', operationsemployees);
	await ns.corporation.setAutoJobAssignment(divisionarg, cityarg, 'Business', operationsemployees);
	await ns.corporation.setAutoJobAssignment(divisionarg, cityarg, 'Management', operationsemployees);
	await ns.corporation.setAutoJobAssignment(divisionarg, cityarg, 'Research & Development', (researchemployees + remainder));	
}


