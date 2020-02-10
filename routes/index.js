const express = require('express');

const api = require('./api');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Yesnaga' });
});

router.get('/ping', (req, res) => {
	const currentTime = new Date().getTime();
	res.status(200).send(`pong ${currentTime}`);
});

router.get('/board', (req, res) => {
	res.render('board');
});

const init = (app) => {
	app.use(router);
	api.init(app);
};

module.exports = init;
