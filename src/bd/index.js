const fs = require('fs');

// init bd
let bd = {};

try {
	bd = require('./players.json');

	// check valid bd structure
	// bd must be only json
	if (Array.isArray(bd) || typeof bd !== 'object') updateBd({});
}
catch(error) {
	console.log(error);
	updateBd({});
}

function updateBd(data) {
	return new Promise((resolve, reject) => {
		fs.writeFile('./src/bd/players.json', JSON.stringify(data), (err) => {
			if (err) return resolve({result: false, statusCode : 501, data: 'bd write error'});
			bd = data;
			resolve({result: true, statusCode : 200, data: 'bd write success'});
		});
	})
}

function getBd() {
	return bd;
}

module.exports = {
	updateBd, getBd
}
