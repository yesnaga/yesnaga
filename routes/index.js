const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('board');
});

router.get('/ping', (req, res) => {
	const currentTime = new Date().getTime();
	res.status(200).send(`pong ${currentTime}`);
});

router.get('/board', (req, res) => {
	res.render('board');
});


module.exports = router;
