let game;
let menu;

function preload() {
	menu = new Menu();
}

function setup() {
	createCanvas(1200, 1000);
	menu.setup();
}

function draw() {
	game ? game.draw() : menu.draw();
}

function keyPressed() {
	game ? game.cheatCode(key) : menu.keyPressed(key);
	// prevents default browser behaviour
	return false;
}
function mouseClicked(e) {
	game ? game.mouseClicked(e) : menu.mouseClicked(e);
}
