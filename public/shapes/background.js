class Background {
    constructor() {
        this.xCloud0 = 0;
        this.xCloud1 = 0;
        this.xSun = -200
        this.ySun = 50
        this.xSunSpeed = 0.5
    }

    async setup() {
        this.bgCloud0 = loadImage("../images/cloud0.png")
        this.bgCloud1 = loadImage("../images/cloud1.png")
        this.bgSun = loadImage("../images/sun.png")

    }

    draw() {
        background('#222222') // this for resetting the background resulting in no trail of clouds on board.
        // scrollspeed
        this.xCloud0 -= 1;
        // resetting/looping the clouds when outside of canvas
        if (this.xCloud0 <= -width) {
            this.xCloud0 = 0;
        }
        image(this.bgCloud0, this.xCloud0, 0, width); // width is global variable from p5js
        image(this.bgCloud0, this.xCloud0 + width, 0, width);

        this.xCloud1 -= 2;
        if (this.xCloud1 <= -width) {
            this.xCloud1 = 0;
        }


        this.xSun -= this.xSunSpeed;
        // elegant solution for sunraise and sunset.
        if (this.xSun < (width / 2)) {
            this.ySun += 0.1
        } else {
            this.ySun -= 0.1
        }
        if (this.xSun <= -250) {
            this.xSun = width;
            this.ySun = 50
        }

        image(this.bgSun, this.xSun, this.ySun, 200, 200);

        image(this.bgCloud1, this.xCloud1, 0, width);
        image(this.bgCloud1, this.xCloud1 + width, 0, width);


    }
}