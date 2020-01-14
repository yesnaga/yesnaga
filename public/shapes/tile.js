
class Tile {
    constructor(x, y, d = 80, player) {
        this.x = x
        this.y = y
        this.d = d
        this.colors = {
            p1: '#F79B18',
            p2: '#00ADEF',
        }
        this.colorIndicator = player


    }
    setup() {

    }
    draw() {
        if (this.colorIndicator) {
            // ensures background for player tiles
            fill("#e5e5e5");
            ellipse(this.x, this.y, this.d + 20);
            fill(this.colors[this.colorIndicator]);
            ellipse(this.x, this.y, this.d);
        } else {
            // neutral player pieces
            fill("#e5e5e5");
            ellipse(this.x, this.y, this.d);
        }

    }

}