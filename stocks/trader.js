/** @param {NS} ns **/
export function getNormalizedStandardDeviation(numbers) {
	const stdDevation = getStandardDeviation(numbers);
	const avg = getAverage(numbers);
	return stdDevation / avg;
}

/** @param {NS} ns **/
export function getStandardDeviation(numbers) {
	const avg = getAverage(numbers);
	const variance = numbers.reduce((runningVariance, current) => runningVariance + Math.pow((current - avg), 2)) / numbers.length;
	const standardDeviation = Math.pow(variance, 0.5);
	return standardDeviation;
}

/** @param {NS} ns **/
export function getAverage(numbers) {
	return getSum(numbers) / numbers.length;
}

/** @param {NS} ns **/
export function getSum(numbers) {
	if (numbers.length === 0) {
		return 0;
	}

	return numbers.reduce((runningSum, current) => runningSum + current);
}





/** @param {NS} ns **/
export function getdirection(ns, stock) {
	let avg = movingaverage(ns, stock);

	// percentage of change - decimal
	let volatility = getNormalizedStandardDeviation(stock.pricehist);
	// Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.


	// increasing price
	// if (stock.pricehist[0] > stock.pricehist[9] && volatility > 0 && volatility < .004) {
	if (ns.stock.getPrice(stock.sym) > avg && volatility > 0 && volatility < .004) {
		return '+';
	}
	// if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .004 && volatility < .006) {
	if (ns.stock.getPrice(stock.sym) > avg && volatility >= .004 && volatility < .006) {
		return '++';
	}
	// if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .006 && volatility < .01) {
	if (ns.stock.getPrice(stock.sym) > avg && volatility >= .006 && volatility < .01) {
		return '+++';
	}
	// if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .01) {
	if (ns.stock.getPrice(stock.sym) > avg && volatility >= .01) {
		return '++++';
	}

	// decreasing price
	if (ns.stock.getPrice(stock.sym) < avg && volatility > 0 && volatility < .004) {
		return '-';
	}
	if (ns.stock.getPrice(stock.sym) < avg && volatility >= .004 && volatility < .006) {
		return '--';
	}
	if (ns.stock.getPrice(stock.sym) < avg && volatility >= .006 && volatility < .01) {
		return '---';
	}
	if (ns.stock.getPrice(stock.sym) < avg && volatility >= .01) {
		return '----';
	}

	// no change
	if (ns.stock.getPrice(stock.sym) === avg) {
		return '=';
	}
}


export function movingaverage(ns, stock) {
	let sum = 0;
	let avg = 0;
	let sample = 20;
	for (let i = 0; i < sample; i++) {
		sum += stock.pricehist[i];
	}
	avg = sum / sample;
	return avg;
}


