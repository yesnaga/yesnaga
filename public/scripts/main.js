const game = new Game(NEIGHBOURS, TILESSETUP, PLAYERS);

function setup() {
    createCanvas(1000, 600);
    game.setup();
}

function draw() {
    game.draw();
}

function keyPressed() {
    game.cheatCode(key)
}

