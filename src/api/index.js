const validation	= require('../validation');
const bd			= require('../bd');
const fs			= require('fs');
const path			= require('path');
const config		= require('config');
const multer	 	= require('multer');

const avatarStorage = config.get('avatarStorage');
const avatarMaxSize	= config.get('avatarMaxSize');

const uploadStorageConfig = {
	destination: (req, file, cb) => {
		// set storage for avatars images
		cb(null, `.${avatarStorage}`);
	},
	filename: (req, file, cb) => {
		// only one avatar for a single user
		console.log(file)
		if (file.mimetype === "image/jpeg") cb(null, `avatar.jpg`);
		else {
			cb(new Error('Bad format'));
		}	
	}
};

const upload = multer({
	storage: multer.diskStorage(uploadStorageConfig),  
	limits: { fileSize: avatarMaxSize }
});

const avatarLoader = upload.single('imageData');

module.exports = {
	setHeroStats : function (req, res) {
		// try validate post params
		let validateData = validation.setHeroStatsValid(req.body);

		if (!validateData.result) {
			return sendResponse(res, 400, 'application/json', validateData);
		}
		// if post params is correct - save it and send response to client
		bd.updateBd(getCorrectHeroStats(req.body)).then((result) => {
			sendResponse(res, result.statusCode, 'application/json', result);
		});
	},
	getHeroStats : function (req, res) {
		sendResponse(res, 200, 'application/json', bd.getBd());
	},
	uploadHeroImage : function (req, res) {
		avatarLoader(req, res, (err) => {
			if (err && err.message === 'Bad format') {
				return sendResponse(res, 400, 'application/json', {"result": false, "data": "format must be .jpg"});
			}
			else if (err && err.message === 'File too large') {
				return sendResponse(res, 400, 'application/json', {"result": false, "data": "file too large"});
			}

			return sendResponse(res, 200, 'application/json', {"result": true, "data": "image uploaded success"});
		})
		
	},
	getHeroImage : function (req, res) {
		// disable caching of requests, that the picture on the page has always changed
		res.set('Cache-Control', 'no-store');
		res.sendFile(path.resolve(__dirname, `../..${avatarStorage}avatar.jpg`));
	}
}

function getCorrectHeroStats(data) {
	return {
		name: data.name,
		strength: Number(data.strength),
		dexterity: Number(data.dexterity),
		intellect: Number(data.intellect),
		isInvincible: data.isInvincible === 'true' ? true : false
	}
}

function sendResponse(res, statusCode, contentType, data) {
	console.log(statusCode, contentType, data);
	res.status(statusCode).json(data);
}