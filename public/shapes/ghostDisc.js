class GhostDisc {
    constructor(x, y, d = 80, discInfo) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.discInfo = discInfo;

        this.clicked = false;
        this.hovering = false;
    }
    // uneeded variables?
    /* static colors() {
        return ['#F79B18', '#00ADEF'];
    } */

    draw() {
        fill('tomato');

    }
}
