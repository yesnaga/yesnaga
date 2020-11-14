const express = require('express');

const { name, version } = require('../package.json');

const title = name.toUpperCase();

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title, version });
});

router.get('/new', (req, res) => {
	res.render('new', { title, version });
});

router.get('/board', (req, res) => {
	res.render('board');
});

router.get('/ping', (req, res) => {
	const currentTime = new Date().getTime();
	res.status(200).send(`pong ${currentTime}`);
});


module.exports = router;
