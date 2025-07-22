
let bankersRound = (number, decimals) => {
	decimals = decimals !== undefined ? decimals : 2;
	number *= Math.pow(10, decimals);
	let rounded = Math.round(number);
	return (Math.abs(number) % 1 === 0.5 
		? (rounded % 2 === 0 ? rounded : rounded-1) 
		: rounded) 
		/ Math.pow(10, decimals);
}

let parseNumber = (string) => {
	if (string) {
		return string;
	}
	return 1;
}

//account
let accountFunds = 0;
document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
document.getElementById("dollarsButton")
	.addEventListener("click", () => {
		accountFunds = bankersRound(Number(document.getElementById("dollarsText").value) + accountFunds);
		document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
	});

//trade
let tradeTable = async () => {
	document.getElementById("buyButton")
		.removeEventListener("click", tradeTable);
	let run = true;
	let amount = parseNumber(document.getElementById("buyAmountText").value);
	let id = parseNumber(document.getElementById("buyNameText").value);
	//Creates tradeTable
	document.getElementById("trade").appendChild(document.createElement("table"))
		.id = "tradeTable";
	//Creates thead
	let tradeTable_thead_tr = document.getElementById("tradeTable")
		.appendChild(document.createElement("thead"))
		.appendChild(document.createElement("tr"));
	tradeTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Name";
	tradeTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Amount";
	tradeTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Value";
	tradeTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Total Value";
	tradeTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "SELL";
	//Creates tbody
	document.getElementById("tradeTable")
		.appendChild(document.createElement("tbody")).id = "tradeTableBody";
	//Creates td elements
	let tradeObjOld = await fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)
			.then(response => response.json());
	tradeObjOld = tradeObjOld[0];
	accountFunds = bankersRound(accountFunds - tradeObjOld.price_usd * amount);
	document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
	let trElements = [document.getElementById("tradeTableBody")
		.appendChild(document.createElement("tr"))];
	let tdElements = [
		trElements[0].appendChild(document.createElement("td")),
		trElements[0].appendChild(document.createElement("td")),
		trElements[0].appendChild(document.createElement("td")),
		trElements[0].appendChild(document.createElement("td")),
		trElements[0].appendChild(document.createElement("button"))
	];
	tdElements[0].innerHTML = `${tradeObjOld.name}`;
	tdElements[0].id = tradeObjOld.id;
	tdElements[1].innerHTML = `${amount}`;
	tdElements[2].innerHTML = `${tradeObjOld.price_usd}`;
	tdElements[3].innerHTML = `${tradeObjOld.price_usd * amount}`;
	tdElements[4].innerHTML = `SELL ${tradeObjOld.symbol}`;
	tdElements[4].addEventListener("click", function press (event) {
		let parent = event.target.parentNode;
		event.target.removeEventListener("click", press);
		accountFunds = bankersRound(accountFunds + Number(parent.childNodes[3].innerHTML));
		document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
		parent.replaceChildren();
		parent.remove();
		console.log(document.getElementById("tradeTableBody").childNodes.length);
		if (document.getElementById("tradeTableBody").childNodes.length === 0) {
			//console.log("RAN");
			document.getElementById("sellAllButton").click();
			run = false;
		}
	});

	//Creates button that removes table
	document.getElementById("tradeButtons")
		.appendChild(document.createElement("button")).id = "sellAllButton";
	document.getElementById("sellAllButton").innerHTML = "SELL ALL";
	document.getElementById("sellAllButton")
		.addEventListener("click", async (event) => {
			document.getElementById("sellAllButton").remove();
			document.getElementById("buyButton")
				.removeEventListener("click", buy);
			run = false;
			trElements = [];
			tdElements = [];
			try {
				document.getElementById("tradeTable")
					.replaceChildren();
			}
			catch(error) { console.log(error); }
			try { document.getElementById("tradeTable").remove(); }
			catch(error) { console.log(error); }
			
			document.getElementById("buyButton")
				.addEventListener("click", tradeTable);
		});
	//Change effect of buy button
	let buy = async () => {
		id = parseNumber(document.getElementById("buyNameText").value);
		tradeObjOld = await fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)
			.then(response => response.json());
		tradeObjOld = tradeObjOld[0];
		amount = parseNumber(document.getElementById("buyAmountText").value);
		accountFunds = bankersRound(accountFunds - tradeObjOld.price_usd * amount);
		document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
		let index = trElements.push(document.getElementById("tradeTableBody")
			.appendChild(document.createElement("tr"))) - 1;
		console.log(trElements[index]);
		tdElements = [
			trElements[index].appendChild(document.createElement("td")),
			trElements[index].appendChild(document.createElement("td")),
			trElements[index].appendChild(document.createElement("td")),
			trElements[index].appendChild(document.createElement("td")),
			trElements[index].appendChild(document.createElement("button"))
		];
		tdElements[0].innerHTML = `${tradeObjOld.name}`;
		tdElements[0].id = tradeObjOld.id;
		tdElements[1].innerHTML = `${amount}`;
		tdElements[2].innerHTML = `${tradeObjOld.price_usd}`;
		tdElements[3].innerHTML = `${tradeObjOld.price_usd * amount}`;
		tdElements[4].innerHTML = `SELL ${tradeObjOld.symbol}`;
		tdElements[4].addEventListener("click", function press (event) {
			let parent = event.target.parentNode;
			event.target.removeEventListener("click", press);
			accountFunds = bankersRound(accountFunds + Number(parent.childNodes[3].innerHTML));
			document.getElementById("accountFunds").innerHTML = `$${accountFunds}`;
			parent.replaceChildren();
			parent.remove();
			console.log(document.getElementById("tradeTableBody").childNodes.length);
			if (document.getElementById("tradeTableBody").childNodes.length === 0) {
				//console.log("RAN");
				document.getElementById("sellAllButton").click();
				run = false;
			}
		});
	}
	document.getElementById("buyButton")
		.addEventListener("click", buy);
	//Refreshes td elements
	let time = 2000;
	while (run) {
		for (child of document.getElementById("tradeTableBody").childNodes) {
			//console.log(child.childNodes[0].id);
			try {
				tradeObjOld = await fetch(`https://api.coinlore.net/api/ticker/?id=${child.childNodes[0].id}`)
					.then(response => response.json());
			}
			catch (error) { run = false; break; }
			tradeObjOld = tradeObjOld[0];
			console.log(`${tradeObjOld.name}: ${tradeObjOld.price_usd}`);
			try {
				child.childNodes[0].innerHTML = `${tradeObjOld.name}`;
				child.childNodes[2].innerHTML = `${tradeObjOld.price_usd}`;
				child.childNodes[3].innerHTML = `${tradeObjOld.price_usd * Number(child.childNodes[1].innerHTML)}`;
			}
			catch (error) { run = false; break; }
		}
		await new Promise(resolve => setTimeout(resolve, time));
	}
	if (document.getElementById("sellAllButton")) {
		document.getElementById("sellAllButton").click();
	}
};
//trade
document.getElementById("buyButton")
	.addEventListener("click", tradeTable);
