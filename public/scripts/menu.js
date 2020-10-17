class Menu {
    constructor() {
        this.player1 = ''
        this.player2 = ''
        this.pid = ''
        this.showInstructions = false
    }
    setup() {
        this.menuItems = {
            title: {
                content: 'YESNAGA',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 70,
                width: width,
                textSize: width / 10
            },
            newGame: {
                content: 'New Game',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 270,
                width: width,
                textSize: width / 14
            },
            continueGame: {
                content: 'Continue Game',
                color: this.pid ? 'black' : 'grey',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 390,
                width: width,
                textSize: width / 14
            },
            instructions: {
                content: 'Instructions',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 510,
                width: width,
                textSize: width / 14
            },
            /* instructionDetails: {
                content: 'Foo bar',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 100,
                width: width,
                textSize: width / 14
            } */
        }
    }

    draw() {
        Object.keys(this.menuItems).forEach((menuItem) => {
            drawContent(this.menuItems[menuItem])
        })

    }
    mouseClick(e) {

    }
    // github link?
}

const drawContent = (menuItem) => {
    textSize(menuItem.textSize);
    textAlign(...menuItem.textAlign)
    fill(menuItem.color)
    text(menuItem.content, menuItem.x, menuItem.y, menuItem.width)
}
