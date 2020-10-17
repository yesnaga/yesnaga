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
                textSize: width / 10
            },
            newGame: {
                content: 'New Game',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 270,
                textSize: width / 14
            },
            continueGame: {
                content: 'Continue Game',
                color: this.pid ? 'black' : 'grey',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 390,
                textSize: width / 14
            },
            instructions: {
                content: 'Instructions',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 510,
                textSize: width / 14
            },
            /* instructionDetails: {
                content: 'Foo bar',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 100,
                textSize: width / 14
            } */
        }
    }

    draw() {
        Object.keys(this.menuItems).forEach((menuItem) => {
            drawContent(this.menuItems[menuItem])
        })

    }
    mouseClicked(event) {
        const currentMenuItem = Object.keys(this.menuItems).find(menuItem => {
            return hoveringMenuItem(this.menuItems[menuItem], event)
        })
        console.log(currentMenuItem)


    }
}

const hoveringMenuItem = (menuItem, event) => {
    const [verticalOffset, horizontalOffset] = [40, 490]
    const { pageY, pageX } = event
    const [adjustedY, adjustedX] = [pageY - verticalOffset, pageX - horizontalOffset]

    // TODO add horizontal check too
    return adjustedY > menuItem.y
        && adjustedY < menuItem.y + menuItem.textSize
        && adjustedX > menuItem.x
        && adjustedX < menuItem.x + width / 2
}

const drawContent = (menuItem) => {
    textSize(menuItem.textSize);
    textAlign(...menuItem.textAlign)
    fill(menuItem.color)
    text(menuItem.content, menuItem.x, menuItem.y, width)
}
