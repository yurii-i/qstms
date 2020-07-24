const express	 = require('express');
const config	 = require('config');
const bodyParser = require('body-parser');
const api		 = require('./src/api');

// set configs
const httpServerPort	= config.get('httpServerPort');

// init server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// get api
app.get('/getHeroStats', api.getHeroStats);
app.get('/getHeroImage', api.getHeroImage);

// post api
app.post('/setHeroStats', api.setHeroStats);
app.post('/uploadHeroImage', api.uploadHeroImage);

// set static dir
app.use(express.static('public'));

// start server
app.listen(httpServerPort, ()=>{console.log(`http server is running on port: ${httpServerPort}`)});
