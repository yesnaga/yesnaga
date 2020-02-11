const express = require('express');

const { Board } = require('../../lib/Board');
const { BoardFactory } = require('../../lib/BoardFactory');

const router = express.Router();

router.get('/board', (req, res) => {
	res.json(BoardFactory.toObject(new Board()));
});

module.exports = router;
