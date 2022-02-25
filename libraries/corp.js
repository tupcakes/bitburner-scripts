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


/** @param {NS} ns **/
export function settaon(ns, division) {
	// enable market TA for products
	let products = getproducts(ns, division)
	for (const product of products) {
		ns.corporation.setProductMarketTA1(division, product.name, 'on');
		ns.corporation.setProductMarketTA2(division, product.name, 'on');
	}
}


/** @param {NS} ns **/
export function settaoff(ns, division) {
	// enable market TA for products
	let products = getproducts(ns, division)
	for (const product of products) {
		ns.corporation.setProductMarketTA1(division, product.name, 'off');
		ns.corporation.setProductMarketTA2(division, product.name, 'off');
	}
}


/** @param {NS} ns **/
export function makeproducts(ns, division) {
	let cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
	let products = getproducts(ns, division);
	let maxproducts = 3;

	// figure out which product is the worst and retire it if we have max products
	if (ns.corporation.hasResearched(division, 'uPgrade: Capacity.I') === true) {
		maxproducts = 4;
	}
	if (ns.corporation.hasResearched(division, 'uPgrade: Capacity.II') === true) {
		maxproducts = 5;
	}
	if (products.length === maxproducts) {
		let worstproduct = products.reduce((min, prod) => min.dmd < prod.dmd ? min : prod);
		ns.corporation.discontinueProduct(division, worstproduct.name);
	}

	// create new product in city and sell it
	let newproductname = division + "-" + Math.floor(Math.random() * 1000);
	//let cityindex = Math.floor(Math.random() * cities.length);
	let city = getbiggestoffice(ns, division);
	ns.corporation.makeProduct(division, city, newproductname, 1e9, 1e9);
	ns.corporation.sellProduct(division, city, newproductname, 'MAX', 'MP', true);


	// set TA
	if (ns.corporation.hasResearched(division, 'Market-TA.I')) {
		ns.corporation.setProductMarketTA1(division, newproductname, 'on');
	}
	if (ns.corporation.hasResearched(division, 'Market-TA.II')) {
		ns.corporation.setProductMarketTA2(division, newproductname, 'on');
	}
}


/** @param {NS} ns **/
export function getbiggestoffice(ns, division) {
	let employeecounts = [];

	for (const city of cities) {
		const employeecount = new Object
		employeecount.city = city;
		employeecount.count = ns.corporation.getOffice(division, city).employees.length;
		employeecounts.push(employeecount);
	}

	let mostemployees = Math.max.apply(Math, employeecounts.map(function (o) { return o.count; }));

	for (var i = 0; i < employeecounts.length; i++) {
		if (employeecounts[i].count === mostemployees) {

			return employeecounts[i].city;
		}
	}
}