///////////////

let tickerTable = async () => {
	document.getElementById("tickerButton")
		.removeEventListener("click", tickerTable);
	let run = true;
	let id = parseNumber(document.getElementById("tickerText").value);
	//Creates tickerTable
	document.getElementById("ticker").appendChild(document.createElement("table"))
		.id = "tickerTable";
	//Creates thead
	let tickerTable_thead_tr = document.getElementById("tickerTable")
		.appendChild(document.createElement("thead"))
		.appendChild(document.createElement("tr"));
	tickerTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Property";
	tickerTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Value";
	//Creates tbody
	document.getElementById("tickerTable")
		.appendChild(document.createElement("tbody")).id = "tickerTableBody";
	//Creates td elements
	let tickerObjOld = await fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)
			.then(response => response.json())
	tickerObjOld = tickerObjOld[0];
	let tdElements = [];
	let trElement;
	for (property in tickerObjOld) {
		trElement = document.getElementById("tickerTableBody")
			.appendChild(document.createElement("tr"));
		trElement.appendChild(document.createElement("td"))
			.innerHTML = `${property}:`;
		tdElements.push(trElement.appendChild(document.createElement("td")));
	}
	//Removes table
	document.getElementById("tickerButton")
	.addEventListener("click", async () => {
		run = false;
		tdElements = [];
		try {
			document.getElementById("tickerTable")
				.replaceChildren();
		}
		catch(error) { console.log(error); }
		try { document.getElementById("tickerTable").remove(); }
		catch(error) { console.log(error); }
		document.getElementById("tickerButton")
			.addEventListener("click", tickerTable);
	});
	//Refreshes td elements
	let tickerObjNew;
	let time = 2000;
	let timeResetCount = 0;
	while (run) {
		id = parseNumber(document.getElementById("tickerText").value);
		tickerObjNew = await fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)
				.then(response => response.json());
		tickerObjNew = tickerObjNew[0];
		if (JSON.stringify(tickerObjOld) !== JSON.stringify(tickerObjNew)) {
			Object.assign(tickerObjOld, tickerObjNew);
			time = 2000;
			timeResetCount++;
		}
		else {
			time += time; //Extends timeframe
			console.log(time / 1000);
			console.log(timeResetCount);
		}
		console.log(tdElements);
		let i = 0;
		for (property in tickerObjNew) {
			console.log(`${property}: ${tickerObjNew[property]}`);
			tdElements[i].innerHTML = `${tickerObjNew[property]}`;
			i++;
		}
		await new Promise(resolve => setTimeout(resolve, time));
	}
};
//ticker
document.getElementById("tickerButton")
	.addEventListener("click", tickerTable);

