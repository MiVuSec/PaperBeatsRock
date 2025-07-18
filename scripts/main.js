fetch('https://api.coinlore.net/api/global/')
	.then(response => response.json())
	.then(json => console.log(json));