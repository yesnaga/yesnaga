class GhostDisc {
    constructor(x, y, d = 80, discInfo) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.discInfo = discInfo;

        this.clicked = false;
        this.hovering = false;
        this.display = false
    }
    // uneeded variables?
    /* static colors() {
        return ['#F79B18', '#00ADEF'];
    } */

    draw() {
        if (!this.display) {
            fill('rgba(225, 225, 225, 0.2)')
            ellipse(this.x, this.y, this.d);
        }

    }
}