//Creates global table
let globalTable = async () => {
	document.getElementById("globalTableButton")
		.removeEventListener("click", globalTable);
	let run = true;
	//Creates globalTable
	document.getElementById("global").appendChild(document.createElement("table"))
		.id = "globalTable";
	//Creates thead
	let globalTable_thead_tr = document.getElementById("globalTable")
		.appendChild(document.createElement("thead"))
		.appendChild(document.createElement("tr"));
	globalTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Property";
	globalTable_thead_tr.appendChild(document.createElement("th"))
		.innerHTML = "Value";
	//Creates tbody
	document.getElementById("globalTable")
		.appendChild(document.createElement("tbody")).id = "globalTableBody";
	//Creates td elements
	let globalObjOld = await fetch("https://api.coinlore.net/api/global/")
			.then(response => response.json())
	globalObjOld = globalObjOld[0];
	let tdElements = [];
	let trElement;
	for (property in globalObjOld) {
		trElement = document.getElementById("globalTableBody")
			.appendChild(document.createElement("tr"));
		trElement.appendChild(document.createElement("td"))
			.innerHTML = `${property}:`;
		tdElements.push(trElement.appendChild(document.createElement("td")));
	}
	//Removes table
	document.getElementById("globalTableButton")
	.addEventListener("click", async () => {
		run = false;
		tdElements = [];
		try {
			document.getElementById("globalTable")
				.replaceChildren();
		}
		catch(error) { console.log(error); }
		try { document.getElementById("globalTable").remove(); }
		catch(error) { console.log(error); }
		document.getElementById("globalTableButton")
			.addEventListener("click", globalTable);
	});
	//Refreshes td elements
	let globalObjNew;
	let time = 2000;
	let timeResetCount = 0;
	while (run) {
		globalObjNew = await fetch("https://api.coinlore.net/api/global/")
			.then(response => response.json());
		globalObjNew = globalObjNew[0];
		if (JSON.stringify(globalObjOld) !== JSON.stringify(globalObjNew)) {
			Object.assign(globalObjOld, globalObjNew);
			time = 2000;
			timeResetCount++;
		}
		else {
			time += time; //Extends timeframe
			console.log(time / 1000);
			console.log(timeResetCount);
		}
		console.log(tdElements);
		let i = 0;
		for (property in globalObjNew) {
			console.log(`${property}: ${globalObjNew[property]}`);
			tdElements[i].innerHTML = `${globalObjNew[property]}`;
			i++;
		}
		await new Promise(resolve => setTimeout(resolve, time));
	}
};
//global
document.getElementById("globalTableButton")
	.addEventListener("click", globalTable);

