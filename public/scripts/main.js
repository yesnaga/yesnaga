
let game;
const initGame = async () => {
    const response = await getBoard()
    game = new Game(response)
}
initGame()


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
function mouseClicked(e) {
    game.clickTile(e)
}

