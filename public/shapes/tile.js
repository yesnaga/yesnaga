class Tile {
    constructor(x, y, d = 80, tileInfo, player) {
        this.x = x
        this.y = y
        this.d = d
        this.tileInfo = tileInfo
        this.colors = {
            p1: '#F79B18',
            p2: '#00ADEF',
        }
        this.colorIndicator = player
        this.hovering = false

        this.debug = true
    }
    setup() {

    }
    draw() {
        if (this.colorIndicator) {
            // ensures background for player tiles
            fill("#e5e5e5");
            ellipse(this.x, this.y, this.d + 20);
            fill(this.colors[this.colorIndicator]);
            const hoverValue = this.hovering ? 20 : 0
            ellipse(this.x, this.y, this.d + hoverValue);
        } else {
            fill("#e5e5e5");
            ellipse(this.x, this.y, this.d);
        }
        // debug
        if (this.debug) {
            fill('black')
            textSize(20)
            text(`ID:${this.tileInfo.id}`, this.x - 25, this.y + 5)
        }
    }
}