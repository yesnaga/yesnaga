const express = require('express');
const router = express.Router();

const init = (app) => {
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

	router.get('/game', (req, res) => {
		res.json({
			session: '42',
			id: 1,
			round: 1,
			player: 0,
			board: {
				tiles: [],
				red: [],
				black: [],
			},
		});
	});

	app.use(router);
};

module.exports = init;
