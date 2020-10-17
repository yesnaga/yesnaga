

let game;
let menu;

function preload() {
	menu = new Menu()
	// todo: somehow select the game or create a new one to get a real pid
	loadJSON('/api/games/3gj9DLW9yQGIA2lU0BaW_', (result) => {
		game = new Game(result);
	});
}

function setup() {
	createCanvas(1200, 1000);
	//frameRate(20)
	menu.setup()
	game.setup();
}

function draw() {
	//game.draw();
	menu.draw()
}

function keyPressed() {
	game.cheatCode(key);
}
function mouseClicked(e) {
	game.mouseClicked(e);
}

