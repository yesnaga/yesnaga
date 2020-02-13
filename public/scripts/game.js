class Game {
    constructor(gameObject) {

        this.background = new Background();
        this.hud = new Hud([,]);
        // filled with Tile-classes
        this.tiles = [];
        // filled with ids of already existing tiles
        this.drawnTiles = []

        this.neighbours = NEIGHBOURS
        this.tilesSetup = gameObject.discs
        this.players = gameObject.players

        this.drawBackground = false
        this.cheatArray = []
        this.gameHistory = [,]
    }

    getPlayerTurn() {
        return this.gameHistory.length % 2 ? 'p2' : 'p1'
    }
    getPlayerTurnIndex() {
        return this.gameHistory.length % 2 ? 1 : 0
    }

    setup() {
        this.background.setup();
        this.pushTile(0, 250, 250)
    }

    draw() {
        if (this.drawBackground) {
            this.background.draw();
        }
        this.tiles.forEach((tile, i) => {
            tile.draw();

            if (this.hoverCheck(tile, mouseX, mouseY)) {
                tile.hovering = true
            } else {
                tile.hovering = false
            }
        });
        this.hud.draw()
    }
    pushTile(id, x, y) {
        const t = this.tilesSetup[id].neighbours
        this.drawnTiles.push(id)
        if (this.players[0].tokens.some(t => t.tile === id)) {
            this.tiles.push(new Tile(x, y, 60, this.tilesSetup[id], 'p1'))
            return
        }
        if (this.players[1].tokens.some(t => t.tile === id)) {
            this.tiles.push(new Tile(x, y, 60, this.tilesSetup[id], 'p2'))
            return
        }
        this.tiles.push(new Tile(x, y, 80, this.tilesSetup[id]))

        Object.keys(t).forEach(d => {
            if (!this.drawnTiles.includes(t[d])) {
                this.pushTile(t[d], this.neighbours[d].x(x), this.neighbours[d].y(y))
            }
        })
    }

    cheatCode(key) {
        // user can trigger easter egg with the konami code
        this.cheatArray.push(key)
        if (key === 'B' || key.toLowerCase() === 'q') {
            this.drawBackground = !this.drawBackground
            background('white') // this for resetting the background resulting in no trail of clouds on board.
        }
        const konamiCheat = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
        const stringifiedCheat = JSON.stringify(konamiCheat).toLowerCase()
        const stringifiedInput = JSON.stringify(this.cheatArray).toLowerCase()

        if (stringifiedInput === stringifiedCheat) {
            this.background.xSunSpeed = 50
            console.warn('Super Yesnaga mode: activated')
            console.warn('Starting reactors: online')
            console.warn('Enabling advanced systems')
            setTimeout(() => {
                console.error('missing cpu power - aborting..')
                this.background.xSunSpeed = 0.5
            }, 3000);
        }

        // user is given 3 seconds to type code before array is reset
        setTimeout(() => {
            this.cheatArray = []
        }, 3000);
    }

    hoverCheck(tile, mX, mY) {
        const playerTurnIndex = this.getPlayerTurnIndex()
        const tileId = tile.tileInfo.id
        const r = 35 // or 40

        if (tile.x - r < mX // left
            && tile.x + r > mX // right
            && tile.y - r < mY // top 
            && tile.y + r > mY) { // bottom
            if (this.players[playerTurnIndex].tokens.some(t => t.tile === tileId)) {
                return true
            }
        }
        return false
    }

    // not dry
    // reuse hover function somehow!
    clickTile(e) {
        /* this.hoverCheck(false, mouseX, mouseY) */
        const playerTurnIndex = this.getPlayerTurnIndex()
        let tileId;

        this.tiles.forEach((t, i) => {
            t.clicked = false // unclicks all tiles
            const r = 35 // or 40
            if (t.x - r < mouseX // left
                && t.x + r > mouseX // right
                && t.y - r < mouseY // top
                && t.y + r > mouseY) { // bottom
                tileId = this.tiles[i].tileInfo.id
                if (this.players[playerTurnIndex].tokens.some(t => t.tile === tileId)) {
                    this.tiles[i].clicked = !this.tiles[i].clicked
                }
            }
        })
    }
}






