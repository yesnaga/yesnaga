const express = require('express');

const { Board } = require('../../lib/Board');
const { BoardFactory } = require('../../lib/BoardFactory');

const router = express.Router();

router.get('/board', (req, res) => {
	res.json(BoardFactory.toObject(new Board()));
});

const init = (app) => {
	app.use('/api', router);
};

module.exports = { init };
