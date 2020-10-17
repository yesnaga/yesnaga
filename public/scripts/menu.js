

class Menu {
    constructor() {
        this.player1 = ''
        this.player2 = ''
        this.showInstructions = false
    }
    setup() {
    }

    draw() {
        this.drawTitle()
        if (this.showInstructions) {
            this.drawInstructions()
        }
    }

    drawTitle() {
        text('YESNAGA', 100, 100)
    }
    drawInstructions() {
        text('Instructions: xyz', 200, 200)
    }

    // new game
    // continue game
    // instructions
    // github link?
}