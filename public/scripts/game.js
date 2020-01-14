class Game {
    constructor(n, t, p) {
        this.background = new Background();
        // filled with Tile-classes
        this.tiles = [];
        // filled with ids of already existing tiles. could probably be 
        this.drawnTiles = []

        this.neighbours = n
        this.tilesSetup = t
        this.players = p

        this.hint = false
    }

    setup() {
        this.background.setup();
        this.pushTile(0, 250, 250)
    }

    draw() {
        this.background.draw();
        this.tiles.forEach((tile, i) => {
            if (this.hint) {
                // something here?
            }
            tile.draw();
        });
    }
    pushTile(id, x, y) {
        const t = this.tilesSetup[id].neighbours
        this.drawnTiles.push(id)

        if (this.players[0].includes(id)) {
            this.tiles.push(new Tile(x, y, 60, 'p1'))
            return;
        }
        if (this.players[1].includes(id)) {
            this.tiles.push(new Tile(x, y, 60, 'p2'))
            return;
        }

        this.tiles.push(new Tile(x, y, 80))

        Object.keys(t).forEach(d => {
            if (!this.drawnTiles.includes(t[d])) {
                this.pushTile(t[d], this.neighbours[d].x(x), this.neighbours[d].y(y))
            }
        })
    }

    showHint() {
        if (keyCode === 32) {
            console.log('changing')
            this.color = 'red'
        }
    }

}






