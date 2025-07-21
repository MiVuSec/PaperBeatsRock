let runAmt = 0; //debug
//Creates global table
(async () => {
	//Creates td elements
	let globalObjOld = await fetch("https://api.coinlore.net/api/global/")
			.then(response => response.json())
	globalObjOld = globalObjOld[0];
	let tdElements = [];
	for (property in globalObjOld) {
		let trElement = document.getElementById("globalTable")
			.appendChild(document.createElement("tr"));
		trElement.appendChild(document.createElement("td"))
			.innerHTML = `${property}:`;
		tdElements.push(trElement.appendChild(document.createElement("td")));
	}
	//Refreshes td elements
	let globalObjNew;
	let time = 2000;
	let timeRestetCount = 0;
	while (runAmt < 1000) { //set while to true after debug
		globalObjNew = await fetch("https://api.coinlore.net/api/global/")
				.then(response => response.json());
		globalObjNew = globalObjNew[0];
		if (globalObjOld.toString() !== globalObjNew.toString()) {
			Object.assign(globalObjOld, globalObjNew);
			time = 2000;
			timeRestetCount++;
		}
		else {
			time += time; //Extends timeframe
			console.log(time / 1000);
			console.log(timeRestetCount);
		}
		console.log(tdElements);
		let i = 0;
		for (property in globalObjNew) {
			console.log(`${property}: ${globalObjNew[property]}`);
			tdElements[i].innerHTML = `${globalObjNew[property]}`;
			i++;
		}
		await new Promise(resolve => setTimeout(resolve, time));
		runAmt++; //debug
	}
})();