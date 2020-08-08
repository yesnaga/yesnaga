let game;

function preload() {
	const response = loadJSON('/api/board', (result) => {
		game = new Game(result);
	});
}

function setup() {
	createCanvas(1920, 1600);
	game.setup();
}

function draw() {
	game.draw();
}

function keyPressed() {
	game.cheatCode(key);
}
function mouseClicked(e) {
	game.clickTile(e);
}