/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');

	let dollarUS = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	});

	let symbols = ns.stock.getSymbols();

	let lookback = [];

	// init lookback array
	for (const sym of symbols) {
		let stock = new Object
		stock.sym = sym;
		stock.pricehist = [];
		stock.pricechangehist = [];
		stock.pctchange = [];
		lookback.push(stock);
	}

	while (true) {
		await ns.sleep(4200);

		stockloop:
		for (let i = 0; i < lookback.length; i++) {
			let position = ns.stock.getPosition(lookback[i].sym);
			let spread = ns.stock.getAskPrice(lookback[i].sym) - ns.stock.getBidPrice(lookback[i].sym);
			let shares = 1000;
			let history = 40; // I've heard 40 is a good size for using std dev
			let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

			// add current price to price history
			let currentprice = ns.stock.getPrice(lookback[i].sym);
			lookback[i].pricehist.unshift(currentprice);

			// add price change to change history
			let pricechange = lookback[i].pricehist[1] - ns.stock.getPrice(lookback[i].sym)
			lookback[i].pricechangehist.unshift(pricechange);

			// add percent change to change history
			let pctchange = ((ns.stock.getPrice(lookback[i].sym) - lookback[i].pricehist[1]) / lookback[i].pricehist[1]) * 100;
			lookback[i].pctchange.unshift(pctchange);

			// remove last item from history if greater than max
			// else loop and keep filling the array
			if (lookback[i].pricehist.length > history) {
				lookback[i].pricehist.pop();
				lookback[i].pricechangehist.pop();
				lookback[i].pctchange.pop();
			} else {
				ns.clearLog();
				ns.print("Building lookback history... " + lookback[lookback.length - 1].pricehist.length + " / " + history);
				continue;
			}

			let volatility = getNormalizedStandardDeviation(lookback[i].pricehist);

			let d = new Date();
			d.toLocaleTimeString();


			if (position[0] > 0) {
				let avg = movingaverage(ns, lookback[i]);
				let pctgain = ((ns.stock.getBidPrice(lookback[i].sym) - position[1]) / position[1]) * 100;

				// is the price increase slowing, if so might be an indicator to sell

				//lookback[i].pricehist
				//lookback[i].pricechangehist
				//lookback[i].pctchange
				//if (lookback[i].pctchange[0] < 1 && ns.stock.getBidPrice(lookback[i].sym) <= avg && pctgain >= 0) {
				if (ns.stock.getBidPrice(lookback[i].sym) <= avg && pctgain >= 0) {
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Selling:    " + position[0] + " @ " + dollarUS.format(ns.stock.getBidPrice(lookback[i].sym).toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:    " + dollarUS.format(avg));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:  " + getdirection(ns, lookback[i]));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:     " + dollarUS.format(spread));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " PosPrice    " + dollarUS.format(position[1]));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility: " + volatility.toFixed(4));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " pctgain:    " + pctgain.toFixed(2));
					ns.print("---");
					ns.stock.sell(lookback[i].sym, position[0]);

				}





				// let sellthreshold = (position[1] + spread);
				// if (getdirection(ns, lookback[i]) === '+') {
				// 	sellthreshold = (position[1] + spread) * 1.03;
				// } else if (getdirection(ns, lookback[i]) === '++') {
				// 	sellthreshold = (position[1] + spread) * 1.05;
				// } else if (getdirection(ns, lookback[i]) === '+++') {
				// 	sellthreshold = (position[1] + spread) * 1.08;
				// } else if (getdirection(ns, lookback[i]) === '++++') {
				// 	sellthreshold = (position[1] + spread) * 1.10;
				// } else if (volatility > .01) {
				// 	sellthreshold = (position[1] + spread) * 1.15;
				// }


				// if we have a 25% profit just sell, otherwise use threshold
				// if (pctgain >= 25) {
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Selling:       " + position[0] + " @ " + dollarUS.format(ns.stock.getBidPrice(lookback[i].sym).toFixed(2)));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:     " + getdirection(ns, lookback[i]));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " sellthreshold: " + dollarUS.format(sellthreshold));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:        " + dollarUS.format(spread));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " PosPrice       " + dollarUS.format(position[1]));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility:    " + volatility.toFixed(4));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " pctgain   :    " + pctgain.toFixed(2));  // this is wrong
				// 	ns.print("---");
				// 	ns.stock.sell(lookback[i].sym, position[0]);
				// } else if (ns.stock.getBidPrice(lookback[i].sym) >= sellthreshold) {
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Selling:       " + position[0] + " @ " + dollarUS.format(ns.stock.getBidPrice(lookback[i].sym).toFixed(2)));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:     " + getdirection(ns, lookback[i]));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " sellthreshold: " + dollarUS.format(sellthreshold));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:        " + dollarUS.format(spread));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " PosPrice       " + dollarUS.format(position[1]));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility:    " + volatility.toFixed(4));
				// 	ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " pctgain   :    " + pctgain.toFixed(2));  // this is wrong
				// 	ns.print("---");
				// 	ns.stock.sell(lookback[i].sym, position[0]);
				// }
			}


			// Idealy we want to buy stock with low price and high volotility and high forcast
			// if volotility and forcast are high
			if (position[0] === 0) {
				let avg = movingaverage(ns, lookback[i]);

				// for (let j = 0; j < 5; j++) {
				// 	if (lookback[i].pricehist[j] < avg) {
				// 		continue stockloop;
				// 	}
				// }


				// if (ns.stock.getAskPrice(lookback[i].sym) > avg && volatility > .01) {
				if (ns.stock.getAskPrice(lookback[i].sym) > (avg * 1.05)) {
					if (ns.getServerMoneyAvailable('home') >= ns.stock.getPurchaseCost(lookback[i].sym, shares, 'Long')) {
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Buying:     " + shares + "@" + dollarUS.format(ns.stock.getAskPrice(lookback[i].sym).toFixed(2)));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:    " + dollarUS.format(avg));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:  " + getdirection(ns, lookback[i]));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility: " + volatility.toFixed(4));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:     " + dollarUS.format(spread));
						ns.print("---");
						ns.stock.buy(lookback[i].sym, shares);
					}
				}
			}
		}
	}
}