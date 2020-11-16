const errHandler = (err) => {
	console.error(err);
	if (err.response && err.response.data) {
		console.error('API response', err.response.data);
		throw err.response.data.message;
	}
	throw err;
};

const getBoard = async () => {
	const response = await fetch('/api/board', { method: 'GET' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Request failed.');
		})
		.then((data) => data)
		.catch(errHandler);
	return response;
};

const updateBoard = (body) => {
	fetch('/api/board', {
		method: 'POST',
		body: JSON.stringify({ body }),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Request failed.');
		})
		.catch(errHandler);
};
