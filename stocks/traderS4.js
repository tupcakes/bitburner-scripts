/** @param {NS} ns **/
export function getdirection(ns, stock) {
	// percentage of change - decimal
	let volatility = ns.stock.getVolatility(stock.sym);
	// Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.


	// increasing price
	if (stock.pricehist[0] > stock.pricehist[9] && volatility > 0 && volatility < .004) {
		return '+';
	}
	if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .004 && volatility < .006) {
		return '++';
	}
	if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .006 && volatility < .01) {
		return '+++';
	}
	if (stock.pricehist[0] > stock.pricehist[9] && volatility >= .01) {
		return '++++';
	}

	// decreasing price
	if (stock.pricehist[0] < stock.pricehist[9] && volatility > 0 && volatility < .004) {
		return '-';
	}
	if (stock.pricehist[0] < stock.pricehist[9] && volatility >= .004 && volatility < .006) {
		return '--';
	}
	if (stock.pricehist[0] < stock.pricehist[9] && volatility >= .006 && volatility < .01) {
		return '---';
	}
	if (stock.pricehist[0] < stock.pricehist[9] && volatility >= .01) {
		return '----';
	}

	// no change - not likely
	if (stock.pricehist[0] === stock.pricehist[9]) {
		return '=';
	}
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
		lookback.push(stock);
	}

	while (true) {
		await ns.sleep(6000);
		for (let i = 0; i < lookback.length; i++) {
			let forcast = ns.stock.getForecast(lookback[i].sym);
			let volatility = ns.stock.getVolatility(lookback[i].sym);
			let position = ns.stock.getPosition(lookback[i].sym);
			let shares = 1000000;
			let history = 10; // I've heard 40 is a good size for using std dev
			let stocks = JSON.parse(ns.read("/stocks/stocks.json.txt"));

			// // add current price to price history
			// let currentprice = ns.stock.getPrice(lookback[i].sym);
			// lookback[i].pricehist.unshift(currentprice);

			// // remove last item from history if greater than max
			// // else loop and keep filling the array
			// if (lookback[i].pricehist.length > history) {
			// 	lookback[i].pricehist.pop();
			// } else {
			// 	ns.clearLog();
			// 	ns.print("Building lookback history... " + lookback[lookback.length - 1].pricehist.length + " / " + history);
			// 	continue;
			// }



			// // calc std deviation
			// //#Source https://bit.ly/2neWfJ2 
			// const standardDeviation = (arr, usePopulation = false) => {
			// 	const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
			// 	return Math.sqrt(
			// 		arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
			// 		(arr.length - (usePopulation ? 0 : 1))
			// 	);
			// };

			// ns.tprint("stddev:     " + standardDeviation(lookback[i].pricehist));
			// // Probability that the specified stock’s price will increase (as opposed to decrease) during the next tick.
			// ns.tprint("forcast:    " + forcast);
			// // percent of change (decimal)
			// ns.tprint("volatility: " + volatility);
			// let score = standardDeviation(lookback[i].pricehist) * forcast;
			// ns.tprint("score: " + score);


			let d = new Date();
			d.toLocaleTimeString();


			// sell - basically the same as what was above in the old version
			//
			// new idea
			// if forecast <= .45
			//   if vol > 0 && vol <= .002
			//     sellthreshold = pos * 1.02
			//   if vol > .002 && vol <= .004
			//     sellthreshold = pos * 1.04
			//   if vol > .004 && vol <= .006
			//     sellthreshold = pos * 1.06
			//   if vol > .006 && vol <= .008
			//     sellthreshold = pos * 1.08
			//   if vol > .008 && vol <= .01
			//     sellthreshold = pos * 1.10
			if (position[0] > 0) {
				if (forcast < .5) {
					let stockindex = stocks.findIndex(function (stock) {
						return stock.sym === lookback[i].sym;
					});
					let avg = (stocks[stockindex].high + stocks[stockindex].low) / 2;
					let sellthreshold = position[1] * 1.05;
					if (volatility > 0 && volatility <= .002) {
						sellthreshold = position[1] * 1.01;
					}
					if (volatility > .002 && volatility <= .004) {
						sellthreshold = position[1] * 1.03;
					}
					if (volatility > .004 && volatility <= .006) {
						sellthreshold = position[1] * 1.05;
					}
					if (volatility > .006 && volatility <= .008) {
						sellthreshold = position[1] * 1.08;
					}
					if (volatility > .008 && volatility <= .01) {
						sellthreshold = position[1] * 1.10;
					} else if (volatility > .01) {
						sellthreshold = position[1] * 1.15;
					}

					if (ns.stock.getPrice(lookback[i].sym) > sellthreshold) {
					let pctgain = (position[1] * position[0]) / ns.stock.getSaleGain(lookback[i].sym, position[0], 'Long');
					// if (pctgain > 2.0) {
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Selling:       " + position[0] + "@" + dollarUS.format(ns.stock.getPrice(lookback[i].sym).toFixed(2)));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Direction:     " + getdirection(ns, lookback[i]));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Forecast:      " + forcast.toFixed(4));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " sellthreshold: " + dollarUS.format(sellthreshold));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:       " + dollarUS.format(avg));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " PosPrice       " + dollarUS.format(position[1]));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Forecast:      " + forcast.toFixed(2));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility:    " + volatility.toFixed(2));
						ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " pctgain   :    " + pctgain.toFixed(2));
						ns.print("---");
						ns.stock.sell(lookback[i].sym, position[0]);
					}
				}
			}

			// Idealy we want to buy stock with low price and high volotility and high forcast
			// if volotility and forcast are high
			//   if price is below the average
			//     buy
			//
			// idea. rather than vol and for. just base on forcast >= .60
			if (position[0] === 0) {
				if (forcast >= .58) {
					let stockindex = stocks.findIndex(function (stock) {
						return stock.sym === lookback[i].sym;
					});
					let avg = (stocks[stockindex].high + stocks[stockindex].low) / 2;
					// if (ns.stock.getPrice(lookback[i].sym) < (avg * .85)) {
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Buying:     " + shares + "@" + dollarUS.format(ns.stock.getPrice(lookback[i].sym).toFixed(2)));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Average:    " + dollarUS.format(avg));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Forecast:   " + forcast.toFixed(2));
					ns.print(d.toLocaleTimeString() + " " + lookback[i].sym + " Volatility: " + volatility.toFixed(2));
					ns.print("---");
					ns.stock.buy(lookback[i].sym, shares);
					// }
				}
			}



			// // no s4 api - per someone on discord - might not work great
			// // volitility
			// standardDeviation(lookback[i].pricehist)

			// // forcast - price hist average
			// let forcast = lookback[i].pricehist.reduce((partialSum, a) => partialSum + a, 0) / 40;

		}
	}
}