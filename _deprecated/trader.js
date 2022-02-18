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
	let smallavg = movingaverage(ns, stock, 10);
	let medavg = movingaverage(ns, stock, 20);
	let largeavg = movingaverage(ns, stock, 30);

	// percentage of change - decimal
	let volatility = getNormalizedStandardDeviation(stock.pricehist);
	// Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.


	// increasing price
	// if (ns.stock.getPrice(stock.sym) > avg && volatility > 0 && volatility < .004) {
	if (largeavg > medavg) {
		return '+++';
	}
	// if (ns.stock.getPrice(stock.sym) > avg && volatility >= .004 && volatility < .006) {
	//if (ns.stock.getPrice(stock.sym) > medavg) {
	if (medavg > smallavg) {
		return '++';
	}
	// if (ns.stock.getPrice(stock.sym) > avg && volatility >= .006 && volatility < .01) {
	// if (ns.stock.getPrice(stock.sym) > largeavg) {
	if (ns.stock.getPrice(stock.sym) > smallavg) {
		return '+';
	}
	// if (ns.stock.getPrice(stock.sym) > avg && volatility >= .01) {
	// 	return '++++';
	// }

	// decreasing price
	// if (ns.stock.getPrice(stock.sym) < avg && volatility > 0 && volatility < .004) {
	if (largeavg < medavg) {
		return '-';
	}
	// if (ns.stock.getPrice(stock.sym) < avg && volatility >= .004 && volatility < .006) {
	// if (ns.stock.getPrice(stock.sym) < medavg) {
	if (medavg < smallavg) {
		return '--';
	}
	// if (ns.stock.getPrice(stock.sym) < avg && volatility >= .006 && volatility < .01) {
	// if (ns.stock.getPrice(stock.sym) < largeavg) {
	if (ns.stock.getPrice(stock.sym) < smallavg) {
		return '-';
	}
	// if (ns.stock.getPrice(stock.sym) < avg && volatility >= .01) {
	// 	return '----';
	// }

	// no change
	return '=';
}


export function movingaverage(ns, stock, samplesize) {
	let sum = 0;
	let avg = 0;
	for (let i = 0; i < samplesize; i++) {
		sum += stock.pricehist[i];
	}
	avg = sum / samplesize;
	return avg;
}



/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');

	let shortenabled = true;

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
			let history = 30; // I've heard 40 is a good size for using std dev
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


			// sell - long
			if (position[0] > 0) {
				let avg = movingaverage(ns, lookback[i], 20);
				let pctgain = ((ns.stock.getBidPrice(lookback[i].sym) - position[1]) / position[1]) * 100;

				// is the price increase slowing, if so might be an indicator to sell

				//lookback[i].pricehist
				//lookback[i].pricechangehist
				//lookback[i].pctchange
				// if the sell price is less than or equal too the rolling avg AND there is a gain, sell
				// if (ns.stock.getBidPrice(lookback[i].sym) <= avg && pctgain >= 0) {
				if ((getdirection(ns, lookback[i]) === '=' || getdirection(ns, lookback[i]) === '-' || getdirection(ns, lookback[i]) === '--' || getdirection(ns, lookback[i]) === '---')) {
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
			}


			// sell - short
			if (shortenabled === true) {
				if (position[2] > 0) {

				}
			}


			// buy
			if (position[0] === 0) {
				let avg = movingaverage(ns, lookback[i], 20);

				// buy - long
				let shares = 0;
				// if (getdirection(ns, lookback[i]) === '+' && volatility > .01) {
				if (getdirection(ns, lookback[i]) === '+') {
					//shares = 500;
				// } else if (getdirection(ns, lookback[i]) === '++' && volatility < .0075 && volatility >= .005) {
				} else if (getdirection(ns, lookback[i]) === '++') {
					shares = 1000;
				// } else if (getdirection(ns, lookback[i]) === '+++' && volatility < .005) {
				} else if (getdirection(ns, lookback[i]) === '+++') {
					shares = 5000;
				}

				// if (ns.stock.getAskPrice(lookback[i].sym) > (avg * 1.05) && shares > 0) {
				if (shares > 0) {
					if (ns.getServerMoneyAvailable('home') >= ns.stock.getPurchaseCost(lookback[i].sym, shares, 'Long')) {
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Buying:   " + shares + "@" + dollarUS.format(ns.stock.getAskPrice(lookback[i].sym).toFixed(2)));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:    " + dollarUS.format(avg));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:  " + getdirection(ns, lookback[i]));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility: " + volatility.toFixed(4));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:     " + dollarUS.format(spread));
						ns.print("---");
						ns.stock.buy(lookback[i].sym, shares);
					}
				}





				// // buy - short
				// if (shortenabled === true) {
				// if (getdirection(ns, lookback[i]) === '-' && volatility > .01) {
				// 	shares = 100;
				// } else if (getdirection(ns, lookback[i]) === '--' && volatility < .0075 && volatility >= .005) {
				// 	shares = 1000;
				// } else if (getdirection(ns, lookback[i]) === '---' && volatility < .005) {
				// 	shares = 5000;
				// }

				// if (ns.stock.getAskPrice(lookback[i].sym) < (avg * 1.05) && shares > 0) {
				// 	if (ns.getServerMoneyAvailable('home') >= ns.stock.getPurchaseCost(lookback[i].sym, shares, 'Short')) {
				// 		ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Shorting:   " + shares + "@" + dollarUS.format(ns.stock.getAskPrice(lookback[i].sym).toFixed(2)));
				// 		ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:    " + dollarUS.format(avg));
				// 		ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:  " + getdirection(ns, lookback[i]));
				// 		ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility: " + volatility.toFixed(4));
				// 		ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Spread:     " + dollarUS.format(spread));
				// 		ns.print("---");
				// 		ns.stock.short(lookback[i].sym, shares);
				// 	}
				// }
				// }
			}
		}
	}
}