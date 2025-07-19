let startTime = new Date();
let endTime = new Date();

fetch('https://api.coinlore.net/api/global/')
.then(response => response.json())
.then(json => {
	endTime = new Date();
	console.log(json, `\n${endTime - startTime}ms`);
	return;
});

let timeFrameMilliSeconds = 0;
let promises = new Array<Promise>();
(async () => {
	while (true) {
		console.log (
			
			await fetch('https://api.coinlore.net/api/global/')
			.then(response => response.json()),
			new Date() - time
		);
		time = new Date();
		//await new Promise(resolve => setTimeout(resolve, 2000));
	}
})();