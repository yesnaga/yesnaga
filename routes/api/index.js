const express = require('express');
const OpenApiValidator = require('express-openapi-validator');

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
	const error = err.errors || err.constructor.name;
	const message = err.message || 'Internal Server Error';
	const status = err.status || 500;
	res.status(status).json({
		error,
		message,
		status,
		request: {
			method: req.method,
			route: (req.route || {}).path,
			params: req.params,
			data: req.body,
		},
	});
});

module.exports = router;
