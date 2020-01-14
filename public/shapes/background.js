class Background {
    constructor() {
        this.xCloudT = 0;
        this.xCloudB = 0;
    }

    setup() {
        this.bgCloudT = loadImage("../images/cloudb.jpg")
        //this.bgCloudT = loadImage("../../public/images/cloudt.jpg");
        //this.bgCloudB = loadImage("../../public/images/cloudb.jpg");

    }

    draw() {
        image(this.bgCloudT, this.xCloudT + width, 0, width);
        /* this.bgCloudT = this.bgCloudT - 1;
        if (this.bgCloudT <= -width) {
            this.bgCloudT = 0;
        } */

        // image(img, x, y, w, h)
        //image(this.bgCloudT, this.xCloudT, 0, width); // `width` is made available by p5 and corresponds to the width of the canvas
    }
}