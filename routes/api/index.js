const express = require('express');

const { Board } = require('../../lib/Board');
const { BoardFactory } = require('../../lib/BoardFactory');

const { ApplicationError } = require('../../lib/Errors');

const initGameRoutes = require('./game');

const router = express.Router();
initGameRoutes(router);

router.get('/board', (req, res) => {
	res.json(BoardFactory.toObject(new Board()));
});

// test route
router.post('/board', (req, res) => {
	const foo = req.body.body;
	return res.json({ foo });
});

router.use((err, req, res, next) => {
	if (err instanceof ApplicationError) {
		res.status(err.status()).json({
			error: err.constructor.name,
			message: err.message,
			status: err.status(),
			request: {
				method: req.method,
				route: req.route.path,
				params: req.params,
				data: req.body,
			},
		});
	} else {
		next(err);
	}
});

module.exports = router;
