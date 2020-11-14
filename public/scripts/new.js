const createGame = (player1Name, player2Name) => {
	const body = JSON.stringify({ players: [player1Name || 'orange', player2Name || 'blue'] });
	const requestOptions = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body,
	};

	fetch('api/games', requestOptions)
		.then((result) => result.json())
		.then((formattedResult) => {
			localStorage.setItem('yesnaga_pid', formattedResult.pid);
			window.location = '/board';
		})
		.catch((error) => console.error('error', error));
};

const $start = document.getElementById('start');
const $playerOne = document.getElementById('playerOne');
const $playerTwo = document.getElementById('playerTwo');

$start.addEventListener('click', () => {
	createGame($playerOne.value, $playerTwo.value);
});
