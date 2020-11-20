let game;

function preload() {
	const pid = localStorage.getItem('yesnaga_pid');
	return fetch(`api/games/${pid}`, { method: 'GET' })
		.then((result) => result.json())
		.then((formattedResult) => {
			game = new Game(formattedResult);
		})
		.catch((error) => console.error('error', error));
}

function setup() {
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('board');
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	if (game) game.draw();
}

function keyPressed() {
	if (game) game.cheatCode(key);
	// prevents default browser behaviour
	return false;
}
function mouseClicked(e) {
	if (game) game.mouseClicked(e);
}
