const express = require('express');

const { Board } = require('../../lib/Board');
const { BoardFactory } = require('../../lib/BoardFactory');

const router = express.Router();
router.get('/board', (req, res) => {
	res.json(BoardFactory.toObject(new Board()));
});

// test route
router.post('/board', (req, res) => {
	const foo = req.body.body;
	return res.json({ foo });
});

// move made by user are sent here, verified and updated
router.post('/move', (req, res) => {
	return res.json(BoardFactory.toObject(new Board());
});

module.exports = router;
