const express = require('express');
const OpenApiValidator = require('express-openapi-validator');

const { ApplicationError } = require('../../lib/Errors');

const { Game } = require('../../lib/Game')();

const initGameRoutes = require('./game');
const initMoveRoutes = require('./move');

const router = express.Router();

router.use(
	OpenApiValidator.middleware({
		apiSpec: './routes/api/openapi.yaml',
		validateRequests: true,
		validateResponses: true,
	}),
);

initGameRoutes(router);
initMoveRoutes(router);

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
		res.status(err.status || 500).json({
			message: err.message,
			errors: err.errors,
		});
	}
});

module.exports = router;
